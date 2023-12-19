import { BaseObject } from './base.object';
import { APPCONSTS, URIS } from '@app/_services';

import { BaseModel } from './base.model';
/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 19 Oct 2022
 * @purpose Label model represent Label for object in different languages
 */
export class LabelModel extends BaseModel {

  table_name: String;
  column_name: String;
  row_id: String;
  lang_id: Number;
  value: String;

  static create_fields = ['table_name', 'column_name', 'row_id', 'value', 'lang_id'];
  static update_fields = ['id', 'value'];
}


/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 19 Oct 2022
 * @purpose Label Object for working with Label
 */
export class Label extends BaseObject {

  static uri_create       = URIS.main.label_create;
  static uri_update       = URIS.main.label_update;
  static uri_list         = URIS.main.label_list;
  static uri_list_model   = URIS.main.label_list_model;

  public data: LabelModel;
  public model_type = LabelModel;

  /**
   * Return an dictionary of labels
   * @Input
   * - fieldTexts: array of LabelModel data - got from database
[{
    "column_name": "question",
    "id": "8f64a1e6849c1d01d5e96934eb85ee4d",
    "lang_id": 0,
    "row_id": "e223368a74859f95d330cafdf3e7525b",
    "table_name": "survey",
    "value": "t1"
}, ...]
   * - label_data: template data for creating new field text
   * - device-langs: array of device languages 
[{
    "id": "0",
    "name": "Tiếng Việt",
    "code": "vi",
    "flag": "vn",
    "default": true,
    "active": false,
    "selected": false,
    "app_key": "vi_VN",
    "l10n_code": "VN",
    "hm_id": 0
},
...]
   * @Output
   * - Key: language code
   * - Value: label record
  */
  static createLabelListForUI(fieldTexts, label_data=null) {
    if (!label_data)    label_data = { value: "" }
    const supported_langs = APPCONSTS.DEVICE_LANGUAGES;
    let labels = {};

    if (fieldTexts && fieldTexts.length) {
      for (let fieldText of fieldTexts) {
        let lang = supported_langs[fieldText.lang_id];
        if (lang.active) {
          let code = supported_langs[fieldText.lang_id].code;
          labels[code] = fieldText;  
        }
      }
    }
    
    for (let lang of supported_langs) {
      if (lang.active && !labels[lang.code]) {
        // Add empty field text for this lang
        let fieldText = Object.assign({}, label_data);
        fieldText.lang_id = lang.id;

        // Add this label to labels list and list of field texts
        labels[lang.code] = fieldText;
        fieldTexts.push(fieldText);
      }
    }
    return labels;
  }

  /**
   * Load initial labels in different language when open add/edit dialog
   * @input 
   * - component: component that main object belong to
   * - tableName: name of table in DB that store this object information
   * - columnName: name of column that need to get labels
   * - objId: id of object
   * - callback: called after finishing geting labels
   */
  static loadInitialLabels(component, tableName, columnName, objId, callback=null) {
    if (objId) {
      component.app_service.getAPIPromise(component.getMainURL(Label.uri_list_model), {
        table: tableName, column: columnName, id: objId
      }).then(function(res) {
        callback(res);
      }.bind(this));
    }
  }

  /**
   * Save lang
   * @param app
   * @param tableName
   * @param columnName
   * @param lang_texts
   */
  static updateLang(app, tableName, columnName, lang_texts) {
    if (lang_texts && lang_texts.length != 0) {
      for (let i = 0; i < lang_texts.length; i++) {
        if (lang_texts[i].id) {
          // update item neu config da ton tai
          const param = {
            'id': lang_texts[i].id,
            'value': lang_texts[i].value
          };
          app.app_service.postAPI(app.getMainURL(Label.uri_update), param);
        } else {
          // create config neu chua co cau hinh
          const param = {
            'table_name': tableName,
            'column_name': columnName,
            'row_id': app.data.id,
            'lang_id': lang_texts[i].lang_id,
            'value': lang_texts[i].value
          };
          app.app_service.postAPI(app.getMainURL(Label.uri_create), param);
        }
      }
    }
  }
}
