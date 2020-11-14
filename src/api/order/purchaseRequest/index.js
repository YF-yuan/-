import axios from '../../api'

export default {
    // 获取采购申请页面列表
    getApplyList (pages,size) {
        return axios({
            method: "GET", 
            url: '/api/order/apply/list',
            params: {
                pages,
                size
                // contractCode
            }
        })
    },
    // 添加申请
    addApply (params) {
        return axios.post('/api/order/apply/add', params)
    },
    // 编辑
    editApply (params) {
        return axios.post('/api/order/apply/edit',params)
    },
    // 查看详情
    infoApply (applyId) {
        return axios({
            method: "GET",
            url: '/api/order/apply/info',
            params: {
                applyId
            }
        })
    },
    // 提交审批
    submitApply (params) {
        return axios.post('/api/order/apply/submit',params)
    },
    // 获取全部合同数组
    getContractList () {
        return axios({
            method: "GET",
            url: '/api/order/contract/getContractByCode',
        })
    },
    // 根据合同编码获取相应合同数组
    getContractByCode (contractCode) {
        return axios({
            method: "GET",
            url: '/api/order/contract/getContractByCode',
            params: {
                contractCode
            }
        })
    },
    // 获取合同元器件数据
    getProduct (contractId) {
        return axios({
            method: "GET",
            url: '/api/order/contract/product',
            params: {
                contractId
            }
        })
    },
    // 导入物料
    importFile (file) {
        return axios.post('/api/order/apply/import',file)
    },
    // 查看审批进度
    checkInfo (applyId) {
        return axios({
            method: 'GET',
            url: '/order/apply/checkinfo',
            params: {
                applyId
            }
        })
    }
}