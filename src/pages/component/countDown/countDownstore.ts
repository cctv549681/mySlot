import { observable, action } from 'mobx';

export class CountDownStore {
    constructor(restTime) {
        this.restTime = restTime;
    }

    @observable restTime: number;

    @action changeRestTime(restTime) {
        this.restTime = restTime;
    }
}