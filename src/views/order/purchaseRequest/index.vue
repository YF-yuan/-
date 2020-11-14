<template>
  <!-- 采购申请页面 -->
  <div id="purchaseRequest">
    <!-- 页面头部 -->
    <div class="applyheader">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="合同编号">
         <el-select v-model="formInline.contractCode" filterable placeholder="请选择合同编号" @change="chooseCode">
            <el-option v-for="item in codeList" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户简称">
          <el-select v-model="formInline.enterpriseId" filterable placeholder="请选择客户简称">
            <el-option label="111" value="111"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formInline.checkStatus" filterable placeholder="请选择状态">
            <el-option label="未完成" value="doing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人">
          <el-select v-model="formInline.headerId" filterable placeholder="请选择负责人">
            <el-option label="张三" value="zhangsan"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSearch"
            >搜索</el-button
          >
          <el-button type="primary" @click="onClear">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 申请列表 -->
    <div class="applymain">
      <div class="functionBtn">
        <el-button
          @click="drawer = true"
          icon="el-icon-plus"
          type="primary"
          style="margin-left: 16px"
        >
          新增
        </el-button>
        <el-drawer :title="naturatxt" :visible.sync="drawer" size="85%">
          <div>
            <purchase-apply v-on:natura-select="NaturaSelect"/>
          </div>
        </el-drawer>
        <el-button
          :loading="tableLoading"
          icon="el-icon-download"
          @click="getGoodList(1)"
          size="small"
          type="primary"
          >导出
        </el-button>
      </div>
      <!-- 主题列表 -->
      <div class="applytable">
        <el-table :data="contractList" border style="width: 100%">
          <el-table-column fixed prop="applyId" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="contractCode" label="合同编号" width="180">
          </el-table-column>
          <el-table-column prop="enterpriseName" label="客户简称" width="100">
          </el-table-column>
          <el-table-column prop="type" label="类型" width="80">
          </el-table-column>
          <el-table-column prop="count" label="数量 " width="60">
          </el-table-column>
          <el-table-column prop="signTime" label="签订日期" width="100" height="40">
          </el-table-column>
          <el-table-column prop="statusText" label="状态" width="80">
          </el-table-column>
          <el-table-column prop="headerName" label="负责人" width="80">
          </el-table-column>
          <el-table-column prop="checkStatusText" label="审批状态" width="80">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="220">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click="handleClick(scope.row)"
                size="small"
                >查看</el-button
              >
              <el-button type="primary" to="/order/purchaseRequest/substitude">
                编辑
              </el-button>
              <el-button type="primary" size="small">提交审批</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination small layout="prev, pager, next" :total="50" @click="choosePage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import PurchaseApply from './purchaseApply'
import api from '@/api/order/purchaseRequest'
export default {
  name: "PurchaseRequest",
  components: {
    PurchaseApply
  },
  data() {
    return {
      drawer: false,
      visible: false,
      innerDrawer: false,
      tableLoading: false,
      formInline: {
            "createTime": "2020-10-15 13:24:06",
            "createUser": "admin",
            "updateTime": null,
            "updateUser": "",
            "mark": 1,
            "contractId": 2,
            "contractCode": "ri0242u04",
            "enterpriseId": 1,
            "customerCode": "121321414",
            "signTime": "2020-10-14",
            "headerId": 14,
            "fileName": "工厂需求.jpg",
            "filePath": "temp/2020/10/15/570986740c-thumbnail.jpg",
            "pcbFileName": "",
            "pcbFilePath": "",
            "checkStatus": 4
        },
      contractList: [],
      naturatxt: '代料',
      codeList: [],
    }
  },
  async created () {
    // 获取页面初始化数据
    const { data } = await api.getApplyList(1,50) 
    this.contractList = data.records
    api.getContractList().then((res)=>{
      let formdata = res.data
      for(let i = 0; i < formdata.length; i++) {
        this.codeList.push(formdata[i].contractCode)
      }
    })
    
   
  },
  mounted() {
    
  },
  methods: {
    // 接受子组件的传值
    NaturaSelect (naturaSelect) {
      this.naturatxt = naturaSelect
    },
    onSearch () {
      console.log("submit!");
    },
    onClear () {
      console.log("clear");
    },
    handleClick (row) {
      console.log(row);
    },
    addGood () {
      this.visible = true;
      this.$nextTick(function () {
        this.visible = true;
      });
    },
    handleClose (done) {
      this.$confirm("还有未保存的工作哦确定关闭吗？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    getGoodList (isExport) {
      this.tableLoading = true;
      let data = JSON.parse(JSON.stringify(this.searchParam));
      let attributeKeys = [];
      let attributeValues = [];
      this.attributeList.map((item) => {
        if (item.attributeValueIds && item.attributeValueIds.length > 0) {
          attributeKeys.push(item.attributeKeyId);
          attributeValues = attributeValues.concat(item.attributeValueIds);
        }
      });
      data.attributeKeys = attributeKeys;
      data.attributeValues = attributeValues;
      if (isExport) {
        this.exportGood(data);
        return;
      }
      data.page = this.page;
      data.pageSize = this.pageSize;
      api
        .getGoodList(data)
        .then((res) => {
          const { records, total } = res.data;
          this.dataList = records ? records : [];
          this.count = total ? parseInt(total) : 0;
          this.tableLoading = false;
        })
        .catch((e) => {
          this.dataList = [];
          this.tableLoading = false;
        });
    },
    // 获取页面数据
    async chooseCode (e) { // 获取合同编码，根据相应的编码渲染数据
      const { data } = await api.getContractByCode(e)
      console.log(data)
    },
    choosePage (e) {
      console.log(e,'页数信息')
    }
  },
}
</script>

<style lang='less'>
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
        width: 54px;
        height: 26px;
        line-height: 0;
        padding: 0px;
      }
    }
  }
}
.el-pagination {
  width: auto;
  margin-top: 20px;
  text-align: center;
}
</style>