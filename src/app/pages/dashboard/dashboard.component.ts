import {Component, Injector, ViewChild} from '@angular/core';
import {BaseComponent} from '@app/_bases';
import {APPCONSTS, AuthenticationService, URIS} from '@app/_services';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent extends BaseComponent {

  SEARCH_OPTION = {
    'Week': {time_unit: 0, bias: 7},
    'Month': {time_unit: 0, bias: 30},
    'Year': {time_unit: 1, bias: 12},
  };
  constructor (public injector: Injector) {
    super(injector);
  }

  time_range: string = 'Month';
  loginName: string;
  generateChart = {total: 0, new_count: 0, processing: 0, processed: 0, unfinished: 0, invalid: 0};
  objectChart = {deviceCount: 0, surveyCount: 0};

  /**
   * filter structure for report
  */
   filterData = null;


  /** Load generate data */
  loadCountStatus(param): void {
    const count_by_status = this.app_service.Based_URLs.front + URIS.front.fbcount_count_by_status;
    this.app_service.postAPI(count_by_status, param, function(res) {
      const valid = res.total - res.invalid_count - res.unfinished_count;
      this.generateChart = {
        total: (res.total? Math.floor(valid / res.total * 100): 0),
        new_count: res.new_count,
        processing: res.processing_count,
        processed: res.processed_count,
        unfinished: res.unfinished_count,
        invalid: res.invalid_count
      };
    }.bind(this));
  }

  /** Load total object counting */
  getObjectCount(param): void {
    const total_object_counting = this.app_service.Based_URLs.main + URIS.main.total_object_counting;
    this.app_service.postAPI(total_object_counting, param, function(res) {
      this.objectChart = {
        deviceCount: res.device_count,
        surveyCount: res.survey_count
      };
    }.bind(this));
  }

  /** Load charts data */
  changeFilter(): void {
    const param = {
      time_unit: this.SEARCH_OPTION[this.time_range].time_unit,
      bias: this.SEARCH_OPTION[this.time_range].bias,
      order: 'created',
      sort: 'ASC'
    };
    this.loadCountStatus(param);
    this.getObjectCount(param);

    this.filterData = {
      fixed_time:   this.time_range
    }
  }

  /** Load init data */
  loadMainPageObjects(): void {
    this.loginName = this.injector.get(AuthenticationService).currentUser.name;
    this.changeFilter();
  }

  // Checking onboarding state before processing
  ngAfterContentInit() {
    this.checkingOnboardingState();
  }
}
