import {NgModule} from '@angular/core';
import {SharedModule} from '@app/_bases/shared.module';

import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ModalModule} from 'ngx-bootstrap/modal';

import {QuotationRouting} from './quotation.routing';
import {QuotationComponent} from '@app/pages/quotation/quotation.component';

@NgModule({
  imports: [
    SharedModule,
    QuotationRouting,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [ QuotationComponent ]
})
export class QuotationModule { }

