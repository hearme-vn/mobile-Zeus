import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QuotationComponent} from '@app/pages/quotation/quotation.component';


// const routes: Routes = [

let routes: Routes = [
  {
    path: 'list',
    component: QuotationComponent,
    data: {
      title_key: 'SIDEBAR.QUOTATION'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationRouting {}

