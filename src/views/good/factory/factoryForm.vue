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
                    label="厂家名称"
                    prop="factoryName"
                    :rules="{ required: true, message: '厂家名称不能为空', trigger: 'blur' }"
            >
                <el-input maxlength="30"  :disabled="isShow?true:false" clearable v-model="ruleForm.factoryName" size="small"/>
            </el-form-item>
            <el-form-item
                    label="厂家logo"
                    prop="factoryLogo"
            >
                <uploadImage :disabled="isShow?true:false" v-model="ruleForm.factoryLogo"></uploadImage>
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
    import api from "@/api/good/factory";
    import {mapGetters} from "vuex";
    import uploadImage from '@/components/uploadImage'

    export default {
        name: "factory-from",
        data() {
            return {
                loading: false,
                submitLoading: false,
                ruleForm: {}
            };
        },
        props: {
            factoryId: {
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
        components: {uploadImage},
        computed: {
            ...mapGetters(["direction", "drawerWidth"]),
            getOperatorName() {
                if (this.isShow) {
                    return '厂家详情'
                } else {
                    return this.factoryId ? "厂家编辑" : "厂家添加";
                }
            }
        },
        mounted() {
            if (this.factoryId) {
                this.infoFactory()
            }
        },
        methods: {
            infoFactory() {
                this.loading=true
                api.infoFactory(this.factoryId).then(res => {
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
                        if (!this.factoryId) {
                            method = 'addFactory'
                        } else {
                            method = 'editFactory'
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
