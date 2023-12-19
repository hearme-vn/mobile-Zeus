import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule} from '@ngx-translate/core';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    InfiniteScrollModule ,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    ModalModule.forRoot(),

  ],
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    InfiniteScrollModule,
    BsDropdownModule,
    ButtonsModule,
    ModalModule
  ]
})
export class SharedModule { }

