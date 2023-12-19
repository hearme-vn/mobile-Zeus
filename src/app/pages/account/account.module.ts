import { NgModule } from  '@angular/core';
import { SharedModule } from '@app/_bases/shared.module';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AccountRouting } from './account.routing';
import { ChangepasswdComponent } from './changepasswd.component';
import { LoginBarCodeComponent } from './loginbarcode.component';
import { ProfileComponent } from './profile.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    SharedModule,
    AccountRouting,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    QRCodeModule
  ],
  declarations: [ChangepasswdComponent, LoginBarCodeComponent, ProfileComponent]
})
export class AccountModule { }

