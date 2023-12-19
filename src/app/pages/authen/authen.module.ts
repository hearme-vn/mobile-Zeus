import { NgModule } from  '@angular/core';
import { SharedModule } from '@app/_bases/shared.module';
import { TranslateModule} from '@ngx-translate/core';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AuthenticationRouting } from './authen.routing';
import { ForgotComponent, LoginComponent, RegisterComponent, PasswordResetComponent, EmailValidateComponent } from '.';

@NgModule({
  imports: [
    SharedModule,
    AuthenticationRouting,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TranslateModule
  ],
  declarations: [ LoginComponent, RegisterComponent, ForgotComponent, PasswordResetComponent, EmailValidateComponent ]
})
export class AuthenticationModule { }

