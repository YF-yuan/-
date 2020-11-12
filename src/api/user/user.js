import axios from '../api'
import user from '../../store/modules/user'

const client_id = 'web'
const client_secret = '123456'
const grant_type = 'password'
const scope = 'server'
const refresh_grant_type='refresh_token'


export default {
    refreshToken(refresh_token) {
        return axios({
            url: "/api/auth/oauth/token",
            method: "post",
            params: {
                grant_type:refresh_grant_type,
                refresh_token,client_id, client_secret, scope
            }
        })
    },
    login(params) {
        return axios({
            url: "/api/auth/oauth/token",
            method: "post",
            params: {
                ...params,
                client_id, client_secret, grant_type, scope
            }
        })
    },
    getCaptcha(params) {
        return axios({
            method: "GET",
            url: '/api/login/captcha',
            params: params
        })
    },

    logout(params) {
        return axios({
            method: "GET",
            url: '/api/login/logout',
            params: params
        })
    },

    getAdminInfo(params) {
        return axios({
            method: "GET",
            url: '/api/system/user/getInfo',
            params: params
        })
    },

    updatePwd(params) {
        return axios({
            method: "POST",
            url: '/api/system/user/editPwd',
            data: params
        })
    },

    getMenu(params) {
        return axios({
            method: "GET",
            url: '/api/system/menu/getRoutes',
            params: params
        })
    },

    upload(params) {
        return axios({
            method: "POST",
            url: '/api/file/upload/index',
            data: params,
            timeout: 1000000,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },

    uploadFile(params) {
        return axios({
            method: "POST",
            url: '/admin/upload/uploadFile',
            data: params,
            timeout: 1000000,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}
