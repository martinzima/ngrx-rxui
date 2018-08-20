import { Directive, TemplateRef, ContentChildren, QueryList } from '@angular/core';
import { DataTableColumnDirective } from '@swimlane/ngx-datatable';

@Directive({ selector: '[compact-columns]' })
export class CompactColumnsDirective {
  @ContentChildren(DataTableColumnDirective, {descendants: true})
  columnTemplates: QueryList<DataTableColumnDirective>;
}
