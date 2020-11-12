<template>
    <div class="main-box bom-list">
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
        <el-table  :span-method="objectSpanMethod" ref="table"
                  :height="tableHeight" size="medium" v-loading="tableLoading" :data="dataList" border>
            <el-table-column :index="indexMethod" label="序号" type="index" width="80" align="center"/>
            <el-table-column min-width="140" align="center" prop="contractCode" label="合同编号"></el-table-column>
            <el-table-column min-width="100" align="center" prop="productName" label="产品名称"></el-table-column>
            <el-table-column min-width="100" align="center" prop="enterpriseName" label="客户简称"></el-table-column>
            <el-table-column min-width="110" align="center" prop="signTime" label="签订日期"></el-table-column>
            <el-table-column min-width="100" align="center" prop="headerName" label="负责人"></el-table-column>
            <el-table-column min-width="120" align="center" prop="checkStatus" label="审批状态">
                <template slot-scope="{row}">
                    <span v-if="row.bomStatus">{{getCheckStatusName(row.bomStatus)}}</span>
                </template>
            </el-table-column>
            <el-table-column width="240" label="操作">
                <template slot-scope="{row}">
                    <el-button
                            v-if="permission.order_bom_info"
                            @click="lookshow(row)"
                            type="primary" size="mini" icon="el-icon-view">查看
                    </el-button>
                    <el-button
                            v-if="permission.order_bom_add&&(row.bomStatus==1||row.bomStatus==5)"
                            @click="add(row)"
                            type="primary" size="mini" icon="el-icon-edit">转化
                    </el-button>
                    <el-button
                            @click="checkinfo(row)"
                            v-if="(row.bomStatus==2||row.bomStatus==3||row.bomStatus==4)&&permission.order_bom_checkinfo"
                            type="primary" size="mini" icon="el-icon-view">审批进度
                    </el-button>
                    <el-button
                            @click="check(row)"
                            v-if="(row.bomStatus==1||row.bomStatus==5)&&permission.order_bom_submit"
                            type="primary" size="mini" icon="el-icon-edit">提交审批
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-current">
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
        <bomForm
                :isCheck="isCheck"
                :isShow="isShow"
                v-if="visible"
                :visible="visible"
                :productData="productData"
                @returnBack="visible=false"
                @successSubmit="visible=false;getBomList()"
        >
        </bomForm>
        <checkForm
                v-if="checkVisible"
                :visible="checkVisible"
                :detailId="detailId"
                @returnBack="checkVisible=false"
        >

        </checkForm>
    </div>
</template>

<script>
    import api from "@/api/order/bom/list";
    import contractApi from "@/api/order/contract/list";
    import dictApi from '@/api/system/dict/dict'
    import {mapGetters} from "vuex";
    import bomForm from './bomForm'
    import checkForm from './checkForm'

    export default {
        name: "bom-list",
        data() {
            return {
                detailId:0,
                checkVisible:false,
                productData: {},
                searchParam: {
                    contractCode: '',
                    productName: '',
                    enterpriseId: '',
                    headerId: ''
                },
                count: 0,
                page: 1,
                pageSize: parseInt((document.body.clientHeight - 290 - 43) / 44.5),
                tableHeight: document.body.clientHeight - 290,
                tableLoading: false,
                dataList: [],
                visible: false,
                contractId: 0,
                enterpriseList: [],
                userList: [],
                checkStatusList: [],
                isShow: false,
                isCheck: 0
            };
        },
        mounted() {
            this.getBomList()
            this.getEnterpriseList()
            this.getAllUser()
            this.getDictValue('bomCheckStatus')
        },
        computed: {
            ...mapGetters(["direction", "drawerWidth", "permission"])
        },
        components: {bomForm,checkForm},
        methods: {
            checkinfo(row){
                this.detailId = row.detailId
                this.$nextTick(function () {
                    this.checkVisible = true
                })
            },
            objectSpanMethod({row, column, rowIndex, columnIndex}) {
                if (columnIndex === 1 || columnIndex === 3 || columnIndex === 5) {
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
            getCheckStatusName(bomStatus) {
                let child = this.checkStatusList.find(item => item.dictKey == bomStatus)
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
                    this.checkStatusList = res.data ? res.data : []
                }).catch(e => {
                });
            },
            getAllUser() {
                contractApi.getAllUser().then(res => {
                    this.userList = res.data ? res.data : []
                }).catch(e => {
                    this.userList = []
                });
            },
            getEnterpriseList() {
                contractApi.getEnterpriseList().then(res => {
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
                    headerId: ''
                }
            },
            check(row) {
                this.productData = JSON.parse(JSON.stringify(row))
                this.isShow = true
                this.isCheck = 1
                this.$nextTick(function () {
                    this.visible = true;
                })
            },
            lookshow(row) {
                this.productData = JSON.parse(JSON.stringify(row))
                this.isShow = true
                this.isCheck = 0
                this.$nextTick(function () {
                    this.visible = true;
                })
            },
            add(row) {
                this.isShow = false
                this.isCheck = 0
                this.productData = JSON.parse(JSON.stringify(row))
                this.$nextTick(function () {
                    this.visible = true;
                })
            },
            successSubmit() {
                this.visible = false;
                this.getBomList();
            },
            search() {
                this.page = 1
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.count = 1
                this.getBomList()
            },
            handleCurrentChange(val) {
                this.page = val
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.getBomList()
            },
            getBomList() {
                this.tableLoading = true;
                this.contractId = 0
                api.getBomList(this.page, this.pageSize, this.searchParam).then(res => {
                    const {records, total} = res.data
                    let contractId = "";
                    records.map(item => {
                        if (item.contractId != contractId) {
                            contractId = item.contractId;
                            item.span = records.filter(
                                child => child.contractId == contractId
                            ).length;
                        }
                    });
                    this.dataList = records
                    this.count = total ? parseInt(total) : 0
                    this.tableLoading = false;
                }).catch(e => {
                    this.dataList = []
                    this.tableLoading = false;
                });
            }
        }
    };
</script>

<style lang="less">
    .bom-list {
        height: auto;
    }
</style>
