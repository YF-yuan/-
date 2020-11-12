<template>
    <div class="main-box package-index">
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item label="包装名称">
                <el-input
                        clearable
                        v-model="searchParam.packageName"
                        size="small"
                        placeholder="请输入包装名称"
                        style="width: 200px"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                        :loading="tableLoading"
                        icon="el-icon-search"
                        @click="search"
                        size="small"
                        type="primary"
                >搜索
                </el-button>
                <el-button
                        icon="el-icon-refresh-right"
                        @click="count=0;initSearchParam();search()"
                        type="primary"
                        size="small"
                        style="background-color: #fff; border: 1px solid #ccc ; color: #666"
                >清空
                </el-button>
            </el-form-item>
        </el-form>
        <div style="margin-bottom: 10px">
            <el-button
                    v-if="permission.good_package_add"
                    icon="el-icon-plus"
                    @click="addPackage"
                    size="small"
                    type="primary"
            >添加包装
            </el-button>
        </div>
        <el-table ref="table" :height="tableHeight" size="medium" v-loading="tableLoading" :data="dataList" border>
            <el-table-column min-width="100" align="center" prop="packageId" label="ID"></el-table-column>
            <el-table-column min-width="100" align="center" prop="packageName" label="包装名称"></el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="{row}">
                    <el-tag size="mini" v-if="row.status==1">正常</el-tag>
                    <el-tag size="mini" v-else type="danger">禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column width="290" label="操作">
                <template slot-scope="{row}">
                    <el-button v-if="permission.good_package_info" @click="infoPackage(row)"
                               type="primary" size="mini" icon="el-icon-view">查看
                    </el-button>
                    <el-button v-if="permission.good_package_edit&&permission.good_package_info" @click="editPackage(row)"
                               type="primary" size="mini" icon="el-icon-edit">编辑
                    </el-button>
                    <el-button
                            v-if="permission.good_package_forbidden && row.status == 1"
                            type="danger"
                            size="mini"
                            icon="el-icon-close"
                            @click="updateStatus(row)"
                    > 禁用
                    </el-button>
                    <el-button
                            v-if="permission.good_package_enable && row.status == 2"
                            type="primary"
                            size="mini"
                            icon="el-icon-check"
                            @click="updateStatus(row)"
                    > 启用
                    </el-button>
                    <el-button
                            v-if="permission.good_package_remove"
                            type="danger"
                            size="mini"
                            icon="el-icon-delete"
                            @click="handleDelete(row)"
                    > 删除
                    </el-button>
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
        <packageForm
                :isShow="isShow"
                @successSubmit="successSubmit"
                v-if="visible"
                @returnBack="visible=false"
                :packageId="packageId"
                :visible="visible"
        ></packageForm>
    </div>
</template>

<script>
    import api from "@/api/good/package";
    import {mapGetters} from "vuex";
    import packageForm from './packageForm'

    export default {
        name: "package-index",
        data() {
            return {
                searchParam: {
                    packageName: ''
                },
                count: 0,
                page: 1,
                pageSize: parseInt((document.body.clientHeight - 280 - 43) / 44.5),
                tableHeight: document.body.clientHeight - 280,
                tableLoading: false,
                dataList: [],
                visible: false,
                packageId: 0
            };
        },
        mounted() {
            this.getPackageList()
        },
        computed: {
            ...mapGetters(["direction", "drawerWidth", "permission"])
        },
        components: {packageForm},
        methods: {
            initSearchParam() {
                this.searchParam = {
                    packageName: ''
                }
            },
            updateStatus(row) {
                this.$confirm(`此操作将${row.status == 1 ? '禁用' : '启用'}该包装是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableLoading = true;
                    let method = 'forbiddenPackage'
                    if (row.status == 2) {
                        method = 'enablePackage'
                    }
                    api[method](row.packageId).then(res => {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        this.getPackageList()
                    }).catch(e => {
                        this.tableLoading = false;
                    });
                }).catch(() => {
                });
            },
            handleDelete(row) {
                this.$confirm(`此操作将删除该包装是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableLoading = true;
                    api.removePackage(row.packageId).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getPackageList()
                    }).catch(e => {
                        this.tableLoading = false;
                    });
                }).catch(() => {
                });
            },
            editPackage(row) {
                this.packageId = row.packageId;
                this.isShow = false
                this.$nextTick(function () {
                    this.visible = true;
                })
            },
            addPackage() {
                this.packageId = 0;
                this.isShow = false
                this.$nextTick(function () {
                    this.visible = true;
                });
            },
            infoPackage(row) {
                this.packageId = row.packageId;
                this.isShow = true
                this.$nextTick(function () {
                    this.visible = true;
                });
            },
            successSubmit() {
                this.visible = false;
                this.getPackageList();
            },
            search() {
                this.page = 1
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.count = 1
                this.getPackageList()
            },
            handleCurrentChange(val) {
                this.page = val
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.getPackageList()
            },
            getPackageList() {
                this.tableLoading = true;
                api.getPackageList(this.page, this.pageSize, this.searchParam).then(res => {
                    const {records, total} = res.data
                    this.dataList = records ? records : []
                    this.count = total ? parseInt(total) : 0
                    this.tableLoading = false;
                }).catch(e => {
                    this.dataList = []
                    this.tableLoading = false;
                });
            }
        }
    };
</script>

<style lang="less">
    .package-index {

    }
</style>
