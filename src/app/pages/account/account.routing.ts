import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangepasswdComponent } from './changepasswd.component';
import { LoginBarCodeComponent } from './loginbarcode.component';
import { ProfileComponent } from './profile.component';


let routes: Routes = [
  {
    path: 'changepasswd',
    component: ChangepasswdComponent,
    data: {
      title_key: 'SIDEBAR.CHANGEPASSWORD'
    }
  },
  {
    path: 'loginbarcode',
    component: LoginBarCodeComponent,
    data: {
      title_key: 'SIDEBAR.LOGINBARCODE'
    }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: {
      title_key: 'SIDEBAR.PROFILE'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRouting {}

