<template>
    <div class="main-box user">
        <el-button
                v-if="permission.system_user_add"
                style="margin-bottom: 10px"
                icon="el-icon-plus"
                @click="addUser"
                size="small"
                type="primary"
        >添加用户
        </el-button>
        <el-table ref="table" :height="tableHeight" size="medium" v-loading="tableLoading" :data="dataList" border>
            <el-table-column align="center" prop="userId" label="ID"></el-table-column>
            <el-table-column align="center" prop="username" label="登陆名"></el-table-column>
            <el-table-column align="center" prop="nickname" label="昵称"></el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="{row}">
                    <span v-if="row.status == 1">正常</span>
                    <span v-if="row.status == 2" style="color:red">禁用</span>
                </template>
            </el-table-column>
            <el-table-column min-width="140" align="center" prop="loginDate" label="上次登陆">
                <template slot-scope="{row}">
                    <span v-if="row.loginDate">{{row.loginDate,'yyyy-MM-dd hh:mm:ss' | datetime}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center"  label="角色">
                <template slot-scope="{row}">
                    <span v-for="roleName in row.roleNames">{{roleName}} </span>
                </template>
            </el-table-column>
            <el-table-column width="240" label="操作">
                <template slot-scope="{row}" v-if="row.userId != 1">
                    <el-button v-if="permission.system_user_edit" @click="editUser(row)" type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                        <el-button
                                v-if="permission.system_user_forbidden && row.status == 1"
                                type="danger"
                                size="mini"
                                icon="el-icon-delete"
                                @click="handleDelete(row)"
                        > 禁用</el-button>
                    <el-button
                            v-if="permission.system_user_forbidden && row.status == 2"
                            type="primary"
                            size="mini"
                            icon="el-icon-setting"
                            @click="handleDelete(row)"
                    >启用</el-button>
                    <el-button v-if="permission.system_user_resetPwd" @click="resetPwd(row)" type="primary" size="mini"
                               icon="el-icon-setting">重置密码
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
        <userForm
                :roleList="roleList"
                @successSubmit="successSubmit"
                v-if="visible"
                @returnBack="visible=false"
                :userId="userId"
                :visible="visible"
        ></userForm>
    </div>
</template>

<script>
    import api from "@/api/system/user/user";
    import {mapGetters} from "vuex";
    import roleApi from "@/api/system/role/role";
    import userForm from './userForm'

    export default {
        name: "user-index",
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
                visible: false,
                ruleForm: {},
            };
        },
        mounted() {
            this.getUserList()
            this.getRoleList();
        },
        computed: {
            ...mapGetters(["direction", "drawerWidth", "permission"])
        },
        components: {userForm},
        methods: {
            resetPwd(row) {
                this.$confirm('此操作将重置密码, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableLoading = true;
                    api.resetPwd(row.userId).then(res => {
                        this.$message({
                            type: 'success',
                            message: '重置密码成功!'
                        });
                        this.tableLoading = false;
                    }).catch(e => {
                        this.tableLoading = false;
                    });
                }).catch(() => {
                });
            },
            handleDelete(row) {
                this.$confirm(`此操作将${row.status==1?'禁用':'启用'}该用户是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableLoading = true;
                    api.dropUser(row.userId).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getUserList()
                    }).catch(e => {
                        this.tableLoading = false;
                    });
                }).catch(() => {
                });
            },
            editUser(row) {
                this.userId = row.userId;
                this.$nextTick(function () {
                    let ruleForm = JSON.parse(JSON.stringify(row))
                    ruleForm.password = ''
                    this.ruleForm = Object.assign({}, ruleForm)
                    this.visible = true;
                })
            },
            addUser() {
                this.userId = '';
                this.ruleForm = {}
                this.$nextTick(function () {
                    this.visible = true;
                });
            },
            successSubmit() {
                this.visible = false;
                this.getUserList();
            },
            handleCurrentChange(val) {
                this.page = val
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.getUserList()
            },
            getUserList() {
                this.tableLoading = true;
                api
                    .getUserList(this.page, this.pageSize)
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
            getRoleList() {
                roleApi
                    .getAllGroup()
                    .then(res => {
                        this.roleList = res.data;
                    })
                    .catch(e => {
                        this.roleList = []
                    });
            }
        }
    };
</script>

<style lang="less">
    .user {

    }
</style>
