import {Component, Injector} from '@angular/core';
import {Configure} from '@app/_models/configure.model';
import {APPCONSTS} from '@app/_services';
import {BaseConfig} from '@app/_bases/baseconfig.component';

/**
 * @license hearme
 * @copyright 2017-2022 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 12 Sep 2022
 * @purpose for managing theme
 */
@Component({
  templateUrl: 'default-language.component.html',
  styleUrls: ['default-language.component.css']
})
export class DefaultLanguageComponent extends BaseConfig {

  languages = [];
  rdoSelected = 0;

  constructor(
    public injector: Injector,
    ) {
    super(injector);
  }

  /**
   * load config
   */
  loadConfig() {
    this.configs = {};
    this.languages = APPCONSTS.DEVICE_LANGUAGES;

    // load DEVICE_LANGUAGE_DEFAULT config
    this.loadConfigByKey("DEVICE_LANGUAGE_DEFAULT", function(data) {
      if (data && data.value) {
        this.configs[data.cfg_key] = data;
        for (let k in this.languages) {
          if (this.languages[k].id === data.value) {
            this.languages[k].selected = true;
            this.rdoSelected = this.languages[k].id;
          }
        }
      }
    }.bind(this));

    // load DEVICE_LANGUAGES config
    this.loadConfigByKey("DEVICE_LANGUAGES", function(data) {
      if (data && data.value) {
        this.configs[data.cfg_key] = data;
        let vls = data.value.split(",");
        for (let k in this.languages) {
          for (let j in vls) {
            if (this.languages[k].id === vls[j]) {
              this.languages[k].active = true;
            }
          }
        }
      } else {
        // Set default selected language
        for (let lang of this.languages) {
          if (lang["default"]) {
            lang["active"] = true;
            lang["selected"] = true;
            this.rdoSelected = lang.id;
            break;
          }
        }
      }
    }.bind(this));
  }

  /** set default language */
  setDefaultLanguage(item) {
    // set Default Language
    item.active = true;
    item.selected = true;
    for (let i in this.languages) {
      if (this.languages[i].id != item.id) {
        this.languages[i].selected = false;
      }
    }
  }

  /** Set active language */
  setActiveLanguage(item) {
    // check condition
    if (item.selected && !item.active) {
      item.active = true;
      let element = <HTMLInputElement> document.getElementById('chk-' + item.id);
      element.checked = true;
      this.app_service.showMessageById('DEFAULT_LANGUAGE_PAGE.AL_LOCK_DEFAULT_LANGUAGE', APPCONSTS.TOAST_TYPE_ERROR);
      return;
    }
  }

  /** Save default and active languages config */
  proccess() {
    // get default language id, active language ids
    let default_language_id = "0";
    let active_language_ids = "";
    for (let i in this.languages) {
      let id = this.languages[i].id;

      // get default language id
      if (this.languages[i].selected) {
        default_language_id = id;
      }

      // get active language ids
      if (this.languages[i].active) {
        active_language_ids = active_language_ids != "" ? active_language_ids + "," + id : id;
      }
    }

    // set default language
    Configure.updateConfig(this, 'DEVICE_LANGUAGE_DEFAULT', default_language_id, null);

    // set active language
    Configure.updateConfig(this, 'DEVICE_LANGUAGES', active_language_ids, null);
  }

}
