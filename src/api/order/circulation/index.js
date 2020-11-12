import axios from '../../api'

export default {

  getCirculationList(page,pageSize,params) {
    return axios({
      method: "GET",
      url: '/api/order/circulation/list',
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

  editCirculation(params) {
    return axios.post('/api/order/circulation/edit',params)
  },

}
