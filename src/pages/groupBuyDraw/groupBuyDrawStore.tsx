import _ from 'lodash';
import { action, observable } from 'mobx';

import { alertError } from '../component/alert/alertError';
import { GroupBuyDrawService } from '../../service/api/groupBuyDrawService';
import { PrizeDetailDto } from '../../service/model/prize/PrizeDetailDto';
import { PrizeHitResult } from '../../service/model/prize/prizeHitResult';
import styles from './groupBuyDraw.pcss';
declare let Global: any;

const service = new GroupBuyDrawService();

export class GroupBuyDrawStore {
  defaultDto = [
    {
      id: -1,
      prizeItem: '谢谢参与',
      prizeProduct: '谢谢参与',
      prizeId: -1,
      img: null,
      staticImg: 'pic_bananan@2x.png',
    },
    {
      id: -2,
      prizeItem: '谢谢参与',
      prizeProduct: '谢谢参与',
      prizeId: -1,
      staticImg: 'pic_cherries@2x.png',
    },
    {
      id: -3,
      prizeItem: '谢谢参与',
      prizeProduct: '谢谢参与',
      prizeId: -1,
      staticImg: 'pic_orange@2x.png',
    },
  ] as PrizeDetailDto[];
  @observable startDisabled = false;
  @observable rules = '';
  @observable winners = [];
  @observable prizeDetailDtoList: PrizeDetailDto[] = [];
  @observable restTime: number = 0;
  @observable hitCount: number;
  @observable ShowResult: boolean = false;
  hitReuslt: PrizeHitResult = null;
  displayHitResult = [];
  prizeId = null;
  @action
  async load() {
    let result = await service.getDrawInfo();
    result = result.data;
    if (!result) {
      alertError({ goto: Global.apiPath + '/index.jhtml' });
    }
    if (result.prizeDto) {
      this.prizeId = result.prizeDto.id;
      this.rules = result.prizeDto.rules;
      this.prizeDetailDtoList = _.concat(result.prizeDto.prizeDetails, this.defaultDto);
    }
    this.hitCount = result.hitCount;
    this.restTime = result.restTime;
    return result;
  }
  @action
  async hit() {
    let result = await service.drawStart({
      prizeId: this.prizeId,
    });
    result = result.data;
    if (!result) {
      alertError();
    }
    this.hitCount = result.hitCount;
    let prizeHitResult: PrizeHitResult = result.result.data;

    this.displayHitResult = [];
    if (!prizeHitResult || prizeHitResult.prizeDetailId === null) {
      this.hitReuslt = null;
      const keys = _.map(this.prizeDetailDtoList, 'id');
      for (let i = 0; i < 3; i++) {
        const randomIndex = _.random(0, keys.length - 1);
        console.log(randomIndex, 'randomIndex');
        this.displayHitResult[i] = _.remove(keys, item => {
          return item === keys[randomIndex];
        })[0];
        console.log(keys, 'keysafter');
        console.log(this.displayHitResult[i], 'this.displayHitResult[i]', i);
      }
      console.log(this.displayHitResult);
    } else {
      this.hitReuslt = prizeHitResult;
      this.displayHitResult = [prizeHitResult.prizeDetailId, prizeHitResult.prizeDetailId, prizeHitResult.prizeDetailId];
    }
  }
  @action
  async getWinningList() {
    let result = await service.getWinningList({
      prizeId: this.prizeId,
      pageSize: 20,
    });
    this.winners = result.data;
  }

  @action
  changeStartDisabled(value) {
    this.startDisabled = value;
  }
  @action
  changeShowResult(value) {
    this.ShowResult = value;
  }
  @action
  mock() {
    this.rules = `XXX`;
    this.hitCount = 2;
    this.restTime = new Date('2017-10-25').getTime() - new Date().getTime();
    this.prizeDetailDtoList = _.concat(
      [
        {
          id: 1,
          prizeItem: '一等奖',
          prizeProduct: '一',
          prizeId: 1,
          img: 'food1.jpg',
          quantity: 100,
        },
        {
          id: 2,
          prizeItem: '二等奖',
          prizeProduct: '二',
          prizeId: 2,
          img: 'food2.jpg',
          quantity: 100,
        },
        {
          id: 3,
          prizeItem: '三等奖',
          prizeProduct: '三',
          prizeId: 3,
          img: 'food3.jpg',
          quantity: 100,
        },
      ] as PrizeDetailDto[],
      this.defaultDto
    );
    this.winners = [
      {
        name: '李某某',
        tel: '18768013422',
        prizeProduct: '电视机',
      },
    ];
  }
}
