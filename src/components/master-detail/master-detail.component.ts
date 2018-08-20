import {
  AfterContentInit,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Store } from '@ngrx/store';
import { DataTableColumnDirective } from '@swimlane/ngx-datatable';
import { FulltextListSearch, ListSearch, ListState, ModifyListSearchAction } from '@zima/ngrx-state-utils';
import { untilComponentDestroyed } from 'ng2-rx-componentdestroyed';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

import { RvDatatableComponent } from '../datatable/datatable.component';
import { CompactColumnsDirective } from './compact-columns.directive';
import { DetailViewDirective } from './detail-view.directive';
import { FullColumnsDirective } from './full-columns.directive';

@Component({
  selector: 'rv-master-detail',
  templateUrl: './master-detail.component.html',
  styleUrls: ['./master-detail.component.scss']
})
export class MasterDetailComponent implements AfterContentInit, OnInit, OnDestroy {
  constructor(private store: Store<any>,
    public media: ObservableMedia) {
  }

  isDetailShown$ = new BehaviorSubject<boolean>(false);
  searchFulltextInput$ = new Subject<string>();

  isCompactListMode$: Observable<boolean> = combineLatest(
    this.media.asObservable().pipe(startWith(null)),
    this.isDetailShown$)
    .pipe(map(([media, isDetailShown]) => {
      return !this.media.isActive('gt-sm') || isDetailShown;
    }));

  get isDetailShown(): boolean {
    return this.isDetailShown$.getValue();
  }

  @Input() set isDetailShown(value: boolean) {
    if (this.isDetailShown != value) {
      this.isDetailShown$.next(value)
    }
  }

  @Input() columnMode: string = 'standard';
  @Input() listState: ListState<any, ListSearch>;
  @Input() rows: any = null;
  @Input() isSearchEnabled: boolean = false;
  @Input() rowClass: any[] = null;
  @Output() requestRows: EventEmitter<any> = new EventEmitter();
  @Output() activateRow: EventEmitter<any> = new EventEmitter();
  @Output() selectRow: EventEmitter<any> = new EventEmitter();

  @ViewChild('rvDatatable') datatable: RvDatatableComponent = null;

  @ContentChild(FullColumnsDirective)
  fullColumns: FullColumnsDirective;

  @ContentChild(CompactColumnsDirective)
  compactColumns: CompactColumnsDirective;

  @ViewChild('compactExpandColumn', { read: DataTableColumnDirective })
  compactExpandColumn: DataTableColumnDirective;

  @ContentChild(DetailViewDirective)
  detailView: DetailViewDirective;  

  get detailViewTemplate() {
    return this.detailView ? this.detailView.template : null;
  }

  fullColumnTemplates$ = new BehaviorSubject<DataTableColumnDirective[]>([]);
  compactColumnTemplates$ = new BehaviorSubject<DataTableColumnDirective[]>([]);

  columnTemplates$ = combineLatest(this.fullColumnTemplates$, this.compactColumnTemplates$, this.isCompactListMode$)
    .pipe(map(([fullColumnTemplates, compactColumnTemplates, isCompactListMode]) => {
      let colsArray = isCompactListMode
        ? compactColumnTemplates.concat([this.compactExpandColumn])
        : fullColumnTemplates;
      (<any>colsArray).toArray = () => colsArray;

      return colsArray;
    }));

  get searchFulltext(): string {
    return (this.listState.search as FulltextListSearch).fulltext;
  }

  ngAfterContentInit() {
    this.fullColumns.columnTemplates.changes
      .pipe(untilComponentDestroyed(this))
      .subscribe(x => this.fullColumnTemplates$.next(x.toArray()));
    this.fullColumnTemplates$.next(this.fullColumns.columnTemplates.toArray());

    this.compactColumns.columnTemplates.changes
      .pipe(untilComponentDestroyed(this))
      .subscribe(x => this.compactColumnTemplates$.next(x.toArray()));
    this.compactColumnTemplates$.next(this.compactColumns.columnTemplates.toArray());
  }

  ngOnInit() {
    this.searchFulltextInput$
      .pipe(debounceTime(600))
      .subscribe(x => {
        if ((this.listState.search as FulltextListSearch).fulltext !== undefined) {
          this.store.dispatch(new ModifyListSearchAction(this.listState.id,
            {
              ...this.listState.search,
              fulltext: x
            } as FulltextListSearch));
        }
      });
  }

  ngOnDestroy() {
  }

  doRequestRows() {
    this.requestRows.emit();
  }

  doActivateRow($event) {
    this.activateRow.emit($event);
  }

  doSelectRow($event) {
    this.selectRow.emit($event);
  }

  doSearchFulltextChanged(fulltextSearch) {
    this.searchFulltextInput$.next(fulltextSearch);
  }
}
