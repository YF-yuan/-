<template>
    <div class="main-box menu">
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item label="部门">
                <el-input
                        clearable
                        v-model="searchParam.deptName"
                        size="small"
                        placeholder="请输入部门名称关键词"
                        style="width: 200px"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                        :loading="tableLoading"
                        icon="el-icon-search"
                        @click="count=0;getDeptList()"
                        size="small"
                        type="primary"
                >搜索
                </el-button>
                <el-button
                        icon="el-icon-refresh-right"
                        @click="count=0;initSearchParam();getDeptList()"
                        type="primary"
                        size="small"
                        style="background-color: #fff; border: 1px solid #ccc ; color: #666"
                >清空
                </el-button>
            </el-form-item>
        </el-form>
        <el-button
                v-if="permission.system_dept_add"
                style="margin-bottom: 10px"
                icon="el-icon-plus"
                @click="addDept"
                size="small"
                type="primary"
        >添加部门
        </el-button>
        <el-table size="medium" v-loading="tableLoading" :data="dataList" row-key="deptId" border>
            <el-table-column align="center" prop="deptId" label="ID"></el-table-column>
            <el-table-column align="center" prop="deptName" label="部门名称"></el-table-column>
            <el-table-column align="center" prop="leader" label="负责人"></el-table-column>
            <el-table-column min-width="110" align="center" prop="phone" label="联系电话"></el-table-column>
            <el-table-column min-width="160" align="center" prop="createTime" label="创建时间"></el-table-column>
            <!--      <el-table-column align="center" prop="status" label="状态">-->
            <!--        <template slot-scope="{row}">-->
            <!--          <span v-if="row.status">{{row.status==1?'显示':'隐藏'}}</span>-->
            <!--        </template>-->
            <!--      </el-table-column>-->
            <el-table-column width="220" label="操作">
                <template slot-scope="{row}">
                    <el-button v-if="permission.system_dept_info" @click="infoDept(row)" type="primary" size="mini"
                               icon="el-icon-view">详情
                    </el-button>
                    <el-button v-if="permission.system_dept_info&&permission.system_dept_edit" @click="editDept(row)"
                               type="primary" size="mini" icon="el-icon-edit">编辑
                    </el-button>
                    <el-button
                            v-if="permission.system_dept_remove"
                            type="danger"
                            size="mini"
                            icon="el-icon-delete"
                            @click="handleDelete(row)"
                    >
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <deptForm
                :isShow="isShow"
                @successSubmit="successSubmit"
                v-if="visible"
                @returnBack="visible=false"
                :deptId="deptId"
                :visible="visible"
                :dataList="dataList"
        ></deptForm>
    </div>
</template>

<script>
    import api from "@/api/system/dept/dept";
    import deptForm from "./deptForm";
    import {mapGetters} from "vuex";

    export default {
        name: "dept-index",
        data() {
            return {
                searchParam: {
                    deptName: ''
                },
                btnVisible: false,
                deptId: 0,
                isShow: false,
                tableLoading: false,
                dataList: [],
                isCol: true,
                deptList: [],
                visible: false,
            };
        },
        mounted() {
            this.getDeptList();
        },
        computed: {
            ...mapGetters(["permission"])
        },
        components: {deptForm},
        methods: {
            initSearchParam() {
                this.searchParam = {
                    deptName: ''
                }
            },
            getListByPid(row) {
                this.deptId = row.deptId
                this.btnVisible = true
            },
            handleDelete(row) {
                if (this.deptList.filter(item => item.parentId == row.deptId).length > 0) {
                    this.$message.error('菜单下有子集,请先删除子集');
                    return
                } else {
                    this.$confirm('此操作将删除该菜单, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.tableLoading = true;
                        api
                            .dropDept(row.deptId)
                            .then(res => {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getDeptList()
                            })
                            .catch(e => {
                                this.tableLoading = false;
                            });
                    }).catch(() => {
                    });
                }
            },
            editDept(row) {
                this.deptId = row.deptId
                this.isShow = false
                this.$nextTick(function () {
                    this.visible = true;
                });
            },
            infoDept(row) {
                this.deptId = row.deptId
                this.isShow = true
                this.$nextTick(function () {
                    this.visible = true;
                });
            },
            addDept() {
                this.deptId = 0
                this.isShow = false
                this.$nextTick(function () {
                    this.visible = true;
                });
            },
            successSubmit() {
                this.visible = false;
                this.getDeptList();
            },
            getDeptList() {
                this.tableLoading = true;
                api.getDeptList(this.searchParam).then(res => {
                    this.deptList = res.data.records;
                    this.dataList = this.filterChildMenuList(this.deptList, 0);
                    this.tableLoading = false;
                }).catch(e => {
                    this.tableLoading = false;
                });
            },
            filterChildMenuList(deptList, pid) {
                let childMenuList = deptList.filter(child => child.parentId === pid);
                let children = [];
                if (childMenuList.length > 0) {
                    childMenuList.map(child => {
                        let childRoute = {
                            deptId: child.deptId,
                            parentId: child.parentId,
                            deptName: child.deptName,
                            leader: child.leader,
                            phone: child.phone,
                            sort: child.sort,
                            status: child.status,
                            createTime: child.createTime
                        };
                        let childrenData = this.filterChildMenuList(deptList, child.deptId);
                        if (childrenData.length > 0) {
                            childRoute.children = childrenData;
                        }
                        children.push(childRoute);
                    });
                }
                return children;
            }
        }
    };
</script>

<style lang="less">
    .menu {
    }
</style>
