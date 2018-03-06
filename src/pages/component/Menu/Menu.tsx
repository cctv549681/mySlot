import Flex from 'antd-mobile/lib/Flex';
import List from 'antd-mobile/lib/list/index.web';
import classnames from 'classnames';
import _ from 'lodash';
import React from 'react';

import { MenuProps } from './PropsType';
import SubMenu from './SubMenu';


export default class Menu extends React.Component<MenuProps, any> {
  static defaultProps = {
    prefixCls: 'am-menu',
    subMenuPrefixCls: 'am-sub-menu',
    radioPrefixCls: 'am-radio',
    data: [],
    level: 2,
    onChange: _.noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      firstLevelSelectValue: this.getNewFsv(props),
      id: props.id,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.setState({
        firstLevelSelectValue: this.getNewFsv(nextProps),
        id: nextProps.id,
      });
    }
  }

  getNewFsv(props) {
    const { id, data } = props;
    let firstValue = '';
    if (id && id.length) {
      // if has init path, chose init first id
      firstValue = id[0];
    } else if (data[0]) {
      // chose the first menu item if it's not leaf.
      firstValue = data[0].id;
    }

    return firstValue;
  }

  onClickFirstLevelItem = dataItem => {
    const { onChange } = this.props;
    if (dataItem.children.length === 0) {
      this.setState({ id: dataItem.id, firstLevelSelectValue: dataItem.id });
    } else {
      this.setState({
        firstLevelSelectValue: dataItem.id,
      });
    }

    if (dataItem.children.length === 0 && onChange) {
      onChange([dataItem.id]);
    }
  }

  onClickSubMenuItem = dataItem => {
    const { level, onChange } = this.props;
    const id =
      level === 2
        ? [this.state.firstLevelSelectValue, dataItem.id]
        : [dataItem.id];
    this.setState({ id });
    setTimeout(() => {
      if (onChange) {
        onChange(id);
      }
    }, 300);
  };

  render() {
    const {
      className,
      style,
      height,
      data = [],
      prefixCls,
      level,
    } = this.props;
    const { firstLevelSelectValue, id } = this.state;
    let subMenuData = data; // menu only has one level as init
    if (level === 2) {
      let parent = data;
      if (firstLevelSelectValue && firstLevelSelectValue !== '') {
        parent = data.filter(dataItem => dataItem.id === firstLevelSelectValue);
      }

      if (parent[0] && parent[0].children && parent[0].isLeaf !== true) {
        subMenuData = parent[0].children;
      } else {
        subMenuData = [];
      }
    }

    const subValue = id && id.length > 0 && id[id.length - 1];
    const parentValue = id && id.length > 1 ? id[0] : null;

    let subSelInitItem = subMenuData.filter(
      dataItem => dataItem.id === subValue
    );
    if (!subSelInitItem || subSelInitItem.length === 0) {
      let ThirdData = [];
      _.each(subMenuData, subItem => {
        ThirdData = _.concat(ThirdData, subItem.children);
      });
      subSelInitItem = ThirdData.filter(dataItem => dataItem.id === subValue);
    }

    let showSelect = true;
    if (level === 2 && parentValue !== firstLevelSelectValue) {
      showSelect = false;
    }

    const heightStyle = {
      height:
        height || `${Math.round(document.documentElement.clientHeight / 2)}px`,
      overflowY: "scroll"
    };
    const subMenuStyle = {
      flex: 3,
    };
    const selectedFirstLevel = data.filter(
      dataItem => dataItem.id === firstLevelSelectValue
    )[0];
    return (
      <div
        className={classnames(prefixCls, className)}
        style={{
          ...style,
        }}
      >
        <Flex align="start">
          {level === 2 && (
            <Flex.Item style={heightStyle}>
              <List role="tablist">
                {data.map((dataItem, index) => (
                  <List.Item
                    className={
                      dataItem.id === firstLevelSelectValue ? (
                        `${prefixCls}-selected`
                      ) : (
                          ''
                        )
                    }
                    onClick={() => this.onClickFirstLevelItem(dataItem)}
                    key={`listitem-1-${index}`}
                    role="tab"
                    aria-selected={dataItem.id === firstLevelSelectValue}
                  >
                    {dataItem.name}
                  </List.Item>
                ))}
              </List>
            </Flex.Item>
          )}
          <Flex.Item
            style={_.assign({}, heightStyle, subMenuStyle)}
            role="tabpanel"
            aria-hidden="false"
          >
            <SubMenu
              parentName={selectedFirstLevel.name}
              subMenuPrefixCls={this.props.subMenuPrefixCls}
              radioPrefixCls={this.props.radioPrefixCls}
              subMenuData={subMenuData}
              selItem={subSelInitItem}
              onSel={this.onClickSubMenuItem}
              showSelect={showSelect}
            />
          </Flex.Item>
        </Flex>
      </div>
    );
  }
}
