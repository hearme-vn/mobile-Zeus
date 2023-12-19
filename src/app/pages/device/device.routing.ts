import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DeviceComponent} from '@app/pages/device/device.component';


// const routes: Routes = [

let routes: Routes = [
  {
    path: 'list',
    component: DeviceComponent,
    data: {
      title_key: 'SIDEBAR.DEVICE'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceRouting {}

