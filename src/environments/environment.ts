export const environment = {
  production: true,

  root: "",
  URLs: {
    main:   "https://api.hearme.vn/main/",
    auth:   "https://api.hearme.vn/oauth/",
    front:  "https://api.hearme.vn/front/",
    imgs:   "https://hearme.vn/img/",
    socket:	{
            root: "https://comm.hearme.vn",
            path: "",
            api: "https://comm.hearme.vn"
    },
    shortURL_root:"https://hearme.vn/",                       // For short URL service
    survey_web:   "https://cx.hearme.vn",                     // Online survey URL
    public_web:  	"http://topcx.hearme.vn/#",                 // Public web URL - for business
    appBase:  	  "https://hearme.vn/zeus/",                  // Base URL for this application
    simulator:    "https://sim.hearme.vn/"                    // Feedback simulator URL,
  },
  fbClientID: 	"xxxxxxx",
  customer_wait_fb: 120,

  /** For Firebase Notification */
  firebase: {
    apiKey: "xxxxxxxxxxx",
    authDomain: "hearme-xxxxxxx.firebaseapp.com",
    databaseURL: "https://hearme-xxxxxx.firebaseio.com",
    projectId: "hearme-xxxxxxx",
    storageBucket: "hearme-xxxxxxx.appspot.com",
    messagingSenderId: "68942843xxxx0096",
    appId: "xxxxxxx",
    vapidKey: "xxxxxxxxxxxxxxxxxxx"
  }
};
