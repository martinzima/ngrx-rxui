import { ContentChild, Directive, QueryList, TemplateRef } from '@angular/core';
import { DataTableColumnDirective } from '@swimlane/ngx-datatable';

@Directive({ selector: '[detail-view]' })
export class DetailViewDirective {
  @ContentChild(TemplateRef) template;
}
