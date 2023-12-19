import { Injector, Component, ViewChild } from '@angular/core';
import { ParamMap } from '@angular/router';

import { FeedbackMessage, FeedbackFactory, Survey, Device, SurveyFactory, Group } from '@app/_models';
import { FeedbackComponent } from './feedback.component';

/**
 * @license hearme 
 * @copyright 2017-2022 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 11 Jan 2023
 * @purpose for displaying feedback
 */
@Component({
  templateUrl: 'fbdetail.component.html',
  styleUrls: ['fbdetail.component.css']
})
export class FeedbackDetailComponent extends FeedbackComponent {

  object_type = FeedbackMessage;

  /** Survey id for current object*/
  feedback_id: string = null;

  constructor(
    public injector: Injector
    ) {
    super(injector);
  }

  /**
   * @return URL for getting object information
  */
   public getObjectInfoURL() {
    return this.app_service.Based_URLs.front + this.object_type.uri_info;
  }

  /**
   * Get feedback message information by id
   * @Return Observable object
  */
  public processingFeedbackData(feedback_data) {
    // console.log("Feedback data: ", feedback_data);
    let feedback_survey = new Survey(this.injector, {id: feedback_data.sur_id});
    feedback_survey.getSurveyTree().then(
      function(survey_tree) {
        // console.log("Survey tree: ", survey_tree);        
        this.active_survey = SurveyFactory.createSurvey( this.injector, survey_tree);

        let message = FeedbackFactory.createMessage(this.injector, feedback_data, this.active_survey);
        message["serializedMSGs"] = message.feedbackMessageList();

        this.object = message;
      }.bind(this)
    );

    // Get feedback device 
    this.getObjectInfoById(Device, null, {device_id: feedback_data.device_id})
      .then( function(device) {
        this.feedback_device = device;
      }.bind(this)
    );    

    // Get feedback Group 
    this.getObjectInfoById(Group, null, {id: feedback_data.grp_id})
      .then( function(group) {
        this.feedback_group = group;
      }.bind(this)
    );    
  }

  /**
   * Load feedback data
   */ 
  loadMainPageObjects() {
    this.getQueryPramMap().subscribe(
      function(paramMap: ParamMap) {
        if (paramMap.get("id")) {
          this.feedback_id = paramMap.get("id");

          // Get feedback data by id
          this.getObjectDataById_GETMETHOD(this.feedback_id)
            .subscribe(this.processingFeedbackData.bind(this));
        }
      }.bind(this)      
    )
  }

}
