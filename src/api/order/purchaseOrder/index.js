import axios from "../../api"

export default{
    getPurchaseOrderList(page,pageSize,params){
        return axios({
            method:"GET",
            url:'/api/order/purchase/list',
            params:{
                page,
                pageSize,
                ...params
            }
        })
    },
    getPurchaseOrderInfo(purchaseId){
        return axios.get('/api/order/purchase/'+purchaseId)
    },
    editPurchaseOrder(params){
        return axios.post('/api/order/purchase/edit',params)
    },
    submitPruchase(params){
        return axios.post('/api/order/purchase/submit',params)
    },
    checkInfo(params){
        return axios.get('/api/order/purchase/checkinfo',{params})
    }
}