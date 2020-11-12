<template>
    <div class="main-table">
        <el-table ref="table" :height="tableHeight" size="medium" v-loading="tableLoading" :data="dataList" border>
            <el-table-column min-width="100" align="center" prop="snapshotId" label="ID"></el-table-column>
            <el-table-column min-width="100" align="center" prop="approveName" label="待办事项"></el-table-column>
            <el-table-column min-width="160" align="center" prop="preTime" label="提交时间"></el-table-column>
            <el-table-column v-if="activeName==2" min-width="160" align="center" prop="dealTime" label="处理时间"></el-table-column>
            <el-table-column min-width="100" align="center" prop="createUser" label="发起人"></el-table-column>
            <el-table-column min-width="100" align="center" prop="preUser" label="上一节点"></el-table-column>
            <el-table-column width="100" label="操作">
                <template slot-scope="{row}">
                    <el-button v-if="activeName==2"  @click="lookShow(row)"
                               type="primary" size="mini" icon="el-icon-view">查看
                    </el-button>
                    <el-button v-if="activeName==1" @click="deal(row)"
                               type="primary" size="mini" icon="el-icon-edit">处理
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
        <contractForm
                :enterpriseList="enterpriseList"
                :isCheck="isCheck"
                :isShow="true"
                :contractId="snapshotId"
                v-if="visible"
                :visible="visible"
                @returnBack="visible=false"
                @successSubmit="visible=false;getList()"
        >

        </contractForm>
        <bomForm
                :isCheck="isCheck"
                :isShow="true"
                :snapshotId="snapshotId"
                v-if="bomVisible"
                :visible="bomVisible"
                @returnBack="bomVisible=false"
                @successSubmit="bomVisible=false;getList()"
        >

        </bomForm>
    </div>
</template>

<script>
    import api from '@/api/main/index'
    import contractForm from '../order/contract/contractForm'
    import bomForm from '../order/bom/bomForm'

    export default {
        name: "mainTable",
        data() {
            return {
                bomVisible:false,
                snapshotId:0,
                visible:false,
                count: 0,
                page: 1,
                pageSize: parseInt((document.body.clientHeight - 240 - 43) / 44.5),
                tableHeight: document.body.clientHeight - 240,
                tableLoading: false,
                dataList: [],
                isCheck:0
            }
        },
        props: {
            enterpriseList: {
                type: Array,
                default() {
                    return [];
                }
            },
            activeName: {
                type: Number,
                default() {
                    return 0;
                }
            },
        },
        mounted() {
            this.getList()
        },
        components: {contractForm,bomForm},
        methods: {
            lookShow(row){
                if(row.circulationType==1&&row.type==2){
                    this.$router.push({path: "/order/bom"});
                }else {
                    this.snapshotId = row.snapshotId
                    this.isCheck = 3
                    this.$nextTick(function () {
                        if (row.approveType == 3) {
                            this.bomVisible = true
                        } else {
                            this.visible = true
                        }
                    })
                }
            },
            deal(row){
                if(row.circulationType==1&&row.type==2){
                    this.tableLoading = true;
                    api.approveStatus(row.snapshotId).then(res => {
                        this.tableLoading = false;
                        this.$router.push({path: "/order/bom"});
                    }).catch(e => {
                        this.tableLoading = false;
                    });
                }else{
                    this.isCheck=2
                    this.snapshotId=row.snapshotId
                    this.$nextTick(function () {
                        if(row.approveType==3){
                            this.bomVisible=true
                        }else{
                            this.visible=true
                        }
                    })
                }
            },
            handleCurrentChange(val) {
                this.page = val
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.getList()
            },
            getList() {
                let method='getUntreatedList'
                if(this.activeName==2){
                    method='getTreatedList'
                }
                this.tableLoading = true;
                api[method](this.page, this.pageSize).then(res => {
                    const {records, total} = res.data
                    this.dataList = records ? records : []
                    this.count = total ? parseInt(total) : 0
                    if(this.activeName==1){
                        this.$emit('returnCount',this.count)
                    }
                    this.tableLoading = false;
                }).catch(e => {
                    this.dataList = []
                    this.tableLoading = false;
                });
            },
        }
    }
</script>

<style scoped>

</style>
