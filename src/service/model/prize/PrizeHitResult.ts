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


/**
 * 中奖信息
 */
export class PrizeHitResult {
  mobile?: string = undefined;

  userUUid?: string = undefined;

  prizeItem?: string = undefined;

  prizeProduct?: string = undefined;

  price?: number = undefined;

  img?: string = undefined;

  prizeId?: number = undefined;

  prizeName?: string = undefined;

  prizeDetailId?: number = undefined;

  static Format(data = {}): PrizeHitResult {
    let obj: PrizeHitResult = new PrizeHitResult();
    obj['mobile'] = utils.convert(data['mobile'] || obj['mobile'], 'string');
    obj['userUUid'] = utils.convert(
      data['userUUid'] || obj['userUUid'],
      'string'
    );
    obj['prizeItem'] = utils.convert(
      data['prizeItem'] || obj['prizeItem'],
      'string'
    );
    obj['prizeProduct'] = utils.convert(
      data['prizeProduct'] || obj['prizeProduct'],
      'string'
    );
    obj['price'] = utils.convert(data['price'] || obj['price'], 'number');
    obj['img'] = utils.convert(data['img'] || obj['img'], 'string');
    obj['prizeId'] = utils.convert(data['prizeId'] || obj['prizeId'], 'number');
    obj['prizeName'] = utils.convert(
      data['prizeName'] || obj['prizeName'],
      'string'
    );
    obj['prizeDetailId'] = utils.convert(
      data['prizeDetailId'] || obj['prizeDetailId'],
      'number'
    );
    return obj;
  }
}