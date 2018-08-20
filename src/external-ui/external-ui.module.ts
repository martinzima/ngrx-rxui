import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbSpinnerModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgrxFormsModule } from 'ngrx-forms';

import { CustomBreakPointsProvider } from './custom-breakpoints';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,

    NgxDatatableModule,

    NbCardModule,
    NbSpinnerModule,
    NgSelectModule,
    NgrxFormsModule,
  ],
  exports: [
    NgxDatatableModule,
    NbCardModule,
    NbSpinnerModule,
    NgSelectModule,
    NgrxFormsModule
  ],
  providers: [
    CustomBreakPointsProvider
  ]
})
export class NgrxRxuiExternalUiModule {}
