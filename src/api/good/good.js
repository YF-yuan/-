import axios from '../api'

export default {

  getGoodList(data) {
    return axios({
      method: "POST",
      url: '/api/good/good/list',
      data: data
    })
  },

  infoGood(goodId) {
    return axios.get('/api/good/good/info/'+goodId)
  },

  enableGood(goodId) {
    return axios.get('/api/good/good/enable/'+goodId)
  },

  forbiddenGood(goodId) {
    return axios.get('/api/good/good/forbidden/'+goodId)
  },




  editGood(params) {
    return axios.post('/api/good/good/edit', params)
  },
  addGood(params) {
    return axios.post('/api/good/good/add', params)
  },

  templateDown(params) {
    return axios.get('/api/good/good/templateDown')
  },

  getEncapList(){
    return axios.get('/api/good/good/encap')
  },

  exportGood(params) {
    return axios({
      method: "POST",
      url: '/api/good/good/export',
      data: params,
      timeout: 1000000
    })
  },


  importGood(params) {
    return axios({
      method: "POST",
      url: '/api/good/good/import',
      data: params,
      timeout: 1000000,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
}
