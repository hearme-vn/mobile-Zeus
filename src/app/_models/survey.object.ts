/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 14 Aug 2022
 * @purpose For working with survey model
 */

// import { identifierModuleUrl } from '@angular/compiler';
import { Injector } from '@angular/core';
import { URIS } from '@app/_services';
import { TranslateService } from '@ngx-translate/core';
import { BaseObject } from './base.object';
import { Configure, ConfigureModel } from './configure.model';
import { Label } from './label.model';
import { RelationModel, SurveyModel } from './survey.model';

class Survey extends BaseObject {
  public translate: TranslateService;

  /** URI for manipulating object */
  static uri_create: String = URIS.main.survey_create;;
  static uri_update: String = URIS.main.survey_v3_update;
  static uri_delete: String = URIS.main.survey_v3_delete;
  static uri_info: String =   URIS.main.survey_info;
  static uri_list: String =   URIS.main.survey_list;  
  static uri_tree: String =   URIS.main.survey_tree;
  static uri_childList: String =      URIS.main.survey_childList;
  static uri_delete_child: String =   URIS.main.survey_delete_child;
  static uri_update_child: String =   URIS.main.survey_update_child;
  static uri_add_child: String =      URIS.main.survey_add_child;
  static uri_set_status: String =      URIS.main.survey_v3_set_status;
  static uri_export: String =      URIS.main.survey_export;
  static uri_import: String =      URIS.main.survey_import;
  
  /**
   * Description FOR Rules to move to child surveys
  */
  CHILD_RULE_DESCRIPTION = "";

  /** Store model data for this object*/
  public model_type = SurveyModel;
  public data: SurveyModel;

  /**
   * Survey type
   */
  type = 0;

  /**
   * This part is for making report and exporting data
  */
  default_col_id = null;
  configs = null;
  
  /**
   * Properties for making feedback list and exporting feedbacks
  */
  reportSurveys: any;
  fullColumns: any;
  shortColumns: any;
  headerCols: any;
  subheader_list: any;
  inShortReport = false;
  inFullReport = true;
  childs = {};
  subs = {};
    
  // For exporting raw data to excel
  shortReport = [];   // List of surveys for short report
  fullReport = [];    // List of surveys for full report

  // For format report
  rowspan = 2;       // for header table
  colspan = 1;       // For header table

  /**
   * Data to define show /hide for each block in creation form
  */
  block_collection = false;
  block_theme = true;
  block_scale = false;   // Just for FLX
  block_options = true;
  block_option_require = true;
  block_option_noti = false;
  block_option_inverted_order = false;
  block_question = true;
  block_info = false;
  block_contact_fields = false;
  block_factors = false;
  block_child_survey = false;
  block_child_options_good_bad = false;
  block_child_options_scale = false;
  block_child_options_factor = false;

  /**
  * Survey Constructor 
  */
  constructor( injector: Injector, data=null) {
    super(injector, data);
    this.data = this.model_type.newModel(data);
    this.translate = injector.get(TranslateService);
    
    if (data) {
      if (data.children && data.children.length) {
        this.childs = {};
        for (var i=0; i<data.children.length; i++) {
          var child = SurveyFactory.createSurvey(injector, data.children[i]);
          this.childs[child.data.id] = child;
        }
      }
      
      if (data.subs && data.subs.length) {
        this.subs = {};
        for (var i=0; i<data.subs.length; i++) {
          var sub = SurveyFactory.createSurvey(injector, data.subs[i]);
          this.subs[sub.data.id] = sub;
        }
      }
    }
  }

  /**
   * Init data for this model for first time create object
  */
  public initModelData() {}
  
  /**
   * Pre processing before updating survey:
   * - Update default question text to question
  */
  preUpdate() {
    // Update default question text to question
    if (this.data.question_texts && this.data.question_texts.length) {
      for (let question_text of this.data.question_texts) {
        let text = <any>question_text;
        if (text.lang_id == this.app_service.device_default_language.id) {
          this.data.question = text.value;
          break;
        }
      }
    }
  }


  /**
   * Prepare data before create object
   * */ 
  preCreate() {
    this.preUpdate();
  }

