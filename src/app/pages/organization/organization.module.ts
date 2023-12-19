import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { SharedModule } from '@app/_bases/shared.module'; 
import { HMUIsModule } from '@app/_bases/ui';
import { CfgModule } from '@app/pages/cfg/cfg.module';
import { OrganizationRouting } from './organization.routing';
import { OrganizationComponent } from './organization.component';
import { RoleComponent } from './role.component';
import { RoleAssignmentComponent } from './role-assignment.component';

@NgModule({
  imports: [
    SharedModule,
    OrganizationRouting,
    BsDropdownModule.forRoot(),
    CfgModule,
    HMUIsModule
  ],
  declarations: [OrganizationComponent, RoleComponent, RoleAssignmentComponent],
  exports: [OrganizationComponent, RoleComponent, RoleAssignmentComponent]
})
export class OrganizationModule { }

