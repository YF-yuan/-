import axios from '../../api'

export default {

  getDictList(page,pageSize,parentId){
    return axios({
      method: "GET",
      url: '/api/system/dict/index',
      params: {
        page,
        pageSize,
        parentId
      }
    })
  },

  getDictValue(code){
    return axios({
      method: "GET",
      url: '/api/system/dict/dictValue/'+code,
      params: {
        code
      }
    })
  },

  getListByPid(dictId){
    return axios.get('/api/system/dict/getListByPid/'+dictId)
  },

  removeDict(id){
    return axios({
      method: "GET",
      url: '/api/system/dict/remove/'+id
    })
  },

  addDict(params) {
    return axios.post('/api/system/dict/add', params)
  },
  editDict(params) {
    return axios.post('/api/system/dict/edit', params)
  }
}
