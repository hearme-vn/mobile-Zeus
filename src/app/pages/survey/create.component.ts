import { Injector, Component, ViewChild } from '@angular/core';
import { ParamMap } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';
import { moveItemInArray, CdkDragDrop } from "@angular/cdk/drag-drop";

import { Survey, SurveyFactory, SurveyModel, Collection, CollectionModel, Theme, Label } from '@app/_models';
import { BaseComponent } from '@app/_bases';
import { Utils, APPCONSTS, AuthenticationService } from '@app/_services';

/**
 * @license hearme 
 * @copyright 2017-2022 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 16 Sep 2022
 * @purpose for creating surveys
 */
@Component({
  templateUrl: 'create.component.html',
  styleUrls: ['create.component.css']
})
export class CreateSurveyComponent extends BaseComponent {
  // @ViewChild('createObjectDialog') creating_Dialog;

  object_type = Survey;
  survey_types = Object.values(SurveyModel.SURVEY_TYPE);
  survey_type_names = [];
  question_text = {};

  /** Survey id for current object*/
  sur_id = null;

  collections: Collection[];
  themes: Theme[];

  /** Step in create / update survey Setting */
  step = 'FORM';
  step_num = 1;

  /** Feedback URL */ 
  feedback_url: any;

  /** Factor for editing */ 
  factor: Survey;

  /** Child*/
  child_survey_form = {index: null, rule: null, child: null};

  /** Preview screen */
  preview_screen = "landscape";

  /** Mapping between language and label record*/ 
  question_labels = {};
  description_labels = {};

  question_template = {
    table_name: "survey",
    column_name: "question",
    value: ""
  }

   description_template = {
    table_name: "survey",
    column_name: "description",
    value: ""
  }

  /** Active html text infor object - using for information survey */
  active_info_object = null;
  
  constructor(
    public injector: Injector,
    private sanitizer: DomSanitizer
    ) {
    super(injector);
  }

  /**
   * Get survey information by id
   * Use API: /v1.3/survey/info/{id}
   * This api update survey object, include:
   * - survey information, 
   * - question in all device languages and 
   * - all sub surveys (factors) and related info
   * @Return Observable object
  */
  public getSurveyDataById(id) {
    let ret = this.getObjectDataById_GETMETHOD(id);
    ret.subscribe(
      function(survey_data) {
        this.object = SurveyFactory.createSurvey(this.injector, survey_data);

        // Get configure for contact survey
        this.object.getObjectConfigures();

        // Init data for question in all languages
        if (this.object.block_question || this.object.block_info) {
          this.createLabelListForUI(this.object, this.question_template);
        }
    }.bind(this)
    );
    return ret;
  }

  /**
   * Create survey object
   * If there is not survey id parameter, create new CSAT survey.
   * Other, get data and create survey object for this data
  */
  initSurveyInformation() {
    this.getQueryPramMap().subscribe(
      function(paramMap: ParamMap) {
        if (paramMap.get("id")) {
          // Get survey object for editing
          this.getSurveyDataById(paramMap.get("id"));
        } else {
          // Init new survey object
          let csat_model = {
            type: 0,
            question_texts: []
          };
          this.object = SurveyFactory.createSurvey(this.injector, csat_model);
          this.object.initModelData();

          // Init data for question in all languages
          if (this.object.block_question || this.object.block_info) {
            this.createLabelListForUI(this.object, this.question_template);
          }

        }
      }.bind(this)      
    )
  }

  /**
   * wait ultil loaded device language and set question texts in different languages
  */
  createLabelListForUI(survey_obj, template) {
    if (!this.device_langs || !this.device_langs.length) {
      setTimeout(this.createLabelListForUI.bind(this), null, survey_obj, template);
    } else {
      survey_obj.data.question_text_links = 
        Label.createLabelListForUI(survey_obj.data.question_texts, template);
    }
  }

  /**
   * Load main data for survey: survey object or init new one
   */ 
  loadMainPageObjects() {
    this.initSurveyInformation();
  }

