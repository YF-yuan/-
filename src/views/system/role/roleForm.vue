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
                    label="角色名称"
                    prop="roleName"
                    :rules="{ required: true, message: '名称不能为空', trigger: 'blur' }"
            >
                <el-input clearable v-model="ruleForm.roleName" size="small"/>
            </el-form-item>
            <el-form-item
                    label="简称"
                    prop="roleKey"
            >
                <el-input clearable v-model="ruleForm.roleKey" size="small"/>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input-number v-model="ruleForm.sort" :min="1" :max="999" label="排序"></el-input-number>
            </el-form-item>
            <el-form-item
                    label="角色权限"
                    prop="rulesList"
            >
                <el-tree
                        v-if="isTreeLoad"
                        ref="tree"
                        :data="filterMenuList"
                        highlight-current
                        check-strictly
                        show-checkbox
                        :default-expanded-keys="checkedKeys"
                        :default-checked-keys="checkedKeys"
                        node-key="menuId"
                        @check-change="handleCheckChange"
                        :props="defaultProps">
                </el-tree>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button
                        :loading="submitLoading"
                        @click="submitForm('ruleForm')"
                        type="primary"
                        size="medium"
                >确定
        </el-button>
        <el-button @click="handleClose" size="medium">返回</el-button>
            </span>
    </el-dialog>
</template>

<script>
    import api from "@/api/system/role/role";
    import menuApi from "@/api/system/menu/menu";
    import {mapGetters} from "vuex";

    export default {
        name: "role-from",
        data() {
            return {
                isTreeLoad:false,
                isTreeBl:false,
                checkedKeys:[],
                submitLoading: false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                ruleForm: {
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
            filterMenuList: {
                type: Array,
                default() {
                    return [];
                }
            },
            roleId: {
                type: Number,
                default() {
                    return 0;
                }
            },
        },
        components: {},
        computed: {
            ...mapGetters(["direction", "drawerWidth","menuList"]),
            getOperatorName() {
                return this.roleId ? "角色编辑" : "角色添加";
            }
        },
        mounted() {
            if (this.roleId) {
                this.getRoleInfo()
            }else{
                this.isTreeLoad=true
            }
        },
        methods: {
            getRoleInfo() {
                api.getRoleInfo(this.roleId).then(res => {
                    let ruleForm = JSON.parse(JSON.stringify(res.data))
                    this.ruleForm = Object.assign({}, ruleForm)
                    this.checkedKeys = ruleForm.menuIds ? ruleForm.menuIds : []
                    this.$nextTick(function () {
                        this.isTreeLoad=true
                    })
                }).catch(e => {
                });
            },
            handleClose(hide) {
                this.$emit("returnBack");
            },
            childNode(childList, type) {
                if (childList && childList.length > 0) {
                    childList.map(item => {
                        if (type) {
                            for (let i = 0; i < this.checkedKeys.length; i++) {
                                if (item.menuId == this.checkedKeys[i]) {
                                    this.checkedKeys.splice(i, 1)
                                    break
                                }
                            }
                        } else {
                            if (!this.checkedKeys.some(key => key == item.menuId)) {
                                this.checkedKeys.push(item.menuId)
                            }
                        }
                        this.childNode(item.children, type)
                    })
                }
            },
            parentNode(pid, type) {
                if (pid) {
                    this.findChild(this.menuList, pid, type)
                }
            },
            findChild(childList, pid, type) {
                let child = childList.find(item => item.menuId == pid)
                if (child) {
                    if (!this.checkedKeys.some(key => key == child.menuId)) {
                        this.checkedKeys.push(child.menuId)
                        if (child.parentId && child.parentId !== 0) {
                            this.findChild(this.menuList, child.parentId)
                        }
                    }
                } else {
                    childList.map(item => {
                        if (item.children && item.children.length > 0) {
                            this.findChild(item.children, pid)
                        }
                    })
                }
            },
            handleCheckChange(data, checked, indeterminate) {
                if (!this.isTreeBl) {
                    if (checked) {
                        if (!this.checkedKeys.some(key => key == data.menuId)) {
                            this.checkedKeys.push(data.menuId)
                        }
                        this.childNode(data.children)
                        this.parentNode(data.parentId)
                    } else {
                        for (let i = 0; i < this.checkedKeys.length; i++) {
                            if (data.menuId == this.checkedKeys[i]) {
                                this.checkedKeys.splice(i, 1)
                                break
                            }
                        }
                        this.childNode(data.children, 1)
                    }
                    this.isTreeBl = true
                    this.$refs.tree.setCheckedKeys(this.checkedKeys);
                    let me = this
                    this.$nextTick(function () {
                        me.isTreeBl = false
                    })
                }
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        let method = ''
                        let ruleForm = JSON.parse(JSON.stringify(this.ruleForm))
                        ruleForm.menuIds = this.checkedKeys
                        if (!this.roleId) {
                            method = 'addRole'
                            ruleForm.parentId = 0
                        } else {
                            method = 'editRole'
                        }
                        api[method](ruleForm)
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
                })
            },
        }
    };
</script>

<style lang="less">
</style>
