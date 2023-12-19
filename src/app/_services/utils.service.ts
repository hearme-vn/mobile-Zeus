/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 2 Apr 2020
 * @purpose provide all utilities for entire application in static methods
 */
import { Injectable } from '@angular/core';
import { environment }  from '@env/environment';

@Injectable({ providedIn: 'root' })
export class Utils {
  public Based_URLs: any;
  public fbClientID: string;

  public working_org: any;    // Current organization that user is working on

  constructor() {
    this.Based_URLs = environment.URLs;
  }

  static dateParser (key, value) {
    var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
    var reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

      if (typeof value === 'string') {
          var a = reISO.exec(value);
          if (a)
              return new Date(value);
          a = reMsAjax.exec(value);
          if (a) {
              var b = a[1].split(/[-+,.]/);
              return new Date(b[0] ? +b[0] : 0 - +b[1]);
          }
      }
      return value;
  };


  // store object in local storage
  static setLocalStorage(key, object) {
    if (!key || !object) {
      console.log("Missing data to store");
      return;
    } 

    let data = JSON.stringify(object);
    localStorage.setItem(key, data);
  }

  // get data from localstorage for parse to JSON object
  static getLocalStorage(key) {
    let data = localStorage.getItem(key);
    let object = null;
    if (data)   object = JSON.parse(data, Utils.dateParser);

    return object;
  }

    
	// Change timezone of datetime d
	static changeTimeZone(d, offset) {
		// convert to msec
		// add local time zone offset
		// get UTC time in msec
		let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	   
		// create new Date object for different zone
		// using supplied offset
		return new Date(utc + (3600000*offset));
	}

  /**
   * Get selected language from language list and selected lang code
  */
  static getLangByLangcode(langs, code) {
    for (let lang of langs) {
      if (lang.code == code) {
        return lang;
      }
    }
  }

  /**
   * Generate radom string
  */
  static randomString(len, charSet=null) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
  }

  /**
   * Trim string 
  */
  static string_trim(value: string, limit = 25, completeWords = false, ellipsis = '...') {
    if (value.length <= limit)  return value;

    if (completeWords) {
      limit = value.substring(0, limit).lastIndexOf(' ');
    }
    return value.length > limit ? value.substring(0, limit) + ellipsis : value;
  }


  /**
   *  Search by one key
   */
  static findObjectByKey(array, key, value) {
    if (!array || !array.length)  return -1;

    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return i;
      }
    }
    return -1;
  }

}
