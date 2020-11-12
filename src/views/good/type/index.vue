<template>
    <div class="main-box type-index">
        <div>
            <div>一级分类</div>
            <div>
                <el-button
                        v-if="permission.good_type_add"
                        icon="el-icon-plus"
                        @click="add(0,'')"
                        size="small"
                        type="primary"
                >新增
                </el-button>
            </div>
            <el-table highlight-current-row @current-change="rowClick" ref="table" :height="tableHeight" size="medium"
                      v-loading="tableLoading1"
                      :data="dataList1.slice((page.page - 1) * pageSize, page.page * pageSize)"
                      border>
                <el-table-column :index="indexMethod" label="序号" type="index" width="80" align="center"/>
                <el-table-column align="center" prop="typeName" label="类型名称"></el-table-column>
                <el-table-column align="center" prop="status" label="状态">
                    <template slot-scope="{row}">
                        <el-tag size="mini" v-if="row.status==1">正常</el-tag>
                        <el-tag size="mini" v-else type="danger">禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column min-width="60" label="操作">
                    <template slot-scope="{row}">
                        <el-button v-if="permission.good_type_edit&&permission.good_type_info"
                                   @click.stop="edit(row,'')" type="primary" size="mini"
                                   icon="el-icon-edit"/>
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
            <div><span v-if="selectRow.typeName">{{selectRow.typeName}}-</span>二级分类</div>
            <div>
                <el-button
                        :disabled="selectRow.typeId?false:true"
                        v-if="permission.good_type_add"
                        icon="el-icon-plus"
                        @click="add(selectRow.typeId,selectRow.typeName)"
                        size="small"
                        type="primary"
                >新增
                </el-button>
            </div>
            <el-table ref="table2" :height="tableHeight" size="medium" v-loading="tableLoading2"
                      :data="dataList2.slice((page2.page - 1) * pageSize, page2.page * pageSize)"
                      border>
                <el-table-column :index="indexMethod2" label="序号" type="index" width="80" align="center"/>
                <el-table-column align="center" prop="typeName" label="类型名称"></el-table-column>
                <el-table-column align="center" prop="status" label="状态">
                    <template slot-scope="{row}">
                        <el-tag size="mini" v-if="row.status==1">正常</el-tag>
                        <el-tag size="mini" v-else type="danger">禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column min-width="60" label="操作">
                    <template slot-scope="{row}">
                        <el-button v-if="permission.good_type_edit&&permission.good_type_info"
                                   @click.stop="edit(row,selectRow.typeName)" type="primary" size="mini"
                                   icon="el-icon-edit"/>
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
        <typeForm
                :typeStatus="typeStatus"
                :visible="visible"
                :typeId="typeId"
                :typeOneName="typeOneName"
                v-if="visible"
                @returnBack="visible=false"
                @successSubmit="successSubmit"
        >
        </typeForm>
    </div>
</template>

<script>
    import api from "@/api/good/type";
    import typeForm from './typeForm'
    import {mapGetters} from "vuex";

    export default {
        name: "type-index",
        data() {
            return {
                typeStatus: 0,
                visible: false,
                selectRow: {},
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
                typeOneName: '',
                typeId: 0,
                pageSize: parseInt((document.body.clientHeight - 270 - 43) / 44.5),
                tableHeight: document.body.clientHeight - 270,
            }
        },
        computed: {
            ...mapGetters(["permission"])
        },
        mounted() {
            this.getTypeList(0);
        },
        components: {
            typeForm
        },
        methods: {
            rowClick(row) {
                this.dataList2 = []
                this.page2.page = 1
                this.page2.count = 0
                this.selectRow = Object.assign({}, row?row:{})
                this.typeId = row?row.typeId:0
                this.getTypeList(this.typeId)
            },
            add(typeId, typeOneName) {
                this.typeStatus = 1
                this.typeId = typeId
                this.typeOneName = typeOneName
                this.$nextTick(function () {
                    this.visible = true
                })
            },
            edit(row, typeOneName) {
                this.typeStatus = 2
                this.typeId = row.typeId
                this.typeOneName = typeOneName
                this.$nextTick(function () {
                    this.visible = true
                })
            },
            successSubmit() {
                this.visible = false
                if (this.typeId && this.typeOneName) {
                    this.getTypeList(this.selectRow.typeId)
                } else {
                    this.getTypeList(0)
                }
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
            },
            handleCurrentChange2(val) {
                this.page2.page = val
                this.$refs.table2.bodyWrapper.scrollTop = 0;
            },
            getTypeList(parentId) {
                if (parentId) {
                    this.tableLoading2 = true
                } else {
                    this.tableLoading1 = true
                }
                api.getTypeList(parentId).then(res => {
                    const {data = []} = res
                    if (parentId) {
                        this.dataList2 = data
                        this.page2.count = data.length
                        this.tableLoading2 = false
                    } else {
                        this.dataList1 = data
                        this.page.count = data.length
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
    .type-index {
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
