<template>
  <div class="main-box purchase-order">
    <!-- 搜索开始 -->
    <el-form v-model="searchParam" :inline="true" class="demo-form-inline" ref="table">
      <el-form-item label="合同编号">
        <el-input
          style="width:200px"
          clearable
          maxlength="30"
          size="small"
          v-model="searchParam.contractCode"
          placeholder="请输入合同编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="客户简介">
        <el-select size="small" clearable filterable v-model="searchParam.enterpriseId">
          <el-option
            :key="index"
            :value="item.enterpriseId"
            :label="item.shortName"
            v-for="(item,index) of enterpriseList"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          style="width:200px"
          size="small"
          clearable
          filterable
          v-model="searchParam.status"
        >
          <el-option
            :key="index"
            :label="item.dictValue"
            :value="item.dictKey"
            v-for="(item,index) of statusList"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责人">
        <el-select
          style="width:200px"
          clearable
          filterable
          size="small"
          v-model="searchParam.headerId"
        >
          <el-option
            :key="index"
            :value="item.userId"
            :label="item.nickname"
            v-for="(item,index) of userList"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="tableLoading"
          icon="el-icon-search"
          size="small"
          type="primary"
          @click="search"
        >搜索</el-button>
        <el-button
          size="small"
          icon="el-icon-refresh-right"
          type="default"
          @click="total=0;initSearchParam();search()"
        >清空</el-button>
      </el-form-item>
    </el-form>
    <!-- 搜索结束 -->

    <!-- 订单列表展示开始 -->
    <el-table
      ref="table"
      size="medium"
      v-loading="tableLoading"
      :data="dataList"
      border
      hightlight-current-row
      :height="tableHeight"
    >
      <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
      <el-table-column label="合同编号" min-width="140" prop="contractCode" align="center"></el-table-column>
      <el-table-column label="客户简介" prop="enterpriseName" min-width="100" align="center"></el-table-column>
      <el-table-column label="类型" prop="type" min-width="100" align="center"></el-table-column>
      <el-table-column label="数量" prop="number" min-width="110" align="center"></el-table-column>
      <el-table-column label="金额" prop="amount" min-width="110" align="center"></el-table-column>
      <el-table-column label="签订日期" prop="signTime" align="center" min-width="110"></el-table-column>
      <el-table-column label="状态" prop="status" align="center" min-width="120"></el-table-column>
      <el-table-column label="负责人" prop="headerName" min-width="100" align="center"></el-table-column>
      <el-table-column label="审批" prop="checkStatus" min-width="120" align="center"></el-table-column>
      <el-table-column label="操作" min-width="300">
        <template slot-scope="{row}">
          <el-button size="small" type="primary" icon="el-icon-view" @click="lookShow(row)">查看</el-button>
          <el-button size="small" type="primary" icon="el-icon-edit" @click="edit(row)">编辑</el-button>
          <el-button size="small" type="primary" icon="el-icon-edit" @click="check(row)">提交审批</el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-view"
            @click="checkInfo(row)"
            style="display:none"
          >审批进度</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 订单列表展示结束 -->

    <div class="page-current">
      <div class="total">
        <span>合同数量：{{totalNumber}}，合同金额：{{totalAmount}}</span>
      </div>
      <el-pagination
        :current-page.sync="currentPage"
        layout="total,prev,pager,next,jumper"
        :total="total"
        background
        prev-text="上一页"
        next-text="下一页"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <order-form :visible.sync="isShow"></order-form>
  </div>
</template>

<script>
import orderForm from "./orderForm"
import api from "@/api/order/purchaseOrder";
import contractApi from "@/api/order/contract/list";
export default {
  components: {
    orderForm
  },
  data() {
    return {
      searchParam: {
        contractCode: "",
        enterpriseId: "",
        status: "",
        headerId: ""
      },
      tableHeight: document.body.clientHeight - 290,
      pageSize: parseInt((document.body.clientHeight - 290 - 43) / 44.5),
      currentPage: 1,
      isShow: false,
      enterpriseList: [],
      statusList: [
        { dictKey: "0", dictValue: "未完成" },
        { dictKey: "1", dictValue: "已采购" }
      ],
      userList: [],
      tableLoading: false,
      dataList: [
        {
          contractCode: "123jklfjkl",
          enterpriseName: "测试",
          type: "代料",
          number: 1000,
          amount: 1000,
          signTime: "2020-8-4",
          status: 0,
          headerName: "张三",
          checkStatus: 0
        },
        {
          contractCode: "123jklfjkl",
          enterpriseName: "测试",
          type: "自购",
          number: 1000,
          amount: 1000,
          signTime: "2020-8-4",
          status: 0,
          headerName: "张三",
          checkStatus: 0
        },
        {
          contractCode: "123jklfjkl",
          enterpriseName: "测试",
          type: "代料",
          number: 1000,
          amount: 1000,
          signTime: "2020-8-4",
          status: 0,
          headerName: "张三",
          checkStatus: 0
        }
      ],
      total: 3
    };
  },
  created() {
    this.getPurchaseOrderList();
    this.getAllUser();
    this.getEnterpriseList();
  },
  computed: {
    totalNumber() {
      return 159;
    },
    totalAmount() {
      return 244455.23;
    }
  },
  methods: {
    getAllUser() {
      contractApi
        .getAllUser()
        .then(res => {
          this.userList = res.data ? res.data : [];
        })
        .catch(e => {
          this.userList = [];
        });
    },
    getEnterpriseList() {
      contractApi
        .getEnterpriseList()
        .then(res => {
          this.enterpriseList = res.data ? res.data : [];
        })
        .catch(e => {
          this.enterpriseList = [];
        });
    },
    initSearchParam() {
      this.searchParam = {
        contractCode: "",
        enterpriseId: "",
        status: "",
        headerId: ""
      };
    },
    getPurchaseOrderList() {
      this.tableLoading = true;
      api
        .getPurchaseOrderList(this.currentPage, this.pageSize, this.searchParam)
        .then(res => {
          console.log(res);
          let { total, orders, records } = res.data;
          this.total = total;
          this.dataList = orders;
          this.tableLoading = false;
        });
    },
    search() {
      this.page = 1;
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getPurchaseOrderList();
    },
    handleCurrentChange(val) {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getPurchaseOrderList();
    },
    check(row) {},
    checkInfo(row) {},
    edit(row) {
      this.isShow = true;
    },
    lookShow(row) {}
  }
};
</script>

<style scoped lang="less">
.purchase-order {
  position: relative;
  height: auto;
  .page-current {
    width: 100%;
    align-items: center;
    display: flex;
    justify-content: space-between;
    .total {
      color: #2c3e50;
      font-weight: 700;
    }
  }
}
</style>