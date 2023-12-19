import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ForgotComponent, LoginComponent, RegisterComponent, PasswordResetComponent, EmailValidateComponent } from '.';

let routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title_key: 'SIDEBAR.CHANGEPASSWORD'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title_key: 'SIDEBAR.REGISTER'
    }
  },
  {
    path: 'forgot',
    component: ForgotComponent,
    data: {
      title_key: 'SIDEBAR.FORGOT'
    }
  },
  {
    path: 'password_reset/:token',
    component: PasswordResetComponent,
    data: {
      title_key: 'SIDEBAR.PASSWORD_RESET'
    }
  },
  {
    path: 'email_validate/:token',
    component: EmailValidateComponent,
    data: {
      title_key: 'SIDEBAR.PASSWORD_RESET'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRouting {}

