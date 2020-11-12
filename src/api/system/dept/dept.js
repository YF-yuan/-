import axios from '../../api'

export default {

  getDeptList(params) {
    return axios({
      method: "GET",
      url: '/api/system/dept/index',
      params:{
        ...params
      }
    })
  },

  getDeptAllList(params) {
    return axios.get('/api/system/dept/all', params)
  },

  dropDept(id){
    return axios({
      method: "GET",
      url: '/api/system/dept/remove/'+id
    })
  },

  getDeptInfo(id){
    return axios({
      method: "GET",
      url: '/api/system/dept/info/'+id
    })
  },

  getListByPid(pid){
    return axios({
      method: "GET",
      url: '/api/system/dept/getChildList/'+pid,
    })
  },

  editDept(params) {
    return axios.post('/api/system/dept/edit', params)
  },
  addDept(params) {
    return axios.post('/api/system/dept/add', params)
  }
}
