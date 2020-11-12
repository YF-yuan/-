<template>
    <div class="main-box main-index" style="position: relative">
        <div v-if="count" class="kad-num">{{count>99?'99+':count}}</div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="未处理" name="1">
                <mainTable @returnCount="returnCount" v-if="activeName==1" :enterpriseList="enterpriseList"
                           :activeName="1"></mainTable>
            </el-tab-pane>
            <el-tab-pane label="已处理" name="2">
                <mainTable v-if="activeName==2" :enterpriseList="enterpriseList" :activeName="2"></mainTable>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import api from "@/api/order/contract/list";
    import mainTable from './mainTable'

    export default {
        name: "main-container",
        data() {
            return {
                activeName: '1',
                enterpriseList: [],
                count: 0
            }
        },
        created() {
        },
        watch: {},
        computed: {},
        components: {mainTable},
        mounted() {
            this.getEnterpriseList()
        },
        methods: {
            returnCount(count) {
                this.count = count
            },
            getEnterpriseList() {
                api.getEnterpriseList().then(res => {
                    this.enterpriseList = res.data ? res.data : []
                }).catch(e => {
                    this.enterpriseList = []
                });
            },
        }
    }
</script>


<style lang="less">
    .main-index {
        .kad-num{
            position: absolute;
            left: 84px;
            top: 6px;
            background-color: red;
            color: #ffffff;
            text-align: center;
            border-radius: 50%;
            height: 25px;
            line-height: 25px;
            width: 25px;
            font-size: 12px;
            z-index: 14;
        }
    }

</style>
