import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KioskInviteComponent } from './kioskinvite.component';
import { CustomerComponent } from './customer.component';

// const routes: Routes = [

let routes: Routes = [
  {
    path: 'customer',
    component: CustomerComponent,
    data: {
      // title: 'Invite customer at Kiosk'
      title_key: 'SIDEBAR.CS_CUSTOMERLIST'
    }
  },
  {
    path: 'kiosk-invitation',
    component: KioskInviteComponent,
    data: {
      // title: 'Invite customer at Kiosk'
      title_key: 'SIDEBAR.CS_INVITECUSTOMER'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CSRouting {}

