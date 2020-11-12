import axios from '../../api'

export default {

  getUserList(page,pageSize) {
    return axios({
      method: "GET",
      url: '/api/system/user/index',
      params: {
        page,
        pageSize
      }
    })
  },

  dropUser(id){
    return axios({
      method: "GET",
      url: '/api/system/user/forbidden/'+id,
    })
  },

  getUserInfo(userId){
    return axios({
      method: "GET",
      url: '/api/system/user/detail/'+userId,
    })
  },

  resetPwd(id){
    return axios({
      method: "GET",
      url: '/api/system/user/resetPwd/'+id,
    })
  },

  editUser(params) {
    return axios.post('/api/system/user/edit', params)
  },
  addUser(params) {
    return axios.post('/api/system/user/add', params)
  }
}
