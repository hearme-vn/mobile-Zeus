import { Injector, Component, ViewChild } from '@angular/core';
import { Survey } from '@app/_models';
import { TablePageComponent } from '@app/_bases';
import { APPService, URIS, APPCONSTS, Utils, SurveyService } from '@app/_services';

/**
 * @license hearme 
 * @copyright 2017-2022 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 07 Sep 2022
 * @purpose for managing surveys
 */
@Component({
  templateUrl: 'survey.component.html'
})
export class SurveyComponent extends TablePageComponent {
  object_type = Survey;

  /** Structure of filtering form fields */
  filtering_form = {
    keyword: null,
    status: null
  }

  /**
   * Define status value for survey 
  */ 
  status_list = [
    { name_key: 'APP.UI_STATUS_CREATED', value: 0 },
    { name_key: 'APP.UI_STATUS_ACTIVE', value: 1 },
    { name_key: 'APP.UI_STATUS_INACTIVE', value: 2 }
  ]

  constructor(
    public injector: Injector,
    private survey_service: SurveyService
    ) {
    super(injector);
  }

  searchPrams() {
    if (this.filtering_form.keyword) {
      this.params["question"] = this.filtering_form.keyword;
    }

    if (this.filtering_form.status != null && this.filtering_form.status != undefined) {
      this.params["status"] = this.filtering_form.status;
    }
  }

  creatingSurvey() {
    this.router.navigate(['/survey/create'])
  }

  importSurveyTemplate() {
    this.router.navigate(['/survey/import'])
  }

  /** Open dialog for updating object */
  openPageForUpdating(obj_id) {
    let uri = '/survey/edit?id=' + obj_id;
    // GOTO editing page
    this.router.navigateByUrl(uri);
  }

  /**
   * Delete survey recursively, specified by id
   * recursive: 0 - delete root survey only
   * 1 - delete root and child surveys
  */
  deleteSurvey(id, recursive=0) {
    let delete_url = this.getMainURL(Survey.uri_delete);
    let payload = {
      id: id,
      recursive: recursive
    };
    this.app_service.postAPI(delete_url, payload, this.postDelete.bind(this));
  }

  /**
   * Set survey status - survey is specified by id
   * - status: 1 (active); 2 (closed)
   * - recursive: 0 (only root); 1 (entire survey tree)
  */
  setSurveyStatus(id, status=1, recursive=0) {
    let set_Status_url = this.getMainURL(Survey.uri_set_status);
    let payload = {
      id: id,
      status: status,
      recursive: recursive
    };
    this.app_service.postAPI(set_Status_url, payload, function(res) {
        this.app_service.showMessageById("MSG.UPDATE_OBJECT", 'toast-success');
        this.search();
      }.bind(this)
    );
  }

  /**
   * Save exported survey configuration information into text file
   * - ud: 
   * - Filename: root survey name
  */ 
  downloadSurveyConfiguration(id, filename="survey.txt") {
    let url = this.getMainURL(Survey.uri_export);
    let payload = {
      id: id
    };
    this.app_service.postAPI(url, payload, function(res) {
        //console.log("Survey name: %s, configuration: %s", filename, JSON.stringify(res));
        let data = new Blob([JSON.stringify(res)], {type: 'text/plain'}); 
        let url = window.URL.createObjectURL(data);
   
        let a = document.createElement('a');
        document.body.appendChild(a);
   
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

      }.bind(this)
    );
  }

  importButton_handle() {
    document.getElementById('survey_configuration_file').click();
  }

  readSurveyData(event) {
    if (!event || !event.target || !event.target.files || !event.target.files.length)  return;

    const survey_file = event.target.files[0];

    // Read file content
    // console.log("Import survey: ", survey_file);
    const reader = new FileReader();
    reader.addEventListener('load', function(event) {
        let survey_config = event.target.result;
        // console.log("Survey config: ", survey_config);
        this.survey_service.importSurvey(JSON.parse(survey_config)).then(
          function(res) {
            this.search();
          }.bind(this)
        );
      }.bind(this)
    );
    reader.readAsText(survey_file);    
  }

}
