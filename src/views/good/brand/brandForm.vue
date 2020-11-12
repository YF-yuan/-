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
                    label="品牌名称"
                    prop="brandName"
                    :rules="{ required: true, message: '品牌名称不能为空', trigger: 'blur' }"
            >
                <el-input maxlength="30"  :disabled="isShow?true:false" clearable v-model="ruleForm.brandName" size="small"/>
            </el-form-item>
            <el-form-item
                    label="品牌logo"
                    prop="brandLogo"
            >
                <uploadImage :disabled="isShow?true:false" v-model="ruleForm.brandLogo"></uploadImage>
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
    import api from "@/api/good/brand";
    import {mapGetters} from "vuex";
    import uploadImage from '@/components/uploadImage'

    export default {
        name: "brand-from",
        data() {
            return {
                loading: false,
                submitLoading: false,
                ruleForm: {}
            };
        },
        props: {
            brandId: {
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
                    return '品牌详情'
                } else {
                    return this.brandId ? "品牌编辑" : "品牌添加";
                }
            }
        },
        mounted() {
            if (this.brandId) {
                this.infoBrand()
            }
        },
        methods: {
            infoBrand() {
                this.loading=true
                api.infoBrand(this.brandId).then(res => {
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
                        if (!this.brandId) {
                            method = 'addBrand'
                        } else {
                            method = 'editBrand'
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
