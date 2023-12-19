import { NgModule } from '@angular/core';
import { SharedModule } from '@app/_bases/shared.module';
import { TreeviewModule } from '@ngx-treeview';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { ModalModule } from 'ngx-bootstrap/modal';

import { HMCommonModule } from '@app/_bases/common'; 
import { SurveyTreeComponent } from './surveytree/surveytree_select.component';
import { SurveySelectComponent } from './survey_select/survey_select.component';
import { DeviceSelectComponent } from './device_select/device_select.component';
import { GroupSelectComponent } from './groupdevice_select/group_select.component';
import { FeedbackContentComponent } from './feedback_content/feedback_content.component';
import { DeviceLanguageSelectComponent } from './devicelanguage_select/devicelanguage_select.component';
import { SelectImageComponent } from './select-image/select-image.component';
import { RightClickMenuComponent } from './right_click_menu/right-click-menu.component';

let ui_list = [ SurveyTreeComponent, SurveySelectComponent, DeviceSelectComponent, 
  FeedbackContentComponent, DeviceLanguageSelectComponent, GroupSelectComponent, 
  SelectImageComponent, RightClickMenuComponent ];

@NgModule({
  imports: [
    SharedModule,
    TreeviewModule.forRoot(),
    NgSelectModule,
    NgOptionHighlightModule,
    HMCommonModule,
    ModalModule.forRoot(),
  ],
  declarations: ui_list,
  exports: ui_list
})
export class HMUIsModule { }
