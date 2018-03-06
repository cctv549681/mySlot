import React from 'react';

export interface DataItem {
  label?: any;
  value?: any;
  children?: any;
  isLeaf?: boolean;
  disabled?: boolean;
  [key: string]: any;
  id?: any;
  name?: any;
}

export interface MenuProps {
  /** web only */
  prefixCls?: string;
  menuCls?: string;
  subMenuPrefixCls?: string;
  radioPrefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  data?: DataItem[];
  defaultValue?: string[];
  value?: string[];
  onChange?: Function;
  level?: number;
  height?: any;
  id?: any;
  name?: any;
}
