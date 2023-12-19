import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollectionComponent, ImagesComponent } from '.';

let routes: Routes = [
  {
    path: 'list',
    component: CollectionComponent,
    data: {
      title_key: 'SIDEBAR.COLLECTION'
    }
  },
  {
    path: 'images',
    component: ImagesComponent,
    data: {
      title_key: 'IMAGE_PAGE.TITLE'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionRouting {}

