<template>
    <div class="main-box role">
        <el-button
                v-if="permission.system_role_add"
                style="margin-bottom: 10px"
                icon="el-icon-plus"
                @click="addRole"
                size="small"
                type="primary"
        >添加角色
        </el-button>
        <el-table ref="table" :height="tableHeight" size="medium" v-loading="tableLoading" :data="dataList" border>
            <el-table-column align="center" prop="roleId" label="ID"></el-table-column>
            <el-table-column align="center" prop="roleName" label="角色名称"></el-table-column>
            <el-table-column align="center" prop="roleKey" label="简称"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="{row}">
                    <el-button v-if="permission.system_role_edit&&permission.system_role_info" @click="editRole(row)"
                               type="primary" size="mini" icon="el-icon-edit">编辑
                    </el-button>
                    <el-button
                            v-if="permission.system_role_remove"
                            type="danger"
                            size="mini"
                            icon="el-icon-delete"
                            @click="handleDelete(row)"
                    >删除
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
        <roleForm
                :filterMenuList="filterMenuList"
                @successSubmit="successSubmit"
                v-if="visible"
                @returnBack="visible=false"
                :roleId="roleId"
                :visible="visible"
        ></roleForm>
    </div>
</template>

<script>
    import api from "@/api/system/role/role";
    import {mapGetters} from "vuex";
    import roleForm from './roleForm'

    export default {
        name: "role-index",
        data() {
            return {
                count: 0,
                submitLoading: false,
                page: 1,
                pageSize: parseInt((document.body.clientHeight - 230 - 43) / 44.5),
                tableHeight: document.body.clientHeight - 230,
                tableLoading: false,
                dataList: [],
                filterMenuList: [],
                roleId: 0,
                visible: false,
            };
        },
        mounted() {
            this.getRoleList()
            this.filterMenuList = this.filterChildMenuList(this.menuList, 0);
        },
        computed: {
            ...mapGetters(["direction", "drawerWidth", "permission", "menuList"])
        },
        components: {roleForm},
        methods: {
            successSubmit() {
                this.visible = false
                this.getRoleList()
            },
            handleClose(hide) {
                this.visible = false
            },
            handleDelete(row) {
                this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableLoading = true;
                    api.dropRole(row.roleId).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getRoleList()
                    }).catch(e => {
                        this.tableLoading = false;
                    });
                }).catch(() => {
                });
            },
            editRole(row) {
                this.roleId = row.roleId;
                this.visible = true
            },
            addRole() {
                this.roleId = 0;
                this.visible = true;
            },
            handleCurrentChange(val) {
                this.page = val
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.getRoleList()
            },
            getRoleList() {
                this.tableLoading = true;
                api
                    .getRoleList(this.page, this.pageSize)
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
            },
            filterChildMenuList(menuList, pid) {
                let childMenuList = menuList.filter(child => child.parentId === pid);
                let children = [];
                if (childMenuList.length > 0) {
                    childMenuList.map(child => {
                        let childRoute = {
                            menuId: child.menuId,
                            parentId: child.parentId,
                            perms: child.perms,
                            name: child.menuName,
                            sort: child.sort,
                            path: child.path,
                            menuType: child.menuType,
                            component: child.component,
                            status: child.status,
                            icon: child.icon
                        };
                        let childrenData = this.filterChildMenuList(menuList, child.menuId);
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
    .role {
    }

</style>
