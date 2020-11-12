<template>
    <div class="main-box menu">
        <el-button
                v-if="permission.system_menu_add"
                style="margin-bottom: 10px"
                icon="el-icon-plus"
                @click="addMenu"
                size="small"
                type="primary"
        >添加菜单
        </el-button>
        <el-table size="medium" v-loading="tableLoading" :data="dataList" row-key="menuId" border>
            <el-table-column prop="menuId" label="ID"></el-table-column>
            <el-table-column width="100" align="center" prop="sort" label="排序"></el-table-column>
            <el-table-column align="center" prop="menuName" label="名称"></el-table-column>
            <el-table-column align="center" prop="path" label="地址"></el-table-column>
            <el-table-column align="center" prop="icon" label="图标">
                <template slot-scope="{row}">
                    <i v-if="row.icon" :class="row.icon"></i>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="status" label="状态">
                <template slot-scope="{row}">
                    <span v-if="row.status">{{row.status==1?'显示':'隐藏'}}</span>
                </template>
            </el-table-column>
            <el-table-column width="240" label="操作">
                <template slot-scope="{row}">
                    <el-button v-if="permission.system_menu_edit" @click="editMenu(row)" type="primary" size="mini"
                               icon="el-icon-edit">编辑
                    </el-button>
                    <el-button
                            v-if="permission.system_menu_remove"
                            type="danger"
                            size="mini"
                            icon="el-icon-delete"
                            @click="handleDelete(row)"
                    >删除
                    </el-button>
                    <el-button
                            v-if="permission.system_menu_getChildList && row.menuType == 'C'"
                            type="primary"
                            size="mini"
                            icon="el-icon-setting"
                            @click="getListByPid(row)"
                    >设置按钮
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <menuForm
                @successSubmit="successSubmit"
                v-if="visible"
                @returnBack="visible=false"
                :menuForm="menuForm"
                :visible="visible"
                :dataList="dataList"
        ></menuForm>
        <btnTable
                v-if="btnVisible"
                @returnBack="btnVisible=false"
                :visible="btnVisible"
                :menuId="menuId"
        ></btnTable>
    </div>
</template>

<script>
    import api from "@/api/system/menu/menu";
    import menuForm from "./menuForm";
    import btnTable from './btnTable'
    import {mapGetters} from "vuex";

    export default {
        name: "menu-index",
        data() {
            return {
                btnVisible: false,
                menuId: '',
                tableLoading: false,
                dataList: [],
                isCol: true,
                menuList: [],
                menuType: 'M',
                visible: false,
                menuForm: {}
            };
        },
        mounted() {
            this.getMenuList();
        },
        computed: {
            ...mapGetters(["permission"])
        },
        components: {menuForm, btnTable},
        methods: {
            getListByPid(row) {
                this.menuId = row.menuId
                this.btnVisible = true
            },
            handleDelete(row) {
                if (this.menuList.filter(item => item.parentId == row.menuId).length > 0) {
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
                            .dropMenu(row.menuId)
                            .then(res => {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getMenuList()
                            })
                            .catch(e => {
                                this.tableLoading = false;
                            });
                    }).catch(() => {
                    });
                }
            },
            editMenu(row) {
                this.menuForm = JSON.parse(JSON.stringify(row))
                this.$nextTick(function () {
                    this.visible = true;
                });
            },
            addMenu() {
                this.menuForm = {
                    status: 1,
                    sort: 1,
                    menuType: 'M'
                };
                this.$nextTick(function () {
                    this.visible = true;
                });
            },
            successSubmit() {
                this.visible = false;
                this.getMenuList();
            },
            getMenuList() {
                this.tableLoading = true;
                api
                    .getMenuList()
                    .then(res => {
                        this.menuList = res.data.records;

                        this.dataList = this.filterChildMenuList(this.menuList, 0);
                        this.tableLoading = false;
                    })
                    .catch(e => {
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
                            menuName: child.menuName,
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
    .menu {
    }
</style>