  /**
   * Make payload for updating and creating survey
   */
  makePayload(fields) {
    let payload = <any>super.makePayload(fields);

    // Payload field for question texts
    if (payload.question_texts && payload.question_texts.length) {
      for (let i=0; i<payload.question_texts.length; i++) {
        let label = payload.question_texts[i];
        if (!label.id && !label.value)  payload.question_texts.splice(i, 1);
      }
    }

    // Payload field for question texts
    if (payload.description_texts && payload.description_texts.length) {
      for (let i=0; i<payload.description_texts.length; i++) {
        let label = payload.description_texts[i];
        if (!label.id && !label.value)  payload.description_texts.splice(i, 1);
      }
    }

    // payload field for configures. configures is an arrray of Configure object
    if (payload.configures && payload.configures.length) {
      let configures = [];
      for (let config of payload.configures) {
        config.setContactConfigureValue();
        configures.push(config.makePayload(config.model_type.update_fields));
      }
      payload.configures = configures;
    }

    return payload;
  }


  /**
   * Post process after creating new survey
   * - Create configure for survey
   * - Create question texts, description texts
  */
  postCreate(data) {
    if (!this.data || !this.data.id)    return;

    // Update for configure
    if (this.block_contact_fields) {
      for (let config of this.data.configures) {
        config.setContactConfigureValue();
      }
      this.createObjectConfigures();
    }

    // Update for question labels
    if (this.data.question_texts && this.data.question_texts.length) {
      for (let question_text of this.data.question_texts) {
        if (question_text.value && question_text.value.length) {
          question_text.row_id = this.data.id;
          let label = new Label(this.injector, question_text);
          label.create();  
        }
      }
    }

    // Update for description labels
    if (this.data.description_texts && this.data.description_texts.length) {
      for (let description_text of this.data.description_texts) {
        if (description_text.value && description_text.value.length) {
          description_text.row_id = this.data.id;
          let label = new Label(this.injector, description_text);
          label.create();  
        }
      }
    }
  }

  /**
   * Get checked value - to set model value to checkbox object in UI
  */
  setStatusCheckedValue(status=null) {
    if (status == undefined || status == null)    status = this.data.status;
    return (status == SurveyModel.STATUS_LIST.ACTIVE)
  }

  /**
   * Get survey tree for this survey
  */
  getSurveyTree(callback=null) {
    let url = this.app_service.Based_URLs.main + URIS.main.survey_tree;
    let payload = {id: this.data.id};
    return this.app_service.postAPI(url, payload, 
      function(survey_tree) {
        if (callback)   callback(survey_tree);
      }.bind(this)
    );
  } 

  /**
   * Get child surveys 
  */
  getChildSurveys() {
    const url = this.app_service.Based_URLs.main + Survey.uri_childList;
    const payload = {id: this.data.id};
    
    let ret = this.app_service.postAPI_Observable(url, payload);
    ret.subscribe(
      function(children) {
        this.data.children = children
        this.setRelationData(children);
      }.bind(this)
    );
    return ret;
  }

  /**
   * Set checked value as model for checkbox, represent child status
  */
  setChildRelationChecked(relation) {
    relation.checked = (relation.status == RelationModel.RELATION_STATUS.ACTIVE)
  }

  /**
   * Name of condition to move from parent to child survey
  */
  setConditionName(relation) {
    relation.name = relation.rule;
    return relation.name;
  }

  /**
   * Purpose: prepare value for displaying child survey in UI:
   * - Set checked property to relation in child survey
   * - Set relation name - condition to move from parent to child
   */
  setRelationData(children=null) {
    if (!children)    children = this.data.children;
    for (let child of children) {
      this.setChildRelationChecked(child.relation);
      this.setConditionName(child.relation);
    }
  }
  
  /**
   * Delete child survey
   * @input relation id for relation between parent and child survey
  */
  deleteChildSurvey(index) {
    if ((index >= this.data.children.length) || (index < 0))     return;

    let child = <any>this.data.children[index];
    let url = this.getMainURL(Survey.uri_delete_child);
    let ret = this.app_service.getAPIPromise(url, {id: child.relation.id});
    ret.then(
      function(res) {
        this.data.children.splice(index, 1);
        this.app_service.showMessageById("MSG.DELETE_OBJECT", 'toast-success');
      }.bind(this))
    return ret;
  }

  /**
   * Update relationship between parent and child survey
   * @input Relation object between parent and child survey
  */
  updateChildRelation(relation) {
    // console.log("relation: ", relation);
    if (relation.checked)   
      relation.status = RelationModel.RELATION_STATUS.ACTIVE
    else
      relation.status = RelationModel.RELATION_STATUS.INACTIVE

    let url = this.getMainURL(Survey.uri_update_child);
    return this.app_service.postAPI(url, relation).then(
      this.app_service.showSuccessMessage.bind(this.app_service)
    );
  }

