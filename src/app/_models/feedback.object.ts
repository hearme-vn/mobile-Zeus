/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 14 Aug 2022
 * @purpose For working with survey model
 */

import { Injector } from '@angular/core';
import { AuthenticationService, URIS } from '@app/_services';
import { BaseObject } from './base.object';
import { FeedbackModel } from './feedback.model';
import { SurveyModel } from './survey.model';
import { Survey } from './survey.object';

/**
* Constructor, input:
* - message: an feedback line in database
* - survey: is object of Survey factory 
*/
class FeedbackMessage extends BaseObject {
  /** URI for manipulating object */
  static uri_update: String = URIS.front.feedback_update_recursive;
  static uri_info: String =   URIS.front.feedback_info;
  static uri_list: String =   URIS.front.feedback_list;  

  model_type = FeedbackModel;

  data: any;
  message: any;
  serializedMSGs: any;
  
  survey: Survey;
  color_level: number;
  name: string;
  contact: string;
  scale: number;
  fullData: any;
  reportCols: any;
  factor_messages: FeedbackFactory[];
  attach_files: any[];
  
  constructor( injector: Injector, message, survey ) {
    super(injector, message, survey);
    this.data = message;
    //this.data.created = new Date(this.data.created);
    if (message.body) {
      try {
        this.message = JSON.parse(message.body);
        if (!this.message.id)   this.data.id = message.id;
      } catch(e) {
        // console.log("Error in JSON: ", message.body);
        this.message = message;
        // return;
      }
    } else {
      this.message = message;
      if (survey) this.data.type = survey.data.type;       // Support old version
    }
    this.survey = survey;
    this.serializedMSGs = null;
    
    // For processing
    this.color_level = 11;
    this.name = null;
    this.contact = null;

  }

  /**
  * Pupose: Prepare data for display feedback detail
  * Output: create array of Messages
  */
   feedbackMessageList() {
    let feedback_res = [];
    let feedback = this.message;    
    feedback_res.push(this);

    // Create factor message
    if (this.survey.subs && Object.keys(this.survey.subs).length) 
      this.makeFactorMessages();

    if (feedback.children && feedback.children.length) {
      for (let i=0; i<feedback.children.length; i++) {
        let survey = this.survey.childs[feedback.children[i].sur_id];
        if (!survey)	continue;
        
        let child = FeedbackFactory.createMessage(this.injector, feedback.children[i], survey);
        
        let child_res = child.feedbackMessageList();
        if (child_res)
          feedback_res = [...feedback_res, ...child_res];
      }
    }
    return feedback_res;
  }

  /**
  * Create list of Message objects for Child surveys
  * Output: dictionay of {sur_id, feedbackMessage}
  */
  feedbackSerialize() {
    let feedback_res = {};
    let feedback = this.message;                
    
    feedback_res[feedback.sur_id] = this;
    
    if (feedback.children && feedback.children.length) {
      for (let i=0; i<feedback.children.length; i++) {
        let survey = this.survey.childs[feedback.children[i].sur_id];
        if (!survey)	continue;
        
        let child = FeedbackFactory.createMessage(this.injector, feedback.children[i], survey);
        if (child.constructor.name=='CONTMessage') {
          this.contact = feedback.children[i];
        }					
        
        let child_res = child.feedbackSerialize();
        if (child_res)
          feedback_res = Object.assign(feedback_res, child_res);
      }
    }
    
    this.serializedMSGs = feedback_res;
    return feedback_res;
  }
  
  /**
   * Get field value for making report
  */
  getFieldValue(field_name) {
    let val = this.data[field_name];

    if (typeof val === 'string')
      return val.replace(/<\/?[^>]+(>|$)/g, "");
    else
      return val;
  }

  // Make data to list in concise feedback list table
  makeShortReportData() {
    let fbMessages = this.feedbackSerialize();
    let conciseData = [];
    this.getRatingColorLevel();

    for (let i=0; i<this.survey.shortReport.length; i++) {
      let survey = this.survey.shortReport[i];
      let message = fbMessages[survey.data.id];
      
      if (message) {
        let color_level = message.getRatingColorLevel();
        if (color_level<this.color_level)
          this.color_level = color_level;
      }
      
      let cols = survey.getShortColumns();
      if (cols && cols.length) {
        for (let i=0; i<cols.length; i++) {
          if (message)	
            // conciseData.push(message.data[cols[i].field])
            conciseData.push(message.getFieldValue(cols[i].field))
          else
            conciseData.push("");
        }
      }
    }
    this.reportCols = conciseData;
  }

