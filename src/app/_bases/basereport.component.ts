import { Injector, OnChanges, OnInit, SimpleChanges, Input, ViewChild, Component } from '@angular/core';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import { BaseObject, HMChartOptions, NumberChartOptions, ReportFilter, SurveyModel, TimeFilter } from '@app/_models';
import { APPCONSTS, APPService, AuthenticationService, I18nService, URIS } from '@app/_services';
import { TranslateService } from '@ngx-translate/core';
import { ChartConfiguration, ChartDataSets, ChartOptions, ChartTooltipLabelColor } from 'chart.js';
import { BaseChartComponent } from './basechart.component';
import * as moment from 'moment';
import { TimesUtils } from '@app/_services/time.service';

/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 17 Dec 2020
 * @purpose Get data from server, preprocess data and call to charts
 * 
 * @input filter parameter
 * @output data for chart
 */
@Component({
  template: ''
})
export class BaseReport implements OnInit, OnChanges {
  static DECIMAL_PLACES = 2;
  static LABEL_LENGTH_MAX = 20;

  // static SEARCH_OPTIONS = {
  //   'Week':   {time_unit: 0, bias: 7},
  //   'Month':  {time_unit: 0, bias: 30},
  //   'Year':   {time_unit: 1, bias: 12},
  // };
  COLORS = BaseChartComponent.CHART_COLORS;

  // Filter time type
  @Input('style')   styleData = 'hm_report';
  @Input('filter')  filter_data: ReportFilter

  /**
   * URL for getting statistics data
  */
  statistics_url = "";
  factor_statistics_url = "";

  /**
   * Data for reports
  */
  report_survey: SurveyModel;
  time_labels = [];
  factor_data = [];       // List of factors (in support surveys: rating 5 stars, multi selection, single selection)
  report_data = null;
  count_by_time = null;   // Deprecated
  count_by_time_datasets: ChartDataSets[] = [];
  score_by_time = null;   // Deprecated
  score_by_time_datasets: ChartDataSets[] = [];
  rating_data: any = null;

  /** Data for drawing charts */ 
  // chartData: ChartDataSets[] = [];
  chartData = [];
  /**
   * Array of label in X axis
   **/ 
  chartLabels = [];

