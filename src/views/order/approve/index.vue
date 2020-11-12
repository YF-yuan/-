<template>
    <div class="main-box approve-index">
        <el-table ref="table" :height="tableHeight" size="medium" v-loading="tableLoading" :data="dataList" border>
            <el-table-column label="序号" type="index" width="80" align="center"/>
            <el-table-column min-width="100" align="center" prop="approveName" label="操作步骤"></el-table-column>
            <el-table-column align="center" label="节点1">
                <template slot-scope="{row}">
                  <el-select v-model="row.stepOneRole" size="small" clearable filterable>
                      <el-option :key="index" :value="item.roleId" :label="item.roleName" v-for="(item,index) in roleList"></el-option>
                  </el-select>
                </template>
            </el-table-column>
            <el-table-column align="center" label="节点2">
                <template slot-scope="{row}">
                    <el-select v-model="row.stepTwoRole" size="small" clearable filterable>
                        <el-option :key="index" :value="item.roleId" :label="item.roleName" v-for="(item,index) in roleList"></el-option>
                    </el-select>
                </template>
            </el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 15px">
            <el-button
                    :loading="submitLoading"
                    v-if="permission.order_approve_edit"
                    icon="el-icon-edit"
                    @click="editApprove"
                    size="small"
                    type="primary"
            >保存
            </el-button>
        </div>
    </div>
</template>

<script>
    import api from "@/api/order/approve/index";
    import {mapGetters} from "vuex";

    export default {
        name: "approve-index",
        data() {
            return {
                submitLoading:false,
                tableHeight: document.body.clientHeight - 190,
                tableLoading: false,
                dataList: [],
                roleList:[]
            };
        },
        mounted() {
            this.getRoleList()
            this.getApproveList()
        },
        computed: {
            ...mapGetters(["direction", "drawerWidth", "permission"])
        },
        components: {},
        methods: {
            getRoleList(){
                api.getRoleList().then(res => {
                    this.roleList =  res.data? res.data:[]
                    this.tableLoading = false;
                }).catch(e => {
                    this.roleList = []
                    this.tableLoading = false;
                });
            },
            editApprove(){
                this.submitLoading = true;
                let dataList=JSON.parse(JSON.stringify(this.dataList))
                dataList.map(item=>{
                    if(!item.stepOneRole){
                        item.stepOneRole=0
                    }
                    if(!item.stepTwoRole){
                        item.stepTwoRole=0
                    }
                })
                api.editApprove(dataList).then(res => {
                    this.$message({
                        message: '操作成功',
                        type: "success"
                    });
                    this.getApproveList()
                    this.submitLoading = false;
                }).catch(e => {
                    this.getApproveList()
                    this.submitLoading = false;
                });
            },
            getApproveList() {
                this.tableLoading = true;
                api.getApproveList(1,999).then(res => {
                    const {records} = res.data
                    records.map(item=>{
                        if(!item.stepOneRole){
                            item.stepOneRole=''
                        }
                        if(!item.stepTwoRole){
                            item.stepTwoRole=''
                        }
                    })
                    this.dataList = records?records:[]
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
    .approve-index {
        width: 70%;
    }
</style>
