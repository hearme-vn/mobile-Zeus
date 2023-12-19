import { NgModule } from  '@angular/core';
import { SharedModule } from '@app/_bases/shared.module';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import { CfgRouting } from './cfg.routing';
import { DefaultLanguageComponent, 
  ConfigurationComponent, CfgDeviceBgComponent, 
  CfgDeviceHeaderComponent, CfgThankPageComponent, CfgOtherComponent, CfgHookComponent, 
  PosNhanhPageComponent, PosNhanhComponent, GetTokenComponent, 
  ReportPluginsComponent, FeedbackPluginsComponent } from '.';
import { HMUIsModule  } from '@app/_bases/ui';
import { HMCommonModule } from '@app/_bases/common'; 

@NgModule({
  imports: [
    SharedModule,
    CfgRouting,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    HMUIsModule,
    HMCommonModule
  ],
  declarations: [DefaultLanguageComponent, ConfigurationComponent, CfgDeviceBgComponent, CfgDeviceHeaderComponent,
    CfgThankPageComponent, CfgOtherComponent, CfgHookComponent,
    PosNhanhPageComponent, PosNhanhComponent, GetTokenComponent,
    ReportPluginsComponent, FeedbackPluginsComponent ]
})
export class CfgModule { }

