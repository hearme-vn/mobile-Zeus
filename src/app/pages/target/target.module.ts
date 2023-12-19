import { NgModule } from  '@angular/core';
import { SharedModule } from '@app/_bases/shared.module';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { TargetRouting } from './target.routing';
import { TargetComponent } from '@app/pages/target/target.component';
import { CfgModule } from '@app/pages/cfg/cfg.module';
import { HMUIsModule } from '@app/_bases/ui';

@NgModule({
  imports: [
    SharedModule,
    TargetRouting,
    BsDropdownModule.forRoot(),
    CfgModule,
    HMUIsModule
  ],
  declarations: [ TargetComponent ]
})
export class TargetModule { }

