import axios from 'axios';

import { BaseService } from './baseService';

declare let Global: any;

export class GroupBuyDrawService extends BaseService {
    constructor() {
        super();
    }

    path = `${Global.apiPath}/prize`;

    getDrawInfo(params?: {
    }): Promise<any> {
        return axios.get(`${this.path}/getAllInformation.jhtml`, {
            params: params
        })

    }

    drawStart(params?: {}): Promise<any> {
        return axios.get(`${this.path}/getPrizeResult.jhtml?time=${Date.now()}`, {
            params: params
        });
        // return new Promise((res, reject) => {
        //     res([1, 1, 1])
        // })
    }
    getWinningList(params?: {}): Promise<any> {
        return axios.get(`${this.path}/getPrizeList.jhtml?time=${Date.now()}`, {
            params: params
        });
    }
}