  /**
   * Add child survey
   * @input Child survey
  */
  addChildSurvey(child, rule) {
    // Add child survey to dababase
    let payload = {
      child_id: child.id,
      parent_id: this.data.id,
      child_order: this.data.children.length + 1,
      rule: rule
    }
    let url = this.getMainURL(Survey.uri_add_child);
    let ret = this.app_service.postAPI_Observable(url, payload);

    // Add child survey to child list
    ret.subscribe(function(relation) {
      this.setChildRelationChecked(relation);
      this.setConditionName(relation);

      child.relation = relation;
      this.data.children.push(child);
      
      this.app_service.showSuccessMessage();
    }.bind(this));
  }

  /**
   * Init factor data for creating new factor
  */
  initFactorData() {
    let sub_order = 1;
    if (this.data.subs && this.data.subs.length)    sub_order = this.data.subs.length + 1;

    let factor_data = {
      name: this.data.name,
      parent: this.data.id,
      sub_order: sub_order,
      type: 3,
      status: SurveyModel.STATUS_LIST.ACTIVE,
      question_texts: [],
      description_texts: []
    }
    return factor_data;
  }

  /**
  * This session is for making feedback list
  * get column names and fields for short report
  */
  getShortColumns() {
    return null;
  }
  
  // Get columns 
  getFullReportComlums() {
    return null;
  }
  
  // This method is used when export data to excel
  getSubHeaders() {
    return null;
  }
  
  // Method to get list of all survey for Report
  getReportSurveys(type) {
    let suveys = [];
    
    if (this[type])     suveys.push(this);
    
    if (this.childs) {
      for (var key in this.childs) {
        var list = this.childs[key].getReportSurveys(type);
        if (list && list.length)
          suveys = suveys.concat(list);
      }
    }
    this.reportSurveys = suveys;
    return suveys;
  }
  
  // make table header for list of surveys
  getColumnHeader(surveyList, columnHandl) {
    if (!surveyList || !surveyList.length)
      return null;
    
    var col_list = [];
    for (var i=0; i<surveyList.length; i++) {
      var cols = surveyList[i][columnHandl]();
      if (cols && cols.length) {
        col_list = col_list.concat(cols);
      }                   
    }
    return col_list;
  }
  
  makeShortHeader() {
    this.shortReport = this.getReportSurveys('inShortReport');
    this.headerCols = this.getColumnHeader(this.shortReport, 'getShortColumns');
    return this.headerCols;
  }
  
  makeFullSurveyReport() {
    this.fullReport = this.getReportSurveys('inFullReport');
    
    if (!this.fullReport || !this.fullReport.length)
      return null;
    
    let subheader_list = [];
    for (var i=0; i<this.fullReport.length; i++) {
      let survey = this.fullReport[i];
      
      let cols = survey.getSubHeaders();
      if (cols && cols.length) {
        subheader_list = subheader_list.concat(cols);
      }                   
    }
    this.subheader_list = subheader_list;
    
  }
  
}

/*
* This class for surveys: 
 - Exclusive, Multi selection, 5 star ratings,
 - HOW (Comment), Attachment survey, Info survey 
 - and Contact survey
**/
class SUPPORTSurvey extends Survey {
  default_notification = 0;


  // For making report
  rowspan = 1;
  
  constructor( injector: Injector, raw_data=null) {
    super(injector, raw_data);
    
    if (this.data.subs)
      this.colspan = this.data.subs.length;           
  }

  getSubHeaders() {
    if (!this.subs)     return null;

    let cols = [];          
    for (let key in this.subs) {
      if (!this.subs.hasOwnProperty(key))     continue;
      
      let sub = this.subs[key];
      cols.push({
        title: sub.data.question,
        survey: sub
      })
    }
    return cols;
  }
  
  getFullReportComlums() {return null;}
  
}

/**
* Define survey class for Multi-selection survey
*/      
class MultiSurvey extends SUPPORTSurvey {
  type = 4;

  /**
   * Data to define show /hide for each block in creation form
  */
  block_collection = true;
  block_factors = true;
  
  constructor( injector: Injector, raw_data=null) {
    super(injector, raw_data);
  }    
}

/**
* Define survey class for Exclusive survey
*/      
class ExclusiveSurvey extends SUPPORTSurvey {
  type = 5;

