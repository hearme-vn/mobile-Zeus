import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name_key: 'SIDEBAR.DASHBOARD',
    url: '/dashboard',
    icon: 'icon-speedometer',
    // badge: {
    //   variant: 'info',
    //   text: 'N'
    // }
  },
  {
    name_key: 'SIDEBAR.SURVEY_ANALYSIS',
    url: '/report/survey',
    icon: 'icon-chart',
    permissions: ["admin", "monitor", "operator"]
  },
  {
    name_key: 'SIDEBAR.CORRELATION_ANALYSIS',
    url: '/report/relation',
    icon: 'icon-equalizer',
    permissions: ["admin", "monitor", "operator"]
  },
  {
    name_key: 'SIDEBAR.PLUGINS_ANALYSIS',
    url: '/report/plugins',
    icon: 'icon-puzzle',
    plugins: false,
  },
  {
    name_key: 'SIDEBAR.FEEDBACK_LIST',
    url: '/feedback/list',
    icon: 'fa fa-comments',
    permissions: ["admin", "monitor", "operator"]
  },
  {
    title: true,
    name_key: 'SIDEBAR.MANAGEMENT',
    permissions: []
  },
  {
    //name: 'Quản lý khách hàng',
    name_key: 'SIDEBAR.CS_MANAGEMENT',
    url: '/cs',
    icon: 'icon-people',
    permissions: ["admin", "service", "monitor", "operator"],
    children: [
      {
        name_key: 'SIDEBAR.CS_CUSTOMERLIST',
        permissions: ["admin", "service", "monitor", "operator"],
        url: '/cs/customer'
      },
      {
        name_key: 'SIDEBAR.CS_INVITECUSTOMER',
        permissions: ["admin", "service", "monitor", "operator"],
        url: '/cs/kiosk-invitation'
      }
    ]
  },
  {
    name_key: 'SIDEBAR.SURVEY',
    url: '/survey/list',
    icon: 'icon-notebook',
    permissions: ["admin", "config"]
  },
  {
    name_key: 'SIDEBAR.GROUP_DEVICE',
    url: '/group/list',
    icon: 'icon-grid',
    permissions: ["admin", "config"]
  },
  {
    name_key: 'SIDEBAR.DEVICE',
    url: '/device/list',
    icon: 'icon-screen-tablet',
    permissions: ["admin", "config"]
  },
  {
    name_key: 'SIDEBAR.COLLECTION',
    url: '/collection/list',
    icon: 'icon-picture',
    permissions: ["admin", "config"]
  },
  {
    name_key: 'SIDEBAR.APPLICATION',
    url: '/module/list',
    icon: 'icon-bag',
    permissions: ["admin", "config"]
  },
  {
    name_key: 'SIDEBAR.THEME',
    url: '/theme/list',
    icon: 'icon-frame',
    permissions: ["admin", "config"]
  },
  {
    name_key: 'SIDEBAR.TARGET',
    url: '/target/list',
    icon: 'icon-target',
    permissions: ["admin", "config"]
  },
  {
    name_key: 'SIDEBAR.THANKS_PAGE',
    url: '/thanks/list',
    icon: 'fa fa-heart-o',
    permissions: ["admin", "config"]
  },
  {
    //name: 'Quản lý tổ chức',
    name_key: 'SIDEBAR.ORGANIZATION_MNG',
    url: '/organization',
    icon: 'icon-home',
    permissions: ["owner", "admin", "service", "monitor", "operator"],
    children: [
      {
        name_key: 'SIDEBAR.ORGANIZATION_LIST',
        // permissions: ["owner", "admin", "service", "monitor", "operator"],
        url: '/organization/list',
      },
      {
        name_key: 'SIDEBAR.ROLES',
        permissions: ["owner", "admin"],
        enterprise_mode: true,              // ONLY FOR ENTERPRISE ORG
        url: '/organization/roles'
      },
      {
        name_key: 'SIDEBAR.ROLE_ASSIGNMENT',
        permissions: ["owner", "admin"],
        enterprise_mode: true,              // ONLY FOR ENTERPRISE ORG
        url: '/organization/role-assignment'
      }

    ]
  },
  {
    //name: 'Cấu hình hệ thống',
    name_key: 'SIDEBAR.SYSTEM_CONFIGURATION',
    url: '/cfg',
    icon: 'icon-settings',
    permissions: ["admin", "config"],
    children: [
      {
        name_key: 'SIDEBAR.DEVICE_LANGUAGE',
        permissions: ["admin", "config"],
        url: '/cfg/default-language'
      },
      {
        name_key: 'SIDEBAR.GENERAL_CONFIGURATION',
        permissions: ["admin", "config"],
        url: '/cfg/configuration'
      },
      {
        name_key: 'SIDEBAR.REPORT_PLUGINS',
        url: '/cfg/report-plugins'
      },
      {
        name_key: 'SIDEBAR.FEEDBACK_PLUGINS',
        url: '/cfg/feedback-plugins'
      },
      {
        name_key: 'SIDEBAR.POS_NHANH_PAGE',
        permissions: ["admin", "config"],
        url: '/cfg/pos-nhanh-page'
      },
      // {
      //   name_key: 'SIDEBAR.PUBLIC_PAGE',
      //   url: '/cfg/public-page'
      // }
    ]
  },
  {
    //name: 'Tài khoản',
    name_key: 'SIDEBAR.UI_ACCOUNT',
    url: '/account',
    icon: 'icon-people',
    permissions: ["admin", "service", "monitor", "operator", "config"],
    children: [
      {
        name_key: 'SIDEBAR.PROFILE',
        url: '/account/profile',
      },
      {
        name_key: 'SIDEBAR.CHANGEPASSWORD',
        url: '/account/changepasswd'
      },
      {
        name_key: 'SIDEBAR.LOGINBARCODE',
        url: '/account/loginbarcode'
      }
    ]
  },
  {
    name_key: 'SIDEBAR.QUOTATION',
    url: '/quotation/list',
    icon: 'icon-basket',
    permissions: ["admin", "config"]
  },
  // {
  //   name_key: 'SIDEBAR.OLDVERSION',
  //   url: 'https://hearme.vn/user',
  //   icon: 'icon-link',
  //   class: 'mt-auto',
  //   variant: 'success',
  //   attributes: { target: '_blank', rel: 'noopener' }
  // },
];
