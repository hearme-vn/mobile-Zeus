import { Injectable } from '@angular/core';

// import { User } from '../_models';
import { APPCONSTS } from './app.const';
import { URIS } from './uris.const';
import { APPService } from './app.service';

/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 29 Nov 2022
 * @purpose Provide service related to survey
 */
@Injectable({ providedIn: 'root' })
export class SurveyService {
  constructor(private app_service: APPService
    ) {
  }

  /**
   * Import survey from survey configuration data
  */
  importSurvey(survey_config, keep_status=0, default_status=0) {
    let url = this.app_service.Based_URLs.main + URIS.main.survey_import;
    let payload = {
      survey_tree: survey_config,
      keep_status: keep_status,
      default_status: default_status
    };

    return this.app_service.postAPI(url, payload, function(res) {
        this.app_service.showMessageById("MSG.SURVEY_IMPORT_SUCCESS", 'toast-success');
      }.bind(this)
    );
  }

}
