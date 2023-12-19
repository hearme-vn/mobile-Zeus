import { NgModule } from  '@angular/core';
import { SharedModule } from '@app/_bases/shared.module';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HMCommonModule } from '@app/_bases/common';

import { HMUIsModule } from '@app/_bases/ui';
import { CollectionRouting } from './collection.routing';
import { CollectionComponent, ImagesComponent } from './';

@NgModule({
  imports: [
    SharedModule,
    CollectionRouting,
    DragDropModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    HMCommonModule,
    HMUIsModule
  ],
  declarations: [ CollectionComponent, ImagesComponent ]
})
export class CollectionModule { }

