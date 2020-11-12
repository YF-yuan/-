<template>
    <div class="main-box gen">
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
            <el-form-item label="创建时间">
                <el-date-picker
                        style="width: 220px"
                        placeholder="创建时间"
                        clearable
                        size="small"
                        value-format="yyyy-MM-dd"
                        v-model="searchParam.time"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                ></el-date-picker>
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
                        @click="conut=0;initSearchParam();search()"
                        type="primary"
                        size="small"
                        style="background-color: #fff; border: 1px solid #ccc ; color: #666"
                >清空
                </el-button>
            </el-form-item>
        </el-form>
        <div>
            <el-button v-if="permission.tool_gen_tables" icon="el-icon-upload" @click="importVisible=true" size="small"
                       type="primary">导入
            </el-button>
            <el-button v-if="permission.tool_gen_remove" @click="del()" icon="el-icon-delete"
                       :disabled="multipleSelection.length>0?false:true" size="small" type="danger">删除
            </el-button>
        </div>
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
            <el-table-column min-width="100" show-overflow-tooltip prop="className" label="实体" align="center"/>
            <el-table-column min-width="160" show-overflow-tooltip prop="createTime" label="创建时间" align="center"/>
            <el-table-column min-width="160" show-overflow-tooltip prop="updateTime" label="更新时间" align="center"/>
            <el-table-column label="操作" align="left" width="240">
                <template slot-scope="{row}">
                    <el-button
                            v-if="permission.tool_gen_columns"
                            @click="detail(row)"
                            type="primary"
                            size="mini"
                            icon="el-icon-edit"
                    >编辑
                    </el-button>
                    <el-button type="danger" size="mini" v-if="permission.gen_remove"
                               icon="el-icon-delete" @click="del(row.tableId)">删除
                    </el-button>
                    <el-button
                            v-if="permission.tool_gen_genCode"
                            @click="genCode(row.tableName)"
                            type="primary"
                            size="mini"
                            icon="el-icon-s-order"
                    >生成代码
                    </el-button>
                </template>
            </el-table-column>
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
        <genImport @successSubmit="importVisible=false;getAllList()" :visible="importVisible" v-if="importVisible"
                   @returnBack="importVisible=false"></genImport>
        <genForm :tableId="tableId" @successSubmit="formVisible=false;getAllList()" :visible="formVisible"
                 v-if="formVisible" @returnBack="formVisible=false"></genForm>
    </div>
</template>

<script>
    import api from "@/api/system/gen/gen";
    import {mapGetters} from "vuex";
    import genImport from './genImport'
    import genForm from './genForm'

    export default {
        name: "gen",
        data() {
            return {
                tableId: '',
                formVisible: false,
                importVisible: false,
                multipleSelection: [],
                dataList: [],
                currentPage: 1,
                count: 0,
                pageSize: parseInt((document.body.clientHeight - 280 - 43) / 45),
                tableHeight: document.body.clientHeight - 280,
                tableLoading: false,
                searchParam: {
                    tableName: "",
                    tableComment: "",
                    time: "",
                }
            };
        },
        computed: {
            ...mapGetters(["permission"])
        },
        components: {genImport, genForm},
        created() {
        },
        mounted() {
            this.tableLoading = true;
            this.getAllList();
        },
        methods: {
            detail(row) {
                this.tableId = row.tableId
                this.formVisible = true
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            genCode(tableName) {
                this.$confirm(`是否确定生成${tableName}表的代码`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.tableLoading = true;
                    api.genCode(tableName).then(res => {
                        this.$message({
                            type: "success",
                            message: "生成成功"
                        });
                        this.getAllList();
                    }).catch(e => {
                        this.tableLoading = false;
                    });
                });
            },
            del(id) {
                let tableIds = []
                if (id) {
                    tableIds.push(id)
                } else {
                    this.multipleSelection.map(item => {
                        tableIds.push(item.id)
                    })
                }
                this.$confirm("是否确定删除", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.tableLoading = true;
                    api.remove(tableIds.join(',')).then(res => {
                        this.$message({
                            type: "success",
                            message: "删除成功"
                        });
                        this.getAllList();
                    }).catch(e => {
                        this.tableLoading = false;
                    });
                });
            },
            indexMethod(index) {
                return index + 1 + (this.currentPage - 1) * this.pageSize;
            },
            initSearchParam() {
                this.searchParam = {
                    tableName: "",
                    tableComment: "",
                    time: "",
                };
            },
            search() {
                this.currentPage = 1;
                this.tableLoading = true;
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.count=0
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
                if (searchParam.time && searchParam.time.length > 0) {
                    searchParam.beginTime = searchParam.time[0]
                    searchParam.endTime = searchParam.time[1]
                } else {
                    searchParam.beginTime = ''
                    searchParam.endTime = ''
                }
                delete searchParam.time
                this.$refs.table.clearSelection();
                this.multipleSelection = []
                searchParam.page = this.currentPage;
                searchParam.pageSize = this.pageSize;
                api.getGenList(searchParam).then(res => {
                    this.dataList = res.data.records ? res.data.records : [];
                    this.count = res.data.total;
                    this.tableLoading = false;
                }).catch(e => {
                    this.dataList = [];
                    this.tableLoading = false;
                });
            }
        }
    };
</script>

<style lang="less">
    .gen {
    }
</style>
