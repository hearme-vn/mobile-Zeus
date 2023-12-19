# UI library
This folder contains library for user interface



# Survey selection
## input: 
``` code
  @Input('surveys') surveys: [];
  @Input('filter') filter: [Number];
  @Output('change') change = new EventEmitter();
```

- surveys: is array of survey object
- filter: is array of survey types which are allowed to be selected
- change: is event, fired when user change selection

Example:

```
        <survey-select class="col-md-6" name="mainSurvey" [filter]="main_survey_filter"
          (change)="mainSurveyChange($event)" [(ngModel)]="selectedSurvey">
        </survey-select>
```

## UI
- Dropdown list with two columns: Survey name and survey type


# Survey tree selection
## input: 
```
  @Input() buttonClass = 'btn-outline-secondary';
  @Input() config: TreeviewConfig;
  @Input() child_surveys: TreeviewItem[];                   // Array of surveys
  @Input('root_survey_id') survey_id: String;               // Parent survey id
  @Input('filter') survey_type_filter: [Number];            // Array of survey types that are allowed to select

  @Output() selectedChange = new EventEmitter<any>();
```

```
class TreeviewConfig {
  hasAllCheckBox = true;
  hasFilter = false;
  hasCollapseExpand = false;
  decoupleChildFromParent = false;
  maxHeight = 500;
  allow_root_survey: true\false
}
```

Example:

```
    // In typescript to init child_surveys:
    this.child_surveys = [];
    this.child_surveys.push(new TreeviewItem(child));
```

```
        <surveytree-select class="col-md-6" [config]="config" [child_surveys]="child_surveys" 
          [buttonClass]="'btn-outline-primary'" [root_survey_id]="selectedSurvey.id" 
          (selectedChange)="onFactorSurveyChange($event)" [filter]="factor_survey_filter">
        </surveytree-select>
```

## UI
Display survey tree, allow user to select only one item


# Device selection


# Device Group selection
