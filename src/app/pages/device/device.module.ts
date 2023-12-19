import { NgModule } from  '@angular/core';
import { SharedModule } from '@app/_bases/shared.module';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import { DeviceRouting } from './device.routing';
import {DeviceComponent} from '@app/pages/device/device.component';
import {QRCodeModule} from 'angularx-qrcode';

@NgModule({
  imports: [
    SharedModule,
    DeviceRouting,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    QRCodeModule
  ],
  declarations: [ DeviceComponent ]
})
export class DeviceModule { }

