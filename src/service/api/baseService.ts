import axios from 'axios';
import _ from 'lodash';
import { alertError } from '../../pages/component/alert/alertError';
export class BaseService {
    constructor() {
        axios.defaults.responseType = 'json';
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
        axios.defaults.headers.post['token'] = getCookie('token');
        axios.defaults.headers.cache = "no-cache";

        axios.interceptors.response.use((response) => {
            console.log(response);
            return response;
        }, (error) => {
            // Do something with response error
            console.log(error);
            alertError();
            return Promise.reject(error);
        });
    }

}
export function addCookie(name, value, options?) {
    if (arguments.length > 1 && name != null) {
        options = _.assign({ path: '/' }, options || {})
        if (value == null) {
            options.expires = -1;
        }
        if (typeof options.expires === "number") {
            const time = options.expires;
            const expires = options.expires = new Date();
            expires.setTime(expires.getTime() + time * 1000);
        }
        document.cookie = encodeURIComponent(String(name)) + "=" + encodeURIComponent(String(value)) + (options.expires ? "; expires=" + options.expires.toUTCString() : "") + (options.path ? "; path=" + options.path : "") + (options.domain ? "; domain=" + options.domain : ""), (options.secure ? "; secure" : "");
    }
}
// 获取Cookie
export function getCookie(name) {
    if (name != null) {
        const value = new RegExp("(?:^|; )" + encodeURIComponent(String(name)) + "=([^;]*)").exec(document.cookie);
        return value ? decodeURIComponent(value[1]) : null;
    }
}
// 移除Cookie
export function removeCookie(name, options?) {
    addCookie(name, null, options);
}
