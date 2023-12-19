/* 
  Created by: thuc@labsofthings.com
  Organization: LabsOfThings.com
  Project: hearme.vn
  Date: 22 Jun 2018
 */
    /**
    * Constructor, input:
    * - message: an feedback line in database
    * - survey: is object of Survey factory 
    */

    // class BaseMessage {
        
    //     constructor(message, survey) {
    //         this.data = message;
    //         //this.data.created = new Date(this.data.created);
    //         if (message.body) {
    //             try {
    //                 this.message = JSON.parse(message.body);
    //                 if (!this.message.id)   this.data.id = message.id;
    //             } catch(e) {
    //                 console.log("Error in JSON: ", message.body);
    //                 this.message = message;
    //                 // return;
    //             }                
    //         } else {
    //             this.message = message;
    //             if (survey) this.data.type = survey.data.type;       // Support old version
    //         }
    //         this.survey = survey;
    //         this.serializedMSGs = null;
            
    //         // For processing
    //         this.color_level = 11;
    //         this.name = null;
    //         this.contact = null;

    //     }
        
    //     /**
    //     * Create list of Message objects for Child surveys
    //     */
    //     feedbackSerialize() {
    //         let feedback_res = {};
    //         let feedback = this.message;                
            
    //         feedback_res[feedback.sur_id] = this;
            
    //         if (feedback.children && feedback.children.length) {
    //             for (let i=0; i<feedback.children.length; i++) {
    //                 let survey = this.survey.childs[feedback.children[i].sur_id];
    //                 if (!survey)	continue;
                    
    //                 let child = FeedbackFactory.createMessage(feedback.children[i], survey);
    //                 if (child.constructor.name=='CONTMessage') {
    //                     this.contact = feedback.children[i];
    //                 }					
                    
    //                 let child_res = child.feedbackSerialize();
    //                 if (child_res)
    //                     feedback_res = Object.assign(feedback_res, child_res);
    //             }
    //         }
            
    //         this.serializedMSGs = feedback_res;
    //         return feedback_res;
    //     }
        
    //     /**
    //      * Get field value for making report
    //     */
    //     getFieldValue(field_name) {
    //         let val = this.data[field_name];

    //         if (typeof val === 'string')
    //             return val.replace(/<\/?[^>]+(>|$)/g, "");
    //         else
    //             return val;
    //     }

    //     // Make data to list in concise feedback list table
    //     makeShortReportData() {
    //         let fbMessages = this.feedbackSerialize();
    //         let conciseData = [];
    //         this.getRatingColorLevel();

    //         for (let i=0; i<this.survey.shortReport.length; i++) {
    //             let survey = this.survey.shortReport[i];
    //             let message = fbMessages[survey.data.id];
                
    //             if (message) {
    //                 let color_level = message.getRatingColorLevel();
    //                 if (color_level<this.color_level)
    //                     this.color_level = color_level;
    //             }
                
    //             let cols = survey.getShortColumns();
    //             if (cols && cols.length) {
    //                 for (let i=0; i<cols.length; i++) {
    //                     if (message)	
    //                         // conciseData.push(message.data[cols[i].field])
    //                         conciseData.push(message.getFieldValue(cols[i].field))
    //                     else
    //                         conciseData.push("");
    //                 }
    //             }
    //         }
    //         this.reportCols = conciseData;
    //     }

    //     // Export feedback data related to this feedback message
    //     // Not export recursively
    //     exportFeedbackData() {
    //         let export_fields = this.survey.getFullReportComlums();
    //         if (!export_fields || !export_fields.length)	return null;
            
    //         let fb_fields = [];
    //         for (let i=0; i<export_fields.length; i++) {
    //             let field = export_fields[i].field;				
    //             fb_fields.push(this.message[field]);
    //         }
            
    //         return fb_fields;
    //     }

    //     // Serialize all feedback data for exporting to excel
    //     makeFullReportData() {
    //         let fbMessages = this.feedbackSerialize();
    //         let surveys = this.survey.fullReport;
    //         if (!surveys || !surveys.length)	return null;
            
    //         let fullData = [];			
    //         for (var i=0; i<surveys.length; i++) {
    //             let survey = surveys[i];
    //             let message = fbMessages[survey.data.id];
    //             let cols = null;
    //             if (message)
    //                 cols = message.exportFeedbackData();

    //             if (cols && cols.length) {
    //                 fullData = fullData.concat(cols);
    //             } else {
    //                 for (let k=0; k<survey.colspan; k++)
    //                     fullData.push(null);
    //             }
                
    //         }
    //         this.fullData = fullData;
    //         return fullData;
    //     }

    //     // Get Factors for surveys
    //     getSurveyFactors() {
    //         let factors = [];
    //         let fb_childs = this.message.children;
            
    //         if (!fb_childs || !fb_childs.length)	return null;
    //         for (let i=0; i<fb_childs.length; i++) {
    //             let feedback = fb_childs[i];
    //             let factor = this.survey.subs[feedback.sur_id];
    //             if (!factor)	continue;
                
    //             let child_message = FeedbackFactory.createMessage(feedback, factor);
    //             if (child_message)		factors.push(child_message);
    //         }
    //         this.factors = factors;
    //         return factors;
            
    //     }

    //     getRatingColorLevel() {
    //         this.color_level = 11;
    //         return this.color_level;
    //     }

    // }
    // /**
    // * Define Factor class for type 3
    // */ 
    // class FactorMessage extends BaseMessage {
    //     constructor(message, survey) {
    //         super(message, survey);
    //         this.name = "Factor";
    //     }

    // }
    
    // /**
    // * Define Index class for all CSAT, NPS, CES
    // */ 
    // class IndexMessage extends BaseMessage {
        
    // }
    
    // /**
    // * Define extends concrete classes
    // */ 
    // class CSATMessage extends IndexMessage {
    //     constructor(message, survey) {
    //         super(message, survey);
    //         this.name = "CSAT";
    //         this.scale = 5;
    //     }
        
    //     getRatingColorLevel() {            
    //         this.color_level = this.message.rating;
    //         return this.color_level;
    //     }
    // }
    
    // class NPSMessage extends IndexMessage {
    //     constructor(message, survey) {
    //         super(message, survey);
    //         this.name = "NPS";
    //         this.scale = 10;
    //     }
        
    //     getRatingColorLevel() {            
    //         this.color_level = Math.round(this.message.rating / 2);
    //         return this.color_level;
    //     }            
    // }
    
    // class CESMessage extends IndexMessage {
    //     constructor(message, survey) {
    //         super(message, survey);
    //         this.name = "CES";
    //         this.scale = 7;
    //     }
        
    //     getRatingColorLevel() {            
    //         this.color_level = this.message.rating - 1;
    //         return this.color_level;
    //     }
    // }
    
    // class FLXMessage extends IndexMessage {
    //     constructor(message, survey) {
    //         super(message, survey);
    //         this.name = "FLX";
    //         this.scale = survey.data.scales;
    //     }
        
    //     getRatingColorLevel() {
    //         if (this.message.rating < (this.scale + 1)/2) {
    //             this.color_level = Math.ceil(this.message.rating*6/(this.scale + 1));
    //         }
    //         else
    //             this.color_level = 10;
            
    //         return this.color_level;
    //     }
    // }
    
    // class SELECTIONMessage extends BaseMessage {
    //     constructor(message, survey) {
    //         super(message, survey);
    //         this.name = "SELECTION";
    //     }
                
    //     // Extract all factor data to make report
    //     // In order of factors in survey
    //     exportFeedbackData() {
    //         if (!this.survey.subs)	return null;

    //         if (!this.message.children || !this.message.children.length)	
    //             return null;			

    //         let factor_fbs = [];
    //         for (let key in this.survey.subs) {
    //             let factor_value = null;
    //             if (this.message.children.length) {
    //                 for (let i=0; i<this.message.children.length; i++) {
    //                     if (key==this.message.children[i].sur_id) {
    //                         factor_value = this.message.children[i].rating;
    //                         this.message.children.splice(i, 1);
    //                         break;
    //                     }
    //                 }
    //             }
    //             factor_fbs.push(factor_value);
    //         }
    //         return factor_fbs;
    //     }
                
    // }
    
    // class RATINGMessage extends SELECTIONMessage {
    //     constructor(message, survey) {
    //         super(message, survey);
    //         this.name = "RATING";
    //     }

    // }

    // class HOWMessage extends BaseMessage {
    //     constructor(message, survey) {
    //         super(message, survey);
    //         this.name = "HOWSurvey";
    //     }

    // }

    // class CONTMessage extends BaseMessage {  //Contact survey
    //     constructor(message, survey) {
    //         super(message, survey);
    //         this.name = "CONTACT";
    //     }

    // }

    // class ATTCHMessage extends BaseMessage {  //Attachment survey
    //     constructor(message, survey) {
    //         super(message, survey);
    //         this.name = "ATTCHSurvey";
    //     }

    //     getFieldValue(field_name) {
    //         if (this.data[field_name])
    //             return "<i class='fa fa-files-o'></i>"
    //         else 
    //             return "";
    //     }

    // }
    
    // class MIXEDMessage extends BaseMessage {
    //     constructor(message, survey) {
    //         super(message, survey);
    //         this.name = "MIXED";
    //     }

    // }

    // class FORMMessage extends BaseMessage {
    //     constructor(message, survey) {
    //         super(message, survey);
    //         this.name = "FRM";
    //     }

    // }
        
    // class FeedbackFactory {
        
    //     static createMessage(message, survey) {
            
    //         if (survey.data.type==SYSCONFIG.SURVEY_TYPE.CSAT)
    //             return new CSATMessage(message, survey)
            
    //         else if (survey.data.type==SYSCONFIG.SURVEY_TYPE.NPS)
    //             return new NPSMessage(message, survey)
            
    //         else if (survey.data.type==SYSCONFIG.SURVEY_TYPE.CES)
    //             return new CESMessage(message, survey)

    //         else if (survey.data.type==SYSCONFIG.SURVEY_TYPE.MTF ||
    //             survey.data.type==SYSCONFIG.SURVEY_TYPE.EXF )
    //             return new SELECTIONMessage(message, survey)
            
    //         else if (survey.data.type==SYSCONFIG.SURVEY_TYPE.RTF)
    //             return new RATINGMessage(message, survey)
            
    //         else if (survey.data.type==SYSCONFIG.SURVEY_TYPE.HOW)
    //             return new HOWMessage(message, survey)
            
    //         else if (survey.data.type==SYSCONFIG.SURVEY_TYPE.MIXED)
    //             return new MIXEDMessage(message, survey)
            
    //         else if (survey.data.type==SYSCONFIG.SURVEY_TYPE.CONT)
    //             return new CONTMessage(message, survey)
            
    //         else if (survey.data.type==SYSCONFIG.SURVEY_TYPE.FLX)
    //             return new FLXMessage(message, survey)

    //         else if (survey.data.type==SYSCONFIG.SURVEY_TYPE.FRM)
    //             return new FORMMessage(message, survey)

    //         else if (survey.data.type==SYSCONFIG.SURVEY_TYPE.ATCH)
    //             return new ATTCHMessage(message, survey)

    //         else 
    //             return new FactorMessage(message, survey);
            
    //     }
    // }
