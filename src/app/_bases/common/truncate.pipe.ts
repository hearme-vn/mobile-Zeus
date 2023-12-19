/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 21 Dec 2022
 * @purpose provide all utilities for entire application in static methods
 */
import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '@app/_services';


@Pipe({ name: 'truncate' })
class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 25, completeWords = false, ellipsis = '...') {
    return Utils.string_trim(value, limit, completeWords, ellipsis);
  }
}

export { TruncatePipe }