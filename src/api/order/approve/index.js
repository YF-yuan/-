import axios from '../../api'

export default {

  getApproveList(page,pageSize,params) {
    return axios({
      method: "GET",
      url: '/api/order/approve/list',
      params: {
        page,
        pageSize,
        ...params
      }
    })
  },
  getRoleList() {
    return axios.get('/api/order/approve/roleList')
  },
  editApprove(params) {
    return axios.post('/api/order/approve/edit',params)
  },

}
