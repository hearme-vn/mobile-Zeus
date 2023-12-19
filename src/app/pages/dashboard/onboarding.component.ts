/**
 * @license hearme 
 * @copyright 2017-2022 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 13 Aug 2022
 * @purpose This page guides user though steps to configure system in first time
 */
import { Component, Injector } from '@angular/core';

import { BaseComponent } from '@app/_bases';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'onboarding.component.html',
  styleUrls: ['onboarding.component.css']
})
export class OnboardingComponent extends BaseComponent {

  isShowConfig = new Map<string, boolean>();

  constructor (public injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.isShowConfig['cfg1'] = true;
    this.isShowConfig['cfg2'] = true;
    this.isShowConfig['cfg3'] = true;
  }

  showHideConfig(cfgNo) {
    this.isShowConfig[cfgNo] = !this.isShowConfig[cfgNo];
  }

}
