import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, Injector } from '@angular/core';
import { BaseComponent } from '@app/_bases';
import { URIS, Utils } from '@app/_services';
// import { isNil } from 'lodash';
import { DropdownTreeviewComponent, TreeviewHelper, TreeviewI18n, TreeviewItem, TreeviewConfig } from '@ngx-treeview';
import { DropdownTreeviewSelectI18n } from './surveytree_select-i18n';
import { Survey } from '@app/_models';

@Component({
  selector: 'surveytree-select',
  templateUrl: './surveytree_select.component.html',
  styleUrls: [
    './surveytree_select.component.scss'
  ],
  providers: [
    { provide: TreeviewI18n, useClass: DropdownTreeviewSelectI18n }
  ]
})
export class SurveyTreeComponent extends BaseComponent implements OnChanges {
  @Input() buttonClass = 'btn-outline-secondary';
  @Input() config: TreeviewConfig;
  @Input() child_surveys: TreeviewItem[];
  @Input('root_survey_id') survey_id: String;   // Parent survey id
  @Input('filter') survey_type_filter: [Number];            // Array of survey types that are allowed to select
  @Input() value: any;

  @Output() valueChange = new EventEmitter<any>();
  @Output() selectedChange = new EventEmitter<any>();
  @ViewChild(DropdownTreeviewComponent, { static: false }) dropdownTreeviewComponent: DropdownTreeviewComponent;
  filterText: string;
  private dropdownTreeviewSelectI18n: DropdownTreeviewSelectI18n;

  selectedItemId: any;
  radio_id = Utils.randomString(10);

  constructor( public injector: Injector,
    public treeviewI18n: TreeviewI18n
  ) {
    super(injector);
    this.config = TreeviewConfig.create({
      hasAllCheckBox: true,
      hasCollapseExpand: true,
      hasFilter: true,
      maxHeight: 500
    });
    this.dropdownTreeviewSelectI18n = treeviewI18n as DropdownTreeviewSelectI18n;
  }

  ngOnChanges(): void {
    this.updateSelectedItem();
  }

  /** method is fired when user select survey in tree */
  select($event, item: TreeviewItem): void {
    if (!item) {
      this.value = null;
      this.selectedItemId = null;
      this.dropdownTreeviewSelectI18n.selectedItem = null;
      this.selectedChange.emit(null);
      this.dropdownTreeviewComponent.onSelectedChange(null);
      /// this.dropdownTreeviewComponent.buttonLabel = "Vui long chon";
      return
    }
    if (this.survey_type_filter && this.survey_type_filter.length && 
      !this.survey_type_filter.includes((<any>item).type)) {
      $event.stopPropagation()
      return;
    }

    this.selectItem(item);
    this.selectedItemId = item["sur_path"] + item.id;
  }

  /**
   * This medthod to set enable or disable survey for selecting item
   * if survey type is in @survey_type_filter, it is allowed to be selected by user
   * Otherwise, it can not be allowed to select   * 
   */ 
  filterSurvey(child_surveys: [any], survey_type_filter: [Number]) {
    if (!survey_type_filter || !survey_type_filter.length)    return;

    for (let survey of child_surveys) {
      let type = survey.type;
      if (!survey_type_filter.includes(type)) {
        survey.disabled = true;
        survey.checked = false;
      } else {
        survey.disabled = false;
      }
      if (survey.children && survey.children.length) {
        this.filterSurvey(survey.children, survey_type_filter);
      }
    }
  }

  private updateSelectedItem(): void {
    // if (!isNil(this.items)) {
    if (this.child_surveys && this.child_surveys.length && !this.survey_id) {
      // Filter tree
      this.filterSurvey(<[any]>this.child_surveys, this.survey_type_filter);

      // Make selected item in tree
      const selectedItem = TreeviewHelper.findItemInList(this.child_surveys, this.value);
      this.selectItem(selectedItem);
    } else {
      this.loadChildSurveyFromRootId(this.survey_id);
    }

    this.selectItem(null);
  }

  /**
   * Get child survey array by root survey id.
   * This list is assigned for items property
  */
  loadChildSurveyFromRootId(root_survey_id) {
    if (!root_survey_id) {
      return [];
    }

    let selectedSurvey = new Survey(this.injector, {id: root_survey_id});
    selectedSurvey.getSurveyTree().then(
      function(survey) {
        this.child_surveys = [];

        let allow_root_survey = (<any>this.config).allow_root_survey;
        if (allow_root_survey) {
          this.child_surveys.push(new TreeviewItem(survey));
        } else {
          if (survey && survey.children && survey.children.length) {
            for (let child of survey.children) {
              this.child_surveys.push(new TreeviewItem(child));
            }
          }
        }
        this.filterSurvey(this.child_surveys, this.survey_type_filter);
      }.bind(this)
    );
  }

  private selectItem(item: TreeviewItem): void {
    if (this.dropdownTreeviewSelectI18n.selectedItem !== item) {
      this.dropdownTreeviewSelectI18n.selectedItem = item;
      if (this.dropdownTreeviewComponent) {
        this.dropdownTreeviewComponent.onSelectedChange([item]);
      }

      if (item) {
        if (this.value !== item.value) {
          this.value = item.value;
          this.valueChange.emit(item.value);
          this.selectedChange.emit(item);
        }
      }
    }
  }
}
