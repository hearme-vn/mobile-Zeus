import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SafeArea } from 'capacitor-plugin-safe-area';

// import { Capacitor } from '@capacitor/core';
// import { environment }  from '@env/environment';
// import { initializeApp } from "firebase/app";

import { AuthenticationService } from '@app/_services';
import { MessagingService } from '@app/_services/message.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('notificationDialog') notificationDialog;
  // notification_data: any;
  loginName: string;

  constructor(private router: Router,
    private authen_service: AuthenticationService,
    public messagingService: MessagingService
    ) {
      this.messagingService.initNotificationService();
      this.messagingService.receiveMessage(this.showNotofication.bind(this));
  }
  
  // public async initializeFirebase(): Promise<void> {
  //   if (Capacitor.isNativePlatform()) {
  //     return;
  //   }
  //   initializeApp(environment.firebase);
  // }

  /**
   * Get data and show notification data to UI
   * */ 
  showNotofication(notification) {
    this.loginName = this.authen_service.currentUser.name;

    this.notificationDialog.show();
  }

  /*
  // For initializing the directive/component,
  // after Angular first displays the data-bound properties 
  // and sets the directive/component's input properties
  */
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  // Post Init; after first page is loaded
  ngAfterViewInit() {
    this.safeAreaSetting();
  }

  /**
   * Setting app to view in Aafe Area
   * */ 
  safeAreaSetting() {
    let _this = this;
    SafeArea.getSafeAreaInsets().then(({ insets }) => {
      // console.log(insets);
      // _this.setDocumentPaddingStyle(insets);
    });
    
    // SafeArea.getStatusBarHeight().then(({ statusBarHeight }) => {
    //   console.log(statusBarHeight, 'statusbarHeight');
    // });
    
    // when safe-area changed
    // const eventListener = await SafeArea.addListener('safeAreaChanged', data => {
    SafeArea.addListener('safeAreaChanged', data => {
      const { insets } = data;
      // _this.setDocumentPaddingStyle(insets);
    });
    // eventListener.remove();    
  }

  /**
   * Configure app view in safe area
   * */ 
  setDocumentPaddingStyle(insets) {
    let top = insets.top;
    document.body.style.paddingTop = top + "px";
    document.getElementById("status-bar").style.height = top + "px";

    document.body.style.paddingBottom = insets.bottom + "px";
    document.body.style.paddingLeft = "0px";
    // document.body.style.paddingLeft = insets.left + "px";
    document.body.style.paddingRight = insets.right + "px";

  }
}
