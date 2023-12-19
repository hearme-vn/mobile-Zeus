import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GroupComponent} from '@app/pages/group/group.component';


// const routes: Routes = [

let routes: Routes = [
  {
    path: 'list',
    component: GroupComponent,
    data: {
      title_key: 'SIDEBAR.GROUP_DEVICE'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRouting {}

