<template>
    <div class="main-box contract-list">
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item label="合同编号">
                <el-input
                        clearable
                        maxlength="30"
                        v-model="searchParam.contractCode"
                        size="small"
                        placeholder="请输入合同编号"
                        style="width: 200px"
                />
            </el-form-item>
            <el-form-item label="产品名称">
                <el-input
                        clearable
                        maxlength="30"
                        v-model="searchParam.productName"
                        size="small"
                        placeholder="请输入产品名称"
                        style="width: 200px"
                />
            </el-form-item>
            <el-form-item label="客户简称">
                <el-select style="width: 200px" filterable clearable size="small" v-model="searchParam.enterpriseId">
                    <el-option :key="index" :label="item.shortName" :value="item.enterpriseId"
                               v-for="(item,index) in enterpriseList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-select style="width: 200px" filterable clearable size="small" v-model="searchParam.status">
                    <el-option :key="index" :label="item.dictValue" :value="item.dictKey"
                               v-for="(item,index) in statusList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="负责人">
                <el-select style="width: 200px" filterable clearable size="small" v-model="searchParam.headerId">
                    <el-option :key="index" :label="item.nickname" :value="item.userId"
                               v-for="(item,index) in userList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button
                        :loading="tableLoading"
                        icon="el-icon-search"
                        @click="search"
                        size="small"
                        type="primary"
                >搜索
                </el-button>
                <el-button
                        icon="el-icon-refresh-right"
                        @click="count=0;initSearchParam();search()"
                        type="primary"
                        size="small"
                        style="background-color: #fff; border: 1px solid #ccc ; color: #666"
                >清空
                </el-button>
            </el-form-item>
        </el-form>
        <div style="margin-bottom: 10px">
        <el-button
                v-if="permission.order_contract_add"
                icon="el-icon-plus"
                @click="addContractList"
                size="small"
                type="primary"
        >添加
        </el-button>
    </div>
        <el-table highlight-current-row @current-change="rowClick" :span-method="objectSpanMethod" ref="table" :height="tableHeight" size="medium" v-loading="tableLoading" :data="dataList" border>
            <el-table-column :index="indexMethod" label="序号" type="index" width="80" align="center"/>
            <el-table-column min-width="140" align="center" prop="contractCode" label="合同编号"></el-table-column>
            <el-table-column min-width="100" align="center" prop="productName" label="产品名称"></el-table-column>
            <el-table-column min-width="100" align="center" prop="enterpriseName" label="客户简称"></el-table-column>
            <el-table-column min-width="110" align="center" prop="number" label="数量"></el-table-column>
            <el-table-column min-width="100" align="center" prop="amount" label="金额"></el-table-column>
            <el-table-column min-width="110" align="center" prop="signTime" label="签订日期"></el-table-column>
            <el-table-column min-width="120" align="center" prop="status" label="状态">
                <template slot-scope="{row}">
                    <span>{{getStatusName(row.status)}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="100" align="center" prop="headerName" label="负责人"></el-table-column>
            <el-table-column min-width="120" align="center" prop="checkStatus" label="审批状态">
                <template slot-scope="{row}">
                    <span v-if="row.checkStatus">{{getCheckStatusName(row.checkStatus)}}</span>
                </template>
            </el-table-column>
            <el-table-column width="170" label="操作">
                <template slot-scope="{row}">
                    <el-button v-if="permission.order_contract_edit&&permission.order_contract_info&&(row.checkStatus==1||row.checkStatus==5)"
                               @click="editContractList(row)"
                               type="primary" size="mini" icon="el-icon-edit">编辑
                    </el-button>
                    <el-button v-if="permission.order_contract_submit&&permission.order_contract_info&&(row.checkStatus==1||row.checkStatus==5)"
                               @click="submitContractList(row)"
                               type="primary" size="mini" icon="el-icon-edit">提交审批
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-current">
            <div style="font-size: 16px;font-weight: bold">
               <span>合同数量：{{contractNumber}}</span> <span style="margin-left: 20px">产品数量：{{productNumber}} </span><span style="margin-left: 20px">合同金额：{{contractAmount}}</span>
            </div>
            <el-pagination
                    :current-page="page"
                    :page-size="pageSize"
                    prev-text="上一页"
                    next-text="下一页"
                    background
                    layout="total, prev, pager, next, jumper"
                    style="display: inline-block;"
                    :total="count"
                    @current-change="handleCurrentChange"
            />
        </div>
        <contracyForm
                :isSubmit="isShow"
                :isShow="isShow"
                :contractId="contractId"
                v-if="visible"
                :visible="visible"
                @returnBack="visible=false"
                :enterpriseList="enterpriseList"
                :userList="userList"
                @successSubmit="visible=false;getContractList()"
        >

        </contracyForm>
        <detailForm
            v-if="contractId"
            :contractId="contractId"
            :enterpriseList="enterpriseList"
            :productData="productData"
            @successSubmit="getContractList()"
        >

        </detailForm>
    </div>
</template>

<script>
    import api from "@/api/order/contract/list";
    import dictApi from '@/api/system/dict/dict'
    import {mapGetters} from "vuex";
    import contracyForm from './contractForm'
    import detailForm from './detailForm'

    export default {
        name: "contract-list",
        data() {
            return {
                contractAmount:0,
                contractNumber:0,
                productNumber:0,
                searchParam: {
                    contractCode: '',
                    productName: '',
                    enterpriseId: '',
                    status: '',
                    headerId: ''
                },
                count: 0,
                page: 1,
                pageSize: parseInt((document.body.clientHeight - 380 - 43) / 44.5),
                tableHeight: document.body.clientHeight - 380,
                tableLoading: false,
                dataList: [],
                visible: false,
                contractId: 0,
                productData:{},
                enterpriseList: [],
                userList: [],
                statusList: [],
                checkStatusList:[],
                isShow:false
            };
        },
        mounted() {
            this.getContractList()
            this.getEnterpriseList()
            this.getAllUser()
            this.getDictValue('productStatus')
            this.getDictValue('contractCheckStatus')
        },
        computed: {
            ...mapGetters(["direction", "drawerWidth", "permission"])
        },
        components: {contracyForm,detailForm},
        methods: {
            rowClick(row){
                    this.contractId=0
                    this.$nextTick(function () {
                        console.log(row)
                        this.productData=Object.assign({},row)
                        this.contractId=row.contractId
                    })
            },
            objectSpanMethod({row, column, rowIndex, columnIndex}) {
                if (columnIndex === 1||columnIndex === 3||columnIndex === 6||columnIndex === 8) {
                    if (row.span) {
                        return {
                            rowspan: row.span,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
            },
            getCheckStatusName(checkStatus) {
                let child = this.checkStatusList.find(item => item.dictKey == checkStatus)
                if (child) {
                    return child.dictValue
                } else {
                    return ''
                }
            },
            getStatusName(status) {
                let child = this.statusList.find(item => item.dictKey == (status+''))
                if (child) {
                    return child.dictValue
                } else {
                    return ''
                }
            },
            indexMethod(index) {
                return index + 1 + (this.page - 1) * this.pageSize;
            },
            getDictValue(code) {
                dictApi.getDictValue(code).then(res => {
                    if(code=='contractCheckStatus'){
                        this.checkStatusList=res.data ? res.data : []
                    }else{
                        this.statusList = res.data ? res.data : []
                    }
                }).catch(e => {
                });
            },
            getAllUser() {
                api.getAllUser().then(res => {
                    this.userList = res.data ? res.data : []
                }).catch(e => {
                    this.userList = []
                });
            },
            getEnterpriseList() {
                api.getEnterpriseList().then(res => {
                    this.enterpriseList = res.data ? res.data : []
                }).catch(e => {
                    this.enterpriseList = []
                });
            },
            initSearchParam() {
                this.searchParam = {
                    contractCode: '',
                    productName: '',
                    enterpriseId: '',
                    status: '',
                    headerId: ''
                }
            },
            submitContractList(row) {
                this.isShow=true
                this.contractId = row.contractId;
                this.$nextTick(function () {
                    this.visible = true;
                })
            },
            editContractList(row) {
                this.isShow=false
                this.contractId = row.contractId;
                this.$nextTick(function () {
                    this.visible = true;
                })
            },
            addContractList() {
                this.isShow=false
                this.contractId = 0;
                this.$nextTick(function () {
                    this.visible = true;
                });
            },
            successSubmit() {
                this.visible = false;
                this.getContractList();
            },
            search() {
                this.page = 1
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.count = 1
                this.getContractList()
            },
            handleCurrentChange(val) {
                this.page = val
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.getContractList()
            },
            getContractList() {
                this.tableLoading = true;
                this.contractId=0
                api.getContractList(this.page, this.pageSize, this.searchParam).then(res => {
                    const {records, total,contractAmount,contractNumber,productNumber} = res.data
                    let contractId = "";
                    records.map(item => {
                        if (item.contractId != contractId) {
                            contractId = item.contractId;
                            item.span = records.filter(
                                child => child.contractId == contractId
                            ).length;
                        }
                    });
                    this.dataList =records
                    this.count = total ? parseInt(total) : 0
                    this.contractAmount=contractAmount?contractAmount:0
                    this.contractNumber=contractNumber?contractNumber:0
                    this.productNumber=productNumber?productNumber:0
                    this.tableLoading = false;
                }).catch(e => {
                    this.contractAmount=0
                    this.contractNumber=0
                    this.productNumber=0
                    this.dataList = []
                    this.tableLoading = false;
                });
            }
        }
    };
</script>

<style lang="less">
    .contract-list {
        height: auto;
        .page-current{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
</style>
