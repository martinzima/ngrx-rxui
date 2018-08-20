import { Directive, TemplateRef, ContentChildren, QueryList } from '@angular/core';
import { DataTableColumnDirective } from '@swimlane/ngx-datatable';

@Directive({ selector: '[full-columns]' })
export class FullColumnsDirective {
  @ContentChildren(DataTableColumnDirective, {descendants: true})
  columnTemplates: QueryList<DataTableColumnDirective>;
}
