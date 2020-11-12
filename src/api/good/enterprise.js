import axios from '../api'

export default {

  getEnterpriseList(page,pageSize,params) {
    return axios({
      method: "GET",
      url: '/api/good/enterprise/list',
      params: {
        page,
        pageSize,
        ...params
      }
    })
  },

  infoEnterprise(enterpriseId) {
    return axios.get('/api/good/enterprise/info/'+enterpriseId)
  },

  removeEnterprise(enterpriseId) {
    return axios.get('/api/good/enterprise/remove/'+enterpriseId)
  },

  editEnterprise(params) {
    return axios.post('/api/good/enterprise/edit', params)
  },
  addEnterprise(params) {
    return axios.post('/api/good/enterprise/add', params)
  },
}
