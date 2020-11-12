import axios from '../api'

export default {

  getTypeList(parentId) {
    return axios({
      method: "GET",
      url: '/api/good/type/list',
      params: {
        parentId
      }
    })
  },

  infoType(typeId) {
    return axios.get('/api/good/type/info/'+typeId)
  },

  editType(params) {
    return axios.post('/api/good/type/edit', params)
  },
  addType(params) {
    return axios.post('/api/good/type/add', params)
  }
}
