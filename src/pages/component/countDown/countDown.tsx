import { observer } from 'mobx-react';
import * as React from 'react';

import { CountDownStore } from './countDownstore';

class CountdownBean {
  restTime: number;
  overText?: string = "00:00:00";
  onEnd?(): void;
  className?: any;
}

@observer
export class Countdown extends React.Component<CountdownBean, any> {
  store: CountDownStore;
  updateTimer: any;

  constructor(props) {
    super(props);

    this.store = new CountDownStore(this.getRestTime(props.restTime));
    this.updateRestTime();
  }
  componentWillReceiveProps(nextProps) {
    this.store.changeRestTime(this.getRestTime(nextProps.restTime));
  }
  getRestTime(restTime) {
    const time = parseInt((restTime / 1000).toString(), 10);

    return time < 0 ? 0 : time;
  }

  getFormateTime(time) {
    const curryLeftpad = time => leftpad(time, 2, 0)
    const d = curryLeftpad(parseInt((time / (24 * 60 * 60)).toString(), 10))
    const h = curryLeftpad(parseInt((time / (60 * 60) % 24).toString(), 10))
    const m = curryLeftpad(parseInt((time / 60 % 60).toString(), 10))
    const s = curryLeftpad(parseInt((time % 60).toString(), 10))

    return { d, h, m, s };
  }

  updateRestTime() {
    const { onEnd } = this.props;

    this.updateTimer = setInterval(() => {
      let { restTime } = this.store;

      if ((restTime - 1) <= 0) {
        onEnd();
        return clearTimeout(this.updateTimer);
      } else {
        this.store.changeRestTime(restTime - 1);
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.updateTimer);
  }

  render() {
    const { restTime } = this.store;
    const { overText, children } = this.props;
    const isOver = restTime <= 0;

    const date = !isOver && this.getFormateTime(restTime);
    return (
      <h5 className={this.props.className ? this.props.className : ''}>
        {isOver ?
          overText :
          (children as any)(date)
        }
      </h5>
    );
  }
}


/**
 * leftpad 用于填充字符串，递归实现
 * @param  {String} str [需要填充的字符串]
 * @param  {Number} len [填充后的长度]
 * @param  {String} ch  [填充字符，默认为空格]
 * @return {String}     [填充后的文字]
 */
function leftpad(str, len, ch) {
  str = String(str);
  ch = String(ch);

  if (str.length >= len) { return str; }
  if (!ch && ch !== 0) { ch = ' '; }

  return leftpad(ch + str, len, ch);
}
