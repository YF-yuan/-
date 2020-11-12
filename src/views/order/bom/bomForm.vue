<template>
    <el-drawer
            class="bom-form"
            :title="getOperatorName"
            :visible.sync="visible"
            :direction="direction"
            :size="drawerWidth+'px'"
            :before-close="handleClose"
            v-loading="loading"
    >
        <el-form :inline="true" :model="ruleForm" class="demo-form-inline">
            <el-form-item label="产品名称">
                <el-input style="width: 300px" v-model="ruleForm.productName" :disabled="true" size="small"></el-input>
            </el-form-item>
            <el-form-item label="版本号">
                <el-select :disabled="isShow" @change="versionChange" style="width: 300px" v-model="ruleForm.version"
                           size="small">
                    <el-option :key="index" :label="version.version" :value="version.versionId"
                               v-for="(version,index) in versionList"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-table
                v-loading="tableloading"
                :data="tableData"
                style="width: 100%;margin-bottom: 20px;"
                row-key="bomId"
                border
                default-expand-all
                :tree-props="{children: 'childList'}">
            <el-table-column
                    prop="name"
                    label="标签"
                    min-width="150">
                <template slot-scope="{row,$index}">
                    <span v-if="!isShow" @click="nameClick(row)" style="cursor: pointer">阶层{{row.level}}</span>
                    <span v-else>阶层{{row.level}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="*编码"
                    min-width="180">
                <template slot-scope="{row,$index}">
                    <el-input v-if="!isShow" maxlength="50" @blur="goodCodeInput(row)" size="mini"
                              v-model="row.goodCode"
                              clearable></el-input>
                    <span v-else>{{row.goodCode}}</span>
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
                    label="*用量"
                    align="center"
                    min-width="100">
                <template slot-scope="{row,$index}">
                    <priceInput :isLow="true" v-if="!isShow" :maxlength="6" :maxPrice="999.99" v-model="row.number"></priceInput>
                    <span v-else>{{row.number}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="客户bom描述"
                    align="center"
                    min-width="160">
                <template slot-scope="{row,$index}">
                    <el-input v-if="!isShow" maxlength="50" size="mini" v-model="row.description" clearable></el-input>
                    <span v-else>{{row.description}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="*属性"
                    align="center"
                    min-width="160">
                <template slot-scope="{row,$index}">
                    <el-select v-if="!isShow" size="mini" v-model="row.attribute" clearable>
                        <el-option :value="1" label="自制"></el-option>
                        <el-option :value="2" label="外购"></el-option>
                        <el-option :value="3" label="客供"></el-option>
                    </el-select>
                    <span v-else>{{row.attribute==1?'自制':(row.attribute==2?'外购':(row.attribute==3?'客供':''))}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="位号"
                    align="center"
                    min-width="100">
                <template slot-scope="{row,$index}">
                    <el-input v-if="!isShow" maxlength="50" size="mini" v-model="row.tag" clearable></el-input>
                    <span v-else>{{row.tag}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    v-if="!isShow"
                    label="是否下阶"
                    align="center"
                    width="100">
                <template slot-scope="{row,$index}">
                    <el-switch
                            v-model="row.isChild"
                            @change="isChildChange(row)"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                    v-if="!isShow"
                    label="操作"
                    align="center"
                    width="60">
                <template slot-scope="{row,$index}">
                    <el-button @click="delItem(row)" v-if="row.level!=1" size="mini" type="danger" icon="el-icon-delete"
                               circle></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-form>
            <el-form-item
                    v-if="isCheck==1"
                    style="margin-top: 15px"
                    prop="dealRemark"
                    label="意见"
            >
                <el-input
                        style="width: 500px"
                        maxlength="50"
                        show-word-limit
                        size="small"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入意见"
                        v-model="dealRemark">
                </el-input>
            </el-form-item>
        </el-form>
        <el-timeline style="margin-top: 15px" v-if="isCheck>1">
            <el-timeline-item
                    :color="((item.step==2||item.step==3)&&item.status==3?'red':(index<log.length-1?'#409EFF':'#b3d8ff'))"
                    type="wait" :key="index"
                    v-for="(item,index) in log" :timestamp="item.dealTime" placement="top">
                <el-card v-if="item.step<4">
                    <h4>操作：{{stepChild[item.step]}}
                        <el-tag style="margin-left: 10px" v-if="(item.step==2||item.step==3)&&item.status>1"
                                :type="item.status==2?'success':'danger'">{{item.status==2?'通过':'驳回'}}
                        </el-tag>
                        <span style="margin-left: 20px" v-if="index!=0||isCheck==3">操作人：{{item.dealUser}}</span>
                    </h4>
                    <p v-if="index!=0||isCheck==3">备注：{{item.dealRemark?item.dealRemark:'无'}}</p>
                    <el-input
                            v-else
                            style="width: 500px"
                            maxlength="50"
                            show-word-limit
                            size="small"
                            type="textarea"
                            :rows="4"
                            placeholder="请输入备注"
                            v-model="dealRemark">
                    </el-input>
                    <div style="margin-top: 10px;margin-left: 160px" v-if="index==0&&isCheck==2">
                        <el-button
                                :loading="checkLoading"
                                @click="deal(item,2)"
                                type="primary"
                                size="medium"
                        >同意
                        </el-button>
                        <el-button
                                :loading="checkLoading"
                                @click="deal(item,3)"
                                type="primary"
                                size="medium"
                        >驳回
                        </el-button>
                    </div>
                </el-card>
                <el-card v-else>
                    <h4>操作：{{stepChild[item.step]}}</h4>
                </el-card>
            </el-timeline-item>
        </el-timeline>
        <div style="margin-top: 15px;text-align: center">
            <el-button
                    v-if="!isShow"
                    :loading="submitLoading"
                    @click="submitForm"
                    type="primary"
                    size="medium"
            >确定提交
            </el-button>
            <el-button
                    v-if="isCheck==1&&tableData.length>0"
                    :loading="submitLoading"
                    @click="submitContract"
                    type="primary"
                    size="medium"
            >提交审批
            </el-button>
            <el-button @click="handleClose" size="medium">返回</el-button>
        </div>
    </el-drawer>
</template>

<script>
    import api from "@/api/order/bom/list";
    import versionApi from "@/api/order/version/index";
    import mainApi from "@/api/main/index";
    import {mapGetters} from "vuex";
    import numInput from '@/components/numInput'
    import priceInput from '@/components/priceInput'

    export default {
        name: "contract-from",
        data() {
            return {
                checkLoading: false,
                stepChild: {
                    1: '开始',
                    2: '一审',
                    3: '二审',
                    4: '通过'
                },
                tableloading: false,
                submitBl: true,
                loading: false,
                submitLoading: false,
                versionList: [{versionId: 1, version: 1}],
                ruleForm: {},
                tableData: [],
                dealRemark: ''
            };
        },
        props: {
            snapshotId: {
                type: Number,
                default() {
                    return 0;
                }
            },
            productData: {
                type: Object,
                default() {
                    return {};
                }
            },
            visible: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            isVersion: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            isCheck: {
                type: Boolean,
                default() {
                    return 0;
                }
            },
            isShow: {
                type: Boolean,
                default() {
                    return false;
                }
            }
        },
        components: {numInput, priceInput},
        computed: {
            ...mapGetters(["direction", "drawerWidth"]),
            getOperatorName() {
                if (this.isCheck == 1) {
                    return '提交审批'
                } else if (this.isCheck == 2 || this.isCheck == 3) {
                    return 'bom审核'
                } else if (this.isShow) {
                    return '详情'
                } else {
                    return '转化'
                }
            },
        },
        mounted() {
            if (this.isCheck > 1) {
                this.getDetail()
            } else if (this.isVersion) {
                this.infoVersion()
            } else {
                let ruleForm = {
                    version: this.productData.bomVersion,
                    productName: this.productData.productName,
                    productId: this.productData.productId
                }
                let me = this
                this.bomVersion(function () {
                    if (me.versionList.length == 0) {
                        ruleForm.version = 1
                        me.ruleForm = Object.assign({}, ruleForm)
                        let list = [
                            {
                                bomId: 'id' + new Date().getTime(),
                                productId: me.productData.productId,
                                parentId: 0,
                                name: '阶层1',
                                level: 1,
                                version: 1,
                                isChild: false
                            }
                        ]
                        me.tableData = Object.assign([], list)
                    } else {
                        if (!ruleForm.version) {
                            ruleForm.version = me.versionList[me.versionList.length - 1].version
                        }
                        me.ruleForm = Object.assign({}, ruleForm)
                        me.getBomInInfo()
                    }
                })
            }
        },
        methods: {
            deal(item, status) {
                this.checkLoading = true
                let params = JSON.parse(JSON.stringify(item))
                params.status = status
                params.dealRemark = this.dealRemark
                mainApi.deal(params).then(res => {
                    this.$message({
                        message: "操作成功",
                        type: "success"
                    });
                    this.checkLoading = false;
                    this.$emit("successSubmit");
                }).catch(e => {
                    this.checkLoading = false;
                });
            },
            infoVersion() {
                this.loading = true;
                versionApi.infoVersion(this.productData.versionId).then(res => {
                    this.ruleForm = {
                        productName: this.productData.productName,
                        version: this.productData.version
                    }
                    this.versionList = [{versionId: this.productData.version, version: this.productData.version}]
                    let tableData = this.filterTable(0, res.data ? res.data : [])
                    this.isChildFilter(tableData)
                    this.tableData = Object.assign([], tableData)
                    this.loading = false
                }).catch(e => {
                    this.tableData = []
                    this.ruleForm = {};
                    this.loading = false;
                });
            },
            getDetail() {
                this.loading = true;
                mainApi.getDetail(this.snapshotId).then(res => {
                    const {data = [], log = []} = res.data
                    if (data.length > 0) {
                        this.ruleForm = {
                            productName: data[0].productName,
                            version: data[0].version
                        }
                        this.versionList = [{versionId: data[0].version, version: data[0].version}]
                    }
                    let tableData = this.filterTable(0, data)
                    this.isChildFilter(tableData)
                    this.tableData = Object.assign([], tableData)
                    let logList = JSON.parse(JSON.stringify(log))
                    if (log.length >= 3) {
                        if (log[0].status == 2 && log[0].step) {
                            let child = {
                                step: 4,
                                dealTime: log[0].dealTime
                            }
                            logList.unshift(child)
                        }
                    }
                    this.log = logList
                    this.loading = false;
                }).catch(e => {
                    this.log = []
                    this.ruleForm = {};
                    this.loading = false;
                });
            },
            submitContract() {
                this.submitLoading = true;
                let params = {
                    dealRemark: this.dealRemark,
                    approveType: '3',
                    processId: this.productData.detailId
                }
                api.submitBom(params).then(res => {
                    this.$message({
                        message: "操作成功",
                        type: "success"
                    });
                    this.submitLoading = false;
                    this.$emit("successSubmit");
                }).catch(e => {
                    this.submitLoading = false;
                });
            },
            versionChange() {
                this.getBomInInfo()
            },
            findChildSubmit(tableData) {
                for (let i = tableData.length - 1; i >= 0; i--) {
                    if (!tableData[i].goodId || tableData[i].number===''||tableData[i].number===null||tableData[i].number===undefined||!tableData[i].attribute) {
                        this.submitBl = false
                        break;
                    }
                    tableData[i].bomId += ''
                    if (tableData[i].bomId.indexOf('id') > -1) {
                        delete tableData[i].bomId
                        delete tableData[i].parentId
                    }
                    delete tableData[i].isChild
                    if (tableData[i].childList) {
                        this.findChildSubmit(tableData[i].childList)
                    }
                }
            },
            submitForm() {
                this.submitBl=true
                let tableData = JSON.parse(JSON.stringify(this.tableData))
                this.findChildSubmit(tableData)
                if (!this.submitBl) {
                    this.$message({
                        message: "编码,用量,属性必填",
                        type: "error"
                    });
                    return
                }
                this.submitLoading = true
                tableData[0].contractId = this.productData.contractId
                api.addBom(tableData[0]).then(res => {
                    this.$message({
                        message: "操作成功",
                        type: "success"
                    });
                    this.submitLoading = false;
                    this.$emit("successSubmit");
                }).catch(e => {
                    this.submitLoading = false;
                });

            },
            nameClick(row) {
                if (row.level != 1) {
                    let tableData = JSON.parse(JSON.stringify(this.tableData))
                    this.findChildNameClick(row.parentId, tableData)
                    this.tableData = Object.assign([], tableData)
                }
            },
            findChildNameClick(bomId, tableData) {
                for (let i = tableData.length - 1; i >= 0; i--) {
                    if (tableData[i].bomId == bomId) {
                        tableData[i].childList.push({
                            bomId: 'id' + new Date().getTime(),
                            productId: this.productData.productId,
                            parentId: bomId,
                            name: '阶层' + (tableData[i].level + 1),
                            level: tableData[i].level + 1,
                            version: this.ruleForm.version,
                            isChild: false
                        })
                        break
                    } else {
                        if (tableData[i].childList) {
                            this.findChildNameClick(bomId, tableData[i].childList)
                        }
                    }
                }
            },
            delItem(row) {
                let tableData = JSON.parse(JSON.stringify(this.tableData))
                this.findChildDel(row.bomId, tableData)
                this.tableData = Object.assign([], tableData)
            },
            findChildDel(bomId, tableData) {
                let index = -1
                for (let i = tableData.length - 1; i >= 0; i--) {
                    if (tableData[i].bomId == bomId) {
                        index = i
                        break
                    } else {
                        if (tableData[i].childList) {
                            this.findChildDel(bomId, tableData[i].childList)
                        }
                    }
                }
                if (index != -1) {
                    tableData.splice(index, 1)
                }
            },
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
            findChildAdd(bomId, tableData) {
                for (let i = tableData.length - 1; i >= 0; i--) {
                    if (tableData[i].bomId == bomId) {
                        if (tableData[i].isChild) {
                            if (!tableData[i].childList) {
                                tableData[i].childList = []
                            }
                            tableData[i].childList.push({
                                bomId: 'id' + new Date().getTime(),
                                productId: this.productData.productId,
                                parentId: bomId,
                                name: '阶层' + (tableData[i].level + 1),
                                level: tableData[i].level + 1,
                                version: this.ruleForm.version,
                                isChild: false
                            })
                        } else {
                            delete tableData[i].childList
                        }
                        break
                    } else {
                        if (tableData[i].childList) {
                            this.findChildAdd(bomId, tableData[i].childList)
                        }
                    }
                }
            },
            isChildChange(row) {
                let tableData = JSON.parse(JSON.stringify(this.tableData))
                this.findChildAdd(row.bomId, tableData)
                this.tableData = Object.assign([], tableData)
            },
            functionTrim(str) {
                return str.replace(/(^\s*)|(\s*$)/g, "");
            },
            findChildGoodCode(bomId, tableData, call) {
                for (let i = tableData.length - 1; i >= 0; i--) {
                    if (tableData[i].bomId == bomId) {
                        if (tableData[i].goodCode) {
                            this.tableLoading = true
                            api.getBomGood(this.functionTrim(tableData[i].goodCode)).then(res => {
                                let data = res.data ? res.data : {}
                                tableData[i].goodCode = this.functionTrim(tableData[i].goodCode)
                                tableData[i].goodId = data.goodId
                                tableData[i].goodName = data.goodName
                                tableData[i].goodModel = data.goodModel
                                tableData[i].encap = data.encap
                                tableData[i].unitName = data.unitName
                                call()
                            }).catch(e => {
                                tableData[i].goodCode = ''
                                tableData[i].goodId = ''
                                tableData[i].goodName = ''
                                tableData[i].encap = ''
                                tableData[i].unitName = ''
                                tableData[i].goodModel = ''
                                call()
                            });
                        } else {
                            tableData[i].goodId = ''
                            tableData[i].goodName = ''
                            tableData[i].goodModel = ''
                            tableData[i].encap = ''
                            tableData[i].unitName = ''
                            call()
                        }
                        break
                    } else {
                        if (tableData[i].childList) {
                            this.findChildGoodCode(bomId, tableData[i].childList, call)
                        }
                    }
                }
            },
            goodCodeInput(row) {
                let tableData = JSON.parse(JSON.stringify(this.tableData))
                let me = this
                this.findChildGoodCode(row.bomId, tableData, function () {
                    me.tableData = Object.assign([], tableData)
                    me.tableLoading = false
                })
            },
            GetRandomNum(Min, Max) {
                var Range = Max - Min;
                var Rand = Math.random();
                return (Min + Math.round(100000000000 * 999999999999));
            },
            handleClose(hide) {
                this.$emit("returnBack");
            },
            getBomInInfo() {
                this.loading = true
                console.log(this.ruleForm)
                api.getBomInInfo(this.ruleForm.productId, this.ruleForm.version).then(res => {
                    let tableData = this.filterTable(0, res.data)
                    this.isChildFilter(tableData)
                    this.tableData = Object.assign([], tableData)
                    this.loading = false
                }).catch(e => {
                    this.tableData = []
                    this.loading = false
                });
            },
            isChildFilter(tableData) {
                for (let i = tableData.length - 1; i >= 0; i--) {
                    if (tableData[i].childList && tableData[i].childList.length > 0) {
                        tableData[i].isChild = true
                    } else {
                        tableData[i].isChild = false
                    }
                    if (tableData[i].childList) {
                        this.isChildFilter(tableData[i].childList)
                    }
                }
            },
            bomVersion(callback) {
                api.bomVersion(this.productData.productId).then(res => {
                    this.versionList = res.data ? res.data : []
                    callback()
                }).catch(e => {
                    this.versionList = []
                    callback()
                });
            }
        }
    };
</script>

<style lang="less">
    .bom-form {
    }
</style>
