import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Store } from '@ngrx/store';
import { DataTableColumnDirective, DatatableComponent, DatatableRowDetailDirective } from '@swimlane/ngx-datatable';
import {
  defaultListState,
  ListSearch,
  ListState,
  LoadListAction,
  ModifyListSearchAction,
  SelectListItemsAction,
} from '@zima/ngrx-state-utils';

@Component({
  selector: 'rv-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class RvDatatableComponent implements AfterContentInit, OnInit, OnDestroy {
  private _state: ListState<any, ListSearch>;
  private _externalColumnTemplates: DataTableColumnDirective[];
  private _columnTemplates: QueryList<DataTableColumnDirective>;
  private _rowDetail: DatatableRowDetailDirective;
  private _selected: any[];

  constructor(private store: Store<any>,
    private media: ObservableMedia) {
    this.state = defaultListState('');
  }

  @ViewChild('ngxDatatable') ngxDatatable: DatatableComponent = null;

  get externalColumnTemplates(): DataTableColumnDirective[] {
    return this._externalColumnTemplates;
  }

  @Input()
  set externalColumnTemplates(value: DataTableColumnDirective[]) {
    if (this._externalColumnTemplates != value) {
      this._externalColumnTemplates = value;
      this.bindColumns();
    }
  }

  get columnTemplates(): QueryList<DataTableColumnDirective> {
    return this._columnTemplates;
  }

  @ContentChildren(DataTableColumnDirective, { descendants: true })
  set columnTemplates(value: QueryList<DataTableColumnDirective>) {
    this._columnTemplates = value;
    this.bindColumns();
  }

  get rowDetail(): DatatableRowDetailDirective {
    return this._rowDetail;
  }

  @ContentChild(DatatableRowDetailDirective)
  set rowDetail(value: DatatableRowDetailDirective) {
    this._rowDetail = value;
    if (this.ngxDatatable) {
      this.ngxDatatable.rowDetail = value;
    }
  }

  @Input() columnMode: string = 'standard';
  @Input() scrollbarH: boolean = true;
  @Input() scrollbarV: boolean = false;
  @Input() headerHeight: number = 50;
  @Input() footerHeight: number = 50;
  @Input() rowHeight: number = undefined;
  @Input() rowIdentity: (x: any) => any = null;
  @Input() rowClass: any = null;

  /**
   * Optional overrides the real rows displayed (e.g. when needing to transform the data before displaying).
   * If null (default), uses the rows in 'state.value' instead.
   */
  @Input() rows: any[] = null;

  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() select: EventEmitter<any> = new EventEmitter();
  
  @Output() requestRows: EventEmitter<ListState<any, ListSearch>> = new EventEmitter();

  get state(): ListState<any, ListSearch> {
    return this._state;
  }

  @Input() set state(value: ListState<any, ListSearch>) {
    if (this._state != value) {
      let oldState = this._state;
      this._state = value;
      
      if (this._state && (!oldState || oldState.search != this._state.search)) {
        this.doRequestRows();
      }

      this._selected = this.state ? this.state.selected.slice() : [];
    }
  }

  get selected(): any[] {
    return this._selected;
  }

  ngAfterContentInit() {
    this.columnTemplates.changes.subscribe(x => this.bindColumns());
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  recalculate() {
    if (this.ngxDatatable) {
      this.ngxDatatable.recalculate();
    }
  }

  scrollTo(element) {
    element.element.scrollIntoView(true);
  }

  pageSet(pageInfo) {
    if (this.state) {
      this.store.dispatch(new ModifyListSearchAction(this.state.id, {
          ...this.state.search,
          page: pageInfo.offset
        }));

      this.ngxDatatable.scroll
    }
  }

  sortSet(sortInfo) {
    // TODO
  }

  doSelect($event) {
    this.store.dispatch(new SelectListItemsAction(this.state.id, $event.selected));
    this.select.emit($event);
  }

  doActivate($event) {
    this.activate.emit($event);
  }

  getRowIdentityFunc() {
    const datatable = this; // workaround for a bug in DatatableComponent - it invokes rowIdentity method in the context of itself (and not this object)
    return (row) => {
      return datatable.getRowIdentity(row);
    };
  }

  getRowIdentity(row) {
    return this.rowIdentity ? this.rowIdentity(row) : row;
  }

  private bindColumns() {
    if (this.ngxDatatable) {
      this.ngxDatatable.translateColumns(this.externalColumnTemplates ? this.externalColumnTemplates : this.columnTemplates);
      
      setTimeout(() => this.ngxDatatable.recalculate(), 100); // workaround for a bug - columns don't automatically resize on their first change
    }
  }

  private doRequestRows() {
    this.store.dispatch(new LoadListAction(this.state.id, this.state.search));
    this.requestRows.emit(this.state);
  }
}