  // Export feedback data related to this feedback message
  // Not export recursively
  exportFeedbackData() {
    let export_fields = this.survey.getFullReportComlums();
    if (!export_fields || !export_fields.length)	return null;
    
    let fb_fields = [];
    for (let i=0; i<export_fields.length; i++) {
      let field = export_fields[i].field;				
      fb_fields.push(this.message[field]);
    }
    
    return fb_fields;
  }

  // Serialize all feedback data for exporting to excel
  makeFullReportData() {
    let fbMessages = this.feedbackSerialize();
    let surveys = this.survey.fullReport;
    if (!surveys || !surveys.length)	return null;
    
    let fullData = [];			
    for (var i=0; i<surveys.length; i++) {
      let survey = surveys[i];
      let message = fbMessages[survey.data.id];
      let cols = null;
      if (message)
        cols = message.exportFeedbackData();

      if (cols && cols.length) {
        fullData = fullData.concat(cols);
      } else {
        for (let k=0; k<survey.colspan; k++)
          fullData.push(null);
      }
      
    }
    this.fullData = fullData;
    return fullData;
  }

  /**
   *  Make list of Factor messages and asssign values to factors property
   */
  makeFactorMessages(): FeedbackMessage[] {
    let factors = [];
    let fb_childs = this.message.children;
    
    if (!fb_childs || !fb_childs.length)	return null;
    for (let i=0; i<fb_childs.length; i++) {
      let feedback = fb_childs[i];
      let factor = this.survey.subs[feedback.sur_id];
      if (!factor)	continue;
      
      let child_message = FeedbackFactory.createMessage(this.injector, feedback, factor);
      if (child_message)		factors.push(child_message);
    }
    this.factor_messages = factors;
    return factors;
    
  }

  getRatingColorLevel() {
    this.color_level = 11;
    return this.color_level;
  }

  /**
   * @return URL for updating object
  */
   public getUpdatingURL() {
    let base = <typeof BaseObject>this.constructor;
    return this.app_service.Based_URLs.front + base.uri_update;
  }

}

/**
* Define Factor class for type 3
*/ 
class FactorMessage extends FeedbackMessage {
  constructor( injector, message, survey) {
    super(injector, message, survey);
    this.name = "Factor";
  }

}

/**
* Define Index class for all CSAT, NPS, CES
*/ 
class IndexMessage extends FeedbackMessage {
  
}

/**
* Define extends concrete classes
*/ 
class CSATMessage extends IndexMessage {
  constructor(injector, message, survey) {
    super(injector, message, survey);
    this.name = "CSAT";
    this.scale = 5;
  }
  
  getRatingColorLevel() {            
    this.color_level = this.message.rating;
    return this.color_level;
  }
}

class NPSMessage extends IndexMessage {
  constructor(injector, message, survey) {
    super(injector, message, survey);
    this.name = "NPS";
    this.scale = 10;
  }
  
  getRatingColorLevel() {            
    this.color_level = Math.round(this.message.rating / 2);
    return this.color_level;
  }            
}

class CESMessage extends IndexMessage {
  constructor(injector, message, survey) {
    super(injector, message, survey);
    this.name = "CES";
    this.scale = 7;
  }
  
  getRatingColorLevel() {            
    this.color_level = this.message.rating - 1;
    return this.color_level;
  }
}

class FLXMessage extends IndexMessage {
  constructor(injector, message, survey) {
    super(injector, message, survey);
    this.name = "FLX";
    this.scale = survey.data.scales;
  }
  
  getRatingColorLevel() {
    if (this.message.rating < (this.scale + 1)/2) {
      this.color_level = Math.ceil(this.message.rating*6/(this.scale + 1));
    }
    else
      this.color_level = 10;
    
    return this.color_level;
  }
}

class SELECTIONMessage extends FeedbackMessage {
  constructor(injector, message, survey) {
    super(injector, message, survey);
    this.name = "SELECTION";
  }
      
