import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ThemeComponent} from '@app/pages/theme/theme.component';


// const routes: Routes = [

let routes: Routes = [
  {
    path: 'list',
    component: ThemeComponent,
    data: {
      title_key: 'SIDEBAR.THEME'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeRouting {}

