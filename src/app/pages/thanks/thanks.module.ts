import {NgModule} from '@angular/core';
import {SharedModule} from '@app/_bases/shared.module';

import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ModalModule} from 'ngx-bootstrap/modal';

import { HMCommonModule } from '@app/_bases/common'; 
import { HMUIsModule } from '@app/_bases/ui';
import { ThanksComponent } from '@app/pages/thanks/thanks.component';
import { ThanksRouting } from './thanks.routing';

@NgModule({
  imports: [
    SharedModule,
    ThanksRouting,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    HMUIsModule,
    HMCommonModule
  ],
  declarations: [ThanksComponent],
})
export class ThanksModule { }

