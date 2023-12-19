import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TargetComponent} from '@app/pages/target/target.component';


// const routes: Routes = [

let routes: Routes = [
  {
    path: 'list',
    component: TargetComponent,
    data: {
      title_key: 'SIDEBAR.TARGET'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TargetRouting {}

