import { Injectable, ViewChild } from '@angular/core';
import { FirebaseMessaging, GetTokenOptions } from "@capacitor-firebase/messaging";
// import { Capacitor } from "@capacitor/core";

import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs'
import { APPCONSTS } from './app.const';
import { environment }  from '@env/environment';

@Injectable()
export class MessagingService {
  @ViewChild('notificationDialog') notificationDialog;

  currentMessage = new BehaviorSubject(null);

  /** Full data on notification */ 
  notification_data: any;

  /** Indicate weather this browser is supprted by firedbase API */ 
  isSupported = false;

  constructor(
    public router: Router
    ) {
    initializeApp(environment.firebase);
  }

  /**
   * Initialize firebase application
   * */ 
  // public async initializeFirebase(): Promise<void> {
  //   if (Capacitor.isNativePlatform()) {
  //     return;
  //   }
  //   initializeApp(environment.firebase);
  // }

  /**
   * Init notification service
   * - Check firebase supported
   * - Request for notification service
   * - Request for Notification token
  */
  async initNotificationService() {
    // Checking if this browser is supported
    let isSupported = await FirebaseMessaging.isSupported();
    if (!isSupported.isSupported)   return false;
    this.isSupported = true;

    let permission = await FirebaseMessaging.requestPermissions();
    if (!permission || !permission.receive)   return false;

    // console.log("Noti permission: ", permission);
    // console.log("Capacitor platform: ", Capacitor.getPlatform());
    const options: GetTokenOptions = { vapidKey: environment.firebase.vapidKey };
    const result = await FirebaseMessaging.getToken(options);
    // console.log("Token result: ", result)
    if (result && result.token) {
      localStorage.setItem( APPCONSTS.LOCAL_STORAGE_KEYS.FIREBASE_TOKEN, result.token );
      return true;
    }
    return false;
  }

  /** Register callback function when this app receive notification message */ 
  async receiveMessage(processing_func) {
    // if (!this.isSupported)   return false;

    let _this = this;
    let notificationReceived = await FirebaseMessaging.addListener("notificationReceived", (event) => {
      _this.processEventData(event, processing_func);
    });
    // if (!notificationReceived)    console.log("Register  cb: ", notificationReceived);

    let notificationActionPerformed = await FirebaseMessaging.addListener("notificationActionPerformed", (event) => {
      // console.log("notificationActionPerformed: ", { event });
      _this.processEventData(event, processing_func);
    });
    // if (!notificationActionPerformed)   console.log("Performed: ", notificationActionPerformed)
    
  }

  /**
   * Process event data then call callback function
   * */ 
  processEventData(event, processing_func) {
    // console.log("notificationReceived: ", { event });
    if (!event ||!event.notification || !event.notification.data)   return;

    let payload = <any>event.notification.data;
    // console.log("new message received. ", payload);
    this.notification_data = payload;
    this.notification_data.notificationMessages = JSON.parse(payload.notificationMessages);

    if (processing_func)   processing_func(payload);
  }

  gotoFeedbackDetail() {
    if (!this.notification_data)   return;

    this.router.navigateByUrl("feedback/content?id=" + this.notification_data.id);
  }
}