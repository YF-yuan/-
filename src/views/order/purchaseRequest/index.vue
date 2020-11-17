<template>
  <!-- 采购申请页面 -->
  <div class="main-box purchase-request">
    <!-- 页面头部 -->
    <el-form :inline="true" v-model="searchParam" class="demo-form-inline">
      <el-form-item label="合同编号">
        <el-select
          v-model="searchParam.contractCode"
          filterable
          size="small"
          placeholder="请选择合同编号"
          @change="chooseCode"
          height="30"
        >
          <el-option
            v-for="item in codeList"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户简称">
        <el-select
          v-model="searchParam.enterpriseId"
          filterable
          size="small"
          placeholder="请选择客户简称"
        >
          <el-option
            :key="index"
            :value="item.enterpriseId"
            :label="item.shortName"
            v-for="(item, index) of enterpriseList"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="searchParam.checkStatus"
          filterable
          placeholder="请选择状态"
        >
          <el-option
            v-for="(item, index) in checkStatusList"
            :key="index"
            :label="item.dictKey"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责人">
        <el-select
          v-model="searchParam.headerId"
          filterable
          placeholder="请选择负责人"
        >
          <el-option
            :key="index"
            :value="item.userId"
            :label="item.nickname"
            v-for="(item, index) of userList"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          :loading="tableLoading"
          @click="search"
          >搜索</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-refresh-right"
          @click="
            total = 0;
            initSearchParam();
            search();
          "
          >清空</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 申请列表 -->
    <div class="applymain">
      <div class="functionBtn">
        <el-button
          @click="add"
          icon="el-icon-plus"
          type="primary"
          style="margin-left: 16px"
        >
          新增
        </el-button>
        <el-button
          :loading="tableLoading"
          icon="el-icon-download"
          @click="exportData"
          size="small"
          type="primary"
          >导出
        </el-button>
      </div>

      <div class="applytable">
        <el-table
          :span-method="objectSpanMethod"
          v-loading="tableLoading"
          :data="dataList"
          height="300"
          border
          style="width: 100%"
        >
          <el-table-column fixed prop="applyId" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="contractCode" label="合同编号" width="180">
          </el-table-column>
          <el-table-column prop="enterpriseName" label="客户简称" width="100">
          </el-table-column>
          <el-table-column prop="type" label="类型" width="80">
          </el-table-column>
          <el-table-column prop="number" label="数量 " width="60">
          </el-table-column>
          <el-table-column
            prop="signTime"
            label="签订日期"
            width="100"
            height="40"
          >
          </el-table-column>
          <el-table-column prop="statusText" label="状态" width="80">
          </el-table-column>
          <el-table-column prop="headerName" label="负责人" width="80">
          </el-table-column>
          <el-table-column prop="checkStatusText" label="审批状态" width="80">
            <template slot-scope="{ row }">
              <span v-if="row.bomStatus">{{
                getCheckStatusName(row.bomStatus)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="220">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                @click="lookShow(row)"
                icon="el-icon-view"
                size="small"
                >查看</el-button
              >
              <el-button type="primary" @click="edit(row)" icon="el-icon-edit">
                编辑
              </el-button>
              <el-button
                @click="checkinfo(row)"
                v-if="
                  (row.bomStatus == 2 ||
                    row.bomStatus == 3 ||
                    row.bomStatus == 4) &&
                  permission.order_bom_checkinfo
                "
                type="primary"
                icon="el-icon-view"
                size="small"
                >审批进度
              </el-button>
              <el-button
                type="primary"
                @click="check(row)"
                icon="el-icon-edit"
                size="small"
                >提交审批</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <div class="pagination">
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
    <!-- drawer -->
    <apply-form
      :isShow="isShow"
      v-if="visible"
      :visible="visible"
      @returnBack="visible = false"
      :request-info="requestInfo"
      :action="action"
      :formDetail='formDetail'
    ></apply-form>
    <approval-form
      v-if="checkVisible"
      :visible="checkVisible"
      :detailId="detailId"
      @returnBack="checkVisible = false"
    ></approval-form>
  </div>
</template>

<script>
import ApplyForm from "./ApplyForm";
import api from "@/api/order/purchaseRequest";
import { mapGetters } from "vuex";
import ApprovalForm from "./ApprovalForm.vue";
export default {
  name: "purchase-request",
  components: {
    ApplyForm,
    ApprovalForm,
  },
  data() {
    return {
      detailId: 0,
      total: 3,
      pageSize: parseInt((document.body.clientHeight - 290 - 43) / 44.5),
      currentPage: 1,
      tableLoading: false,
      checkVisible: false,
      searchParam: {
        contractCode: "",
        enterpriseId: "",
        status: "",
        headerId: "",
      },
      checkStatusList: [
        { dictKey: "0", dictValue: "未完成" },
        { dictKey: "1", dictValue: "已完成" },
      ],
      userList: [
        {
          userId: 0,
          nickname: "张三",
        },
        {
          userId: 1,
          nickname: "李四",
        },
      ],
      enterpriseList: [
        {
          enterpriseId: 1,
          shortName: "拓恒水务",
        },
        {
          enterpriseId: 2,
          shortName: "拓恒航空",
        },
      ],
      dataList: [],
      naturatxt: "代料",
      codeList: [],
      isShow: false,
      requestInfo: {},
      action: "",
      visible: false,
      formDetail: {}
    }
  },
  computed: {
    ...mapGetters(["direction", "drawerWidth", "permission"]),
  },
  created() {
    // 获取页面初始化数据
    this.getDataList();
  },
  mounted() {},
  methods: {
    //
    getDataList() {
      this.tableLoading = true;
      api
        .getApplyList(this.currentPage, this.pageSize, this.searchParam)
        .then((res) => {
          this.tableLoading = false;
          this.dataList = res.data.records;
          this.total = res.data.total;
        });
    },
    // 接受子组件的传值
    NaturaSelect(naturaSelect) {
      this.naturatxt = naturaSelect;
    },
    search() {
      console.log("submit!");
    },
    handleClose(done) {
      this.$confirm("还有未保存的工作哦确定关闭吗？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 获取页面数据
    async chooseCode(e) {
      // 获取合同编码，根据相应的编码渲染数据
      const { data } = await api.getContractByCode(e);
      console.log(data);
    },
    choosePage(e) {
      console.log(e, "页数信息");
    },
    handleCurrentChange(val) {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.getPurchaseOrderList();
    },
    add() {
      this.isShow = true;
      this.action = "add";
      this.$nextTick(function () {
        this.visible = true;
      });
    },
    initSearchParam() {
      this.formInline = {
        contractCode: "",
        enterpriseId: "",
        status: "",
        headerId: "",
      };
    },
    exportData() {},
    lookShow(row) {
      console.log(row,'purchaseRequest页面查看')
      api.infoApply(row.applyId).then((res)=>{
        this.formDetail = res.data
        console.log(this.formDetail)
        this.action = "lookShow";
        this.isShow = true;
        this.isCheck = 0;
        this.$nextTick(function () {
          this.visible = true;
        })
      })
   
    },
    edit(row) {
      this.isShow = true;
      this.action = "edit";
      this.requestInfo = row;
      this.$nextTick(function () {
        this.visible = true;
      });
    },
    check(row) {
      this.isShow = true
      this.actions = "check"
      this.requestInfo = row
      this.$nextTick(function () {
        this.visible = true;
      })
    },
    checkinfo(row) {
      this.detailId = row.detailId;
      this.$nextTick(function () {
        this.checkVisible = true;
      });
    },
    getCheckStatusName(bomStatus) {
      let child = this.checkStatusList.find(
        (item) => item.dictKey == bomStatus
      );
      if (child) {
        return child.dictValue;
      } else {
        return "";
      }
    },
    // 合并列表项
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // if (columnIndex === 1 || columnIndex === 3 || columnIndex === 5) {
      //   if (row.span) {
      //     return {
      //       rowspan: row.span,
      //       colspan: 1
      //     }
      //   } else {
      //     return {
      //       rowspan: 0,
      //       colspan: 0
      //     }
      //   }
      // }
    },
  },
};
</script>

<style lang='less' scoped>
element.style {
  height: auto;
}
.route-box {
  height: auto;
}
.el-form {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-form-item {
    width: 210px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-form-item__label {
      height: 24px;
    }
    .el-form-item__content {
      width: 140px;
      height: 24px;
      padding: 0;
      margin: 0;
      .el-input__inner {
        width: 150px;
        height: 24px;
      }
    }
    .el-button {
      width: 56px;
      height: 24px;
      line-height: 0;
      padding: 0;
      font-size: 14px;
    }
  }
}
.applymain {
  width: 100%;
  margin-top: 20px;
  .functionBtn {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .el-button {
      width: 60px;
      height: 24px;
      font-size: 12px;
      margin-right: 10px;
      line-height: 0;
      padding: 0;
    }
  }
  .applytable {
    width: 100%;
    margin-top: 10px;
    .el-table {
      td {
        padding: 0;
      }
      th {
        padding: 0;
      }
      .cell {
        padding: 10px;
        margin: 0;
      }
      .el-button {
        height: 24px;
        padding: 2px;
        font-size: 12px;
      }
    }
  }
}
.el-pagination {
  width: auto;
  margin-top: 20px;
  text-align: end;
}
</style>