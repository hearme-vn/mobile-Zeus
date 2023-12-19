/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 2 Apr 2020
 * @purpose Application contants
 */
export const APPCONSTS = {
  // For general purpose
  HEARME_LOGO: "assets/img/brand/hearme-white.png",
  HEARME_ICON: "assets/img/brand/hearme_mini.png",
  WELCOME_PAGE: "/sc/welcome",
  LOGIN_PAGE: "/anyone/login",
  FORGOT_PAGE: "/anyone/forgot",
  REGISTER_PAGE: "/anyone/register",
  DEFAULT_LOGGED_PAGE: "/dashboard",   // default page for logged user
  DASHBOARD_PAGE: "/dashboard",   // default page for logged user
  ONBOARDING_PAGE: "/onboarding",
  NOTIFY_PAGE: "/tools/notification",

  // TIMEOUT / TIMEINTERVAL
  TIMEOUT_SHORT: 200,

  // For base component
  FIRSTLOAD_COUNT: 20,
  LOADMORE_COUNT: 20,

  // For Device status
  DEVICE_STATUS_NEW: 0,
  DEVICE_STATUS_ACTIVE: 1,
  DEVICE_STATUS_INACTIVE: 2,

  // For Device type
  DEVICE_TYPE_KIOSK: 0,
  DEVICE_TYPE_WEB: 1,
  DEVICE_TYPE_EMAIL: 2,
  
  // For Organization
  ORGANIZATION_TYPE_PERSONAL: 0,
  ORGANIZATION_TYPE_ENTERPRISE: 1,

  /**
   * For local storage keys
   * - Values of these keys will be deleted after signing out
   */
  LOCAL_STORAGE_KEYS: {
    ROOT_URL: "backend_root_url",
    WORKING_ORG_ID: "working_org_id",
    INVITATION_LIST_KEY: "invitation_list_key",
    AUTH_TOKEN: "hearme_token",
    FIREBASE_TOKEN: "firebase_token"
  },

  // For survey management 
  SURVEY_CREATED: 0,
  SURVEY_ACTIVE: 1,
  SURVEY_CLOSED: 2,

  // For user-role system status
  USER_ROLE_ACTIVE: 0,
  USER_ROLE_LOCKED: 1,

  // For customer management
  CUSTOMER_STATUS_ACTIVE: 0,
  CUSTOMER_STATUS_INACTIVE: 1,

  // For collection management
  COLLECTION_STATUS_ACTIVE: 0,
  COLLECTION_STATUS_LOCK: 1,

  // For quotation management
  QUOTATION_STATUS_ACTIVE: 0,
  QUOTATION_STATUS_CANCEL: 1,

  // For invitation customer in Kiosk
  INVITATION_STATUS_SENT: 0,
  INVITATION_STATUS_CANCELED: 1,
  INVITATION_LIST_LIMIT: 5,           // Number of invitation kept in list
  INVITATION_CHECKING_INTERVAL: 3000,    //Interval of time that checking invitation if they are cancelable

  // TOAST Message
  TOAST_ERROR_TIMEOUT: 5000,
  TOAST_WARNING_TIMEOUT: 4000,
  TOAST_INFO_TIMEOUT: 3000,

  // TOAST type: "WARNING", "INFO" and "ERROR"
  TOAST_TYPE_WARNING: "toast-warning",
  TOAST_TYPE_INFO: "toast-success",
  TOAST_TYPE_ERROR: "toast-error",

  /**
   *  Define app's languages used in this application
   * - language key: is used for switching between languages.
   * - lang_id: is language id value used database
   * - flag_icon: defined be icon libray in this project
   * */
  APP_LANGS: {
    en: {
      name: "English",
      lang_id: 1,
      flag_icon: "flag-icon-gb",
      local_id: "en-US",
      default: true
    },
    vi: {
      name: "Việt nam",
      lang_id: 0,
      flag_icon: "flag-icon-vn",
      local_id: "vi",
      default: false
    }

  },
  DEVICE_LANGUAGES: [
    {
      "id": "0",
      "name": "Tiếng Việt",
      "code": "vi",
      "flag": "vn",
      "default": true,
      "active": false,
      "selected": false,
      "app_key": "vi_VN",
      "l10n_code": "VN",
      "hm_id": 0,
    },
    {
      "id": "1",
      "name": "English",
      "code": "en",
      "flag": "gb",
      "default": false,
      "active": false,
      "selected": false,
      "app_key": "en_US",
      "l10n_code": "EN",
      "hm_id": 1				
    },
    {
      "id": "2",
      "name": "中国",
      "code": "cn",
      "flag": "cn",
      "default": false,
      "active": false,
      "selected": false,
      "app_key": "zh-CN",
      "l10n_code": "CN",
      "hm_id": 2			
    },
    {
      "id": "3",
      "name": "Pусский",
      "code": "ru",
      "flag": "ru",
      "default": false,
      "active": false,
      "selected": false,
      "app_key": "ru_RU",
      "l10n_code": "RU",
      "hm_id": 3
    },
    {
      "id": "4",
      "name": "한국어",
      "code": "ko",
      "flag": "kr",
      "default": false,
      "active": false,
      "selected": false,
      "app_key": "ko-KR",
      "l10n_code": "KO",
      "hm_id": 4	
    }
  ],


  /**
   * For api error processing: define exceptional error codes
   * If APIs return these codes, just ignore them
  */
  EXCEPTIONAL_ERROR_CODES: [
    "ORG02"
  ],

  INDUSTRIES: [
    {id: 1, name: 'INDUSTRY.MEDIA'},
    {id: 2, name: 'INDUSTRY.TRANSPORTATION'},
    {id: 3, name: 'INDUSTRY.INSURANCE'},
    {id: 4, name: 'INDUSTRY.IT_SERVICE'},
    {id: 5, name: 'INDUSTRY.CONSTRUCTION'},
    {id: 6, name: 'INDUSTRY.FINANCIAL_SERVICE'},
    {id: 7, name: 'INDUSTRY.TELECOMMUNICATIONS'},
    {id: 8, name: 'INDUSTRY.HEALTHCARE'},
    {id: 9, name: 'INDUSTRY.BANKING'},
    {id: 10, name: 'INDUSTRY.CONSUMER_SERVICE'},
    {id: 11, name: 'INDUSTRY.MANUFACTURING'},
    {id: 12, name: 'INDUSTRY.RETAIL'},
    {id: 13, name: 'INDUSTRY.HOSPITALITY'},
    {id: 14, name: 'INDUSTRY.PUBLIC_SERVICES'},
    {id: 15, name: 'INDUSTRY.EDUCATION'},
    {id: 0, name: 'INDUSTRY.OTHERS'}
  ],
  LOGIN: {
    desktop_life_time: 1,
    mobile_life_time: 0,
  }
}
