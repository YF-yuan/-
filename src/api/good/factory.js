import axios from '../api'

export default {

  getFactoryList(page,pageSize,params) {
    return axios({
      method: "GET",
      url: '/api/good/factory/list',
      params: {
        page,
        pageSize,
        ...params
      }
    })
  },

  exportFactory(params) {
    return axios({
      method: "GET",
      url: '/api/good/factory/export',
      params: {
        ...params
      }
    })
  },

  getFactoryAll() {
    return axios.get('/api/good/factory/getAll')
  },

  infoFactory(factoryId) {
    return axios.get('/api/good/factory/info/'+factoryId)
  },

  removeFactory(factoryId) {
    return axios.get('/api/good/factory/remove/'+factoryId)
  },

  enableFactory(factoryId) {
    return axios.get('/api/good/factory/enable/'+factoryId)
  },

  forbiddenFactory(factoryId) {
    return axios.get('/api/good/factory/forbidden/'+factoryId)
  },


  editFactory(params) {
    return axios.post('/api/good/factory/edit', params)
  },
  addFactory(params) {
    return axios.post('/api/good/factory/add', params)
  },
}
