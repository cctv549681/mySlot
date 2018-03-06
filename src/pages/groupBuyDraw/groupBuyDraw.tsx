import _ from 'lodash';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { render } from 'react-dom';
import alert from '../component/alert/alert';

import { Countdown } from '../component/countDown/countDown';
import Slots from '../component/slots/Slots';
import styles from './groupBuyDraw.pcss';
import { GroupBuyDrawStore } from './groupBuyDrawStore';
let store = new GroupBuyDrawStore();
@observer
class ButtonContainer extends React.PureComponent<any, any> {
  rules() {
    alert('活动说明', <div style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: `<pre style="white-space: pre-line;">${store.rules}</pre>` }} />, [
      {
        text: <div className={styles.alertConfirm} />,
      },
    ]);
  }
  prizes() {
    const self = this;
    alert(
      '活动奖品',
      <div className={styles.prizeList} style={{ textAlign: 'left' }}>
        <table style={{ width: '100%' }}>
          <tbody>
            {_.map(toJS(store.prizeDetailDtoList), (item: any, i) => {
              return item.prizeId && item.prizeId !== -1 ? (
                <tr key={i}>
                  <th style={{ width: '60%', padding: '5px' }}>
                    <img style={{ width: '100px' }} src={item.img ? `${Global.uploadPath}/${item.img}` : `${Global.imgPath}/draw/${item.staticImg}`} />
                  </th>
                  <td style={{ width: '40%' }}>
                    <div className={styles.prizeItem}>{item.prizeItem}</div>
                    <div className={styles.prizeProduct}>{item.prizeProduct}</div>
                    {/* <div className={styles.quantity}>{item.quantity}件</div> */}
                  </td>
                </tr>
              ) : (
                  ''
                );
            })}
          </tbody>
        </table>
      </div>,
      [
        {
          text: <div className={styles.alertConfirm} />,
        },
      ]
    );
  }
  async winners() {
    await store.getWinningList();
    const winnersContent = (
      <table className={styles.winnersTable}>
        <tbody>
          <tr style={{ lineHeight: '25px' }}>
            <th style={{ textAlign: 'center' }}>昵称</th>
            <th>手机号码</th>
            <th>中奖礼品</th>
          </tr>
          {_.map(toJS(store.winners), (item: any) => {
            console.log(_.padEnd(item.mobile.substr(0, 3), 8, '*') + item.mobile.substr(-item.mobile.length + 8));
            return (
              <tr style={{ lineHeight: '20px' }}>
                <td style={{ textAlign: 'center' }}>{_.padEnd(item.name.substr(0, 1), item.name.length, '*')}</td>
                <td>{_.padEnd(item.mobile.substr(0, 3), 8, '*') + item.mobile.substr(-item.mobile.length + 8)}</td>
                <td>{item.prizeProduct}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
    alert('中奖名单', <div style={{ textAlign: 'left' }}>{winnersContent}</div>, [
      {
        text: <div className={styles.alertConfirm} />,
      },
    ]);
  }
  render() {
    return (
      <div className={styles.buttons}>
        <button className={styles.dialogButton + ' ' + styles.rules} onClick={this.rules} />
        <button
          className={styles.dialogButton + ' ' + styles.prizes}
          onClick={() => {
            this.prizes();
          }}
        />
        <button className={styles.dialogButton + ' ' + styles.winners} onClick={this.winners} />
      </div>
    );
  }
}
@observer
class DrawSlots extends React.PureComponent<any, any> {
  slots;
  async hitSlots() {
    const self = this;
    this.slots.start();

    await store.hit();
    setTimeout(() => {
      self.slots.stop(store.displayHitResult);
    }, 2000);
  }
  render() {
    let PrizeDetailDtoList = toJS(store.prizeDetailDtoList);
    return (
      <div className={styles.slots}>
        <Slots
          slotsQuantity={3}
          prizeDetailDtoList={PrizeDetailDtoList}
          transitionTime={0.4}
          actionDelay={[0, 0.5, 1]}
          ref={el => {
            this.slots = el;
          }}
          onChange={isRunning => {
            if (store.startDisabled !== isRunning) {
              store.changeStartDisabled(isRunning);
            }
          }}
          StopCallback={() => {
            setTimeout(() => {
              store.changeShowResult(true);
            }, 500);
          }}
        />
        <button
          disabled={store.startDisabled || store.hitCount === 0}
          className={styles.start + ' ' + (store.startDisabled || store.hitCount === 0 ? styles.disabledStart : '')}
          onClick={() => {
            this.hitSlots();
          }}
        />
      </div>
    );
  }
}

@observer
export class GroupBuyDraw extends React.PureComponent<any, any> {
  constructor() {
    super();
  }
  async componentDidMount() {
    // store.mock();
    const result: any = await store.load();
    if (!result.flag) {
      alert('提示', result.message, [
        {
          text: <div className={styles.alertConfirm} />,
          onPress: () => {
            location.href = Global.apiPath + '/index.jhtml';
          },
        },
      ]);
    }
  }
  handleCountdownEnd() {
    // window.location.reload(true);
  }
  setShowResultFalse() {
    store.changeShowResult(false);
  }
  render() {
    let PrizeDetailDtoList = toJS(store.prizeDetailDtoList);
    return (
      <div className={styles.container}>
        {store.ShowResult ? (
          <div className={styles.prizeResult}>
            {// todo
              store.hitReuslt ? (
                <div className={styles.resultContainer + ' ' + styles.resultWinning}>
                  <img className={styles.winningCloseButton} onClick={this.setShowResultFalse} src={`${Global.imgPath}/draw/icon_zhongjiangclose@2x.png`} />
                  <div>
                    <img src={`${Global.uploadPath}/${store.hitReuslt.img}`} className={styles.winnerImage} />
                  </div>
                  <div className={styles.winningWord}>
                    <div>恭喜你，中得{store.hitReuslt.prizeProduct}</div>
                    <div>工作人员将在两个工作日内给您配送</div>
                  </div>
                </div>
              ) : (
                  <div className={styles.resultContainer + ' ' + styles.resultFail}>
                    <img className={styles.closeButton} onClick={this.setShowResultFalse} src={`${Global.imgPath}/draw/icon_close@2x.png`} />
                    <div className={styles.FailWord}>很遗憾未中奖</div>
                    <div className={styles.FailWord2}>
                      <div>没关系哦</div>
                      <div style={{ color: '#e34d2c' }}>{store.hitCount > 0 ? `你还有${store.hitCount}次抽奖机会，再来一次` : `你已经没有抽奖机会了`}</div>
                    </div>
                  </div>
                )}
          </div>
        ) : (
            ''
          )}
        {/* countdown */}
        <div className={styles.countdownInfo}>
          活动倒计时
          <Countdown restTime={store.restTime} overText="00天00时00分00秒" onEnd={this.handleCountdownEnd} className={styles.countdown}>
            {({ d, h, m, s }) => {
              return (
                <div>
                  <span>{d}</span>天
                  <span>{h}</span>时
                  <span>{m}</span>分
                  <span>{s}</span>秒
                </div>
              );
            }}
          </Countdown>
        </div>
        {/* message */}
        <div className={styles.lotteryNumberInfo}>
          今天还剩<span className={styles.lotteryNumber}>{store.hitCount}</span>次抽奖机会
        </div>
        {/* buttonGroup */}
        <DrawSlots />
        <ButtonContainer prizeDetailDtoList={PrizeDetailDtoList} />
      </div>
    );
  }
}
render(<GroupBuyDraw />, document.getElementById('drawApp'));
