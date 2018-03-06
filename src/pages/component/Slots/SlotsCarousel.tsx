import _ from 'lodash';
import React from 'react';

import { PrizeDetailDto } from '../../../service/model/prize/PrizeDetailDto';
import styles from './Slots.pcss';

class PropType {
  prizeDetailDtoList: PrizeDetailDto[];
  actionDelay?: number = 0;
  beforeStop?: Function;
  onStop?: Function;
  beforeStart?: Function;
  onStart?: Function;
  autoplay?: boolean = false;
  transitionTime?: number = 0.6;
  carouselHeight: number;
}

export default class SlotsCarousel extends React.PureComponent<PropType, any> {
  CarouselUl;
  // 轮播底部
  BottomPosition;
  ToStyle;
  StaticStyle = {
    transform: `matrix(1, 0, 0, 1, 0, 0)`,
    transitionDuration: '0s',
    transitionTimingFunction: 'linear',
  };
  IntervalTime;
  IntervalId;
  // 点击停止时
  running = false;
  constructor() {
    super();
  }
  getToStyle(position: number, transitionTime: number) {
    return {
      transform: `matrix(1, 0, 0, 1, 0, -${position})`,
      transitionDuration: `${transitionTime}s`,
      transitionTimingFunction: 'linear',
    };
  }
  componentDidMount() {
    this.reset();
    if (this.props.autoplay) {
      this.start();
    }
  }
  reset() {
    this.IntervalTime = this.props.transitionTime;
    this.BottomPosition = (this.props.prizeDetailDtoList.length - 1) * this.props.carouselHeight;
    this.ToStyle = this.getToStyle(this.BottomPosition, this.props.transitionTime);
  }
  start() {
    const self = this;
    this.reset();
    if (this.running) {
      console.log('正在执行');
      return false;
    }
    this.running = true;
    // 开始前判断
    if (this.props.beforeStart && typeof this.props.beforeStart === 'function') {
      this.props.beforeStart();
    }
    setTimeout(() => {
      // 第一次开始转动
      self.CarouselUl.style.transform = self.ToStyle.transform;
      self.CarouselUl.style.transitionDuration = self.ToStyle.transitionDuration;
      // 第一次结束，开始循环
      self.IntervalId = setInterval(() => {
        self.CarouselUl.style.transform = self.StaticStyle.transform;
        self.CarouselUl.style.transitionDuration = self.StaticStyle.transitionDuration;

        setTimeout(() => {
          self.CarouselUl.style.transform = self.ToStyle.transform;
          self.CarouselUl.style.transitionDuration = self.ToStyle.transitionDuration;
        }, 20);
      }, self.IntervalTime * 1000);
      // 开始后
      if (self.props.onStart && typeof self.props.onStart === 'function') {
        self.props.onStart();
      }
    }, 10 + self.props.actionDelay * 1000);
  }
  getStopPosition(id) {
    let index;
    const positionEls = _.filter(this.props.prizeDetailDtoList, { id: id });
    if (positionEls.length < 1) {
      return;
    }
    index = _.indexOf(this.props.prizeDetailDtoList, positionEls[positionEls.length - 1]);

    return index * this.props.carouselHeight;
  }
  stop(id) {
    if (!this.running) {
      console.log('未执行');
      return false;
    }
    const self = this;
    // 结束前判断
    if (this.props.beforeStop && typeof this.props.beforeStop === 'function') {
      this.props.beforeStop();
    }
    setTimeout(() => {
      clearInterval(self.IntervalId);
      self.IntervalId = null;
      self.ToStyle = self.getToStyle(self.getStopPosition(id), self.props.transitionTime);
      self.CarouselUl.style.transform = self.ToStyle.transform;
      self.running = false;
      // 结束后
      if (self.props.onStop && typeof self.props.onStop === 'function') {
        self.props.onStop();
      }
    }, 10 + self.props.actionDelay * 1000);
  }
  render() {
    return (
      <div className={styles.SlotsCarousel}>
        <ul
          className={styles.ul}
          style={this.StaticStyle}
          ref={ul => {
            this.CarouselUl = ul;
          }}
        >
          <SlotsCarouselChildren PrizeDetailDtoList={this.props.prizeDetailDtoList} />
        </ul>
      </div>
    );
  }
}
class SlotsCarouselChildren extends React.PureComponent<any, any> {
  render() {
    return (
      <div>
        {_.map(this.props.PrizeDetailDtoList, (item: any, i) => {
          return (
            <li className={styles.li} key={i}>
              <img className={styles.img} src={item.img ? `${Global.uploadPath}/${item.img}` : `${Global.imgPath}/draw/${item.staticImg}`} />
            </li>
          );
        })}
      </div>
    );
  }
}
