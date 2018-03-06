/* tslint:disable:no-unused-variable */
import React from 'react';
/* tslint:enable:no-unused-variable */
import ReactDOM from 'react-dom';
import alert from './alert';
import styles from './alertError.pcss';
export function alertError(option?: { goto?: string }) {
    alert('提示', "系统错误，请重试", [
        {
            text: <div className={styles.alertConfirm} >刷新</div>,
            onPress: () => {
                if (option && option.goto) {
                    location.href = option.goto;
                } else {
                    location.reload();
                }
            },
        },
    ]);
}