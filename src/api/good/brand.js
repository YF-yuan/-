import axios from '../api'

export default {

  getBrandList(page,pageSize,params) {
    return axios({
      method: "GET",
      url: '/api/good/brand/list',
      params: {
        page,
        pageSize,
        ...params
      }
    })
  },

  getBrandAll() {
    return axios.get('/api/good/brand/getAll')
  },

  exportBrand(params) {
    return axios({
      method: "GET",
      url: '/api/good/brand/export',
      params: {
        ...params
      }
    })
  },

  infoBrand(brandId) {
    return axios.get('/api/good/brand/info/'+brandId)
  },

  removeBrand(brandId) {
    return axios.get('/api/good/brand/remove/'+brandId)
  },

  enableBrand(brandId) {
    return axios.get('/api/good/brand/enable/'+brandId)
  },

  forbiddenBrand(brandId) {
    return axios.get('/api/good/brand/forbidden/'+brandId)
  },




  editBrand(params) {
    return axios.post('/api/good/brand/edit', params)
  },
  addBrand(params) {
    return axios.post('/api/good/brand/add', params)
  },
}
