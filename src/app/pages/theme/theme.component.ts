import {Component, Injector, ViewChild} from '@angular/core';
import {TablePageComponent} from '@app/_bases';
import {Theme} from '@app/_models/theme.model';
// import {Collection, CollectionModel} from '@app/_models';
// import {URIS} from '@app/_services';

/**
 * @license hearme
 * @copyright 2017-2022 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 12 Sep 2022
 * @purpose for managing theme
 */
@Component({
  templateUrl: 'theme.component.html',
  styleUrls: ['theme.component.css']
})
export class ThemeComponent extends TablePageComponent {
  @ViewChild('createObjectDialog') creating_Dialog;
  @ViewChild('themeConfigureDlg') themeConfigureDlg;
  @ViewChild('selectHeaderDialog') selectHeaderDialog;
  @ViewChild('selectBgDialog') selectBgDialog;

  object_type = Theme;
  /** Structure of filtering form fields */
  filtering_form = {
    name: null,
    status: -1
  };
  type_list = [];

  constructor(
    public injector: Injector,
  ) {
    super(injector);
  }

  /** Load theme type list */
  loadTypeList() {
    this.type_list = [];
    const url = this.getMainURL(this.object_type.uri_type_list);
    this.app_service.getAPIPromise(url).then(
      function(res) {
        this.type_list = res;
      }.bind(this)
    );
  }
  /** Load supportive data */
  loadSupportiveData() {
    this.loadTypeList();
  }

  /** Set params for search data */
  searchPrams() {
    // console.log('Filtering form values are: ', this.filtering_form);
    if (this.filtering_form.name) {
      this.params['name'] = this.filtering_form.name;
    } else {
      delete this.params['name'];
    }
    if (this.filtering_form.status != -1) {
      this.params['status'] = this.filtering_form.status;
    } else {
      delete this.params['status'];
    }
  }
  /** Set data when open update dialog */
  initDataForUpdatingObject() {
    this.object.data.type_key_name = null;
    this.object.data.type_names = null;
  }

  gotoConfigTheme(data) {
    this.object = this.object_type.newObject(this.injector, data);
    this.themeConfigureDlg.show();
  }

  processUpdateTheme() {
    if (this.object.data.type_id == 1) {
      // Type E-commerce
      this.object.data.header = null;
      this.object.data.background = null;
    }
    this.object.update(function(data) {
      if (data.id) {
        this.themeConfigureDlg.hide();
      }
    }.bind(this));
  }

  /** Header menu */
  headerMenu = {
    type: 'header',
    status: false,
    x: 0,
    y: 0,
    items: [
      {id: 1, iconClass: 'icon-picture', lableMenu: 'THEME_PAGE.LB_THEME_MENU_CHANGE_BANNER'},
      {id: 2, iconClass: 'icon-close', lableMenu: 'THEME_PAGE.LB_THEME_MENU_DEL_BANNER'},
    ]
  };
  /** Background menu */
  bgMenu = {
    type: 'background',
    status: false,
    x: 0,
    y: 0,
    items: [
      {id: 1, iconClass: 'icon-picture', lableMenu: 'THEME_PAGE.LB_THEME_MENU_CHANGE_BG'},
      {id: 2, iconClass: 'icon-close', lableMenu: 'THEME_PAGE.LB_THEME_MENU_DEL_BG'},
    ]
  };
  // Activates the menu with the coordinates
  onrightClick(parent, event) {
    this.disableContextMenu();
    let mainX = document.getElementById('theme-basic').getBoundingClientRect().x;
    let mainY = document.getElementById('theme-basic').getBoundingClientRect().y;
    parent.x = event.clientX - mainX;
    parent.y = event.clientY - mainY;
    parent.status = true;
  }
  // Disables the menu
  disableContextMenu() {
    this.headerMenu.status = false;
    this.bgMenu.status = false;
  }
  // Action click menu
  actionContextMenu(parent, itemId) {
    if (parent.type == this.headerMenu.type) {
      if (itemId == 1) {
        this.selectHeaderDialog.show();
      } else {
        this.object.data.header = '';
      }
    } else {
      if (itemId == 1) {
        this.selectBgDialog.show();
      } else {
        this.object.data.background = '';
      }
    }
  }

  /**
   * Set selected image to data
   * @param image type
   * @param fileName
   */
  setImage(type, fileName) {
    if (type == this.headerMenu.type) {
      this.object.data.header = fileName;
      this.selectHeaderDialog.hide();
    } else {
      this.object.data.background = fileName;
      this.selectBgDialog.hide();
    }
  }
  public getImageURL(uri, defaultImg, isCover=false) {
    let link = uri ? this.app_service.Based_URLs.imgs + uri : defaultImg;
    let style = "background: url(" + link + ")" + (isCover ? ' 0% 0% / cover;' : '');
    return style;
  }

}