  /**
   * Load all support data: theme list, collection list, survey list
  */
  loadSupportiveData() {
    // Get  list of survey type name in languages
    this.translate.get("SURVEY_PAGE.TYPES").subscribe(
      function(types) {
        // console.log("Types: ", types);
        this.survey_type_names = types;
      }.bind(this)
    );

    // Get collection list
    let col_list_filter = {
      "status": CollectionModel.STATUS_LIST.ACTIVE
    };
    this.loadObjectsbyFilter(Collection, col_list_filter).subscribe(
      function(data) {
        this.collections = data;
      }.bind(this)
    );

    // Get Theme list
    let theme_list_filter = {
      "status": 0
    };
    this.loadObjectsbyFilter(Theme, theme_list_filter).subscribe(
      function(data) {
        this.themes = data;
      }.bind(this)
    );

    // Get device language configuration, in order to input survey question in suported languages 
    this.getDeviceLanguages();
    // this.getDeviceLanguages(function(device_default_language, device_langs) {
    //     this.current_lang_code = device_default_language.code;
    //     this.selected_lang = Utils.getLangByLangcode(this.device_langs, this.current_lang_code);
    //   }.bind(this)
    // );
  }

  /**
   * Get feedback simulator URL
   */
  getFeedbackSimulatorURL() {
    let root_url = this.app_service.Based_URLs.simulator;
    if (!root_url)    root_url = "/simulator/";

    let url = root_url + "?token=" + AuthenticationService.getToken();
    let id = this.object.data.id;
    if (id)      url += "&survey_id=" + id;
    
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /**
   * Change survey type: re-create new survey object
  */
  changeSurveyType() {
    // Create new survey with type
    // console.log("Changed type");
    this.object = SurveyFactory.createSurvey(this.injector, this.object.data)
    this.object.initModelData();
    this.object.getObjectConfigures();
  }

  /**
   * Change language for factor tab
   **/ 
  changeFactorLanguage(lang) {
    // console.log("Selected language: ", lang);
    this.selected_lang = lang;
    this.current_lang_code = lang.code;

    // this.selected_lang = Utils.getLangByLangcode(this.device_langs, this.current_lang_code);
    // console.log("Current language: ", this.selected_lang);
  }

  /**
   * Select child survey from survey list  
   */ 
  changeChildSurvey(survey) {
    // console.log("Selected child survey: ", survey);
    // console.log("Selected child survey model: ", this.child_survey_form.child);
    this.child_survey_form.child = survey;
  }

  /**
   * Update child survey status
  */
  addChildSurvey() {
    // console.log("Update child survey status: ");
    // let child = this.survey_list[this.child_survey_form.index];
    // if (!child) {
    if (!this.child_survey_form.child) {
      this.app_service.showMessageById('MSG.SURVEY_MISSING_CHILD', 'toast-warning');
      return;
    }

    this.object.addChildSurvey(this.child_survey_form.child, this.child_survey_form.rule);
  }

  /**
   * Method to be called after survey is created: redirect to editing page
  */
  postCreateSurvey(survey) {
    if (!survey || !survey.id)  return;
    let uri = '/survey/edit?id=' + survey.id;

    // GOTO editing page
    this.router.navigateByUrl(uri);
  }

  /**
   * Update status for factor
   * */ 
  updateFactor(factor_data) {
    if (factor_data.checked) {
      factor_data.status = SurveyModel.STATUS_LIST.ACTIVE
    } else {
      factor_data.status = SurveyModel.STATUS_LIST.INACTIVE   // Closed
    }

    let factor = SurveyFactory.createSurvey(this.injector, factor_data);
    factor.update();
  }

  /**
   * Delete factor
  */
  deleteFactor(factor_index) {
    if (!this.object || !this.object.data || !this.object.data.subs)   return;
    let sub = this.object.data.subs[factor_index];
    if (!sub)   return;    
    
    let delete_url = this.get_URL_deleting();
    let payload = {id: sub.id};
    return this.app_service.postAPI(delete_url, payload, function() {
        // Delete factor in list
        this.object.data.subs.splice(factor_index, 1);
        this.postDelete();
      }.bind(this)
    );      
  }

  /**
   * update new data into factor raw data in UI
   * */ 
   postFactorCreate(new_factor_data) {
    // Update value for checkbox status
    // new_factor_data.checked = this.object.setCheckedValue(new_factor_data.status);
    let sub = this.factor.data.raw_data;
    sub.checked = this.factor.setStatusCheckedValue();
    sub.question_text_links = this.factor.data.question_text_links;
    sub.question = new_factor_data.question;
    
    // Insert into subs list
    this.object.data.subs.push(sub);

    // Init for adding new factor
    this.setupEditingFactorForm(); 
  };

  /**
   * update new data into factor raw data in UI
   * */ 
  postFactorUpdate(updated_factor_data) {
    // Init for adding new factor
    this.setupEditingFactorForm(); 
  }
  
  /**
   * Init factor object for editing in form
  */
  setupEditingFactorForm(factor_data=null) {
    if (!factor_data)   factor_data = this.object.initFactorData();

    this.factor = SurveyFactory.createSurvey(this.injector, factor_data);
    this.factor.data.question_text_links = Label.createLabelListForUI(
      factor_data.question_texts, this.question_template);   // For question
      
    this.factor.data.description_text_links = Label.createLabelListForUI(
      factor_data.description_texts, this.description_template);   // For description
  }

  /** Change screen direction */
  changeScreenDirection(type) {
    this.preview_screen = type
  }

  /**
   * Prepare factor data for survey when open factor tab: 
   * - Set checked status
   * - init empty factor
  */
  initFactors() {
    const survey_data = this.object.data;

    // Init status for factor
    if (survey_data && survey_data.subs) {
      for (let sub of survey_data.subs) {
        sub.checked = this.object.setStatusCheckedValue(sub.status)
        sub.question_text_links = Label.createLabelListForUI(sub.question_texts);
        sub.description_text_links = Label.createLabelListForUI(sub.description_texts);  
      }

      // Init empty factor (sub) to insert into factor list
      let factor_data = this.object.initFactorData();
      this.factor = SurveyFactory.createSurvey(this.injector, factor_data);
      factor_data.question_text_links = Label.createLabelListForUI(factor_data.question_texts);
      factor_data.description_text_links = Label.createLabelListForUI(factor_data.description_texts);  
    }
  }

  /**
   * Handle for drag and drop factor
  */
   changeFactorOrder(event: CdkDragDrop<string[]>) {
    // console.log("User dragged an item");
    moveItemInArray(this.object.data.subs, event.previousIndex, event.currentIndex);
    this.object.data.subs.forEach((sub, idx) => {
      // console.log("Original order: %s, new order: %s", sub.sub_order, idx+1);
      if (sub.sub_order != idx + 1) {
        sub.sub_order = idx + 1;
        this.updateFactor(sub);
      }
    });
  }

  /**
   * Handle for drag and drop children survey
  */
  changeChildrenSurveyOrder(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.object.data.children, event.previousIndex, event.currentIndex);
    this.object.data.children.forEach((child, idx) => {
      console.log("Original order: %s, new order: %s", child.relation.child_order, idx+1);
      if (child.relation.child_order != idx + 1) {
        child.relation.child_order = idx + 1;
        this.object.updateChildRelation(child.relation);
      }
    });
  }

