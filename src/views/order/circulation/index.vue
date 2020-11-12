<template>
    <div class="main-box circulation-index">
        <el-table ref="table" :height="tableHeight" size="medium" v-loading="tableLoading" :data="dataList" border>
            <el-table-column label="序号" type="index" width="80" align="center"/>
            <el-table-column min-width="100" align="center" prop="circulationName" label="流转步骤"></el-table-column>
            <el-table-column align="center" label="节点1">
                <template slot-scope="{row}">
                  <el-select v-model="row.roleId" size="small" clearable filterable>
                      <el-option :key="index" :value="item.roleId" :label="item.roleName" v-for="(item,index) in roleList"></el-option>
                  </el-select>
                </template>
            </el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 15px">
            <el-button
                    :loading="submitLoading"
                    v-if="permission.order_circulation_edit"
                    icon="el-icon-edit"
                    @click="editCirculation"
                    size="small"
                    type="primary"
            >保存
            </el-button>
        </div>
    </div>
</template>

<script>
    import api from "@/api/order/circulation/index";
    import {mapGetters} from "vuex";

    export default {
        name: "circulation-index",
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
            this.getCirculationList()
        },
        computed: {
            ...mapGetters(["direction", "drawerWidth", "permission"])
        },
        components: {},
        methods: {
            getRoleList(){
                api.getRoleList().then(res => {
                    this.roleList =  res.data? res.data:[]
                }).catch(e => {
                    this.roleList = []
                });
            },
            editCirculation(){
                this.submitLoading = true;
                let dataList=JSON.parse(JSON.stringify(this.dataList))
                dataList.map(item=>{
                    if(!item.roleId){
                        item.roleId=0
                    }
                })
                api.editCirculation(dataList).then(res => {
                    this.$message({
                        message: '操作成功',
                        type: "success"
                    });
                    this.getCirculationList()
                    this.submitLoading = false;
                }).catch(e => {
                    this.getCirculationList()
                    this.submitLoading = false;
                });
            },
            getCirculationList() {
                this.tableLoading = true;
                api.getCirculationList(1,999).then(res => {
                    const {records} = res.data
                    records.map(item=>{
                        if(!item.roleId){
                            item.roleId=''
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
    .circulation-index {
        width: 50%;
    }
</style>
