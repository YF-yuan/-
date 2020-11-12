<template>
    <el-drawer
            :wrapperClosable="false"
            class="contract-form"
            :title="getOperatorName"
            :visible.sync="visible"
            :direction="direction"
            :size="drawerWidth+'px'"
            :before-close="handleClose"
    >
        <el-form
                :inline="true"
                v-loading="loading"
                ref="ruleForm"
                :model="ruleForm"
                size="small"
                label-width="130px"
        >
            <el-row>
                <el-form-item
                        prop="enterpriseId"
                        label="客户名称"
                        :rules="{ required: true, message: '客户名称不能为空', trigger: 'change' }"
                >
                    <el-select :disabled="isShow" @change="enterpriseChange" style="width: 300px" filterable clearable
                               size="small"
                               v-model="ruleForm.enterpriseId">
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
                            v-model="ruleForm.shortName"
                            size="small"
                            style="width: 300px"
                    />
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item
                        prop="contractCode"
                        label="合同编号"
                        :rules="{ required: true, message: '合同编号不能为空', trigger: 'blur' }"
                >
                    <el-input
                            :disabled="isShow"
                            maxlength="30"
                            clearable
                            v-model="ruleForm.contractCode"
                            size="small"
                            style="width: 300px"
                    />
                </el-form-item>
                <el-form-item
                        prop="customerCode"
                        label="客户合同编号"
                        :rules="{ required: true, message: '客户合同编号不能为空', trigger: 'blur' }"
                >
                    <el-input
                            :disabled="isShow"
                            maxlength="30"
                            clearable
                            v-model="ruleForm.customerCode"
                            size="small"
                            style="width: 300px"
                    />
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item
                        prop="signTime"
                        label="签订日期"
                        :rules="{ required: true, message: '签订日期不能为空', trigger: 'change' }"

                >
                    <el-date-picker
                            :disabled="isShow"
                            style="width: 300px"
                            clearable
                            size="small"
                            value-format="yyyy-MM-dd"
                            v-model="ruleForm.signTime"
                            type="date"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                        prop="headerId"
                        label="负责人"
                        :rules="{ required: true, message: '客户名称不能为空', trigger: 'change' }"
                >
                    <el-input :disabled="true" v-if="isCheck" v-model="ruleForm.headerName"></el-input>
                    <el-select v-else :disabled="isShow" style="width: 300px" filterable clearable size="small"
                               v-model="ruleForm.headerId">
                        <el-option :key="index" :label="item.nickname" :value="item.userId"
                                   v-for="(item,index) in userList"></el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item
                        prop="filePath"
                        label="上传合同"
                >
                    <el-upload
                            :disabled="isShow"
                            class="upload-demo"
                            drag
                            :on-preview="filePreview"
                            :on-success="fileSuccess"
                            :on-remove="fileRemove"
                            :on-error="fileError"
                            action="/api/file/upload/index"
                            :multiple="false"
                            :file-list="fileList"
                            :before-upload="fileBefore"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">支持扩展名.pdf .jpg文件</div>
                    </el-upload>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item
                        prop="pcbFilePath"
                        label="上传pcb文件"
                >
                    <el-upload
                            class="upload-demo"
                            drag
                            :disabled="isShow"
                            :on-preview="filePreview"
                            :on-success="pcbFileSuccess"
                            :on-remove="pcbFileRemove"
                            :on-error="pcbFileError"
                            action="/api/file/upload/index"
                            :multiple="false"
                            :file-list="pcbFileList"
                            :before-upload="pcbFileBefore"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">支持扩展名.excel .rar .zip .doc .docx .pdf .jpg文件</div>
                    </el-upload>
                </el-form-item>
            </el-row>
            <el-button
                    icon="el-icon-plus"
                    style="margin-top: 15px"
                    @click="addContract"
                    size="small"
                    v-if="!isShow"
                    type="primary"
            >添加产品
            </el-button>
            <el-table style="margin-top: 15px;width: 70%" ref="table" size="small" :data="ruleForm.detailList" border>
                <el-table-column min-width="150" align="center" label="*产品名称">
                    <template slot-scope="{row,$index}">
                        <el-input v-if="!isShow" size="small" clearable maxlength="30"
                                  v-model="row.productName"></el-input>
                        <span v-else>{{row.productName}}</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="150" align="center" label="*数量">
                    <template slot-scope="{row,$index}">
                        <numInput v-if="!isShow" :disabled="isShow" v-model="row.number" :maxlength="8"></numInput>
                        <span v-else>{{row.number}}</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="150" align="center" label="*金额">
                    <template slot-scope="{row,$index}">
                        <priceInput v-if="!isShow" v-model="row.amount" :maxPrice="99999999.99"
                                    :maxlength="11"></priceInput>
                        <span v-else>{{row.amount}}</span>
                    </template>
                </el-table-column>

                <el-table-column v-if="!isShow" width="80" label="操作">
                    <template slot-scope="{row,$index}">
                        <el-button @click="delProduct($index)" v-if="ruleForm.detailList.length>1"
                                   size="small" type="danger" icon="el-icon-delete" circle></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-timeline style="margin-top: 15px" v-if="isCheck">
                <el-timeline-item :color="((item.step==2||item.step==3)&&item.status==3?'red':(index<log.length-1?'#409EFF':'#b3d8ff'))" type="wait" :key="index"
                                  v-for="(item,index) in log" :timestamp="item.dealTime" placement="top">
                    <el-card v-if="item.step<4">
                        <h4>操作：{{stepChild[item.step]}}<el-tag style="margin-left: 10px" v-if="(item.step==2||item.step==3)&&item.status>1" :type="item.status==2?'success':'danger'">{{item.status==2?'通过':'驳回'}}</el-tag><span style="margin-left: 20px" v-if="index!=0||isCheck==3">操作人：{{item.dealUser}}</span>
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
            <el-form-item
                    v-if="isSubmit"
                    style="margin-top: 15px"
                    prop="dealRemark"
                    label="备注"
            >
                <el-input
                        style="width: 500px"
                        maxlength="50"
                        show-word-limit
                        size="small"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入备注"
                        v-model="ruleForm.dealRemark">
                </el-input>
            </el-form-item>
            <br/>
            <el-form-item
                    style="margin-top: 15px;margin-left: 260px"
            >
                <el-button
                        v-if="!isShow"
                        :loading="submitLoading"
                        @click="submitForm('ruleForm')"
                        type="primary"
                        size="medium"
                >确定提交
                </el-button>
                <el-button
                        v-if="isSubmit"
                        :loading="submitLoading"
                        @click="submitContract"
                        type="primary"
                        size="medium"
                >提交审批
                </el-button>
                <el-button @click="handleClose" size="medium">返回</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<script>
    import api from "@/api/order/contract/list";
    import mainApi from "@/api/main/index";
    import {mapGetters} from "vuex";
    import numInput from '@/components/numInput'
    import priceInput from '@/components/priceInput'

    export default {
        name: "contract-from",
        data() {
            return {
                checkLoading:false,
                stepChild: {
                    1: '开始',
                    2: '一审',
                    3: '二审',
                    4: '通过'
                },
                dealRemark:'',
                pcbFileList: [],
                fileList: [],
                log: [],
                loading: false,
                submitLoading: false,
                ruleForm: {
                    detailList: [{}]
                },
            };
        },
        props: {
            enterpriseList: {
                type: Array,
                default() {
                    return [];
                }
            },
            userList: {
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
            },
            isSubmit: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            isShow: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            isCheck: {
                type: Number,
                default() {
                    return 0;
                }
            },
            visible: {
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
                if (this.isSubmit) {
                    return "合同提交审批";
                } else {
                    if (this.isShow) {
                        return "合同详情";
                    } else {
                        return this.contractId ? "合同编辑" : "合同添加";
                    }
                }
            }
        },
        mounted() {
            if (this.contractId) {
                if (this.isCheck) {
                    this.getDetail()
                } else {
                    this.infoContract();
                }
            }
        },
        methods: {
            deal(item,status){
                this.checkLoading=true
                let params=JSON.parse(JSON.stringify(item))
                params.status=status
                params.dealRemark=this.dealRemark
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
            submitContract() {
                this.submitLoading = true;
                let params = {
                    dealRemark: this.ruleForm.dealRemark,
                    approveType: '1',
                    processId: this.ruleForm.contractId
                }
                api.submitContract(params).then(res => {
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
            filePreview(file) {
                window.open(file.url)
            },
            enterpriseChange() {
                let ruleForm = JSON.parse(JSON.stringify(this.ruleForm))
                if (ruleForm.enterpriseId) {
                    let child = this.enterpriseList.find(item => item.enterpriseId == ruleForm.enterpriseId)
                    if (child) {
                        ruleForm.shortName = child.shortName
                    }
                } else {
                    ruleForm.shortName = ''
                }
                this.ruleForm = Object.assign({}, ruleForm)
            },
            delProduct(index) {
                let ruleForm = JSON.parse(JSON.stringify(this.ruleForm))
                ruleForm.detailList.splice(index, 1)
                this.ruleForm = Object.assign({}, ruleForm)
            },
            addContract() {
                let ruleForm = JSON.parse(JSON.stringify(this.ruleForm))
                ruleForm.detailList.push({})
                this.ruleForm = Object.assign({}, ruleForm)
            },
            fileRemove() {
                this.fileList = []
            },
            pcbFileRemove() {
                this.pcbFileList = []
            },
            pcbFileBefore(file) {
                if (/\.(excel|rar|zip|doc|docx|pdf|jpg|PDF|JPG|EXCEL|RAR|ZIP|DOC|DOCX)$/.test(file.name)) {
                    let MAXSIZE = 10 * 1024 * 1024;
                    let size = file.size;
                    if (size > MAXSIZE) {
                        this.$notify.error({
                            title: "上传文件错误",
                            message: "上传文件不能超过10M"
                        });
                        return false;
                    }
                } else {
                    this.$notify.error({
                        title: "上传图片错误",
                        message: "请上传pdf|jpg格式文件"
                    });
                    return false
                }
            },
            fileBefore(file) {
                console.log(file);
                if (/\.(pdf|jpg|PDF|JPG)$/.test(file.name)) {
                    let MAXSIZE = 10 * 1024 * 1024;
                    let size = file.size;
                    if (size > MAXSIZE) {
                        this.$notify.error({
                            title: "上传文件错误",
                            message: "上传文件不能超过10M"
                        });
                        return false;
                    }
                } else {
                    this.$notify.error({
                        title: "上传图片错误",
                        message: "请上传pdf|jpg格式文件"
                    });
                    return false
                }
            },
            pcbFileSuccess(response, file, fileList) {
                this.pcbFileList = Object.assign(
                    [],
                    [{name: response.data.fileName, url: response.data.url}]
                );
            },
            fileSuccess(response, file, fileList) {
                this.fileList = Object.assign(
                    [],
                    [{name: response.data.fileName, url: response.data.url}]
                );
            },
            pcbFileError(err) {
                this.$notify.error({
                    title: "错误",
                    message: err
                });
            },
            fileError(err) {
                this.$notify.error({
                    title: "错误",
                    message: err
                });
            },
            getDetail() {
                this.loading = true;
                mainApi.getDetail(this.contractId).then(res => {
                    const {data = {}, log = []} = res.data
                    if (data.enterpriseId) {
                        let child = this.enterpriseList.find(item => item.enterpriseId == data.enterpriseId)
                        if (child) {
                            data.shortName = child.shortName
                        }
                    } else {
                        data.shortName = ''
                    }
                    if (data.filePath) {
                        this.fileList = Object.assign(
                            [],
                            [{name: data.fileName, url: data.filePath}]
                        );
                    }
                    if (data.pcbFilePath) {
                        this.pcbFileList = Object.assign(
                            [],
                            [{name: data.pcbFileName, url: data.pcbFilePath}]
                        );
                    }
                    this.ruleForm = Object.assign({}, data);
                    let logList=JSON.parse(JSON.stringify(log))
                    if(log.length>=3){
                        if(log[0].status==2&&log[0].step){
                            let child = {
                                step:4,
                                dealTime:log[0].dealTime
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
            infoContract() {
                this.loading = true;
                api.infoContract(this.contractId).then(res => {
                    let data = res.data ? res.data : {}
                    if (data.enterpriseId) {
                        let child = this.enterpriseList.find(item => item.enterpriseId == data.enterpriseId)
                        if (child) {
                            data.shortName = child.shortName
                        }
                    } else {
                        data.shortName = ''
                    }
                    if (data.filePath) {
                        this.fileList = Object.assign(
                            [],
                            [{name: data.fileName, url: data.filePath}]
                        );
                    }
                    if (data.pcbFilePath) {
                        this.pcbFileList = Object.assign(
                            [],
                            [{name: data.pcbFileName, url: data.pcbFilePath}]
                        );
                    }
                    this.ruleForm = Object.assign({}, data);
                    this.loading = false;
                }).catch(e => {
                    this.ruleForm = {};
                    this.loading = false;
                });
            },
            handleClose(hide) {
                this.$emit("returnBack");
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let method = "";
                        let ruleForm = JSON.parse(JSON.stringify(this.ruleForm));
                        if (this.fileList.length == 0) {
                            this.$message({
                                message: "上传合同不能为空",
                                type: "error"
                            });
                            return
                        }
                        let bl = true
                        ruleForm.detailList.map(item => {
                            if (!item.productName || !item.number || !item.amount) {
                                bl = false
                            }
                        })
                        if (!bl) {
                            this.$message({
                                message: "产品名称，数量，金额不能为空",
                                type: "error"
                            });
                            return
                        }
                        ruleForm.filePath = this.fileList[0].url
                        ruleForm.fileName = this.fileList[0].name
                        if (this.pcbFileList.length > 0) {
                            ruleForm.pcbFilePath = this.pcbFileList[0].url
                            ruleForm.pcbFileName = this.pcbFileList[0].name
                        } else {
                            ruleForm.pcbFilePath = ''
                            ruleForm.pcbFileName = ''
                        }
                        if (!this.contractId) {
                            method = "addContract";
                        } else {
                            method = "editContract";
                        }
                        this.submitLoading = true;
                        api[method](ruleForm)
                            .then(res => {
                                this.$message({
                                    message: "操作成功",
                                    type: "success"
                                });
                                this.submitLoading = false;
                                this.$emit("successSubmit");
                            })
                            .catch(e => {
                                this.submitLoading = false;
                            });
                    }
                });
            }
        }
    };
</script>

<style lang="less">
    .contract-form {
        .el-form-item--small.el-form-item {
            margin-bottom: 18px !important;
        }
    }
</style>
