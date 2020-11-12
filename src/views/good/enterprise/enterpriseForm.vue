<template>
    <el-dialog
            class="center-dialog"
            center
            :title="getOperatorName"
            :visible.sync="visible"
            width="500px"
            :before-close="handleClose">
        <el-form v-loading="loading" ref="ruleForm" :model="ruleForm" size="small" label-width="100px">
            <el-form-item
                    label="企业名称"
                    prop="enterpriseName"
                    :rules="{ required: true, message: '企业名称不能为空', trigger: 'blur' }"
            >
                <el-input maxlength="30"  clearable v-model="ruleForm.enterpriseName" size="small"/>
            </el-form-item>
            <el-form-item
                    label="简称"
                    prop="shortName"
                    :rules="{ required: true, message: '简称不能为空', trigger: 'blur' }"
            >
                <el-input maxlength="30"  clearable v-model="ruleForm.shortName" size="small"/>
            </el-form-item>
            <el-form-item
                    label="联系人"
                    prop="linkUser"
                    :rules="{ required: true, message: '联系人不能为空', trigger: 'blur' }"
            >
                <el-input maxlength="30"  clearable v-model="ruleForm.linkUser" size="small"/>
            </el-form-item>
            <el-form-item
                    label="联系电话"
                    prop="linkPhone"
                    :rules="{ required: true,validator:validatePhone, trigger: 'blur' }"
            >
                <el-input maxlength="11"  clearable v-model="ruleForm.linkPhone" size="small"/>
            </el-form-item>
            <el-form-item
                    label="职位"
                    prop="position"
                    :rules="{ required: true, message: '职位不能为空', trigger: 'blur' }"
            >
                <el-input maxlength="30"  clearable v-model="ruleForm.position" size="small"/>
            </el-form-item>
            <el-form-item
                    label="纳税识别号"
                    prop="taxCode"
            >
                <el-input maxlength="30"  clearable v-model="ruleForm.taxCode" size="small"/>
            </el-form-item>
            <el-form-item
                    label="开户行"
                    prop="bank"
            >
                <el-input maxlength="30"  clearable v-model="ruleForm.bank" size="small"/>
            </el-form-item>
            <el-form-item
                    label="账号"
                    prop="accountNumber"
            >
                <el-input maxlength="30"  clearable v-model="ruleForm.accountNumber" size="small"/>
            </el-form-item>
            <el-form-item
                    label="地址"
                    prop="address"
            >
                <el-input  type="textarea" autosize maxlength="50"  clearable v-model="ruleForm.address" size="small"/>
            </el-form-item>
            <el-form-item
                    label="电话"
                    prop="phone"
            >
                <el-input maxlength="30"  clearable v-model="ruleForm.phone" size="small"/>
            </el-form-item>
        </el-form>
        <div style="text-align: center">
            <el-button
                    :loading="submitLoading"
                    @click="submitForm('ruleForm')"
                    type="primary"
                    size="medium"
            >确定提交
            </el-button>
            <el-button @click="handleClose" size="medium">返回</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import api from "@/api/good/enterprise";
    import {mapGetters} from "vuex";

    export default {
        name: "enterprise-from",
        data() {
            var validatePhone = (rule, value, callback) => {
                var phoneReg = /^1\d{10}$/
                if (!value) {
                    callback(new Error('请输入联系电话'));
                } else {
                    if (!phoneReg.test(value)) {
                        callback(new Error('请输入正确电话'));
                    }else{
                        callback()
                    }
                }
            };
            return {
                validatePhone:validatePhone,
                loading: false,
                submitLoading: false,
                ruleForm: {}
            };
        },
        props: {
            enterpriseId: {
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
        components: {},
        computed: {
            ...mapGetters(["direction", "drawerWidth"]),
            getOperatorName() {
                return this.enterpriseId ? "企业编辑" : "企业添加";
            }
        },
        mounted() {
            if (this.enterpriseId) {
                this.infoEnterprise()
            }
        },
        methods: {
            infoEnterprise() {
                this.loading=true
                api.infoEnterprise(this.enterpriseId).then(res => {
                    this.ruleForm = Object.assign({}, res.data ? res.data : {})
                    this.loading = false
                }).catch(e => {
                    this.ruleForm = {}
                    this.loading = false
                });
            },
            handleClose(hide) {
                this.$emit("returnBack");
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        let method = ''
                        let ruleForm = JSON.parse(JSON.stringify(this.ruleForm))
                        if (!this.enterpriseId) {
                            method = 'addEnterprise'
                        } else {
                            method = 'editEnterprise'
                        }
                        api[method](ruleForm).then(res => {
                            this.$message({
                                message: '操作成功',
                                type: "success"
                            });
                            this.submitLoading = false;
                            this.$emit('successSubmit')
                        }).catch(e => {
                            this.submitLoading = false;
                        });
                    }
                })
            },
        }
    };
</script>

<style lang="less">
</style>
