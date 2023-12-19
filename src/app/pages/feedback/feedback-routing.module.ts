import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeedbackComponent, FeedbackDetailComponent } from '.'; 

const routes: Routes = [
  {
    path: 'list',    
    component: FeedbackComponent,
    data: {
      title_key: 'FEEDBACK.LIST'
    }
},
  {
    path: 'content',
    component: FeedbackDetailComponent,
    data: {
      title_key: 'FEEDBACK.CONTENT'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackRoutingModule {}
