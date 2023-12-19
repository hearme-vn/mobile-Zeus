// Angular library
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ngx-toastr';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { ModalModule } from 'ngx-bootstrap/modal';

import { MessagingService } from '@app/_services';
import { HMCommonModule } from '@app/_bases/common'; 

// Third parties library
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
// import { I18nService } from '@app/_services';

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent, AnyoneLayoutComponent } from './containers';

import { P404Component } from './pages/error/404.component';
import { P500Component } from './pages/error/500.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent,
  AnyoneLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { QRCodeModule } from 'angularx-qrcode';
import { environment } from '@env/environment';
export function translateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
          provide: TranslateLoader,
          useFactory: (translateLoader),
          deps: [HttpClient]
      }
    }),
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    CommonModule,
    QRCodeModule,
    DragDropModule,    
    ToastrModule.forRoot({ // ToastrModule added
      autoDismiss: true,
      maxOpened: 3,
      preventDuplicates: true
    }),
    ModalModule.forRoot(),
    HMCommonModule
  ],
  declarations: [
    AppComponent,
    APP_CONTAINERS,
    P404Component,
    P500Component,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    MessagingService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
