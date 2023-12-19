import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ModuleComponent} from '@app/pages/module/module.component';


// const routes: Routes = [

let routes: Routes = [
  {
    path: 'list',
    component: ModuleComponent,
    data: {
      title_key: 'SIDEBAR.APPLICATION'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleRouting {}

