<template>
    <el-dialog
            class="center-dialog"
            center
            :title="getOperatorName"
            :visible.sync="visible"
            width="500px"
            :before-close="handleClose">
        <el-form ref="deptForm" :model="deptForm" size="small" label-width="100px">
            <!--            <el-form-item label="上级菜单" prop="parentId">-->
            <!--                <el-cascader-->
            <!--                        style="width: 100%"-->
            <!--                        filterable-->
            <!--                        v-model="deptForm.parentId"-->
            <!--                        :options="dataList"-->
            <!--                        size="small"-->
            <!--                        placeholder="无上级"-->
            <!--                        :props="{ checkStrictly: true,value:'deptId',-->
            <!--              label:'deptName' ,emitPath:false}"-->
            <!--                        clearable-->
            <!--                ></el-cascader>-->
            <!--            </el-form-item>-->


            <el-form-item
                    label="部门名称"
                    prop="deptName"
                    :rules="{ required: true, message: '部门名称不能为空', trigger: 'blur' }"
            >
                <el-input :disabled="isShow" maxlength="50" clearable v-model="deptForm.deptName" size="small"/>
            </el-form-item>

            <el-form-item
                    label="负责人"
                    prop="leader"
                    :rules="{ required: true, message: '负责人不能为空', trigger: 'blur' }"
            >
                <el-input :disabled="isShow" maxlength="50" clearable v-model="deptForm.leader" size="small"/>
            </el-form-item>
            <el-form-item
                    label="联系电话"
                    prop="phone"
                    :rules="[
                    {required: true,validator: validatePhone, trigger: 'blur'}
                    ]"
            >
                <el-input oninput="value=value.replace(/[^\d]/g,'')" :disabled="isShow" maxlength="11" clearable v-model="deptForm.phone" size="small"/>
            </el-form-item>
            <el-form-item
                    label="备注"
                    prop="remark"
            >
                <el-input  :rows="4" :disabled="isShow" show-word-limit maxlength="500" type="textarea" clearable v-model="deptForm.remark"
                          size="small"/>
            </el-form-item>
            <!--            <el-form-item label="状态" prop="status">-->
            <!--                <el-switch-->
            <!--                        v-model="deptForm.status"-->
            <!--                        :inactive-value="2"-->
            <!--                        :active-value="1"-->
            <!--                        active-text="显示"-->
            <!--                        inactive-text="隐藏"-->
            <!--                ></el-switch>-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="排序" prop="sort">-->
            <!--                <el-input-number v-model="deptForm.sort" :min="1" :max="9999" label="排序"></el-input-number>-->
            <!--            </el-form-item>-->
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button
                        v-if="!isShow"
                        :loading="submitLoading"
                        @click="submitForm('deptForm')"
                        type="primary"
                        size="medium"
                >确定
                </el-button>
                <el-button @click="$emit('returnBack')" size="medium">返回</el-button>
            </span>
    </el-dialog>
</template>

<script>
    import api from "@/api/system/dept/dept";
    import {mapGetters} from "vuex";

    export default {
        name: "paymentFrom",
        data() {
            var phoneReg = /^1\d{10}$/
            var validatePhone = (rule, value, callback) => {
                if (value) {
                    if (!phoneReg.test(value)) {
                        callback(new Error('请输入正确手机号码'));
                    } else {
                        callback();
                    }
                } else {
                    callback(new Error('手机号码必填'));
                }
            };
            return {
                validatePhone: validatePhone,
                submitLoading: false,
                iconVisible: false,
                deptForm: {
                    status: 1,
                    sort: 1,
                }
            };
        },
        props: {
            visible: {
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
            deptId: {
                type: Number
            },
            dataList: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        computed: {
            ...mapGetters(["direction", "drawerWidth"]),
            getOperatorName() {
                if(this.isShow){
                    return '部门详情'
                }else{
                    return this.deptId ? "部门编辑" : "部门添加";
                }
            }

        },
        mounted() {
            if (this.deptId) {
                this.getDeptInfo()
            }
        },
        methods: {
            handleClose(hide) {
                this.$emit("returnBack");
            },
            getDeptInfo() {
                api.getDeptInfo(this.deptId)
                    .then(res => {
                        this.deptForm=Object.assign({},res.data)
                    })
                    .catch(e => {
                    });
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;

                        let deptForm = JSON.parse(JSON.stringify(this.deptForm))
                        let method = deptForm.deptId ? "editDept" : "addDept"
                        api[method](deptForm)
                            .then(res => {
                                this.$message({
                                    message: '操作成功',
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
    .dept-from {
    }
</style>
