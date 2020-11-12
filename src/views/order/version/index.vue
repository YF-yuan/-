<template>
    <div class="main-box version-index">
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item label="产品名称">
                <el-input
                        clearable
                        v-model="searchParam.productName"
                        size="small"
                        placeholder="请输入产品名称"
                        style="width: 200px"
                />
            </el-form-item>
            <el-form-item label="客户简称">
                <el-select style="width: 200px" filterable clearable size="small" v-model="searchParam.enterpriseId">
                    <el-option :key="index" :label="item.shortName" :value="item.enterpriseId"
                               v-for="(item,index) in enterpriseList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="版本">
                <el-input
                        clearable
                        v-model="searchParam.version"
                        size="small"
                        placeholder="请输入版本"
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
        <el-table  ref="table" :height="tableHeight" size="medium" v-loading="tableLoading" :data="dataList" border>
            <el-table-column :index="indexMethod" label="序号" type="index" width="80" align="center"/>
            <el-table-column min-width="100" align="center" prop="productName" label="产品名称"></el-table-column>
            <el-table-column min-width="100" align="center" prop="version" label="版本"></el-table-column>
            <el-table-column min-width="160" align="center" prop="createTime" label="版本时间"></el-table-column>
            <el-table-column min-width="160" align="center" prop="goodCode" label="成品编码"></el-table-column>

            <el-table-column width="100" label="操作">
                <template slot-scope="{row}">
                    <el-button v-if="permission.order_version_info" @click="infoVersion(row)"
                               type="primary" size="mini" icon="el-icon-view">查看
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
        <bomForm
                :isVersion="true"
                :isShow="true"
                v-if="visible"
                :visible="visible"
                :productData="productData"
                @returnBack="visible=false"
        >
        </bomForm>
    </div>
</template>

<script>
    import api from "@/api/order/version/index";
    import {mapGetters} from "vuex";
    import bomForm from '../bom/bomForm'

    export default {
        name: "version-index",
        data() {
            return {
                searchParam: {
                    enterpriseId:'',
                    productName: '',
                    version:''
                },
                count: 0,
                page: 1,
                pageSize: parseInt((document.body.clientHeight - 240 - 43) / 44.5),
                tableHeight: document.body.clientHeight - 240,
                tableLoading: false,
                dataList: [],
                visible: false,
                brandId: 0,
                enterpriseList:[],
                productData:{}
            };
        },
        mounted() {
            this.getEnterpriseList()
            this.getVersionList()
        },
        computed: {
            ...mapGetters(["direction", "drawerWidth", "permission"])
        },
        components: {bomForm},
        methods: {
            indexMethod(index) {
                return index + 1 + (this.page - 1) * this.pageSize;
            },
            getEnterpriseList() {
                api.getEnterpriseList().then(res => {
                    this.enterpriseList = res.data ? res.data : []
                }).catch(e => {
                    this.enterpriseList = []
                });
            },
            initSearchParam() {
                this.searchParam = {
                    enterpriseId:'',
                    productName: '',
                    version:''
                }
            },
            infoVersion(row) {
                this.productData = JSON.parse(JSON.stringify(row))
                this.$nextTick(function () {
                    this.visible = true;
                })
            },
            search() {
                this.page = 1
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.count = 1
                this.getVersionList()
            },
            handleCurrentChange(val) {
                this.page = val
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.getVersionList()
            },
            getVersionList() {
                this.tableLoading = true;
                api.getVersionList(this.page, this.pageSize, this.searchParam).then(res => {
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
    .version-index {

    }
</style>
