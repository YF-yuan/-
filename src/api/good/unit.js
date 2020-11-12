import axios from '../api'

export default {

  getUnitList(page,pageSize,params) {
    return axios({
      method: "GET",
      url: '/api/good/unit/list',
      params: {
        page,
        pageSize,
        ...params
      }
    })
  },

  getUnitAll() {
    return axios.get('/api/good/unit/getAll')
  },

  infoUnit(unitId) {
    return axios.get('/api/good/unit/info/'+unitId)
  },

  removeUnit(unitId) {
    return axios.get('/api/good/unit/remove/'+unitId)
  },

  enableUnit(unitId) {
    return axios.get('/api/good/unit/enable/'+unitId)
  },

  forbiddenUnit(unitId) {
    return axios.get('/api/good/unit/forbidden/'+unitId)
  },




  editUnit(params) {
    return axios.post('/api/good/unit/edit', params)
  },
  addUnit(params) {
    return axios.post('/api/good/unit/add', params)
  },
}
