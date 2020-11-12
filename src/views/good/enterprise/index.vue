<template>
    <div class="main-box enterprise-index">
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item label="企业名称">
                <el-input
                        clearable
                        v-model="searchParam.enterpriseName"
                        size="small"
                        placeholder="请输入企业名称"
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
                    v-if="permission.good_enterprise_add"
                    icon="el-icon-plus"
                    @click="addEnterprise"
                    size="small"
                    type="primary"
            >添加企业
            </el-button>
        </div>
        <el-table ref="table" :height="tableHeight" size="medium" v-loading="tableLoading" :data="dataList" border>
            <el-table-column min-width="80" align="center" prop="enterpriseId" label="ID"></el-table-column>
            <el-table-column min-width="100" align="center" prop="enterpriseName" label="企业名称"></el-table-column>
            <el-table-column min-width="100" align="center" prop="shortName" label="简称"></el-table-column>
            <el-table-column min-width="100" align="center" prop="linkUser" label="联系人"></el-table-column>
            <el-table-column min-width="110" align="center" prop="linkPhone" label="联系电话"></el-table-column>
            <el-table-column min-width="100" align="center" prop="position" label="职位"></el-table-column>
            <el-table-column min-width="110" align="center" prop="taxCode" label="纳税识别号"></el-table-column>
            <el-table-column min-width="100" align="center" prop="bank" label="开户行"></el-table-column>
            <el-table-column min-width="100" align="center" prop="accountNumber" label="账号"></el-table-column>
            <el-table-column min-width="100" align="center" prop="address" label="地址"></el-table-column>
            <el-table-column min-width="100" align="center" prop="phone" label="电话"></el-table-column>
            <el-table-column width="100" label="操作">
                <template slot-scope="{row}">
                    <el-button v-if="permission.good_enterprise_info&&permission.good_enterprise_edit" @click="editEnterprise(row)"
                               type="primary" size="mini" icon="el-icon-edit">编辑
                    </el-button>
<!--                    <el-button-->
<!--                            v-if="permission.good_enterprise_remove"-->
<!--                            type="danger"-->
<!--                            size="mini"-->
<!--                            icon="el-icon-delete"-->
<!--                            @click="removeEnterprise(row)"-->
<!--                    > 删除-->
<!--                    </el-button>-->
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
        <enterpriseForm
                @successSubmit="successSubmit"
                v-if="visible"
                @returnBack="visible=false"
                :enterpriseId="enterpriseId"
                :visible="visible"
        ></enterpriseForm>
    </div>
</template>

<script>
    import api from "@/api/good/enterprise";
    import {mapGetters} from "vuex";
    import enterpriseForm from './enterpriseForm'

    export default {
        name: "enterprise-index",
        data() {
            return {
                searchParam: {
                    enterpriseName: ''
                },
                count: 0,
                page: 1,
                pageSize: parseInt((document.body.clientHeight - 280 - 43) / 44.5),
                tableHeight: document.body.clientHeight - 280,
                tableLoading: false,
                dataList: [],
                visible: false,
                enterpriseId: 0
            };
        },
        mounted() {
            this.getEnterpriseList()
        },
        computed: {
            ...mapGetters(["direction", "drawerWidth", "permission"])
        },
        components: {enterpriseForm},
        methods: {
            initSearchParam() {
                this.searchParam = {
                    enterpriseName: ''
                }
            },
            removeEnterprise(row) {
                this.$confirm(`确定将选择数据删除?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableLoading = true;
                    api.removeEnterprise(row.enterpriseId).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getEnterpriseList()
                    }).catch(e => {
                        this.tableLoading = false;
                    });
                }).catch(() => {
                });
            },
            editEnterprise(row) {
                this.enterpriseId = row.enterpriseId;
                this.$nextTick(function () {
                    this.visible = true;
                })
            },
            addEnterprise() {
                this.enterpriseId = 0;
                this.$nextTick(function () {
                    this.visible = true;
                });
            },
            successSubmit() {
                this.visible = false;
                this.getEnterpriseList();
            },
            search() {
                this.page = 1
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.count = 1
                this.getEnterpriseList()
            },
            handleCurrentChange(val) {
                this.page = val
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.getEnterpriseList()
            },
            getEnterpriseList() {
                this.tableLoading = true;
                api.getEnterpriseList(this.page, this.pageSize, this.searchParam).then(res => {
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
    .enterprise-index {

    }
</style>
