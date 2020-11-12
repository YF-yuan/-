<template>
    <el-drawer
            class="genImport"
            title="导入表"
            :visible.sync="visible"
            :direction="direction"
            :size="drawerWidth+'px'"
            :before-close="handleClose"
    >
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item label="表名称">
                <el-input
                        clearable
                        v-model="searchParam.tableName"
                        size="small"
                        placeholder="请输入表名称"
                        style="width: 150px"
                />
            </el-form-item>
            <el-form-item label="表描述">
                <el-input
                        clearable
                        v-model="searchParam.tableComment"
                        size="small"
                        placeholder="请输入表描述"
                        style="width: 150px"
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
        <el-table
                style="margin-top: 10px"
                stripe
                ref="table"
                @selection-change="handleSelectionChange"
                :height="tableHeight"
                v-loading="tableLoading"
                :data="dataList"
                border
                size="medium"
                row-key="id"
        >
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column :index="indexMethod" label="序号" type="index" width="80" align="center"/>
            <el-table-column
                    min-width="100"
                    show-overflow-tooltip
                    prop="tableName"
                    label="表名称"
                    align="center"
            ></el-table-column>
            <el-table-column min-width="100" show-overflow-tooltip prop="tableComment" label="表描述" align="center"/>
            <el-table-column min-width="160" show-overflow-tooltip prop="createTime" label="创建时间" align="center"/>
            <el-table-column min-width="160" show-overflow-tooltip prop="updateTime" label="更新时间" align="center"/>
        </el-table>
        <div class="page-current">
            <el-pagination
                    :current-page="currentPage"
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
        <div style="text-align: center;margin-top: 10px">
            <el-button
                    :disabled="multipleSelection.length>0?false:true"
                    v-if="permission.tool_gen_importTable"
                    :loading="submitLoading"
                    @click="submitForm"
                    type="primary"
                    size="medium"
            >确定
            </el-button>
            <el-button @click="$emit('returnBack')" size="medium">返回</el-button>
        </div>
    </el-drawer>
</template>

<script>
    import api from "@/api/system/gen/gen";
    import {mapGetters} from "vuex";

    export default {
        name: "genImport",
        data() {
            return {
                dataList: [],
                currentPage: 1,
                count: 0,
                tableHeight: document.body.clientHeight - 260,
                pageSize: parseInt((document.body.clientHeight - 260 - 43) / 43),
                multipleSelection: [],
                submitLoading: false,
                tableLoading: false,
                searchParam: {
                    tableName: '',
                    tableComment: ''
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
        },
        mounted() {
            this.getAllList()
        },
        components: {},
        computed: {
            ...mapGetters(["direction", "drawerWidth", "permission"]),
        },
        methods: {
            indexMethod(index) {
                return index + 1 + (this.currentPage - 1) * this.pageSize;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            initSearchParam() {
                this.searchParam = {
                    tableName: "",
                    tableComment: ""
                };
            },
            search() {
                this.currentPage = 1;
                this.tableLoading = true;
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.getAllList();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.getAllList();
            },
            getAllList() {
                this.tableLoading = true;
                let searchParam = JSON.parse(JSON.stringify(this.searchParam));
                if (this.$refs.table) {
                    this.$refs.table.clearSelection();
                }
                this.multipleSelection = []
                searchParam.page = this.currentPage;
                searchParam.pageSize = this.pageSize;
                api.getTables(searchParam).then(res => {
                    this.dataList = res.data.records ? res.data.records : [];
                    this.count = res.data.total;
                    this.tableLoading = false;
                }).catch(e => {
                    this.dataList = [];
                    this.tableLoading = false;
                });
            },
            handleClose(hide) {
                this.$emit("returnBack");
            },
            submitForm() {
                this.submitLoading = true;
                let tableName = []
                this.multipleSelection.map(item=>{
                    tableName.push(item.tableName)
                })
                api.importTable(tableName.join(',')).then(res => {
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
        }
    };
</script>

<style lang="less">
    .dict-from {
    }
</style>
