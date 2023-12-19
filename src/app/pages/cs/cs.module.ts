import { NgModule } from  '@angular/core';
import { SharedModule } from '@app/_bases/shared.module';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import { KioskInviteComponent } from './kioskinvite.component';
import { CustomerComponent } from './customer.component';
import { CSRouting } from './cs.routing';

@NgModule({
  imports: [
    SharedModule,
    CSRouting,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [ KioskInviteComponent, CustomerComponent ]
})
export class CSModule { }

