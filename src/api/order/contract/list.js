import axios from '../../api'

export default {

  getContractList(page,pageSize,params) {
    return axios({
      method: "GET",
      url: '/api/order/contract/list',
      params: {
        page,
        pageSize,
        ...params
      }
    })
  },

  getEnterpriseList() {
    return axios.get('/api/order/contract/enterprise')
  },

  getAllUser() {
    return axios.get('/api/order/contract/getAllUser')
  },

  infoContract(contractId) {
    return axios.get('/api/order/contract/info/'+contractId)
  },

  submitContract(params) {
    return axios.post('/api/order/contract/submit',params)
  },

  cancelContract(params) {
    return axios.post('/api/order/contract/cancel',params)
  },

  editContract(params) {
    return axios.post('/api/order/contract/edit', params)
  },
  addContract(params) {
    return axios.post('/api/order/contract/add', params)
  },

  checkinfo(contractId) {
    return axios({
      method: "GET",
      url: '/api/order/contract/checkinfo',
      params: {
        contractId
      }
    })
  }

}
