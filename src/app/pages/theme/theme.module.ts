import { NgModule } from  '@angular/core';
import { SharedModule } from '@app/_bases/shared.module';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ThemeRouting } from './theme.routing';
import { ThemeComponent } from '@app/pages/theme/theme.component';
// import {RightClickMenuComponent} from '@app/_bases/ui/right_click_menu/right-click-menu.component';
// import {SelectImageComponent} from '@app/_bases/ui';
import { HMUIsModule } from '@app/_bases/ui';

@NgModule({
  imports: [
    SharedModule,
    ThemeRouting,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    HMUIsModule
  ],
  declarations: [ ThemeComponent ]
})
export class ThemeModule { }

