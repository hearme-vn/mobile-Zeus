import { Injectable } from '@angular/core';
import { TimeFilter } from '@app/_models';
import * as dayjs from 'dayjs';

/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 17 Feb 2023
 * @purpose Provide service related to time processing, making time labels for reports
 */
@Injectable({ providedIn: 'root' })
export class TimesUtils {

  constructor() {}

  /**
   * Parse day string to datetime value
   * */ 
  static dateParser (value) {
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
  }

  /**
   * This method is deprecated
  */
  getDayDiff(startDate: Date, endDate: Date): number {
    const msInDay = 24 * 60 * 60 * 1000;
  
    return Math.round(
      Math.abs(Number(endDate) - Number(startDate)) / msInDay
    );
  }
  /**
   * Get days array from start to end date
   * */ 
  getDateLabels(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs, time_unit: dayjs.ManipulateType='day', format='YYYY-MM-DD') {
    const labels = new Array();
    var currentDate = startDate;
    while (currentDate.isBefore(endDate, time_unit) || (currentDate.isSame(endDate, time_unit))) {
      labels.push(currentDate.format(format));
      currentDate = currentDate.add(1, time_unit);
    }
    return labels;
  }


  /**
   * Get labels for range of time, from Start to end time
   */ 
  getTimeLabels_forRange(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) {
    var labels = [];
    let days_diff = endDate.diff(startDate, 'day');

    if (days_diff <= 30) {
      // Get daily labels
      labels = this.getDateLabels(startDate, endDate);

    } else if (days_diff <= 365) {
      labels = this.getDateLabels(startDate, endDate, 'month', 'YYYY-MM');
    } else {
      labels = this.getDateLabels(startDate, endDate, 'year', 'YYYY');
    }
    return labels;
  }
  

  /**
   * Make time labels  for all charts by time range
   * @input is time in report time filter:
      time = {
        time_unit: 0,                   // Default by days
        bias: 30,                        // Default 30 days
        start_time: null,
        end_time: null
      };
   */
  static makeReportLabels_byTime(report_time: TimeFilter) {
    if (!report_time || (report_time.bias==undefined) || (report_time.time_unit==undefined))   return;

    const bias = report_time.bias;
    let labels = [];

    if (report_time.time_unit == 0) { // Limit by days
      for (let i = bias; i > 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i + 1);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        labels.push(year + '-' + month + '-' + day);
      }

    } else if (report_time.time_unit == 1) {  // Limit by months
      for (let i = bias; i > 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i + 1);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        labels.push(year + '-' + month);
      }

    } else if (report_time.time_unit == 2) {  // Limit by start_time, end_time
      // Adjust time range
      if (report_time.time_unit == 2) {
        report_time.start_time = report_time.time_range.start.toDate(),
        report_time.end_time = report_time.time_range.end.toDate()
      }

      let time_util = new TimesUtils();
      labels = time_util.getTimeLabels_forRange(report_time.time_range.start, report_time.time_range.end);
    }
    return labels;
  }

  /**
   * Make time labels  for all charts in DARDBOARD by time type
   * @input is standard time, with value is following:
   * - 'Week':   {time_unit: 0, bias: 7},
   * - 'Month':  {time_unit: 0, bias: 30},
   * - 'Year':   {time_unit: 1, bias: 12},
   */
  static makeLabels_ByStandardTimes(time_range): any[] {
    let time_filter = TimeFilter.SEARCH_OPTIONS[time_range];
    return TimesUtils.makeReportLabels_byTime(time_filter);
  }
}
