import axios from '../api'

export default {

  getKeyList(page,pageSize,params) {
    return axios({
      method: "GET",
      url: '/api/good/key/list',
      params: {
        page,
        pageSize,
        ...params
      }
    })
  },

  editKey(params) {
    return axios.post('/api/good/key/edit',params)
  },

  getAttributeKeyList(typeTwoId) {
    return axios.get('/api/good/key/getAttributeKeyList/'+typeTwoId)
  },
}
