import axios from 'axios'
import Cookies from 'js-cookie';
import {Notification, MessageBox} from 'element-ui';
import store from '../store'


axios.defaults.timeout = 15000

//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;

//返回其他状态吗
axios.defaults.validateStatus = function (status) {
    return status >= 200 && status <= 500; // 默认的
};


axios.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = 'application/json;charset=utf-8'
        config.headers['Authorization'] = "Bearer " + (Cookies.get(location.host + '-token') ? Cookies.get(location.host + '-token') : '')
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

axios.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        if (response.status == 200) {
            const res = response.data
            if (response.config.url == "/api/auth/oauth/token") {
                return res
            }
            if (res.code != 200) {
                Notification.error({
                    title: '错误',
                    message: res.msg,
                    duration: 5 * 1000
                });
                if (res.code == 401) {
                    store.dispatch('user/resetToken', response.config).then(resq => {
                        return resq
                    }).catch(e => {
                        Promise.reject(e)
                    })
                } else {
                    return Promise.reject(new Error(res.msg || 'Error'))
                }
            } else {
                return res
            }
        } else {
            const res = response.data
            let error = res.msg ? res.msg : res
            if (response.status == 500) {
                error = '服务超时'
            } else if (response.status == 404) {
                error = '接口未定义'
            }
            Notification.error({
                title: '错误',
                message: error
            });
            return Promise.reject(new Error(error))
        }
    },
    error => {
        console.log(error)
        Notification.error({
            title: '错误',
            message: '服务超时'
        });
        return Promise.reject(error)
    }
)

export default axios

