<template>
    <div class="main-box dict">
        <div>
            <div>业务字典列表</div>
            <div>
                <el-button
                        v-if="permission.system_dict_add"
                        icon="el-icon-plus"
                        @click="add(0)"
                        size="small"
                        type="primary"
                >新增
                </el-button>
            </div>
            <el-table highlight-current-row @current-change="rowClick" ref="table" :height="tableHeight" size="medium" v-loading="tableLoading1" :data="dataList1"
                      border>
                <el-table-column prop="dictId" label="ID" width="80" align="center"/>
                <el-table-column align="center" prop="code" label="字典编号"></el-table-column>
                <el-table-column align="center" prop="dictValue" label="字典名称"></el-table-column>
                <el-table-column align="center" prop="statusText" label="是否封存">
                </el-table-column>
                <el-table-column min-width="90" label="操作">
                    <template slot-scope="{row}">
                        <el-button v-if="permission.system_dict_edit" @click.stop="edit(row)" type="primary" size="mini"
                                   icon="el-icon-edit"/>
                        <el-button
                                v-if="permission.system_dict_remove"
                                type="danger"
                                size="mini"
                                icon="el-icon-delete"
                                @click.stop="remove(row)"
                        />
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-current">
                <el-pagination
                        :current-page="page.page"
                        :page-size="pageSize"
                        prev-text="上一页"
                        next-text="下一页"
                        background
                        layout="total, prev, pager, next, jumper"
                        style="display: inline-block;"
                        :total="page.count"
                        @current-change="handleCurrentChange"
                />
            </div>
        </div>
        <div></div>
        <div>
            <div>[{{selectRow.dictValue?selectRow.dictValue:'暂无'}}]业务字典详情</div>
            <div>
                <el-button
                        v-if="permission.system_dict_add"
                        icon="el-icon-plus"
                        @click="add(selectRow.dictId)"
                        size="small"
                        type="primary"
                >新增
                </el-button>
            </div>
            <el-table  ref="table2" :height="tableHeight" size="medium" v-loading="tableLoading2" :data="dataList2"
                      border>
                <el-table-column :index="indexMethod2" label="序号" type="index" width="80" align="center"/>
                <el-table-column align="center" prop="dictValue" label="字典名称"></el-table-column>
                <el-table-column align="center" prop="dictKey" label="字典键值"></el-table-column>
                <el-table-column align="center" prop="statusText" label="是否封存">
                </el-table-column>
                <el-table-column min-width="90" label="操作">
                    <template slot-scope="{row}">
                        <el-button v-if="permission.system_dict_edit" @click.stop="edit(row)" type="primary" size="mini"
                                   icon="el-icon-edit"/>
                        <el-button
                                v-if="permission.system_dict_remove"
                                type="danger"
                                size="mini"
                                icon="el-icon-delete"
                                @click.stop="remove(row)"
                        />
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-current">
                <el-pagination
                        :current-page="page2.page"
                        :page-size="pageSize"
                        prev-text="上一页"
                        next-text="下一页"
                        background
                        layout="total, prev, pager, next, jumper"
                        style="display: inline-block;"
                        :total="page2.count"
                        @current-change="handleCurrentChange2"
                />
            </div>
        </div>
        <dictForm  @successSubmit="successSubmit" :visible="visible" v-if="visible" :dictForm="dictForm"
                  @returnBack="visible=false"></dictForm>
    </div>
</template>

<script>
    import api from "@/api/system/dict/dict";
    import dictForm from './dictForm'
    import {mapGetters} from "vuex";

    export default {
        name: "dict",
        data() {
            return {
                selectRow:false,
                visible: false,
                dictForm: {},
                dataList1: [],
                dataList2: [],
                tableLoading1: false,
                tableLoading2: false,
                page: {
                    page: 1,
                    count: 0
                },
                page2: {
                    page: 1,
                    count: 0
                },
                dictId:'',
                pageSize: parseInt((document.body.clientHeight - 270 - 43) / 44.5),
                tableHeight: document.body.clientHeight - 270,
            }
        },
        computed: {
            ...mapGetters(["permission"])
        },
        mounted() {
            this.getDictList(0);
        },
        components: {
            dictForm
        },
        methods: {
            rowClick(row){
                this.dataList2=[]
                this.page2.page=1
                this.selectRow = Object.assign({}, row?row:{})
                this.dictId = row?row.dictId:0
                this.getDictList(this.dictId)
            },
            add(dictId) {
                this.dictForm = {
                    status: 1,
                    parentId: dictId ? dictId : 0,
                    code:dictId ? this.selectRow.code : ''
                }
                this.visible = true
            },
            edit(row) {
                this.dictForm = Object.assign({}, row)
                this.visible = true
            },
            remove(row) {
                this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (row.parentId) {
                        this.tableLoading2 = true
                    } else {
                        this.tableLoading1 = true
                    }
                    api.removeDict(row.dictId).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getDictList(row.parentId)
                    }).catch(e => {
                        if (row.parentId) {
                            this.tableLoading2 = false
                        } else {
                            this.tableLoading1 = false
                        }
                    });
                }).catch(() => {
                });
            },
            successSubmit() {
                this.visible = false
                this.getDictList(this.dictForm.parentId)
            },
            indexMethod(index) {
                return (index + 1) + ((this.page.page - 1) * this.pageSize);
            },
            indexMethod2(index) {
                return (index + 1) + ((this.page2.page - 1) * this.pageSize);
            },
            handleCurrentChange(val) {
                this.page.page = val
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.getDictList(0)
            },
            handleCurrentChange2(val){
                this.page2.page = val
                this.$refs.table2.bodyWrapper.scrollTop = 0;
                this.getDictList(this.dictId)
            },
            getDictList(parentId) {
                let page=1
                if (parentId) {
                    page=this.page2.page
                    this.tableLoading2 = true
                } else {
                    page=this.page.page
                    this.tableLoading1 = true
                }
                api.getDictList(page, this.pageSize, parentId).then(res => {
                    const {records, total} = res.data
                    if (parentId) {
                        this.dataList2 = records ? records : []
                        this.page2.count = total ? parseInt(total) : 0
                        this.tableLoading2 = false
                    } else {
                        this.dataList1 = records ? records : []
                        this.page.count = total ? parseInt(total) : 0
                        this.tableLoading1 = false
                    }
                }).catch(e => {
                    if (parentId) {
                        this.dataList2 = []
                        this.page2.count = 0
                        this.tableLoading2 = false
                    } else {
                        this.dataList1 = []
                        this.page.count = 0
                        this.tableLoading1 = false
                    }
                });
            }
        }
    }
</script>

<style lang="less">
    .dict {
        height: 100%;
        padding: 0px;
        display: flex;


        > div:nth-child(2) {
            flex: none;
            width: 20px;
            background-color: #f2f2f2;
        }

        > div:first-child, > div:nth-child(3) {
            flex: 1;
            background-color: #ffffff;
            padding: 20px;

            > div:first-child {
                font-weight: bold;
            }

            > div:nth-child(2) {
                margin: 15px 0;
            }
        }
    }
</style>
