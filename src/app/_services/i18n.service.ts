/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 5 Apr 2020
 * @purpose This service is for internationalization and localization
 */

import { Injectable, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import locale_vi from '@angular/common/locales/vi';
import locale_en from '@angular/common/locales/en';

import { APPCONSTS } from './app.const';
import { APPService } from './app.service'

@Injectable({ providedIn: 'root' })
export class I18nService {
  public locale_vi = locale_vi;
  public locale_en = locale_en;

  public lang=null;
  public current_lang_id = "en";

  /**
   * timezone in number: this value is for time calculation
  */
  public tz=0;

  /**
   * - timezone in string format
   * - this value is for using in setting locale format in template
  */
  public tzStr="+0";

  private update_hooks = [];   // Hooks for updating string items in specified languages

  constructor(
    public translate: TranslateService,
    public injector: Injector
    ) {
    this.translate.addLangs(['en', 'vi']);

    // Set default language
    let default_lang = this.getDefaultLanguage();
    this.setLanguage(default_lang.key);

    this.tz = this.getCurrentTimeZone();
    this.tzStr = this.getTimeZoneStr();
  }


  /**
   * This function is for switching beetween languages
   * - Input: language code can be "en" or "vi"
   * - This function update all language setting in application and 
   * save this languge code as default language for user
   */ 
  setLanguage(code) {
    if (!APPCONSTS.APP_LANGS[code])   return;

    this.current_lang_id = code;
    this.translate.use(code);
    this.lang = APPCONSTS.APP_LANGS[code];
    this.registerLocalFormat(code);

    // call for all hook functions on change language event
    if (this.update_hooks.length) {
      for (let i=0; i<this.update_hooks.length; i++) {
        let fnc = this.update_hooks[i];
        fnc();
      }
    }

    // Retun false to prevent action in a tag
    return false;
  }

  /**
   * Set local for specific language code
   * - Input: lang_code value can be "vi", "en"
   * - Return local data for formating data such as: datetime, currency, plural
  */
  registerLocalFormat(lang_code) {
    let locale_data = this["locale_" + lang_code];
    registerLocaleData(locale_data, lang_code);
    return locale_data;
  }

  /**
   * This function get lang_id in user table and init language
   * - Input: lang_id value can be 0 for Vietnamese; 1 for Engish
   * - Set translation language
   * - Save language into localstorage
  */
  public setUserLanguage(lang_id) {
    let lang_json = this.getLanguageByID(lang_id);
    if (!lang_json)    return;

    this.registerLocalFormat(lang_json.key);
    this.translate.use(lang_json.key);
    this.lang = lang_json.lang;
    this.current_lang_id = lang_json.key;
  }


  /**
   * This function get language by lang_id
   * - lang_id: is integer value for setting language in DataBase
  */
  public getLanguageByID(lang_id) {
    let langs = APPCONSTS.APP_LANGS;

    for (let key in langs) {
      if (langs[key].lang_id == lang_id)    
        return {key: key, lang: langs[key]};
    }
    return null;
  }

  /**
   * Get default language. This language is used for anonymous user, when user is not logged
   * - Default languge is set in language configutation
  */
  private getDefaultLanguage() {
    let langs = APPCONSTS.APP_LANGS;

    for (let key in langs) {
      if (langs[key].default)
        return {key: key, lang: langs[key]};
    }
    return null;
  }


  public getCurrentTimeZone() {
    let offset = new Date().getTimezoneOffset();
    return - offset/60;
  }

  public getTimeZoneStr() {
    let tz = this.getCurrentTimeZone();
    if (tz>0) {
      return "+" + tz;
    } else {
      return "-" + tz;
    }
  }

	// Change timezone of datetime d
	public changeTimeZone(d, offset) {
		// convert to msec
		// add local time zone offset
		// get UTC time in msec
		let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	   
		// create new Date object for different zone
		// using supplied offset
		return new Date(utc + (3600000*offset));
	}

  public hook_register(fnc) {
    this.update_hooks.push(fnc);
  }

}