  CHILD_RULE_DESCRIPTION = "SURVEY_PAGE.RULE_DESCRIPTION_EXCLUSIVE_SELECTION";

  /**
   * Data to define show /hide for each block in creation form
  */
   block_collection = true;
   block_factors = true;   
   block_child_survey = true;
   block_child_options_factor = true;
   
  constructor( injector: Injector, raw_data=null) {
    super(injector, raw_data);
  }
  


  /**
   * Name of condition to move from parent to child survey
  */
  setConditionName(relation) {
    relation.name = relation.rule;

    for (let sub of this.data.subs) {
      if (sub.id == relation.rule) {
        relation.name = sub.question;
        return relation.name;
      }
    }
    return relation.name
  }


}
/**
* Define survey class for FACTOR survey
*/      
class FactorSurvey extends SUPPORTSurvey {
  type = 3;
  
  // inFullReport = false;
  
  constructor( injector: Injector, raw_data=null) {
    super(injector, raw_data);
    if (!raw_data.question_texts)   this.data.question_texts = [];
    if (!raw_data.description_texts)    this.data.description_texts = [];
  }
  
  getFullReportComlums() {
    this.fullColumns = [{
      field: "rating",
    }];
    return this.fullColumns;
  }
  
}

/**
* Define survey class for HOW survey - Open question
*/      
class HOWSurvey extends SUPPORTSurvey {
  type = 7;

  default_required = 0;

  inShortReport = true;
  rowspan = 1;
  colspan = 3;
  
  constructor( injector: Injector, raw_data=null) {
    super(injector, raw_data);

  }
  
  getShortColumns() {
    this.shortColumns = [{
      title: this.translate.instant('SURVEY_PAGE.TYPES.7'),
      field: "comment",
      survey_data: this.data
    }];
    return this.shortColumns;
  }

  getSubHeaders() {
    let cols = [
      {title: this.translate.instant('SURVEY_PAGE.TYPES.7'), field: "comment"},
      {title: this.translate.instant('CONFIGURES.CONTACT_NAME'), field: "name"},
      {title: this.translate.instant('CONFIGURES.CONTACT_PHONE'), field: "contact"},
    ];
    return cols;
  }
  
  getFullReportComlums() {
    return this.getSubHeaders();
  }
}

/**
* Define survey class for CONTACT survey
*/      
class CONTSurvey extends SUPPORTSurvey {
  type = 9;

  /**
   * Data to define show /hide for each block in creation form
  */
   block_contact_fields = true;
   block_option_require = false;

  inShortReport = true;
  rowspan = 1;
  colspan = 4;
  
  constructor( injector: Injector, raw_data=null) {
    super(injector, raw_data);

    // Init configure for contact data
    // if (!raw_data || !raw_data.configures) {
    //   const configures = this.initData();
    //   if (!this.data.raw_data)
    //     this.data.raw_data = {configures: <any[]>configures}
    //   else 
    //     this.data.raw_data.configures = configures;

    //   this.data.configures = <[]>configures;
    // }
  }

  initData() {
    return this.configs = [
      {id: "", object_id: "", cfg_key: "CONTACT_NAME", value: "0", status: 1, cfg_order: 1},
      {id: "", object_id: "", cfg_key: "CONTACT_PHONE", value: "0", status: 1, cfg_order: 2},
      {id: "", object_id: "", cfg_key: "CONTACT_EMAIL", value: "0", status: 1, cfg_order: 3},
      {id: "", object_id: "", cfg_key: "CONTACT_ADDRESS", value: "0", status: 1, cfg_order: 4},
      {id: "", object_id: "", cfg_key: "CONTACT_ROOMNUMBER", value: "0", status: 1, cfg_order: 5}
    ]
  }

  // Processing configuration data for object, after getting from backend
  makeConfigureObject() {
    if (!this.data || !this.data.raw_data || !this.data.raw_data.configures)    return;

    this.data.configures = [];
    let key_set = new Set(["CONTACT_NAME", "CONTACT_PHONE", "CONTACT_EMAIL", "CONTACT_ADDRESS", "CONTACT_ROOMNUMBER"]);

    // console.log("Configures: ", this.data.raw_data.configures);
    for (let configure_data of this.data.raw_data.configures) {
      key_set.delete(configure_data["cfg_key"]);
      let cfg_object = new Configure(this.injector, configure_data);
      cfg_object.setContactCheckValues();
      this.data.configures.push(cfg_object);
    }

    // Add missing configures with default value for contact survey
    if (key_set && key_set.size) {
      key_set.forEach( missing_key => {
        let configure = {
          id: "", 
          object_id: this.data.id, 
          cfg_key: missing_key, 
          value: "0", 
          status: 1, 
          cfg_order: this.data.configures.length + 1,
          chkRequired: false,
          chkValidate: false
        }
        let cfg_object = new Configure(this.injector, configure);
        this.data.configures.push(cfg_object);
      });
    }
  }

