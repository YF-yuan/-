<template>
  <el-drawer
    :direction="direction"
    :visible.sync="visible"
    :size="drawerWidth+'px'"
    :before-close="handleClose"
  >
    <el-form v-model="paramInsert" style="width:620px;" label-position="right">
      <el-row>
        <el-col :span="11">
          <el-form-item required label="合同性质">
            <el-select
              v-model="paramInsert.contractType"
              :disabled="disabled"
              style="width:200px;"
              size="small"
            ></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item label="代工合同编号" required>
            <el-select
              :disabled="disabled"
              v-model="paramInsert.contractCode"
              style="width:200px;"
              size="small"
            ></el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="客户名称" required>
            <el-input
              v-model="paramInsert.enterpriseName"
              :disabled="disabled"
              style="width:200px;"
              size="small"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item required label="客户简称">
            <el-input
              :disabled="disabled"
              v-model="paramInsert.enterpriseId"
              size="small"
              style="width:200px;"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="签订日期" required>
            <el-input
              :disabled="disabled"
              size="small"
              style="width:200px;"
              v-model="paramInsert.signTime"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item required label="负责人">
            <el-select
              :disabled="disabled"
              v-model="paramInsert.headerId"
              size="small"
              style="width:200px;"
            ></el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="upload-info">
      <span>
        <i style="color:#F56C6C">*</i>上传附件
      </span>
      <div>
        <upload-image :value="value" :is-compress="true" style="margin-bottom:10px;"></upload-image>
        <span style="margin-left:8px;">只支持pdf、jpg格式</span>
      </div>
    </div>

    <div class="order-info">
      <div class="info-header">
        <span>
          <i>产品名称</i>
          {{'14554'}}
        </span>
        <span>
          <i>数量</i>
          {{'14554'}}
        </span>
        <span>
          <i>bom</i>
          <el-button type="default" size="small">查看</el-button>
        </span>
        <span>
          <i>查询编码</i>
          <el-select filterable size="small" style="width:200px;margin-right:5px;"></el-select>
          <el-button type="default" size="small">查询</el-button>
        </span>
      </div>
      <el-table
        size="medium"
        v-loading="tableLoading"
        :data="dataList"
        hightligth-current-row
        border
      >
        <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
        <el-table-column label="阶层" align="center" min-width="100"></el-table-column>
        <el-table-column label="物料编码" align="center" min-width="120"></el-table-column>
        <el-table-column label="数量" align="center" min-width="100"></el-table-column>
        <el-table-column label="需求数量" align="center" min-width="100"></el-table-column>
        <el-table-column label="现有库存" align="center" min-width="100"></el-table-column>
        <el-table-column label="备损" align="center" min-width="100"></el-table-column>
        <el-table-column label="需采购数量" align="center" min-width="100"></el-table-column>
        <el-table-column label="实际采购数量" align="center" min-width="100"></el-table-column>
        <el-table-column label="采购单价" align="center" min-width="100"></el-table-column>
        <el-table-column label="采购总价" align="center" min-width="100"></el-table-column>
      </el-table>
    </div>

    <div class="order-info">
      <el-table
        highlight-current-row
        v-loading="tableLoading"
        size="medium"
        :data="dataList"
        border
      >
        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
        <el-table-column label="物料编码" align="center" min-width="120"></el-table-column>
        <el-table-column label="需采购数量" align="center" min-width="100"></el-table-column>
        <el-table-column label="实际采购数量" align="center" min-width="100"></el-table-column>
        <el-table-column label="采购单价" align="center" mn-width="100"></el-table-column>
        <el-table-column label="采购总价" align="center" min-width="100"></el-table-column>
      </el-table>
    </div>
    <div class="action">
      <el-button type="default" size="small">保存</el-button>
      <el-button type="default" size="small" @click="handleClose">返回</el-button>
    </div>
  </el-drawer>
</template>

<script>
import uploadImage from "@/components/uploadImage";
import { mapGetters } from "vuex";
export default {
  components: {
    uploadImage
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    }
  },
  data() {
    return {
      paramInsert: {
        headerId: 12
      },
      value: [],
      dataList: [],
      tableLoading: false,
      disabled:true
    };
  },
  computed: {
    ...mapGetters(["drawerWidth", "direction"])
  }
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
    margin-bottom: 20px;
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