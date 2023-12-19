import { Injector, Component, ViewChild } from '@angular/core';
import { ParamMap } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';

import { Survey, SurveyModel, SurveyTemplate } from '@app/_models';
import { BaseComponent, TablePageComponent } from '@app/_bases';
import { Utils, APPCONSTS, AuthenticationService, URIS, SurveyService } from '@app/_services';

/**
 * @license hearme 
 * @copyright 2017-2022 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 28 Nov 2022
 * @purpose for importing surveys from system templates
 */
@Component({
  templateUrl: 'import.component.html',
  styleUrls: ['import.component.css']
})
export class ImportSurveyComponent extends TablePageComponent {

  object_type = SurveyTemplate;

  /** Structure of filtering form fields */
  filtering_form = {
    business_field: null,
    search: null
  }

  /** Step in create / update survey Setting */
  step = 'FORM';
  step_num = 1;

  /**
   * Selected templated
  */
  selected_template: Number;

  /** Feedback URL */ 
  feedback_url: any;

  /** Preview screen */
  preview_screen = "landscape";

  /** template description for displaying by tooltip*/ 
  template_description = null;

  constructor(
    public injector: Injector,
    private sanitizer: DomSanitizer,
    private survey_service: SurveyService
    ) {
    super(injector);
  }

  /**
   * Get list of business field
   * - all sub surveys (factors) and related info
   * @Return Observable object
  */
  loadSupportiveData() {
    this.getBusinessFields(null);
  }

  searchPrams() {
    if (this.filtering_form.business_field != null) {
      this.params["business_field"] = this.filtering_form.business_field;
    }
  }

  /**
   * Get feedback simulator URL
   */
  getFeedbackSimulatorURL() {
    let root_url = this.app_service.Based_URLs.simulator;
    if (!root_url)    root_url = "/simulator/";

    let url = root_url + "?token=" + AuthenticationService.getToken();    
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }  

  /** Change screen direction */
  changeScreenDirection(type) {
    this.preview_screen = type
  }

  /**
   * Get survey configure and then import to system
   * @input selected_template
  */
  importSurveyTemplate() {
    if (!this.selected_template) {
      this.app_service.showMessageById('MSG.SURVEY_CHOOSE_TEMPLATE', 'toast-warning');
      return;
    }

    // Get survey configuration for importing
    let url = this.app_service.Based_URLs.main + URIS.main.survey_template_export_survey;
    let payload = {
      id: this.selected_template
    };
    this.app_service.postAPI(url, payload, function(survey_config) {
        console.log("Data from exported survey: ", survey_config);

        // Import survey configuration to server
        this.survey_service.importSurvey(survey_config);
      }.bind(this)
    );
  }

  selectSurveyTemplate(template_id) {
    this.selected_template = template_id
  }

  /**
   * Get survey tree from survey_id configured in template
  */
  getSurveyTreeForTemplate(template_id) {
    let url = this.app_service.Based_URLs.main + URIS.main.survey_template_survey_tree;
    let payload = {
      id: template_id
    };
    this.app_service.postAPI(url, payload, function(res) {
        // Send survey to simulator iframe
        let ifm_window = <HTMLIFrameElement>document.getElementById('simulator_id');

        ifm_window.contentWindow.postMessage(JSON.stringify(res), "*");
      }.bind(this)
    );
  }

  /**
   * status value returned from simulator:
    public static readonly _STATUS_NOT_INIT_ = 10;
    public static readonly _STATUS_NOT_LOGGED_ = 0;
    public static readonly _STATUS_LOGGED_ = 1;
    public static readonly _STATUS_ATTACHED_ = 2;
    public static readonly _STATUS_ATTACHED_FAILED_ = 3;
    public static readonly _STATUS_ACTIVE_ = 4;
    public static readonly _STATUS_INACTIVE_ = 5;
    public static readonly _STATUS_NO_SURVEY_ = 6;
    public static readonly _STATUS_AVTIVE_SURVEY_ = 7;
    public static readonly _STATUS_SEND_FEEDBACK_ = 8;
    public static readonly _STATUS_SURVEY_FINISHED_ = 9;
    public static readonly _STATUS_SURVEY_READY_ = 11;
   * 
  */
  iFrame_event_hanlde(event) {
    let post_message = event.data;
    try {
        post_message = JSON.parse(event.data);
    } catch(e) {
        console.log("post message is not in JSON");
    }

    if (post_message && post_message.status==4) {
      this.getSurveyTreeForTemplate(this.selected_template);
    }
  }

  /** Set content for tooltip */
  setToolTipContent(description) {
    // console.log(description);
    this.template_description = description;
  }


  /** Upding step in configuration
   * Value from 1-3
  */
   configure_StepChange(step) {
    switch (step) {
      case "FORM": // Basic form
        break;

      case "PREVIEW":   // Preview
        if (!this.selected_template) {
          this.app_service.showMessageById('MSG.SURVEY_CHOOSE_TEMPLATE', 'toast-warning');
          return;
        }
        this.getSurveyTreeForTemplate(this.selected_template);
        // if ( window.addEventListener ) {
        //     window.addEventListener('message', this.iFrame_event_hanlde.bind(this), false);
        // }
    }
    this.step = step;

    return step;
  }

}
