import axios from '../../api'

export default {

  getConfigList(page,pageSize) {
    return axios({
      method: "GET",
      url: '/api/system/config/index',
      params: {
        page,
        pageSize
      }
    })
  },

  dropConfig(id){
    return axios({
      method: "GET",
      url: '/api/system/config/remove/'+id,
    })
  },


  editConfig(params) {
    return axios.post('/api/system/config/edit', params)
  },
  addConfig(params) {
    return axios.post('/api/system/config/add', params)
  }
}
