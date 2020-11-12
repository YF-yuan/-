<template>
    <el-dialog
            class="center-dialog"
            center
            append-to-body
            :title="getOperatorName"
            :visible.sync="visible"
            width="500px"
            :before-close="handleClose">
        <el-form ref="menuForm" :model="menuForm" size="small" label-width="100px">
            <el-form-item v-if="menuForm.menuType != 'F'" label="上级菜单" prop="parentId">
                <el-cascader
                        style="width: 100%"
                        filterable
                        v-model="menuForm.parentId"
                        :options="dataList"
                        size="small"
                        placeholder="无上级"
                        :props="{ checkStrictly: true,value:'menuId',
              label:'menuName' ,emitPath:false}"
                        clearable
                ></el-cascader>
            </el-form-item>

            <el-form-item label="菜单类型" prop="menuType">
                <el-radio-group v-model="menuForm.menuType">
                    <el-radio v-if="menuType!='F'" label="M">目录</el-radio>
                    <el-radio v-if="menuType!='F'" label="C">菜单</el-radio>
                    <el-radio v-if="menuType=='F'" label="F">按钮</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                    label="名称"
                    prop="menuName"
                    :rules="{ required: true, message: '名称不能为空', trigger: 'blur' }"
            >
                <el-input clearable v-model="menuForm.menuName" size="small"/>
            </el-form-item>

            <el-form-item
                    v-if="menuForm.menuType != 'F'"
                    label="访问地址"
                    prop="path"
                    :rules="{ required: true, message: '访问地址不能为空', trigger: 'blur' }"
            >
                <el-input clearable v-model="menuForm.path" size="small"/>
            </el-form-item>
            <el-form-item
                    v-if="menuForm.menuType == 'C'"
                    label="文件路径"
                    prop="component"
                    :rules="{ required: true, message: '文件路径不能为空', trigger: 'blur' }"
            >
                <el-input clearable v-model="menuForm.component" size="small"/>
            </el-form-item>
            <el-form-item
                    v-if="menuForm.menuType != 'M'"
                    label="权限"
                    prop="perms"
                    :rules="{ required: true, message: '权限不能为空', trigger: 'blur' }"
            >
                <el-input clearable v-model="menuForm.perms" size="small"/>
            </el-form-item>
            <el-form-item v-if="menuForm.menuType != 'F'" label="图标" prop="icon">
                <div style="display:flex">
                    <el-input clearable v-model="menuForm.icon" size="small"/>
                    <el-button @click="showIconForm" type="small" size="medium">选择图标</el-button>
                </div>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-switch
                        v-model="menuForm.status"
                        :inactive-value="2"
                        :active-value="1"
                        active-text="显示"
                        inactive-text="隐藏"
                ></el-switch>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input-number v-model="menuForm.sort" :min="1" :max="9999" label="排序"></el-input-number>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button
                        :loading="submitLoading"
                        @click="submitForm('menuForm')"
                        type="primary"
                        size="medium"
                >确定
                </el-button>
                <el-button @click="handleClose" size="medium">返回</el-button>
            </span>
        <iconForm @iconClick="iconClick" @returnBack="iconVisible=false" :visible="iconVisible"></iconForm>
    </el-dialog>
</template>

<script>
    import api from "@/api/system/menu/menu";
    import {mapGetters} from "vuex";
    import iconForm from "@/components/iconForm";

    export default {
        name: "paymentFrom",
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
            menuForm: {
                type: Object,
                default() {
                    return {};
                }
            },
            menuType: {
                type: String,
                default() {
                    return '';
                }
            },
            dataList: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        components: {iconForm},
        computed: {
            ...mapGetters(["direction", "drawerWidth"]),
            getOperatorName() {
                let menuForm = JSON.parse(JSON.stringify(this.menuForm));
                var operator = menuForm != '' && menuForm.menuId != undefined ? "修改" : "添加";
                switch (menuForm.menuType) {
                    case 'M':
                        return operator + '目录'
                        break
                    case 'C':
                        return operator + '菜单'
                        break
                    case 'F':
                        return operator + '按钮'
                        break
                }

            }

        },
        methods: {

            iconClick(code) {
                this.iconVisible = false;
                let menuForm = JSON.parse(JSON.stringify(this.menuForm));
                menuForm.icon = code;
                this.menuForm = Object.assign({}, menuForm);
            },
            showIconForm() {
                this.iconVisible = true;
            },
            handleClose(hide) {
                this.$emit("returnBack");
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;

                        let menuForm = JSON.parse(JSON.stringify(this.menuForm))
                        let method = menuForm != '' && menuForm.menuId != undefined ? "editMenu" : "addMenu"
                        api[method](menuForm)
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
    .menu-from {
    }
</style>
