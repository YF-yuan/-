import axios from '../../api'

export default {

  getBomList(page,pageSize,params) {
    return axios({
      method: "GET",
      url: '/api/order/bom/list',
      params: {
        page,
        pageSize,
        ...params
      }
    })
  },

  getBomGood(goodCode) {
    return axios({
      method: "GET",
      url: '/api/order/bom/good',
      params: {
        goodCode
      }
    })
  },

  getBomInfo(productId) {
    return axios({
      method: "GET",
      url: '/api/order/bom/info',
      params: {
        productId
      }
    })
  },

  getBomInInfo(productId,version) {
    return axios({
      method: "GET",
      url: '/api/order/bom/bomInfo',
      params: {
        productId,
        version
      }
    })
  },

  checkinfo(detailId) {
    return axios({
      method: "GET",
      url: '/api/order/bom/checkinfo',
      params: {
        detailId
      }
    })
  },

  submitBom(params) {
    return axios.post('/api/order/bom/submit',params)
  },

  addBom(params) {
    return axios.post('/api/order/bom/add', params)
  },

  bomVersion(productId) {
    return axios({
      method: "GET",
      url: '/api/order/bom/version',
      params: {
        productId
      }
    })
  }

}
