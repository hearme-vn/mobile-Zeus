import { Component, Injector, Input, SimpleChanges } from '@angular/core';
import { URIS } from '@app/_services';
import { BaseReport } from '@app/_bases/basereport.component';
import { CorrelationForm } from '@app/_models';
import { ChartDataSets } from 'chart.js';
import { BaseChartComponent } from '@app/_bases/basechart.component';

@Component({
  selector: 'correlation',
  template: `
    <hm-horizontalbarchart
      [style]="styleData"
      [data]="chartData"
      [labels]="chartLabels"
      [options]="options"
      [type]="chartType">
    </hm-horizontalbarchart>
  `
})
export class CorrelationAnalysis extends BaseReport {
  public CHART_COLORS = ['#3366CC', '#06b110', '#FF6A68', '#FF9900', '#990099', '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC'];

  @Input('filter')  cor_formData: CorrelationForm;

  chartType = BaseChartComponent.chart_types.HORIZONTAL_BARCHART;

  chartData: ChartDataSets[] = [];
  chartLabels = [];

  options = {
    indexAxis: 'y',
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
            suggestedMin: -0,
            suggestedMax: 0
        }
      }]
    }    
  };

  statistics_url = this.app_service.Based_URLs.front + URIS.front.correlation_cofficient;

  constructor (public injector: Injector) {
    super(injector);
    
  }

  /**
   * Load factor data from factor survey
   * */ 
  ngOnChanges(changes: SimpleChanges): void {
    // Check factor survey
    if (!this.cor_formData.factor_survey_id) {
      return;
    }

    // init chart options min, max
    let ticks = this.options.scales.xAxes[0].ticks;
    ticks.suggestedMax = 0;
    ticks.suggestedMin = 0;

    // init data
    this.chartData = [];
    
    let factor_suvey = this.cor_formData.factor_survey;
    // console.log("factor survey is: ", factor_suvey);
    if (factor_suvey && factor_suvey.subs && factor_suvey.subs.length) {
      // Set label to survey name
      this.chartLabels = [factor_suvey.name];

      // Call API to calculate correlation coefficient for each factor
      for (let index in factor_suvey.subs) {
        let sub = factor_suvey.subs[index];
        let payload = {
          sur_id: this.cor_formData.index_sur_id,
          sur_path_1: this.cor_formData.index_sur_path,
          type_1: this.cor_formData.index_sur_type,

          factor_id: sub.id,
          sur_path_2: this.cor_formData.factor_survey_path + "." + factor_suvey.id,
          type_2: this.cor_formData.factor_survey_type,

          coefficient: 'pearson',
          default_factor_score: 0,
          time_unit: this.cor_formData.time_unit,
          bias: this.cor_formData.bias
        };
        let options = {payload: payload, factor: sub, index: index};
        this.loadData(options);
      }
    }


    // Load factor survey from server
    // let payload = {id: this.cor_formData.factor_survey_id};
    // let url = this.app_service.Based_URLs.main + URIS.main.survey_info;
    // this.app_service.getAPIPromise(url, payload).then( 
    //   function(factor_suvey) {
    //     // console.log("factor survey is: ", factor_suvey);
    //     if (factor_suvey && factor_suvey.subs && factor_suvey.subs.length) {
    //       // Set label to survey name
    //       this.chartLabels = [factor_suvey.name];

    //       // Call API to calculate correlation coefficient for each factor
    //       for (let index in factor_suvey.subs) {
    //         let sub = factor_suvey.subs[index];
    //         let payload = {
    //           sur_id: this.cor_formData.index_sur_id,
    //           sur_path_1: this.cor_formData.index_sur_path,
    //           type_1: this.cor_formData.index_sur_type,

    //           factor_id: sub.id,
    //           sur_path_2: this.cor_formData.factor_survey_path + "." + factor_suvey.id,
    //           type_2: this.cor_formData.factor_survey_type,

    //           coefficient: 'pearson',
    //           default_factor_score: 0,
    //           time_unit: 1,
    //           bias: 12
    //         };
    //         let options = {payload: payload, factor: sub, index: index};
    //         this.loadData(options);
    //       }
    //     }
    //   }.bind(this)
    // );
  }

  /**
   * Call to API to calculate correlation value
   * @input options = {payload: payload, factor: sub, index: index};
  */
  loadData(options=null) {
    if (!this.statistics_url)     return;

    let payload = null;
    if (!options && !options.payload)   
      payload = this.makePayload();
    else
      payload = options.payload;

    this.app_service.postAPI(this.statistics_url, payload, 
      function(correlation) {
        correlation.factor = options.factor;
        correlation.index = options.index;
        this.dataProcesssing(correlation);
      }.bind(this)
    );
  }

  /**
   * Process correlation response data to insert into chart
  */  
  dataProcesssing(correlation_response) {
    let correlation = correlation_response.correl.toFixed(BaseReport.DECIMAL_PLACES);

    let ticks = this.options.scales.xAxes[0].ticks;
    if (correlation > ticks.suggestedMax)   ticks.suggestedMax = correlation;
    if (correlation < ticks.suggestedMin)   ticks.suggestedMin = correlation;

    this.chartData.push({
      data: [correlation], 
      label: correlation_response.factor.question,
      backgroundColor: this.CHART_COLORS[correlation_response.index],
      borderColor: this.CHART_COLORS[correlation_response.index]
    }); 
  }
}

