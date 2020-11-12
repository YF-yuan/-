import axios from '../../api'

export default {

  getGenList(params){
    return axios({
      method: "GET",
      url: '/api/tool/gen/index',
      params: {
        ...params
      }
    })
  },

  getTables(params){
    return axios({
      method: "GET",
      url: '/api/tool/gen/tables',
      params:{
        ...params
      }
    })
  },

  importTable(tableName){
    return axios({
      method: "GET",
      url: '/api/tool/gen/importTable',
      params:{
        tableName
      }
    })
  },

  columns(tableId){
    return axios({
      method: "GET",
      url: '/api/tool/gen/columns',
      params:{
        tableId
      }
    })
  },

  genCode(tableName){
    return axios({
      method: "GET",
      url: '/api/tool/gen/genCode',
      params:{
        tableName
      }
    })
  },

  editColumn(params) {
    return axios.post('/api/tool/gen/editColumn', params)
  },

  remove(tableIds){
    return axios({
      method: "DELETE",
      url: '/api/tool/gen/remove',
      params:{
        tableIds
      }
    })
  },
}
