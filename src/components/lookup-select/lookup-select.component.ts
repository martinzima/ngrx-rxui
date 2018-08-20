import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { FulltextListSearch, ListState, LoadListAction, ModifyListSearchAction } from '@zima/ngrx-state-utils';
import { FormControlState } from 'ngrx-forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'rv-lookup-select',
  templateUrl: './lookup-select.component.html',
  styleUrls: ['./lookup-select.component.scss']
})
export class LookupSelectComponent {
  private _listState: ListState<any, FulltextListSearch>;
  private _formControlState: FormControlState<any>;
  private _safeFormControlState: FormControlState<any>;
  private _multiple: boolean;
  
  typeahead: Subject<string> = new Subject();

  constructor(private store: Store<any>) {
    this.typeahead
      .pipe(debounceTime(300)) // TODO might want to make this configurable
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
  
  get safeFormControlState(): FormControlState<any> {
    if (!this._safeFormControlState && this.formControlState) {
      this._safeFormControlState = {
        ...this.formControlState,
        value: this.multiple && !this.formControlState.value ? '[]' : this.formControlState.value
      }
    }

    return this._safeFormControlState;
  }

  get formControlState(): FormControlState<any> {
    return this._formControlState;
  }

  // TODO refactor into a custom ngrx-forms FormViewAdapter to match the naming
  @Input() set formControlState(value: FormControlState<any>) {
    if (this._formControlState != value) {
      this._formControlState = value;
      this._safeFormControlState = null;
    }
  }
    
  @Input() bindLabel: string;
  @Input() bindValue: string;
  @Input() clearable: boolean;
  @Input() placeholder: string;
  @Input() value: any;

  get multiple(): boolean {
    return this._multiple;
  }

  @Input() set multiple(value: boolean) {
    if (this._multiple != value) {
      this._multiple = value;
      this._safeFormControlState = null;
    }
  }

  @Output() requestRows: EventEmitter<ListState<any, FulltextListSearch>> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();

  get listState(): ListState<any, FulltextListSearch> {
    return this._listState;
  }

  @Input() set listState(value: ListState<any, FulltextListSearch>) {
    if (this._listState != value) {
      let oldState = this._listState;
      this._listState = value;
      
      if (this._listState && (!oldState || oldState.search != this._listState.search)) {
        this.doRequestRows();
      }
    }
  }

  doChange($event) {
    this.change.emit($event);
  }

  private doRequestRows() {
    this.store.dispatch(new LoadListAction(this.listState.id, this.listState.search));
    this.requestRows.emit(this.listState);
  }
}
