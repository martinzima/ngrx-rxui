import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { BreadcrumbNavComponent } from './components/breadcrumb-nav/breadcrumb-nav.component';
import { RvDatatableComponent } from './components/datatable/datatable.component';
import { LookupSelectComponent } from './components/lookup-select/lookup-select.component';
import { CompactColumnsDirective } from './components/master-detail/compact-columns.directive';
import { DetailViewDirective } from './components/master-detail/detail-view.directive';
import { FullColumnsDirective } from './components/master-detail/full-columns.directive';
import { MasterDetailComponent } from './components/master-detail/master-detail.component';
import { NgrxRxuiExternalUiModule } from './external-ui/external-ui.module';
import { NiceGuidPipe } from './pipes/nice-guid.pipe';
import { NiceShortGuidPipe } from './pipes/nice-short-guid.pipe';
import { YesNoPipe } from './pipes/yes-no.pipe';

export const components = [
  NiceGuidPipe,
  NiceShortGuidPipe,
  YesNoPipe,
  RvDatatableComponent,
  BreadcrumbNavComponent,
  MasterDetailComponent,
  CompactColumnsDirective,
  FullColumnsDirective,
  DetailViewDirective,
  LookupSelectComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
    NgrxRxuiExternalUiModule
  ],
  declarations: components,
  exports: [
    ...components,
    NgrxRxuiExternalUiModule
  ],
  providers: [
  ],
  entryComponents: [
  ]
})
export class NgrxRxuiModule { }
