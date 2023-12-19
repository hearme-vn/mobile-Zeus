import { NgModule } from  '@angular/core';
import { SharedModule } from '@app/_bases/shared.module';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import { GroupRouting } from './group.routing';
import {GroupComponent} from '@app/pages/group/group.component';

@NgModule({
  imports: [
    SharedModule,
    GroupRouting,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [ GroupComponent ]
})
export class GroupModule { }

