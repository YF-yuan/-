<template>
    <div class="detail-form">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="详情" :name="1">
                <el-form
                        :inline="true"
                        v-loading="loading"
                        ref="info"
                        :model="info"
                        size="small"
                        label-width="130px"
                >
                    <el-row>
                        <el-form-item
                                prop="enterpriseId"
                                label="客户名称"
                        >
                            <el-select :disabled="true" @change="enterpriseChange" style="width: 300px" filterable
                                       clearable
                                       size="small"
                                       v-model="info.enterpriseId">
                                <el-option :key="index" :label="item.enterpriseName" :value="item.enterpriseId"
                                           v-for="(item,index) in enterpriseList"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                                prop="shortName"
                                label="客户简称"
                        >
                            <el-input
                                    :disabled="true"
                                    maxlength="30"
                                    clearable
                                    v-model="info.shortName"
                                    size="small"
                                    style="width: 300px"
                            />
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item
                                prop="contractCode"
                                label="合同编号"
                        >
                            <el-input
                                    :disabled="true"
                                    maxlength="30"
                                    clearable
                                    v-model="info.contractCode"
                                    size="small"
                                    style="width: 300px"
                            />
                        </el-form-item>
                        <el-form-item
                                prop="customerCode"
                                label="客户合同编号"
                        >
                            <el-input
                                    :disabled="true"
                                    maxlength="30"
                                    clearable
                                    v-model="info.customerCode"
                                    size="small"
                                    style="width: 300px"
                            />
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item
                                prop="signTime"
                                label="签订日期"
                        >
                            <el-date-picker
                                    :disabled="true"
                                    style="width: 300px"
                                    clearable
                                    size="small"
                                    value-format="yyyy-MM-dd"
                                    v-model="info.signTime"
                                    type="date"
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item
                                prop="headerId"
                                label="负责人"
                                :rules="{ required: true, message: '客户名称不能为空', trigger: 'change' }"
                        >
                            <el-input style="width: 300px" :disabled="true" v-model="info.headerName"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item
                                prop="signTime"
                                label="合同"
                        >
                            <div style="width: 300px">
                                <a :href="info.filePath" target="_blank">{{info.fileName}}</a>
                            </div>
                        </el-form-item>
                        <el-form-item
                                prop="headerId"
                                label="pcb文件"
                        >
                            <div style="width: 300px">
                                <a :href="info.pcbFilePath" target="_blank">{{info.pcbFileName}}</a>

                            </div>
                        </el-form-item>
                    </el-row>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="BOM" :name="2">
                <el-form :inline="true" :model="productData" class="demo-form-inline">
                    <el-form-item label="产品名称">
                        <el-input style="width: 300px" v-model="productData.productName" :disabled="true" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="版本号">
                        <el-input style="width: 100px" v-model="productData.bomVersion" :disabled="true" size="small"></el-input>
                    </el-form-item>
                </el-form>
                <el-table
                        v-loading="tableloading"
                        :data="bomList"
                        style="width: 100%;margin-top: 20px;"
                        row-key="bomId"
                        border
                        default-expand-all
                        :tree-props="{children: 'childList'}">
                    <el-table-column
                            prop="name"
                            label="标签"
                            min-width="150">
                        <template slot-scope="{row,$index}">
                            <span>阶层{{row.level}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="编码"
                            min-width="180">
                        <template slot-scope="{row,$index}">
                            <span>{{row.goodCode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="goodName"
                            label="名称"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="goodModel"
                            label="型号"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="encap"
                            label="封装"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="unitName"
                            label="单位"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            label="用量"
                            align="center"
                            min-width="100">
                        <template slot-scope="{row,$index}">
                            <span>{{row.number}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="客户bom描述"
                            align="center"
                            min-width="160">
                        <template slot-scope="{row,$index}">
                            <span>{{row.description}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="属性"
                            align="center"
                            min-width="160">
                        <template slot-scope="{row,$index}">
                            <span>{{row.attribute}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="位号"
                            align="center"
                            min-width="100">
                        <template slot-scope="{row,$index}">
                            <span>{{row.tag}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane v-if="productData.checkStatus==4&&productData.status" label="取消" :name="3">
                <h5>取消此产品所在合同订单{{info.contractCode}}，合同下所有产品均取消</h5>
                <h5>请确认</h5>
                <el-input
                        style="width: 500px"
                        maxlength="200"
                        show-word-limit
                        size="small"
                        type="textarea"
                        :rows="6"
                        placeholder="意见"
                        v-model="dealRemark">
                </el-input>
                <br/>
                <div style="width:500px;text-align: center;margin-top: 10px">
                    <el-button
                            :loading="submitLoading"
                            @click="cancelContract"
                            type="primary"
                            size="medium"
                    >确定
                    </el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="审批" :name="4">
                <el-steps style="margin-top: 15px"
                          :process-status="item[item.length-1].status==2?'success':(item[item.length-1].status==3?'error':'')"
                          v-if="item&&item.length>0" :key="index" v-for="(item,index) in log"
                          :active="item.length-1" align-center>
                    <el-step  :description="item.length>0?`备注：${item[0].dealRemark?item[0].dealRemark:'无'}`:''">
                        <template slot="title">
                            操作：开始<br/>
                            <span v-if="item.length>0">操作人：{{item[0].dealUser}}</span><br/>
                            <span v-if="item.length>0">操作时间：{{item[0].dealTime}}</span>
                        </template>
                    </el-step>
                    <el-step :description="item.length>1?`备注：${item[1].dealRemark?item[1].dealRemark:'无'}`:''">
                        <template slot="title">
                            操作：一审<br/>
                            <span v-if="item.length>1">操作人：{{item[1].dealUser}}</span><br/>
                            <span v-if="item.length>1">操作时间：{{item[1].dealTime}}</span>
                        </template>
                    </el-step>
                    <el-step :description="item.length>2?`备注：${item[2].dealRemark?item[2].dealRemark:'无'}`:''">
                        <template slot="title">
                            操作：二审<br/>
                            <span v-if="item.length>2">操作人：{{item[2].dealUser}}</span><br/>
                            <span v-if="item.length>2">操作时间：{{item[2].dealTime}}</span>
                        </template>
                    </el-step>
                    <el-step>
                        <template slot="title">
                            操作：完成
                        </template>
                    </el-step>
                    <!--                <el-step :key="zindex" v-for="(child,zindex) in item"-->
                    <!--                         :description="zindex==1||zindex==2?`备注：${child.dealRemark?child.dealRemark:'无'}`:''">-->
                    <!--                    <template v-if="child.step<4" slot="title">-->
                    <!--                        操作：{{stepChild[child.step]}}<br/>-->
                    <!--                        操作人：{{child.dealUser}}<br/>-->
                    <!--                        操作时间：{{child.dealTime}}-->
                    <!--                    </template>-->
                    <!--                    <template v-else slot="title">-->
                    <!--                        操作：{{stepChild[child.step]}}<br/>-->
                    <!--                    </template>-->
                    <!--                </el-step>-->
                </el-steps>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import api from "@/api/order/contract/list";
    import {mapGetters} from "vuex";
    import bomApi from "@/api/order/bom/list";

    export default {
        name: "detail-list",
        data() {
            return {
                stepChild: {
                    1: '开始',
                    2: '一审',
                    3: '二审',
                    4: '通过'
                },
                tableloading:false,
                submitLoading: false,
                activeName: 1,
                info: {},
                bomList:[],
                log: [],
                dealRemark: ''
            };
        },
        mounted() {
            if (this.activeName == 1) {
                this.infoContract()
            }
        },
        watch: {
            activeName() {
                if (this.activeName == 4 && this.log.length == 0) {
                    this.checkinfo()
                }else if (this.activeName == 2 && this.bomList.length == 0) {
                    this.getBomInInfo()
                }
            }
        },
        props: {
            productData: {
                type: Object,
                default() {
                    return {};
                }
            },
            enterpriseList: {
                type: Array,
                default() {
                    return [];
                }
            },
            contractId: {
                type: Number,
                default() {
                    return 0;
                }
            }
        },
        computed: {
            ...mapGetters(["direction", "drawerWidth", "permission"])
        },
        components: {},
        methods: {
            filterTable(pid, dataList) {
                let list = dataList.filter(item => item.parentId == pid)
                list.map(item => {
                    let childList = this.filterTable(item.bomId, dataList)
                    if (childList.length > 0) {
                        item.childList = childList
                    }
                })
                return list
            },
            getBomInInfo() {
                this.tableloading = true
                bomApi.getBomInInfo(this.productData.productId, this.productData.bomVersion).then(res => {
                    let bomList = this.filterTable(0, res.data)
                    this.bomList = Object.assign([], bomList)
                    this.tableloading = false
                }).catch(e => {
                    this.tableData = []
                    this.tableloading = false
                });
            },
            checkinfo() {
                api.checkinfo(this.contractId).then(res => {
                    let logList = res.data ? res.data : []
                    logList.map(item => {
                        if (item.length >= 3) {
                            if (item[item.length - 1].status == 2 && item[item.length - 1].step) {
                                let child = {
                                    step: 4,
                                    dealTime: item[item.length - 1].dealTime,
                                    status: 2
                                }
                                item.push(child)
                            }
                        }
                    })

                    this.log = logList
                }).catch(e => {
                    this.log = []
                });
            },
            cancelContract() {
                this.submitLoading = true
                let params = {
                    dealRemark: this.dealRemark,
                    approveType: 2,
                    processId: this.contractId
                }
                api.cancelContract(params).then(res => {
                    this.$message({
                        message: "操作成功",
                        type: "success"
                    });
                    this.dealRemark = ''
                    this.$emit('successSubmit')
                    this.infoContract()
                    this.submitLoading = false
                }).catch(e => {
                    this.submitLoading = false
                });
            },
            infoContract() {
                api.infoContract(this.contractId).then(res => {
                    let info = res.data ? res.data : {}
                    if (info.enterpriseId) {
                        let child = this.enterpriseList.find(item => item.enterpriseId == info.enterpriseId)
                        if (child) {
                            info.shortName = child.shortName
                        }
                    } else {
                        info.shortName = ''
                    }
                    this.info = info
                }).catch(e => {
                    this.info = {}
                });
            },
        }
    };
</script>

<style lang="less">
    .contract-list {

    }
</style>
