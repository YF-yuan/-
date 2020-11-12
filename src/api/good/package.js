import axios from '../api'

export default {

  getPackageList(page,pageSize,params) {
    return axios({
      method: "GET",
      url: '/api/good/package/list',
      params: {
        page,
        pageSize,
        ...params
      }
    })
  },

  getPackageAll() {
    return axios.get('/api/good/package/getAll')
  },

  infoPackage(packageId) {
    return axios.get('/api/good/package/info/'+packageId)
  },

  removePackage(packageId) {
    return axios.get('/api/good/package/remove/'+packageId)
  },

  enablePackage(packageId) {
    return axios.get('/api/good/package/enable/'+packageId)
  },

  forbiddenPackage(packageId) {
    return axios.get('/api/good/package/forbidden/'+packageId)
  },




  editPackage(params) {
    return axios.post('/api/good/package/edit', params)
  },
  addPackage(params) {
    return axios.post('/api/good/package/add', params)
  },
}
