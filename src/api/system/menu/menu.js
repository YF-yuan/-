import axios from '../../api'

export default {

  getMenuList(params) {
    return axios.get('/api/system/menu/index', params)
  },

  dropMenu(id){
    return axios({
      method: "GET",
      url: '/api/system/menu/drop/'+id
    })
  },

  getListByPid(pid){
    return axios({
      method: "GET",
      url: '/api/system/menu/getChildList/'+pid,
    })
  },

  editMenu(params) {
    return axios.post('/api/system/menu/edit', params)
  },
  addMenu(params) {
    return axios.post('/api/system/menu/add', params)
  }
}