  // focusOut(event) {
  //   console.log("Out Object: ", event.target);
  // }

  /** Get active html object - represent text for info survey */ 
  activeInfoObject(event) {
    // console.log("Object: ", event.target);
    if (event) 
      this.active_info_object = event.target
  }

  /**
   * Add tag to information survey 
  */
  addTag_Infor_survey(tag) {
    if (!this.active_info_object)    return;

    let cursorPos = this.active_info_object.selectionStart;
    let info_content = this.active_info_object.value;

    var textBefore = info_content.substring(0,  cursorPos );
    var textAfter  = info_content.substring( cursorPos, info_content.length );
    this.active_info_object.value = textBefore + tag + textAfter;
    let new_pos = cursorPos + tag.length;
    this.active_info_object.focus();
    this.active_info_object.setSelectionRange(new_pos, new_pos);

    // update into model
    let lang_code = this.active_info_object.id;
    this.object.data.question_text_links[lang_code].value = this.active_info_object.value;
  }

  /** Upding step in configuration
   * Value from 1-3
  */
   configure_StepChange(step) {
    switch (step) {
      case "FORM": // Basic form
        break;

      case "FACTOR": // Survey factors
        if (!this.object.data.id) {
          this.app_service.showMessageById('MSG.SURVEY_SAVING', 'toast-warning');
          return;
        }
        this.initFactors();
        this.setupEditingFactorForm(null);
        break;

      case "CHILD": // Child survey
        if (!this.object.data.id) {
          this.app_service.showMessageById('MSG.SURVEY_SAVING', 'toast-warning');
          return;
        }

        this.getSurveylist();
        let survey = this.object;
        survey.getChildSurveys();
        break;

      case "PREVIEW":   // Preview
        if (!this.object.data.id) {
          this.app_service.showMessageById('MSG.SURVEY_SAVING', 'toast-warning');
          return;
        }

    }
    this.step = step;

    return step;
  }

}
