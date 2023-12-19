import {Component, Injector, Input, Output} from '@angular/core';
import { BaseComponent } from '@app/_bases';
import { FeedbackMessage, Survey } from '@app/_models';

@Component({
  selector: 'feedback-content',
  templateUrl: 'feedback_content.component.html',
  styleUrls: ['feedback_content.component.css']
})
export class FeedbackContentComponent extends BaseComponent {

  @Input('message') message: FeedbackMessage;
  @Input('survey') survey: Survey;
  
  constructor (public injector: Injector) {
    super(injector);
  }



}
