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
                    label="包装名称"
                    prop="packageName"
                    :rules="{ required: true, message: '包装名称不能为空', trigger: 'blur' }"
            >
                <el-input maxlength="30"  :disabled="isShow?true:false" clearable v-model="ruleForm.packageName" size="small"/>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-switch
                        :disabled="isShow?true:false"
                        v-model="ruleForm.status"
                        :inactive-value="2"
                        :active-value="1"
                        active-text="正常"
                        inactive-text="禁用"
                ></el-switch>
            </el-form-item>
        </el-form>
        <div style="text-align: center">
            <el-button
                    v-if="!isShow"
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
    import api from "@/api/good/package";
    import {mapGetters} from "vuex";

    export default {
        name: "package-from",
        data() {
            return {
                loading: false,
                submitLoading: false,
                ruleForm: {
                    status:1
                }
            };
        },
        props: {
            packageId: {
                type: Number,
                default() {
                    return 0;
                }
            },
            isShow: {
                type: Boolean,
                default() {
                    return false;
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
                if (this.isShow) {
                    return '包装详情'
                } else {
                    return this.packageId ? "包装编辑" : "包装添加";
                }
            }
        },
        mounted() {
            if (this.packageId) {
                this.infoPackage()
            }
        },
        methods: {
            infoPackage() {
                this.loading=true
                api.infoPackage(this.packageId).then(res => {
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
                        if (!this.packageId) {
                            method = 'addPackage'
                        } else {
                            method = 'editPackage'
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