  /**
   * Get configure for object from database
   * If this is not any configure (new object), create new configure for it
  */
  getObjectConfigures() {
    let cfg_res = super.getObjectConfigures();
    if (!cfg_res) {
      const configures = this.initData();
      if (!this.data.raw_data)
        this.data.raw_data = {configures: <any[]>configures}
      else 
        this.data.raw_data.configures = configures;

      this.data.configures = <[]>configures;
      this.makeConfigureObject();
    } else {
      cfg_res.then(
        this.makeConfigureObject.bind(this)
      );
    }
    return cfg_res;
  }

  getShortColumns() {
    this.shortColumns = [
      {
        title: this.translate.instant('CONFIGURES.CONTACT_NAME'),
        field: "name"
      },
      {
        title: this.translate.instant('CONFIGURES.CONTACT_PHONE'),
        field: "phone"
      },
    ];
    return this.shortColumns;
  }
  
  getSubHeaders() {
    let cols = [
      {title: this.translate.instant('CONFIGURES.CONTACT_NAME'), field: "name"},
      {title: this.translate.instant('CONFIGURES.CONTACT_PHONE'), field: "phone"},
      {title: this.translate.instant('CONFIGURES.CONTACT_EMAIL'), field: "email"},
      {title: this.translate.instant('CONFIGURES.CONTACT_ADDRESS'), field: "address"},
    ];
    return cols;
  }
  
  getFullReportComlums() {
    return this.getSubHeaders();
  }
}


/**
* Define survey class for ATTACHMENT survey
*/      
class ATTCHSurvey extends SUPPORTSurvey {
  type = 12;

  default_required = 0;

  inShortReport = true;
  rowspan = 2;
  colspan = 1;
  
  constructor( injector: Injector, raw_data=null) {
    super(injector, raw_data);

  }
  
  getShortColumns() {
    this.shortColumns = [{
      title: this.translate.instant('SURVEY_PAGE.TYPES.12'),
      field: "comment",
      survey_data: this.data
    }];
    return this.shortColumns;
  }

  getFullReportComlums() {
    return this.getSubHeaders();
  }
}

/**
* Define survey class for INFOMATION survey
*/      
class INFOSurvey extends SUPPORTSurvey {
  type = 13;

  /**
   * Data to define show /hide for each block in creation form
  */
  block_theme = false;
  block_option_require = false;
  block_info = true;
  block_question = false;
  
  constructor( injector: Injector, raw_data=null) {
    super(injector, raw_data);

  }
  
}

/**
* Define survey class for 5 STAR RATING
*/      
class RatingSurvey extends SUPPORTSurvey {
  type = 6;

  default_notification = 0;

  /**
   * Data to define show /hide for each block in creation form
  */
  block_collection = true;
  block_option_noti = true;
  block_factors = true;

  constructor( injector: Injector, raw_data=null) {
    super(injector, raw_data);
  }

  initModelData() {
    this.data.notification = this.default_notification;
  }  
  
}


/**
* Define survey class for all CSAT, NPS, CES, FLX
*/      
class IndexSurvey extends Survey {
  default_notification = 1;
  scales = 5;

  CHILD_RULE_DESCRIPTION = "SURVEY_PAGE.RULE_DESCRIPTION_BAD_GOOD";

  /**
   * Data to define show /hide for each block in creation form
  */
  block_theme = true;
  block_options = true;
  block_option_noti = true;
  block_child_survey = true;
  block_child_options_good_bad = true;

  // For making report
  inShortReport = true;
  shortTitle = "Index";
  rowspan = 2;
  colspan = 1;
  
  constructor( injector: Injector, raw_data=null) {
    super(injector, raw_data);
    if (!raw_data || !raw_data.scales)   this.data.scales = this.scales;
  }
  
  initModelData() {
    this.data.initData();   // Init data for index survey: notification, required and inverted_order
  }  
  