  // Extract all factor data to make report
  // In order of factors in survey
  exportFeedbackData() {
    if (!this.survey.subs)	return null;

    if (!this.message.children || !this.message.children.length)	
      return null;			

    let factor_fbs = [];
    for (let key in this.survey.subs) {
      let factor_value = null;
      if (this.message.children.length) {
        for (let i=0; i<this.message.children.length; i++) {
          if (key==this.message.children[i].sur_id) {
            factor_value = this.message.children[i].rating;
            this.message.children.splice(i, 1);
            break;
          }
        }
      }
      factor_fbs.push(factor_value);
    }
    return factor_fbs;
  }
      
}

class RATINGMessage extends SELECTIONMessage {
  constructor(injector, message, survey) {
    super(injector, message, survey);
    this.name = "RATING";
  }

}

class HOWMessage extends FeedbackMessage {
  constructor(injector, message, survey) {
    super(injector, message, survey);
    this.name = "HOWSurvey";
  }

}

class CONTMessage extends FeedbackMessage {  //Contact survey
  constructor(injector, message, survey) {
    super(injector, message, survey);
    this.name = "CONTACT";
  }

}

class ATTCHMessage extends FeedbackMessage {  //Attachment survey
  constructor(injector, message, survey) {
    super(injector, message, survey);
    this.name = "ATTCHSurvey";
  }

  getFieldValue(field_name) {
    if (this.data[field_name])
      return "<i class='fa fa-files-o'></i>"
    else 
      return "";
  }

  /**
  * Pupose: Prepare data for display feedback detail
  * Output: create array of Messages
  */
   feedbackMessageList() {
    if (this.data.comment && this.data.comment.length) {
      try {
          this.attach_files = JSON.parse(this.data.comment);
          if (this.attach_files && this.attach_files.length) {
            for (let file of this.attach_files) {
              let token = AuthenticationService.getToken();
              file["url"] = this.app_service.Based_URLs.front + "attachment/read/" + file.id + "?token=" + token;
            }
          }
          return [this];
      } catch(err) {
          console.log("Error in list of attachment files: ", err);
      }
    }
    return [];
  }

}

class MIXEDMessage extends FeedbackMessage {
  constructor(injector, message, survey) {
    super(injector, message, survey);
    this.name = "MIXED";
  }

}

class FORMMessage extends FeedbackMessage {
  constructor(injector, message, survey) {
    super(injector, message, survey);
    this.name = "FRM";
  }

}
  
class FeedbackFactory {
  
  static createMessage(injector, message, survey) {
    
    if (survey.data.type==SurveyModel.SURVEY_TYPE.CSAT)
      return new CSATMessage(injector, message, survey)
    
    else if (survey.data.type==SurveyModel.SURVEY_TYPE.NPS)
      return new NPSMessage(injector, message, survey)
    
    else if (survey.data.type==SurveyModel.SURVEY_TYPE.CES)
      return new CESMessage(injector, message, survey)

    else if (survey.data.type==SurveyModel.SURVEY_TYPE.MTF ||
      survey.data.type==SurveyModel.SURVEY_TYPE.EXF )
      return new SELECTIONMessage(injector, message, survey)
    
    else if (survey.data.type==SurveyModel.SURVEY_TYPE.RTF)
      return new RATINGMessage(injector, message, survey)
    
    else if (survey.data.type==SurveyModel.SURVEY_TYPE.HOW)
      return new HOWMessage(injector, message, survey)
    
    else if (survey.data.type==SurveyModel.SURVEY_TYPE.MIXED)
      return new MIXEDMessage(injector, message, survey)
    
    else if (survey.data.type==SurveyModel.SURVEY_TYPE.CONT)
      return new CONTMessage(injector, message, survey)
    
    else if (survey.data.type==SurveyModel.SURVEY_TYPE.FLX)
      return new FLXMessage(injector, message, survey)

    else if (survey.data.type==SurveyModel.SURVEY_TYPE.FRM)
      return new FORMMessage(injector, message, survey)

    else if (survey.data.type==SurveyModel.SURVEY_TYPE.ATCH)
      return new ATTCHMessage(injector, message, survey)

    else 
      return new FactorMessage(injector, message, survey);
    
  }
}

export { FeedbackMessage, FeedbackFactory }