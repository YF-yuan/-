<template>
    <el-dialog
            class="center-dialog"
            center
            :title="dictForm.dictId?'编辑字典':'新增字典'"
            :visible.sync="visible"
            width="500px"
            :before-close="handleClose">
        <el-form ref="dictForm" :model="dictForm" size="small" label-width="100px">
            <el-form-item
                    v-if="!dictForm.parentId"
                    label="字典编号"
                    prop="code"
                    :rules="{ required: true, message: '字典编号不能为空', trigger: 'blur' }"
            >
                <el-input clearable v-model="dictForm.code" size="small"/>
            </el-form-item>
            <el-form-item
                    label="字典名称"
                    prop="dictValue"
                    :rules="{ required: true, message: '字典名称不能为空', trigger: 'blur' }"
            >
                <el-input clearable v-model="dictForm.dictValue" size="small"/>
            </el-form-item>
            <el-form-item
                    v-if="dictForm.parentId"
                    label="字典健值"
                    prop="dictKey"
                    :rules="{ required: true, message: '字典健值不能为空', trigger: 'blur' }"
            >
                <el-input clearable v-model="dictForm.dictKey" size="small"/>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input-number v-model="dictForm.sort" :min="1" :max="9999" label="排序"></el-input-number>
            </el-form-item>
            <el-form-item label="是否封存" prop="status">
                <el-switch
                        v-model="dictForm.status"
                        :inactive-value="2"
                        :active-value="1"
                        active-text="显示"
                        inactive-text="隐藏"
                ></el-switch>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button
                        :loading="submitLoading"
                        @click="submitForm('dictForm')"
                        type="primary"
                        size="medium"
                >确定
                </el-button>
                <el-button @click="$emit('returnBack')" size="medium">返回</el-button>
            </span>
    </el-dialog>
</template>

<script>
    import api from "@/api/system/dict/dict";
    import {mapGetters} from "vuex";

    export default {
        name: "dict-from",
        data() {
            return {
                submitLoading: false,
                iconVisible: false
            };
        },
        props: {
            visible: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            dictForm: {
                type: Object,
                default() {
                    return {};
                }
            },
        },
        components: {},
        computed: {
            ...mapGetters(["direction", "drawerWidth"]),
        },
        methods: {
            handleClose(hide) {

                this.$emit("returnBack");
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        let method = ''
                        if (this.dictForm.dictId) {
                            method = 'editDict'
                        } else {
                            method = 'addDict'
                        }
                        api[method](this.dictForm).then(res => {
                            this.$message({
                                message: '操作成功',
                                type: "success"
                            });
                            this.submitLoading = false;
                            this.$emit("successSubmit");
                        }).catch(e => {
                            this.submitLoading = false;
                        });
                    }
                });
            }
        }
    };
</script>

<style lang="less">
    .dict-from {
    }
</style>
