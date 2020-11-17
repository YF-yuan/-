<template>
    <el-dialog
            v-loading="loading"
            class="center-dialog"
            center
            :title="getOperatorName"
            :visible.sync="visible"
            width="1100px"
            :before-close="handleClose">
        <el-steps style="margin-top: 15px"
                  :process-status="item[item.length-1].status==2?'success':(item[item.length-1].status==3?'error':'')"
                  v-if="item&&item.length>0" :key="index" v-for="(item,index) in log"
                  :active="item.length-1" align-center>
            <el-step :description="item.length>0?`备注：${item[0].dealRemark?item[0].dealRemark:'无'}`:''">
                <template slot="title">
                    操作：开始<br/>
                    <span v-if="item.length>0">操作人：{{item[0].dealUser}}</span><br/>
                    <span v-if="item.length>0">操作时间：{{item[0].dealTime}}</span>
                </template>
            </el-step>
            <el-step :description="item.length>1?`备注：${item[1].dealRemark?item[1].dealRemark:'无'}`:''">
                <template slot="title">
                    操作：一审<br/>
                    <span v-if="item.length>1">操作人：{{item[1].dealUser}}</span><br/>
                    <span v-if="item.length>1">操作时间：{{item[1].dealTime}}</span>
                </template>
            </el-step>
            <el-step :description="item.length>2?`备注：${item[2].dealRemark?item[2].dealRemark:'无'}`:''">
                <template slot="title">
                    操作：二审<br/>
                    <span v-if="item.length>2">操作人：{{item[2].dealUser}}</span><br/>
                    <span v-if="item.length>2">操作时间：{{item[2].dealTime}}</span>
                </template>
            </el-step>
            <el-step>
                <template slot="title">
                    操作：完成
                </template>
            </el-step>
            <!--                <el-step :key="zindex" v-for="(child,zindex) in item"-->
            <!--                         :description="zindex==1||zindex==2?`备注：${child.dealRemark?child.dealRemark:'无'}`:''">-->
            <!--                    <template v-if="child.step<4" slot="title">-->
            <!--                        操作：{{stepChild[child.step]}}<br/>-->
            <!--                        操作人：{{child.dealUser}}<br/>-->
            <!--                        操作时间：{{child.dealTime}}-->
            <!--                    </template>-->
            <!--                    <template v-else slot="title">-->
            <!--                        操作：{{stepChild[child.step]}}<br/>-->
            <!--                    </template>-->
            <!--                </el-step>-->
        </el-steps>
        <div style="text-align: center">
            <el-button @click="handleClose" size="medium">返回</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import api from "@/api/order/bom/list";
    import {mapGetters} from "vuex";

    export default {
        name: "check-from",
        data() {
            return {
                loading: false,
                log: [],
                stepChild: {
                    1: '开始',
                    2: '一审',
                    3: '二审',
                    4: '通过'
                },
            };
        },
        props: {
            detailId: {
                type: Number,
                default() {
                    return 0;
                }
            },
            visible: {
                type: Boolean,
                default() {
                    return false;
                }
            }
        },
        components: {},
        computed: {
            ...mapGetters(["direction", "drawerWidth"]),
            getOperatorName() {
                return '审批进度'
            }
        },
        mounted() {
            this.checkinfo()
        },
        methods: {
            checkinfo() {
                this.loading = true
                api.checkinfo(this.detailId).then(res => {
                    let logList = res.data ? res.data : []
                    logList.map(item => {
                        if (item.length >= 3) {
                            if (item[item.length - 1].status == 2 && item[item.length - 1].step) {
                                let child = {
                                    step: 4,
                                    dealTime: item[item.length - 1].dealTime,
                                    status: 2
                                }
                                item.push(child)
                            }
                        }
                    })
                    this.log = logList
                    this.loading = false
                }).catch(e => {
                    this.ruleForm = {}
                    this.loading = false
                });
            },
            handleClose(hide) {
                this.$emit("returnBack");
            },
        }
    };
</script>

<style lang="less">
</style>
