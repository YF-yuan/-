<template>
    <el-dialog
            class="center-dialog"
            center
            :title="typeStatus==2?'编辑分类':'新增分类'"
            :visible.sync="visible"
            width="500px"
            :before-close="handleClose">
        <el-form v-loading="loading" ref="dictForm" :model="ruleForm" size="small" label-width="100px">
            <el-form-item
                    v-if="!typeOneName"
                    label="一级分类"
                    prop="typeName"
                    :rules="{ required: true, message: '一级分类不能为空', trigger: 'blur' }"
            >
                <el-input  maxlength="30" v-if="!ruleForm.parentId" clearable v-model="ruleForm.typeName" size="small"/>
            </el-form-item>
            <el-form-item
                    v-if="typeOneName"
                    label="一级分类"
            >
                <el-input :disabled="true" clearable v-model="typeOneName" size="small"/>
            </el-form-item>
            <el-form-item
                    v-if="typeOneName"
                    label="二级分类"
                    prop="typeName"
                    :rules="{ required: true, message: '二级分类不能为空', trigger: 'blur' }"
            >
                <el-input maxlength="30"  clearable v-model="ruleForm.typeName" size="small"/>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-switch
                        v-model="ruleForm.status"
                        :inactive-value="2"
                        :active-value="1"
                        active-text="正常"
                        inactive-text="禁用"
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
    import api from "@/api/good/type";
    import {mapGetters} from "vuex";

    export default {
        name: "type-from",
        data() {
            return {
                ruleForm:{
                    status:1
                },
                submitLoading: false,
                loading:false
            };
        },
        props: {
            visible: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            typeId: {
                type: Number,
                default() {
                    return 0;
                }
            },
            typeStatus: {
                type: Number,
                default() {
                    return 0;
                }
            },
            typeOneName: {
                type: String,
                default() {
                    return '';
                }
            },
        },
        components: {},
        computed: {
            ...mapGetters(["direction", "drawerWidth"]),
        },
        mounted(){
          if(this.typeStatus==2){
              this.infoType()
          }
        },
        methods: {
            handleClose(hide) {
                this.$emit("returnBack");
            },
            infoType(){
                this.loading=true
                api.infoType(this.typeId).then(res => {
                    this.ruleForm=Object.assign({},res.data?res.data:{})
                    this.loading=false
                }).catch(e => {
                    this.loading=false
                });
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        let method = ''
                        if (this.typeStatus==2) {
                            method = 'editType'
                        } else {
                            method = 'addType'
                        }
                        let ruleForm=JSON.parse(JSON.stringify(this.ruleForm))
                        if(this.typeStatus==1&&this.typeId){
                            ruleForm.parentId=this.typeId
                        }
                        api[method](ruleForm).then(res => {
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
    .type-from {
    }
</style>
