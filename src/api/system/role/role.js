import axios from '../../api'

export default {

  getRoleList(page,pageSize) {
    return axios({
      method: "GET",
      url: '/api/system/role/index',
      params: {
        page,
        pageSize
      }
    })
  },

  dropRole(id){
    return axios({
      method: "GET",
      url: '/api/system/role/drop/'+id,
    })
  },


  getRoleInfo(id){
    return axios({
      method: "GET",
      url: '/api/system/role/info/'+id,
    })
  },
  getAllGroup(){
    return axios({
      method: "GET",
      url: '/api/system/role/all',
      params: {}
    })
  },

  editRole(params) {
    return axios.post('/api/system/role/edit', params)
  },
  addRole(params) {
    return axios.post('/api/system/role/add', params)
  }
}
