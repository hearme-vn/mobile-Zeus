import {Component, Injector, Input, ViewChild} from '@angular/core';
import {APPCONSTS, AuthenticationService, URIS} from '@app/_services';
import {ChartData, HMChartOptions} from '@app/_models';
import { BaseReport } from '@app/_bases/basereport.component';
// import { PieChartComponent } from '@app/_bases/charts';
import { Group } from '@app/_models/group.model';

@Component({
  selector: 'feedbackcount-bygroup-report',
  template: `
      <hm-piechart #feedbacks_bygroup 
        [style] = "styleData"
        [data]="chartData"
        [labels]="chartLabels"
        [hm_options]="hmoptions">
      </hm-piechart>
  `
})
export class FeedbacksByGroup extends BaseReport {
  
  statistics_url = this.app_service.Based_URLs.front + URIS.front.fbcount_count_by_groups;

  constructor (public injector: Injector) {
    super(injector);
  }

  /**
   * Get all group in system
  */
  loadGroupList() {
    let filterParams = { status: 100 };
    return this.loadObjectsbyFilter(Group, filterParams);
  }

  /**
   * Process data to insert into chart
  */  
  dataProcesssing(reportData) {
    this.hmoptions = new HMChartOptions({"title_text": this.translate.instant('DASHBOARD.FEEDBACKS_BY_GORUP_CHART_TITLE')});

    this.resetChartData();

    // console.log("Report data: ", reportData);
    if (!reportData || !reportData.length)      return;

    this.loadGroupList().subscribe(
      function(groups) {
        let chartData = [];
        let chartLabels = [];

        // console.log("Group list", groups)
        //Mapping group with id
        let group_map = {}
        if (groups && groups.length) {
          for (let group of groups) {
            group_map[group.id] = group;
          }
        }

        // make report dataset
        for (let group_report of reportData) {
          // console.log("Group report data: ", group_report);
          // Group count
          chartData.push(group_report.count);

          // Group name
          let group = group_map[group_report.grp_id];
          if (group)
            chartLabels.push(group.name)
          else
            chartLabels.push(group_report.grp_id);
        }  
        this.chartData = chartData;
        this.chartLabels = chartLabels;
      }.bind(this)
    )
  }

}

