<template>
  <el-drawer
    :direction="direction"
    :visible.sync="visible"
    :size="drawerWidth + 'px'"
    :before-close="handleClose"
  >
    <el-form v-model="paramInit" style="width: 620px" label-position="right">
      <el-row>
        <el-col :span="11">
          <el-form-item required label="合同性质">
            <el-select
              v-model="paramInit.type"
              :disabled="disabled"
              style="width: 200px"
              size="small"
              filterable
              clearable
              @change="chooseType"
            >
              <el-option
                v-for="(item, index) of typeList"
                :key="index"
                :label="item.value"
                :value="item.type"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item label="代工合同编号" required>
            <el-select
              :disabled="disabled"
              v-model="paramInit.contractCode"
              style="width: 200px"
              size="small"
              filterable
              @change="getcodeList"
              clearable
            >
              <el-option
                v-for="(item, index) in codeList"
                :key="index"
                :label="item.value"
                :value="item.type"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="客户名称" required>
            <el-input
              v-model="paramInit.enterpriseName"
              :disabled="disabled"
              style="width: 200px"
              size="small"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item required label="客户简称">
            <el-input
              :disabled="disabled"
              v-model="paramInit.enterpriseId"
              size="small"
              style="width: 200px"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="签订日期" required>
            <el-date-picker
              v-model="paramInit.singTime"
              style="width: 200px"
              type="date"
              placeholder="选择日期"
              size="small"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item required label="负责人">
            <el-select
              :disabled="disabled"
              v-model="paramInit.headerId"
              size="small"
              style="width: 200px"
            >
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="upload-info">
      <span> <i style="color: #F56C6C">*</i>上传附件 </span>
      <div>
        <upload-image
          :value="paramInit.value"
          :is-compress="true"
          style="margin-bottom: 10px"
        ></upload-image>
        <span style="margin-left: 8px">只支持pdf、jpg格式</span>
      </div>
    </div>

    <div class="order-info" v-if="listShow">
      <div class="info-header">
        <span>
          <span>产品名称</span>
          {{ "14554" }}
        </span>
        <span>
          <span>数量</span>
          {{ "14554" }}
        </span>
        <span>
          <span>bom</span>
          <el-button type="default" size="small">查看</el-button>
        </span>
        <span>
          <span>查询编码</span>
          <el-select
            filterable
            size="small"
            style="width: 200px; margin-right: 5px"
          ></el-select>
          <el-button type="default" size="small">查询</el-button>
        </span>
      </div>
      <el-table
        size="medium"
        v-loading="tableLoading"
        :data="dataList"
        hightligth-current-row
        border
        height="300"
        fixed
        :span-method="mergeLine"
      >
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80"
        ></el-table-column>
        <el-table-column
          label="阶层"
          align="center"
          min-width="100"
        ></el-table-column>
        <el-table-column
          label="物料编码"
          align="center"
          min-width="120"
        ></el-table-column>
        <el-table-column
          label="数量"
          align="center"
          min-width="100"
        ></el-table-column>
        <el-table-column
          label="需求数量"
          align="center"
          min-width="100"
        ></el-table-column>
        <el-table-column
          label="现有库存"
          align="center"
          min-width="100"
        ></el-table-column>
        <el-table-column
          label="备损"
          align="center"
          min-width="100"
        ></el-table-column>
        <el-table-column
          label="需采购数量"
          align="center"
          min-width="100"
        ></el-table-column>
        <el-table-column
          label="实际采购数量"
          align="center"
          min-width="100"
        ></el-table-column>
        <el-table-column
          label="采购单价"
          align="center"
          min-width="100"
        ></el-table-column>
        <el-table-column
          label="采购总价"
          align="center"
          min-width="100"
        ></el-table-column>
      </el-table>
    </div>

    <div class="order-info" v-else>
      <div class="info-header">
        <el-button type="primary">添加</el-button>
        <el-button type="primary">导入</el-button>
        <el-button type="primary">模板</el-button>
      </div>
      <el-table
        highlight-current-row
        v-loading="tableLoading"
        size="medium"
        :data="dataList"
        border
        height="300"
      >
        <el-table-column
          label="序号"
          type="index"
          width="80"
          align="center"
          fixed
        ></el-table-column>
        <el-table-column
          label="物料编码"
          align="center"
          min-width="120"
        ></el-table-column>
        <el-table-column
          label="需采购数量"
          align="center"
          min-width="100"
        ></el-table-column>
        <el-table-column
          label="实际采购数量"
          align="center"
          min-width="100"
        ></el-table-column>
        <el-table-column
          label="采购单价"
          align="center"
          mn-width="100"
        ></el-table-column>
        <el-table-column
          label="采购总价"
          align="center"
          min-width="100"
        ></el-table-column>
      </el-table>
    </div>

    <div class="action">
      <el-button type="primary" size="small">保存</el-button>
      <el-button type="primary" size="small" @click="handleClose"
        >返回</el-button
      >
    </div>
  </el-drawer>
</template>

<script>
import uploadImage from "@/components/uploadImage";
import api from "@/api/order/purchaseRequest";
import conApi from "@/api/order/contract/list";
import { mapGetters } from "vuex";

export default {
  name: "apply-form",
  components: {
    uploadImage,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    requestInfo: {
      type: Object,
    },
    action: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      dataList: [],
      tableLoading: false,
      disabled: false,
      headerList: [],
      codeList: [],
      typeList: [
        { type: 0, value: "自采" },
        { type: 1, value: "代料" },
      ],
      contractList: [],
      paramInit: {
        type: 1,
        contractCode: "",
        enterpriseName: "",
        enterpriseId: 0,
        singTime: "",
        headerId: "",
        value: [],
      },
      listShow: true,
    };
  },

  methods: {
    resetParamInit() {
      this.paramInit = {
        type: "代料",
        contractCode: "",
        enterpriseName: "",
        enterpriseId: 0,
        singTime: "",
        headerId: "",
        value: [],
      };
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
    getcodeList() {
      api.getContractByCode(this.paramInit.contractCode).then((res) => {
        this.codeList = res.data;
      });
    },
    getContractCodeList() {
      conApi.getContractList().then((res) => {
        this.contractList = res.data.records;
      });
    },
    mergeLine({ row, column, rowIndex, columnIndex }) {
      console.log(row, column, rowIndex, columnIndex);
    },
    chooseType(e) {
      if (e == 0) {
        this.listShow = false;
      } else {
        this.listShow = true;
      }
    },
  },

  computed: {
    ...mapGetters(["drawerWidth", "direction"]),
    // paramInsert() {
    //   if (this.requestInfo)
    //     return Object.assign(this.paramInit, this.requestInfo);
    //   return this.paramInit;
    // },
  },

  watch: {
    visible(val) {
      if (val == false) {
        this.resetParamInit();
      }
    },
    action(val) {
      if (val === "add") {
        this.getContractCodeList();
      }
    },
  },
};
</script>

<style scoped lang="less">
@fontColor: #606266;
.el-row {
  .el-form-item {
    display: flex;
    justify-content: flex-end;
  }
}

.upload-info {
  margin-left: 8px;
  display: flex;
  span {
    font-size: 14px;
    margin-top: 10px;
    color: @fontColor;
  }
}

.order-info {
  margin: 0 0 20px 10px;
  .info-header {
    margin: 20px 0;
    .el-button {
      width: 60px;
      height: 24px;
      margin-right: 10px;
      line-height: 0;
      padding: 0;
    }
    span {
      margin-right: 50px;
      font-size: 14px;
      color: @fontColor;
      i {
        margin-right: 14px;
      }
    }
  }
}
</style>