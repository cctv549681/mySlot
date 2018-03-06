import List from 'antd-mobile/lib/list/index.web';
import classNames from 'classnames';
import React from 'react';

import style from './Menu.pcss';

/* tslint:disable:jsx-no-multiline-js */
const stopPropagation = e => {
  e.preventDefault();
  e.stopPropagation();
};

export default class SubMenu extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      selItem: props.selItem,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.subMenuData !== this.props.subMenuData) {
      this.setState({
        selItem: nextProps.selItem,
      });
    }
  }
  onClick = dataItem => {
    this.setState({
      selItem: [dataItem],
    });
    if (this.props.onSel) {
      this.props.onSel(dataItem);
    }
  };
  render() {
    const {
      subMenuPrefixCls,
      radioPrefixCls,
      subMenuData,
      parentName,
    } = this.props;
    const { selItem } = this.state;

    const selected = dataItem => {
      console.log(
        selItem.length > 0 && selItem[0].id === dataItem.id,
        selItem,
        dataItem.id,
        dataItem.name
      );
      return selItem.length > 0 && selItem[0].id === dataItem.id;
    };

    return (
      <div style={{ height: '100%' }}>
        <div className={style.parentName}>{parentName}</div>
        <List className={subMenuPrefixCls}>
          {subMenuData.map((dataItem, idx) => (
            <List.Item
              className={classNames({
                [`${radioPrefixCls}-item`]: true,
                [`${subMenuPrefixCls}-item-selected`]: selected(dataItem),
                [`${subMenuPrefixCls}-item-disabled`]: dataItem.disabled,
              })}
              key={idx}
            >
              <div
                className={
                  style.secondLevelTitle +
                  (selected(dataItem)
                    ? ' ' + style.secondLevelTitleSelected
                    : '')
                }
                onClick={event => {
                  stopPropagation(event);
                  this.onClick(dataItem);
                }}
              >
                {dataItem.name}
                <span className={style.secondLevelTitleLink}>全部&gt;</span>
              </div>
              {dataItem.children.length > 0 ? (
                <List style={{ paddingTop: 0 }} className={style.thirdMenu}>
                  {dataItem.children.map((thirdItem, idThree) => (
                    <List.Item
                      onClick={event => {
                        stopPropagation(event);
                        this.onClick(thirdItem);
                      }}
                      className={classNames({
                        [`${radioPrefixCls}-item`]: true,
                        [`${subMenuPrefixCls}-item-selected`]: selected(
                          thirdItem
                        ),
                        [`${subMenuPrefixCls}-item-disabled`]: thirdItem.disabled,
                      })}
                      key={idThree}
                    >
                      <div
                        className={
                          style.thirdLevelContent +
                          (selected(thirdItem)
                            ? ' ' + style.secondLevelTitleSelected
                            : '')
                        }
                        data-id={thirdItem.id}
                      >
                        <img
                          src={`${Global.uploadPath}/${thirdItem.image}`}
                          alt={thirdItem.name}
                          className={style.thirdLevelImg}
                        />
                        <div className={style.thirdImgName}>
                          {thirdItem.name}
                        </div>
                      </div>
                    </List.Item>
                  ))}
                </List>
              ) : (
                <List style={{ paddingTop: 0 }} className={style.thirdMenu}>
                  <List.Item
                    onClick={event => {
                      stopPropagation(event);
                      this.onClick(dataItem);
                    }}
                    className={classNames({
                      [`${radioPrefixCls}-item`]: true,
                      [`${subMenuPrefixCls}-item-selected`]: selected(dataItem),
                      [`${subMenuPrefixCls}-item-disabled`]: dataItem.disabled,
                    })}
                    key={idx}
                  >
                    <div
                      className={
                        style.thirdLevelContent +
                        (selected(dataItem)
                          ? ' ' + style.secondLevelTitleSelected
                          : '')
                      }
                      data-id={dataItem.id}
                    >
                      <img
                        src={`${Global.uploadPath}/${dataItem.image}`}
                        alt={dataItem.name}
                        className={style.thirdLevelImg}
                      />
                      <div className={style.thirdImgName}>{dataItem.name}</div>
                    </div>
                  </List.Item>
                </List>
              )}
            </List.Item>
          ))}
        </List>
      </div>
    );
  }
}
