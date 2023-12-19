import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { OnboardingComponent } from './onboarding.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      // title: 'Dashboard',
      title_key: 'SIDEBAR.DASHBOARD'
    }
  },
  {
    path: 'onboarding',
    component: OnboardingComponent,
    data: {
      title_key: 'SIDEBAR.ONBOARDING'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
