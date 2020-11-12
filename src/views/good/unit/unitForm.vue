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
                    label="单位名称"
                    prop="unitName"
                    :rules="{ required: true, message: '单位名称不能为空', trigger: 'blur' }"
            >
                <el-input maxlength="30"  :disabled="isShow?true:false" clearable v-model="ruleForm.unitName" size="small"/>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-switch
                        v-model="ruleForm.status"
                        :inactive-value="2"
                        :active-value="1"
                        active-text="正常"
                        inactive-text="禁用"
                        :disabled="isShow?true:false"
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
    import api from "@/api/good/unit";
    import {mapGetters} from "vuex";

    export default {
        name: "unit-from",
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
            unitId: {
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
                    return '单位详情'
                } else {
                    return this.unitId ? "单位编辑" : "单位添加";
                }
            }
        },
        mounted() {
            if (this.unitId) {
                this.infoUnit()
            }
        },
        methods: {
            infoUnit() {
                this.loading=true
                api.infoUnit(this.unitId).then(res => {
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
                        if (!this.unitId) {
                            method = 'addUnit'
                        } else {
                            method = 'editUnit'
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