  getShortColumns() {
    this.shortColumns = [{
      title: this.shortTitle,
      field: "rating",
      survey_data: this.data
    }];
    return this.shortColumns;
  }
  
  getFullReportComlums() {
    return this.getShortColumns();
  }
}

// Define survey class for CSAT Survey
class CSATSurvey extends IndexSurvey {
  type = 0;    
  scales = 5;

  /**
   * Data to define show /hide for each block in creation form
  */
   block_collection = true;

  shortTitle = "CSAT";
  
  constructor( injector: Injector, raw_data=null) {
    super(injector, raw_data);
  }           
}

// Define survey class for NPS Survey
class NPSSurvey extends IndexSurvey {
  type = 1;
  scales = 11;
  
  shortTitle = "NPS";
  
  constructor( injector: Injector, raw_data=null) {
    super(injector, raw_data);
    this.data.scales = this.scales;
  }           
}

// Define survey class for CES Survey
class CESSurvey extends IndexSurvey {
  type = 2;    
  scales = 7;
  
  shortTitle = "CES";
  
  constructor( injector: Injector, raw_data=null) {
    super(injector, raw_data);
    this.data.scales = this.scales;
  }           
}

// Define survey class for FLX Survey
class FLXSurvey extends IndexSurvey {
  type = 10;    
  shortTitle = "FLX";

  CHILD_RULE_DESCRIPTION = "SURVEY_PAGE.RULE_DESCRIPTION_FLX";

  /**
   * Data to define show /hide for each block in creation form
  */
  block_collection = true;
  block_scale = true;
  block_option_inverted_order = true;
  block_child_options_good_bad = false;
  block_child_options_scale = true;
  
  constructor( injector: Injector, raw_data=null) {
    super(injector, raw_data);

  }           
}

/*
* Define survey class for Mixed Survey
*/      
class MIXEDSurvey extends Survey {
  type = 8;
  
  /**
   * Data to define show /hide for each block in creation form
  */
  block_theme = false;
  block_option_require = false;
  block_question = false;
  block_child_survey = true;

  inFullReport = false;
    
  constructor( injector: Injector, raw_data=null) {
    super(injector, raw_data);

  }           
}

/*
* Define survey class for FORM based Survey
*/      
class FormSurvey extends Survey {
  type = 11;

  /**
   * Data to define show /hide for each block in creation form
  */
  block_theme = false;
  block_option_require = false;
  block_question = true;
  block_child_survey = true;

  inFullReport = false;
    
  constructor( injector: Injector, raw_data=null) {
    super(injector, raw_data);

  }           
}

/**
* Class for creating Surveys
*/      
class SurveyFactory {
  
  static createSurvey(injector, data) {
    let SURVEY_TYPE = SurveyModel.SURVEY_TYPE;
    let survey = null;

    if (data.type==SURVEY_TYPE.CSAT)
      survey = new CSATSurvey(injector, data)
    else if (data.type==SURVEY_TYPE.NPS)
      survey =  new NPSSurvey(injector, data)
    else if (data.type==SURVEY_TYPE.CES)
      survey =  new CESSurvey(injector, data)
    else if (data.type==SURVEY_TYPE.FLX)
      survey =  new FLXSurvey(injector, data)                
    else if (data.type==SURVEY_TYPE.MTF)
      survey =  new MultiSurvey(injector, data)
    else if (data.type==SURVEY_TYPE.EXF)
      survey =  new ExclusiveSurvey(injector, data)
    else if (data.type==SURVEY_TYPE.RTF)
      survey =  new RatingSurvey(injector, data)
    else if (data.type==SURVEY_TYPE.HOW)
      survey =  new HOWSurvey(injector, data)
    else if (data.type==SURVEY_TYPE.CONT)
      survey =  new CONTSurvey(injector, data)
    else if (data.type==SURVEY_TYPE.MIXED)
      survey =  new MIXEDSurvey(injector, data)
    else if (data.type==SURVEY_TYPE.FRM)
      survey =  new FormSurvey(injector, data)
    else if (data.type==SURVEY_TYPE.ATCH)
      survey =  new ATTCHSurvey(injector, data);
    else if (data.type==SURVEY_TYPE.SFR)
      survey =  new FactorSurvey(injector, data);
    else if (data.type==SURVEY_TYPE.INFO)
      survey =  new INFOSurvey(injector, data);      
    else {
      survey =  new CSATSurvey(injector, data);
    }
    return survey;
  }
}

export {Survey, SurveyFactory};