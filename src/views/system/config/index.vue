<template>
    <div class="main-box config">
        <el-button
                v-if="permission.system_config_add"
                style="margin-bottom: 10px"
                icon="el-icon-plus"
                @click="addConfig"
                size="small"
                type="primary"
        >添加
        </el-button>
        <el-table ref="table" :height="tableHeight" size="medium" v-loading="tableLoading" :data="dataList" border>
            <el-table-column align="center" prop="configId" label="ID"></el-table-column>
            <el-table-column align="center" prop="configName" label="参数名称"></el-table-column>
            <el-table-column align="center" prop="configKey" label="参数健名"></el-table-column>
            <el-table-column align="center" prop="configValue" label="参数键值"></el-table-column>
            <el-table-column width="150" label="操作">
                <template slot-scope="{row}">
                        <el-button v-if="permission.system_config_edit" @click="editConfig(row)" type="primary" size="mini" icon="el-icon-edit">
                            编辑</el-button>
                        <el-button
                                v-if="permission.system_config_remove"
                                type="danger"
                                size="mini"
                                icon="el-icon-delete"
                                @click="handleDelete(row)"
                        >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-current">
            <el-pagination
                    :current-page="page"
                    :page-size="pageSize"
                    prev-text="上一页"
                    next-text="下一页"
                    background
                    layout="total, prev, pager, next, jumper"
                    style="display: inline-block;"
                    :total="count"
                    @current-change="handleCurrentChange"
            />
        </div>
        <el-dialog
                class="center-dialog"
                center
                :title="type==1?'配置添加':'配置编辑'"
                :visible.sync="visible"
                width="500px"
                :before-close="handleClose">
            <el-form ref="configForm" :model="configForm" size="small" label-width="100px">
                <el-form-item
                        label="参数名称"
                        prop="configName"
                        :rules="{ required: true, message: '参数名称', trigger: 'blur' }"
                >
                    <el-input :disabled="type==2?true:false" clearable v-model="configForm.configName" size="small"/>
                </el-form-item>
                <el-form-item
                        label="参数键名"
                        prop="configKey"
                        :rules="{ required: true, message: '参数键名不能为空', trigger: 'blur' }"
                >
                    <el-input clearable v-model="configForm.configKey" size="small"/>
                </el-form-item>
                <el-form-item
                        label="参数键值"
                        prop="configValue"
                        :rules="{ required: true, message: '参数键值不能为空', trigger: 'blur' }"
                >
                    <el-input clearable v-model="configForm.configValue" size="small"/>

                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button
                        :loading="submitLoading"
                        @click="submitForm('configForm')"
                        type="primary"
                        size="medium"
                >确定
                </el-button>
                <el-button @click="handleClose" size="medium">返回</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from "@/api/system/config/config";
    import {mapGetters} from "vuex";

    export default {
        name: "config-index",
        data() {
            return {
                count: 0,
                submitLoading: false,
                page: 1,
                pageSize: parseInt((document.body.clientHeight - 230 - 43) / 44.5),
                tableHeight: document.body.clientHeight - 230,
                tableLoading: false,
                dataList: [],
                roleList: [],
                type: 0,
                visible: false,
                configForm: {},
            };
        },
        mounted() {
            this.getConfigList();
        },
        computed: {
            ...mapGetters(["direction", "drawerWidth", "permission"])
        },
        components: {},
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        let method = ''
                        let configForm = JSON.parse(JSON.stringify(this.configForm))
                        configForm.permission = this.checkedKeys
                        configForm.authGroup=configForm.authGroup?configForm.authGroup.join(','):''
                        if (this.type == 1) {
                            method = 'addConfig'
                        } else {
                            method = 'editConfig'
                        }
                        api[method](configForm)
                            .then(res => {
                                this.$message({
                                    message: '操作成功',
                                    type: "success"
                                });
                                this.submitLoading = false;
                                this.visible = false
                                this.getConfigList()
                            })
                            .catch(e => {
                                this.submitLoading = false;
                            });
                    }
                })
            },
            handleClose(hide) {
                this.visible = false
            },
            handleDelete(row) {
                this.$confirm('此操作将删除该配置, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableLoading = true;
                    api.dropConfig(row.configId).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getConfigList()
                    }).catch(e => {
                        this.tableLoading = false;
                    });
                }).catch(() => {
                });
            },
            viewConfig(row){

            },
            editConfig(row) {
                this.type = 2;
                this.$nextTick(function () {
                    let configForm = JSON.parse(JSON.stringify(row))
                    configForm.password = ''
                    this.configForm = Object.assign({}, configForm)
                    this.visible = true;
                })
            },
            addConfig() {
                this.type = 1;
                this.configForm = {}
                this.$nextTick(function () {
                    this.visible = true;
                });
            },
            successSubmit() {
                this.visible = false;
                this.getConfigList();
            },
            handleCurrentChange(val) {
                this.page = val
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.getConfigList()
            },
            getConfigList() {
                this.tableLoading = true;
                api
                    .getConfigList(this.page, this.pageSize)
                    .then(res => {
                        const {records, total} = res.data
                        this.dataList = records ? records : []
                        this.count = total ? parseInt(total) : 0
                        this.tableLoading = false;
                    })
                    .catch(e => {
                        this.dataList = []
                        this.tableLoading = false;
                    });
            }
        }
    };
</script>

<style lang="less">
    .config {

    }
</style>
