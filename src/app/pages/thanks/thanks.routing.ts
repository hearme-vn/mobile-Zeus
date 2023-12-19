import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ThanksComponent } from './thanks.component';


let routes: Routes = [
  {
    path: 'list',
    component: ThanksComponent,
    data: {
      title_key: 'SIDEBAR.THANKS_PAGE'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThanksRouting {}

