import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruncatePipe } from './truncate.pipe'; 
import { DragDirective } from './dragDrop.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [ 
    TruncatePipe, DragDirective
  ],
  exports: [ 
    TruncatePipe, DragDirective
  ]
})
export class HMCommonModule { }
