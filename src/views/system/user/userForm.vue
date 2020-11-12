<template>
    <el-dialog
            class="center-dialog"
            center
            :title="getOperatorName"
            :visible.sync="visible"
            width="500px"
            :before-close="handleClose">
        <el-form ref="ruleForm" :model="ruleForm" size="small" label-width="100px">
            <el-form-item
                    label="用户名"
                    prop="username"
                    :rules="{ required: true, message: '名称不能为空', trigger: 'blur' }"
            >
                <el-input :disabled="userId?true:false" clearable v-model="ruleForm.username" size="small"/>
            </el-form-item>
            <el-form-item
                    label="昵称"
                    prop="nickname"
            >
                <el-input clearable v-model="ruleForm.nickname" size="small"/>
            </el-form-item>
            <el-form-item
                    label="密码"
                    prop="password"
            >
                <el-input type="password" auto-complete="new-password" clearable v-model="ruleForm.password"
                          size="small"/>
                <div class="span-tip">不修改留空即可</div>
            </el-form-item>
            <el-form-item
                    label="确认密码"
                    :rules="{validator:validatePassword, trigger: 'blur' }"
                    prop="two_admin_password">
                <el-input type="password" auto-complete="new-password" clearable
                          v-model="ruleForm.two_admin_password" size="small"/>
            </el-form-item>
            <el-form-item
                    label="手机号"
                    prop="phoneNumber"
                    :rules="{required: true,validator: validatePhone, trigger: 'blur'}"
            >
                <el-input oninput="value=value.replace(/[^\d]/g,'')" clearable maxlength="11"
                          v-model="ruleForm.phoneNumber" size="small"/>
            </el-form-item>
            <el-form-item
                    label="邮箱"
                    prop="email"
                    :rules="{ required: true, message: '邮箱不能为空', trigger: 'blur' }"
            >
                <el-input clearable
                          v-model="ruleForm.email" size="small"/>
            </el-form-item>
            <el-form-item
                    label="角色"
                    prop="rules"
            >
                <el-select filterable multiple clearable v-model="ruleForm.roleIds">
                    <el-option v-for="(item,index) in roleList" :key="index" :label="item.roleName"
                               :value="item.roleId"></el-option>
                </el-select>
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
    import api from "@/api/system/user/user";
    import {mapGetters} from "vuex";

    export default {
        name: "user-from",
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
            var validatePassword = (rule, value, callback) => {
                if (!value) {
                    if (this.ruleForm.password) {
                        callback('请输入确认密码');
                    } else {
                        callback()
                    }
                } else {
                    if (value != this.ruleForm.password) {
                        callback(new Error('两次密码不一致'));
                    } else {
                        callback()
                    }
                }
            };
            return {
                validatePassword:validatePassword,
                validatePhone:validatePhone,
                submitLoading: false,
                ruleForm: {

                }
            };
        },
        props: {
            userId:{
                userId: String,
                default() {
                    return '';
                }
            },
            roleList:{
                type: Array,
                default() {
                    return [];
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
                return this.userId ? "用户编辑" : "用户添加";
            }
        },
        mounted() {
            if (this.userId) {
                this.getUserInfo()
            }
        },
        methods: {
            getUserInfo() {
                api.getUserInfo(this.userId)
                    .then(res => {
                        let ruleForm = Object.assign({},res.data)
                        ruleForm.password=''
                        this.ruleForm=Object.assign({},ruleForm)
                    })
                    .catch(e => {
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
                        ruleForm.roleIds=ruleForm.roleIds?ruleForm.roleIds:[]
                        if (!this.userId) {
                            method = 'addUser'
                        } else {
                            method = 'editUser'
                        }
                        api[method](ruleForm)
                            .then(res => {
                                this.$message({
                                    message: '操作成功',
                                    type: "success"
                                });
                                this.submitLoading = false;
                                this.$emit('successSubmit')
                            })
                            .catch(e => {
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
