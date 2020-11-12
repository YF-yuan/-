<template>
    <div class="main-box factory-index">
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item label="厂家">
                <el-input
                        clearable
                        v-model="searchParam.factoryName"
                        size="small"
                        placeholder="请输入厂家名称"
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
                        @click="count=0;initSearchParam();getFactoryList()"
                        type="primary"
                        size="small"
                        style="background-color: #fff; border: 1px solid #ccc ; color: #666"
                >清空
                </el-button>
            </el-form-item>
        </el-form>
        <div style="margin-bottom: 10px">
            <el-button
                    v-if="permission.good_factory_add"
                    icon="el-icon-plus"
                    @click="addFactory"
                    size="small"
                    type="primary"
            >添加厂家
            </el-button>
            <el-button
                    :loading="tableLoading"
                    v-if="permission.good_factory_export"
                    icon="el-icon-download"
                    @click="exportFactory"
                    size="small"
                    type="primary"
            >导出
            </el-button>
        </div>
        <el-table ref="table" :height="tableHeight" size="medium" v-loading="tableLoading" :data="dataList" border>
            <el-table-column min-width="100" align="center" prop="factoryId" label="ID"></el-table-column>
            <el-table-column min-width="100" align="center" prop="factoryName" label="厂家名称"></el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="{row}">
                    <el-tag size="mini" v-if="row.status==1">正常</el-tag>
                    <el-tag size="mini" v-else type="danger">禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column width="290" label="操作">
                <template slot-scope="{row}">
                    <el-button v-if="permission.good_factory_info" @click="infoFactory(row)"
                               type="primary" size="mini" icon="el-icon-view">查看
                    </el-button>
                    <el-button v-if="permission.good_factory_edit&&permission.good_factory_info" @click="editFactory(row)"
                               type="primary" size="mini" icon="el-icon-edit">编辑
                    </el-button>
                    <el-button
                            v-if="permission.good_factory_forbidden && row.status == 1"
                            type="danger"
                            size="mini"
                            icon="el-icon-close"
                            @click="updateStatus(row)"
                    > 禁用
                    </el-button>
                    <el-button
                            v-if="permission.good_factory_enable && row.status == 2"
                            type="primary"
                            size="mini"
                            icon="el-icon-check"
                            @click="updateStatus(row)"
                    > 启用
                    </el-button>
                    <el-button
                            v-if="permission.good_factory_remove"
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
        <factoryForm
                :isShow="isShow"
                @successSubmit="successSubmit"
                v-if="visible"
                @returnBack="visible=false"
                :factoryId="factoryId"
                :visible="visible"
        ></factoryForm>
    </div>
</template>

<script>
    import api from "@/api/good/factory";
    import {mapGetters} from "vuex";
    import factoryForm from './factoryForm'

    export default {
        name: "factory-index",
        data() {
            return {
                searchParam:{
                    factoryName:''
                },
                count: 0,
                page: 1,
                pageSize: parseInt((document.body.clientHeight - 280 - 43) / 44.5),
                tableHeight: document.body.clientHeight - 280,
                tableLoading: false,
                dataList: [],
                visible: false,
                factoryId: 0
            };
        },
        mounted() {
            this.getFactoryList()
        },
        computed: {
            ...mapGetters(["direction", "drawerWidth", "permission"])
        },
        components: {factoryForm},
        methods: {
            exportFactory(){
                this.tableLoading = true
                api.exportFactory(this.searchParam).then(res => {
                    window.open(res.data)
                    this.tableLoading = false
                }).catch(e => {
                    this.tableLoading = false;
                });
            },
            initSearchParam() {
                this.searchParam = {
                    factoryName: ''
                }
            },
            updateStatus(row){
                this.$confirm(`此操作将${row.status==1?'禁用':'启用'}该厂家是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableLoading = true;
                    let method='forbiddenFactory'
                    if(row.status==2){
                        method='enableFactory'
                    }
                    api[method](row.factoryId).then(res => {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        this.getFactoryList()
                    }).catch(e => {
                        this.tableLoading = false;
                    });
                }).catch(() => {
                });
            },
            handleDelete(row) {
                this.$confirm(`此操作将删除该厂家是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableLoading = true;
                    api.removeFactory(row.factoryId).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getFactoryList()
                    }).catch(e => {
                        this.tableLoading = false;
                    });
                }).catch(() => {
                });
            },
            editFactory(row) {
                this.factoryId = row.factoryId;
                this.isShow = false
                this.$nextTick(function () {
                    this.visible = true;
                })
            },
            addFactory() {
                this.factoryId = 0;
                this.isShow = false
                this.$nextTick(function () {
                    this.visible = true;
                });
            },
            infoFactory(row) {
                this.factoryId = row.factoryId;
                this.isShow = true
                this.$nextTick(function () {
                    this.visible = true;
                });
            },
            successSubmit() {
                this.visible = false;
                this.getFactoryList();
            },
            handleCurrentChange(val) {
                this.page = val
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.getFactoryList()
            },
            search(){
                this.page = 1
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.count=0
                this.getFactoryList()
            },
            getFactoryList() {
                this.tableLoading = true;
                api.getFactoryList(this.page, this.pageSize,this.searchParam).then(res => {
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
    .factory-index {

    }
</style>
