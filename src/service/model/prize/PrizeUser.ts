/**
 * 抽奖API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * 
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { utils } from '../../utils';

export class PrizeUser {
  id?: number = undefined;

  prizeDetailId?: number = undefined;

  userUuid?: string = undefined;

  static Format(data = {}): PrizeUser {
    let obj: PrizeUser = new PrizeUser();
    obj['id'] = utils.convert(data['id'] || obj['id'], 'number');
    obj['prizeDetailId'] = utils.convert(
      data['prizeDetailId'] || obj['prizeDetailId'],
      'number'
    );
    obj['userUuid'] = utils.convert(
      data['userUuid'] || obj['userUuid'],
      'string'
    );
    return obj;
  }
}