  /**
   * Chart options
  */
  public lineChartOptions: ChartConfiguration['options']  = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function(tooltipItem, chart) {
          return <ChartTooltipLabelColor>{ backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: any, index) {
            return index % 2 === 0 ? value : '';
          }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },

    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false,
    },
    plugins: {
      legend: {
        display: false
      }
    }
  
  };

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
        }
      }]
    },
    legend: {
      display: false
    },
    plugins: {
      labels: {
        display: false,
        render: 'value',
        precision: 0
      }
    }    
  };


  /**
   * Hearme options for chart types
  */
  hmoptions: HMChartOptions;
  hmoptions_satisfaction_score: HMChartOptions;
  hmoptions_score_bytime: HMChartOptions;
  hmoptions_feedbackcount_bytime: HMChartOptions;
  hmoptions_rating_proportions: HMChartOptions;
  hmoptions_factor_score: HMChartOptions;

  numberChartOptions = new NumberChartOptions({
    line_color: "green",
    title_font_size: 16,      // In pixel
    number_font_size: 16,     // In pixel
    with_border: true  
  });

  public injector: Injector;
  public app_service: APPService;
  public authenticationService: AuthenticationService;
  public translate: TranslateService;

  constructor (injector: Injector) {
    this.injector = injector;

    // Store all dependency services
    this.app_service = injector.get(APPService);
    // this.authenticationService = injector.get(AuthenticationService);
    this.translate = injector.get(TranslateService);

  }

  initHMChartOptions() {
    this.hmoptions_satisfaction_score = new HMChartOptions({"title_text": this.translate.instant('REPORT.SATISFACTION_SCORE')});
    this.hmoptions_score_bytime = new HMChartOptions({"title_text": this.translate.instant('REPORT.SCORE_BY_TIME')});
    this.hmoptions_feedbackcount_bytime = new HMChartOptions({"title_text": this.translate.instant('REPORT.FBCOUNT_BY_TIME')});
    this.hmoptions_rating_proportions = new HMChartOptions({"title_text": this.translate.instant('REPORT.RATING_PROPORTIONS')});
    this.hmoptions_factor_score = new HMChartOptions({"title_text": this.translate.instant('REPORT.FACTOR_SCORE')});  

  }

  /**
   * handle changing event from 
  */
  ngOnChanges(changes: SimpleChanges): void {
    // change values in inputs
    // console.log("Changed in input values: ", this.filter_data);
    this.report_survey = this.filter_data.childSurvey || this.filter_data.mainSurvey;

    // reset statics data
    this.count_by_time_datasets = [];
    this.score_by_time_datasets = [];

    // // Adjust time range
    // if (this.filter_data.time.time_unit == 2) {
    //   this.filter_data.time.start_time = this.filter_data.time.time_range.start.toDate(),
    //   this.filter_data.time.end_time = this.filter_data.time.time_range.end.toDate()
    // }

    // set time labels
    // this.time_labels = this.makeReportLabels_byTime(this.filter_data.time);
    this.time_labels = TimesUtils.makeReportLabels_byTime(this.filter_data.time);
    
    // get statistics data
    this.loadData();
  }

  
  ngOnInit(): void {
    // Init data
    // console.log("Init component data");
    // this.loadData();
  }

  /**
   * Make payload from filter data
  */
  makePayload() {
    if (!this.filter_data)  return {};

    if (!(this.filter_data instanceof TimeFilter))    this.filter_data = new ReportFilter(this.filter_data);
    let payload = this.filter_data.initPayload();
    
    // survey filter
    if (this.filter_data.sur_id)    { 
      payload["sur_id"] = this.filter_data.sur_id;
      payload["type"] = this.filter_data.type;
    }

    // others
    if (this.filter_data.sur_path)    payload["sur_path"] = this.filter_data.sur_path;
    if (this.filter_data.group_id)    payload["grp_id"] = this.filter_data.group_id;
    if (this.filter_data.device_id)    payload["device_id"] = this.filter_data.device_id;
    if (this.filter_data.status)    payload["status"] = this.filter_data.status;

    return payload;
  }

  /**
   * Make payload from filter data for factor
  */
  makeFactorPayload(factor: SurveyModel) {
    if (!this.filter_data)  return {};

    if (!(this.filter_data instanceof TimeFilter))    this.filter_data = new ReportFilter(this.filter_data);
    let payload = this.filter_data.initPayload();

    // factor filter
    if (this.filter_data.sur_id)    { 
      payload["sur_id"] = factor.id;
      payload["type"] = factor.type;
    }

    // others
    if (this.report_survey.sur_path)    payload["sur_path"] = this.report_survey.sur_path;

    if (this.filter_data.group_id)    payload["group_id"] = this.filter_data.group_id;
    if (this.filter_data.device_id)    payload["device_id"] = this.filter_data.device_id;
    if (this.filter_data.status)    payload["status"] = this.filter_data.status;

    return payload;
  }

  /**
   * Post data processing, for example: make chart options
  */
  postProcessing(report_data) {}

  /**
   * Convert API output data on ratings to chart data
   * @input rating_data: Array[{count: 63, proportion: 8.47, rating: 1}]
   * @outpt {labels: ['Satisfied', 'Very Satisfied'], data: [3, 6] }
  */
  getFeedbackCountRating(rating_data) {}

  /**
   * Process data to insert into chart
  */
  dataProcesssing(reportData) {
    // console.log("Report data: ", reportData);
    this.resetChartData();
    if (!reportData)      return;

    // Make data for feedback count by time report - All report
    this.getFeedbackCountByTime(reportData.count_bytimes);

    // Make data for scores by times report - for index survey
    this.getScoreByTimeData(reportData.score_bytimes);

    // Prepare data for rating propotion in pie chart. Apply for index surveys
    this.rating_data = this.getFeedbackCountRating(reportData.ratings);
  }

  /**
   * Get data for report
   * @input options = { payload: any, ...} 
  */
  loadData(options=null) {
    if (!this.statistics_url)     return;

    let payload = null;
    if (!options || !options.payload)   
      payload = this.makePayload();
    else
      payload = options.payload;

    this.app_service.postAPI(this.statistics_url, payload, 
      function(res) {
        // console.log("Report data: ", res);
        this.report_data = res;        
        this.dataProcesssing(res);
        this.postProcessing(res);
      }.bind(this)
    );
  }

  /**
   * Process factor report data 
  */
  factorDataProcesssing(report_data, factor) {}

  /**
   * Post-process factor report data 
  */
  postFactorProcessing(report_data, factor) {}

  /**
   * Get data report for factor
   * @input options = { payload: any, ...} 
  */
  loadFactor_statistic(factor: SurveyModel, options=null) {
    if (!this.factor_statistics_url)     return;

    let payload = null;
    if (!options || !options.payload)   
      payload = this.makeFactorPayload(factor);
    else
      payload = options.payload;

    this.app_service.postAPI(this.factor_statistics_url, payload, 
      function(res) {
        // console.log("Factor report data: ", res);
        this.factorDataProcesssing(res, factor);
        this.postFactorProcessing(res, factor);
      }.bind(this)
    );
  }  

  /**
   * Get all objects that meet condition in params
   * */ 
  loadObjectsbyFilter(ObjectClass: typeof BaseObject, filterParams) {
    let url = this.app_service.Based_URLs.main + ObjectClass.uri_list;

    return this.app_service.postAPI_Observable(url, filterParams);
  }

  /**
   * Convert Count by time to Map data. Replace count with score to calculate score by time.
   * @input report_data
    {
      count_bytimes: [
        {
            "count": 4,
            "time": "2020-08"
        },
        {
            "count": 5,
            "time": "2020-09"
        }
      ],
      total_feedbacks: 9
    }
    @output map data
  */
  convertScoreData_toMap(score_by_times, key_score="score", key_time="time") {
    let map = [];
    if (score_by_times && score_by_times.length)
      for (const item of score_by_times) {
        map[item[key_time]] = item[key_score];
      }

    return map;
  }
    
  /**
   * Get object information by id - using get method API
   * @Return Observable object
  */
  public getObjectDataById_GETMETHOD(id, object_class = BaseObject ) {
    const url =  this.app_service.Based_URLs.main + object_class.uri_info;
    let data = { "id": id};
    return this.app_service.getAPI_Observable(url, data);
  }

  /**
   * Make time labels  for all charts in DARDBOARD by time type
   * @input is time_range, with value is following:
   * - 'Week':   {time_unit: 0, bias: 7},
   * - 'Month':  {time_unit: 0, bias: 30},
   * - 'Year':   {time_unit: 1, bias: 12},
   */
  makeLabels(time_range): any[] {
    return TimesUtils.makeLabels_ByStandardTimes(time_range);
  }

  /**
   * Convert API output data on feedback count by time to chart data
   * @input series_by_times: Array[{count: 3, time: '2022-07'}]
   * @outpt {labels: ['2022-07', '2022-08'], datasets: [3, 6] }
  */
  getFeedbackCountByTime(count_bytimes, label=null) {
    if (!count_bytimes || !count_bytimes.length)  return;

    let count_map = this.convertScoreData_toMap(count_bytimes, "count");
    if (!this.time_labels || !this.time_labels.length)    return;

    const score_Set: ChartDataSets = {
      data: [],
      label: label
    };
    
    for (const label of this.time_labels) {
      if (count_map[label])
        score_Set.data.push(count_map[label])
      else
        score_Set.data.push(0)
    }
    this.count_by_time_datasets.push(score_Set);
    return this.count_by_time_datasets;
  }

  /**
   * Make data of satisfaction score by times for line chart
  */
  getScoreByTimeData(score_bytimes, label=null) {
    if (!score_bytimes || !score_bytimes.length)  return;

    let count_map = this.convertScoreData_toMap(score_bytimes);
    if (!this.time_labels || !this.time_labels.length)    return;

    const score_Set: ChartDataSets = {
      data: [],
      label: label
    };
    
    for (const label of this.time_labels) {
      if (count_map[label])
        score_Set.data.push(count_map[label])
      else
        score_Set.data.push(0)
    }
    this.score_by_time_datasets.push(score_Set);
    return this.score_by_time_datasets;
  }

  /**
   * Fill score into time-serires dataset for chartjs 
   * @input time_series is array of time series
   * @input scores: {key, value} pair of time and score
   * 
   * @output data array for ChartDataSets for displaying in chartjs' line chart
   * */ 
  fillData2TimeseriesDataset(time_series, scores) {
    let score_Set = [];

    for (const time of time_series) {
      if (scores[time])
      score_Set.push(scores[time])
      else
      score_Set.push(0)
    }
    return score_Set;
  }


  /**
   * Reset chart data
   * */ 
  resetChartData () {
    this.chartData = [];
    this.chartLabels = [];

    this.factor_data = [];
    this.count_by_time_datasets = [];
    this.score_by_time_datasets = [];
  }
}
