import _ from 'lodash';
import React from 'react';

import { PrizeDetailDto } from '../../../service/model/prize/PrizeDetailDto';
import SlotsCarousel from './SlotsCarousel';

class PropType {
  prizeDetailDtoList: PrizeDetailDto[];
  slotsQuantity?: number = 0;
  transitionTime?: number = 0.6;
  actionDelay?: number[];
  onChange?: Function;
  StopCallback?: Function;
}

export default class Slots extends React.PureComponent<PropType, any> {
  isRunning = false;
  state = {
    prizeDetailDtoList: []
  };
  slotsCarouselCollection = {};
  updateDtoList(props) {
    const prizeDetailDtoList = props.prizeDetailDtoList;
    if (props.prizeDetailDtoList.length > 0) {
      const cloneListFirst = _.clone(props.prizeDetailDtoList[0])
      const listLastIndex = props.prizeDetailDtoList[props.prizeDetailDtoList.length - 1].id;
      cloneListFirst.id = listLastIndex + 1;
      prizeDetailDtoList.push(cloneListFirst);
    }
    this.setState({
      prizeDetailDtoList: prizeDetailDtoList
    });
  }

  constructor(props) {
    super(props);

    this.updateDtoList(props);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.prizeDetailDtoList !== nextProps.prizeDetailDtoList) {
      this.updateDtoList(nextProps);
    }
  }
  start() {
    _.each(this.slotsCarouselCollection, (slotsCarousel: any, i) => {
      slotsCarousel.start();
    })

  }
  stop(array) {
    _.each(this.slotsCarouselCollection, (slotsCarousel: any, i) => {
      slotsCarousel.stop(array[i]);
    })
  }
  checkRunning() {
    let running = false;
    _.each(this.slotsCarouselCollection, (slotsCarousel: any, i) => {
      if (!!slotsCarousel.running) {
        running = true;
        return;
      }
    })
    return running;
  }
  beforeStart() {
    this.isRunning = true;
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this.isRunning);
    }
  }
  onStop() {
    this.isRunning = this.checkRunning();
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this.isRunning);
    }
    if (!this.isRunning && typeof this.props.StopCallback === 'function') {
      this.props.StopCallback();
    }
  }
  render() {
    return (
      <div>
        <div >
          <SlotsCarousel
            actionDelay={0}
            carouselHeight={75 * window.screen.width / 375}
            prizeDetailDtoList={this.state.prizeDetailDtoList}
            autoplay={false}
            transitionTime={this.props.transitionTime || 0.3}
            ref={el => {
              this.slotsCarouselCollection[0] = el;
            }}
            beforeStart={() => { this.beforeStart() }}
            onStop={() => { this.onStop() }}
          />
          <SlotsCarousel
            actionDelay={0.5}
            carouselHeight={75 * window.screen.width / 375}
            prizeDetailDtoList={this.state.prizeDetailDtoList}
            autoplay={false}
            transitionTime={this.props.transitionTime || 0.3}
            ref={el => {
              this.slotsCarouselCollection[1] = el;
            }}
            beforeStart={() => { this.beforeStart() }}
            onStop={() => { this.onStop() }}
          />
          <SlotsCarousel
            actionDelay={1}
            carouselHeight={75 * window.screen.width / 375}
            prizeDetailDtoList={this.state.prizeDetailDtoList}
            autoplay={false}
            transitionTime={this.props.transitionTime || 0.3}
            ref={el => {
              this.slotsCarouselCollection[2] = el;
            }}
            beforeStart={() => { this.beforeStart() }}
            onStop={() => { this.onStop() }}
          />
        </div>
        {/* <div>
          <button
            onClick={() => {
              if (this.isRunning) {
                this.stop([1, 2, 3]);
              }
            }}
          >
            Stop
          </button>
        </div> */}
      </div>
    );
  }
}
