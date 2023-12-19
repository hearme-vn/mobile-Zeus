/**
 * @license hearme 
 * @copyright 2017-2022 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 13 Aug 2022
 * @purpose This module makes some Supporting Component for app:
    - Welcome component
    - Onboarding component
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome.component';
import {NotificationComponent} from '@app/pages/utils/notification.component';

// const routes: Routes = [

let routes: Routes = [
  {
    path: 'welcome',
    component: WelcomeComponent,
    data: {
      title_key: 'SIDEBAR.CS_INVITECUSTOMER'
    }
  },
  {
    path: 'notification',
    component: NotificationComponent,
    data: {
      title_key: 'SIDEBAR.NOTIFICATION'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SCRouting {}

