import axios from '../../api'

export default {

  getVersionList(page,pageSize,params) {
    return axios({
      method: "GET",
      url: '/api/order/version/list',
      params: {
        page,
        pageSize,
        ...params
      }
    })
  },

  getEnterpriseList() {
    return axios.get('/api/order/contract/enterprise')
  },

  infoVersion(id) {
    return axios.get('/api/order/version/info/'+id)
  },
}
