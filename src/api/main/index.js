import axios from '../api'

export default {

  getUntreatedList(page,pageSize,params) {
    return axios({
      method: "GET",
      url: '/api/order/approve/untreated',
      params: {
        page,
        pageSize,
        ...params
      }
    })
  },

  getTreatedList(page,pageSize,params) {
    return axios({
      method: "GET",
      url: '/api/order/approve/treated',
      params: {
        page,
        pageSize,
        ...params
      }
    })
  },

  getDetail(snapshotId) {
    return axios({
      method: "GET",
      url: '/api/order/approve/detail',
      params: {
        snapshotId
      }
    })
  },

  deal(params) {
    return axios.post('/api/order/approve/deal',params)
  },

  approveStatus(snapshotId) {
    return axios({
      method: "GET",
      url: '/api/order/approve/status',
      params: {
        snapshotId
      }
    })
  },

}
