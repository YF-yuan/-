import Cookies from 'js-cookie';
import api from '@/api/user/user'
import axios from '@/api/api'

const state = {
  drawerWidth:document.body.clientWidth-200,
  direction: 'rtl',
  menuList: [],
  info: null,
  breadcrumb: [],
  tagList: [],
  permission: {},
  isIndexTag: true,
}

const mutations = {
  SET_MENU: (state, menuList) => {
    state.menuList = menuList
  },
  SET_INFO: (state, info) => {
    state.info = info
  },
  SET_BREADCRUMB: (state, breadcrumb) => {
    state.breadcrumb = breadcrumb
  },
  SET_TAG: (state, tagList) => {
    state.tagList = tagList
  },
  SET_ISINDEX: (state, isIndexTag) => {
    state.isIndexTag = isIndexTag
  },
  SET_PERMISSION: (state, permission) => {
    state.permission = permission
  },
}

const actions = {

  setIsIndexTag({commit, state}, isIndexTag) {
    commit('SET_ISINDEX', isIndexTag)
  },

  setTagList({commit, state}, tagList) {
    commit('SET_TAG', tagList)
  },

  setBreadcrumb({commit, state}, breadcrumb) {
    commit('SET_BREADCRUMB', breadcrumb)
  },


  getMenuList({commit, state},menuList) {
    return new Promise((resolve, reject) => {
      api.getMenu().then(res => {
        if(res.data&&res.data.length>0){
          commit('SET_MENU', res.data)
          let btnList = res.data.filter(item=>item.menuType=='F')
          let permission={}
          btnList.map(item=>{
            if(item.perms){
              permission[item.perms.replace(/:/g,'_')]=true
            }
          })
          console.log(permission)
          commit('SET_PERMISSION',permission)
        }else{
          commit('SET_MENU',[])
          commit('SET_PERMISSION',{})
        }
        resolve(res.data)
      }).catch(e => {
        reject(e)
      })
    })
  },

  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      api.getAdminInfo().then(res => {
        commit('SET_INFO', res.data.user ? res.data.user : {})
        resolve(res.data.info)
      }).catch(e => {
        Cookies.set(location.host+'-token', '')
        commit('SET_INFO', null)
        commit('SET_MENU', [])
        commit('SET_PERMISSION', [])
        location.href = '/login'
        reject(e)
      })
    })
  },

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      Cookies.set(location.host+'-token', '')
      commit('SET_INFO', null)
      commit('SET_MENU', [])
      commit('SET_TAG', [])
      commit('SET_PERMISSION', [])
      resolve()
    })
  },

  // remove token
  resetToken({commit},config) {
    return new Promise(resolve => {
      api.refreshToken(Cookies.get(location.host+'-refreshToken')).then(res => {
        Cookies.set(location.host+'-token', res.access_token);
        Cookies.set(location.host+'-refreshToken', res.refresh_token);
        if(config.method=='get'){
          axios({
            url: config.url,
            method: 'GET',
            params: {
              ...config.params
            },
            headers: config.headers,
            timeout:config.timeout
          }).then(res => {
            resolve(res)
          }).catch(e => {
            Promise.reject(e)
          })
        }else{
          let params=JSON.parse(config.data)
          axios({
            url: config.url,
            method: 'POST',
            data: params,
            headers: config.headers,
            timeout:config.timeout
          }).then(res => {
            resolve(res)
          }).catch(e => {
            Promise.reject(e)
          })
        }
      }).catch(e => {
        Promise.reject(e)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}

