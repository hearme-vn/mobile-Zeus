import { NgModule } from '@angular/core';
import { RouterModule , Routes} from '@angular/router';
import { OrganizationComponent } from '@app/pages/organization/organization.component';
import { RoleComponent } from '@app/pages/organization/role.component';
import { RoleAssignmentComponent } from '@app/pages/organization/role-assignment.component';
import { AuthGuard } from '@app/_helpers';

let routes: Routes = [
  {
    path: 'list',
    component: OrganizationComponent,
    data: {
      title_key: 'SIDEBAR.ORGANIZATION_LIST'
    }
  },
  {
    path: 'roles',
    component: RoleComponent,
    canActivate: [AuthGuard],
    data: {
      title_key: 'SIDEBAR.ROLES',
      permissions: ["owner", "admin"]
    }
  },
  {
    path: 'role-assignment',
    component: RoleAssignmentComponent,
    canActivate: [AuthGuard],
    data: {
      title_key: 'SIDEBAR.ROLE_ASSIGNMENT',
      permissions: ["owner", "admin"]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRouting {}

