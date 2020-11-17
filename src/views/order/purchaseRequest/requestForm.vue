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
              v-model="paramInsert.type"
              :disabled="disabled"
              style="width:200px;"
              size="small"
              filterable
              clearable
            >
              <el-option
                v-for="(item,index) of typeList"
                :key="index"
                v-model="item.type"
                :label="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item label="代工合同编号" required v-if="paramInsert.type==1">
            <el-select
              :disabled="disabled&&action!='add'"
              v-model="paramInsert.contractCode"
              style="width:200px;"
              size="small"
              filterable
              @change="getInfo"
              clearable
            >
              <el-option
                v-for="(item,index) of contractCodeList"
                :key="index"
                :label="item.contractCode"
                :value="item.contractCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="自采申请编号" required v-else>
            <el-input v-model="paramInsert.contractCode" size="small" style="width:200px"></el-input>
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
            <el-date-picker
              v-model="paramInsert.signTime"
              style="width:200px"
              type="date"
              placeholder="选择日期"
              size="small"
              :disabled="disabled"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item required label="负责人">
            <el-select
              :disabled="disabled"
              v-model="paramInsert.headerId"
              size="small"
              style="width:200px;"
              filterable
              clearable
            >
              <el-option
                v-for="(item,index) of userList"
                :key="index"
                :label="item.nickname"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="upload-info">
      <span>
        <i style="color:#F56C6C">*</i>上传附件
      </span>
      <div>
        <upload-image
          :value="paramInsert.filePath"
          :is-compress="true"
          style="margin-bottom:10px;"
          :disabled="disabled"
        ></upload-image>
        <span style="margin-left:8px;">只支持pdf、jpg格式</span>
      </div>
    </div>

    <template v-if="paramInsert.type==1">
      <div class="order-info" v-for="(item,index) of paramInsert.productList" :key="index">
        <div class="info-header">
          <span>
            <i>产品名称</i>
            {{item.productName}}
          </span>
          <span>
            <i>数量</i>
            {{item.number}}
          </span>
          <span>
            <i>bom</i>
            <el-button type="default" size="small">查看</el-button>
          </span>
          <span v-if="action!=='check'">
            <i>查询编码</i>
            <el-select
              filterable
              size="small"
              style="width:200px;margin-right:5px;"
              v-model="goodId"
              clearable
            >
              <el-option
                v-for="(code,index) of item.detailList"
                :key="index"
                :label="code.goodCode"
                :value="code.goodId"
              ></el-option>
            </el-select>
            <el-button type="default" size="small" @click="filterDetail(index)">查询</el-button>
          </span>
        </div>
        <el-table
          size="medium"
          v-loading="tableLoading"
          :data="item.detailList"
          hightligth-current-row
          border
          :span-method="arraySpanMethod"
          :summary-method="getSummaries"
          show-summary
        >
          <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
          <el-table-column label="阶层" align="center" min-width="100" prop="bomLevel"></el-table-column>
          <el-table-column label="物料编码" align="center" min-width="120" prop="goodCode"></el-table-column>
          <el-table-column label="数量" align="center" min-width="100" prop="number"></el-table-column>
          <el-table-column label="需求数量" align="center" min-width="100" prop="needNumber"></el-table-column>
          <el-table-column label="现有库存" align="center" min-width="100" prop="storageNumber">
            <template slot-scope="{row}">
              <span v-if="action=='lookShow'|| action=='check'">{{row.storageNumber}}</span>
              <el-input v-else v-model="row.storageNumber"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="备损" align="center" min-width="100" prop="lossNumber">
            <template slot-scope="{row}">
              <span v-if="action=='lookShow'|| action=='check'">{{row.lossNumber}}</span>
              <el-input v-else v-model="row.lossNumber"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="需采购数量" align="center" min-width="100" prop="purchaseNumber">
            <template slot-scope="{row}">
              <span v-if="action=='lookShow' || action=='check'">{{row.purchaseNumber}}</span>
              <el-input v-else v-model="row.purchaseNumber"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>

    <template v-else>
      <div class="order-info">
        <div class="info-header">
          <el-button type="default" size="small">添加</el-button>
          <el-button type="default" size="small">导入</el-button>
          <el-button type="default" size="small">模板</el-button>
        </div>
        <el-table
          highlight-current-row
          v-loading="tableLoading"
          size="medium"
          :data="paramInsert.productList"
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
    </template>
    <div class="idea" v-if="action=='check'">
      <span>意见：</span>
      <el-input type="textarea" placeholder="请输入意见" v-model="dealRemark" :rows="5"></el-input>
    </div>
    <div class="action">
      <el-button type="default" size="small" v-if="action=='edit'||action=='add'" @click="saving">保存</el-button>
      <el-button type="default" size="small" v-else-if="action=='check'">提交审批</el-button>
      <el-button type="default" size="small" @click="handleClose">返回</el-button>
    </div>
  </el-drawer>
</template>

<script>
import uploadImage from "@/components/uploadImage";
import api from "@/api/order/purchaseRequest";
import conApi from "@/api/order/contract/list";
import { mapGetters } from "vuex";
let obj = {
  createTime: "",
  createUser: "",
  updateTime: "",
  updateUser: "",
  mark: undefined,
  applyId: undefined,
  contractId: undefined,
  contractCode: "",
  type: 1,
  enterpriseId: undefined,
  signTime: "",
  headerId: undefined,
  fileName: "",
  filePath: "",
  status: 1,
  checkStatus: 1,
  enterpriseName: null,
  headerName: null,
  statusText: null,
  checkStatusText: null,
  productList: []
};

export default {
  components: {
    uploadImage
  },

  props: {
    visible: {
      type: Boolean,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    applyId: {
      type: Number
    }
  },

  data() {
    return {
      goodId: undefined,
      tableLoading: false,
      disabled: false,
      typeList: [
        { type: 1, value: "代料" },
        { type: 0, value: "自采" }
      ],
      contractCodeList: [],
      userList: [],
      dealRemark: "",
      productList: [],
      paramInsert: obj
    };
  },
  methods: {
    getInfo() {
      api.getContractByCode(this.paramInsert.contractCode).then(res => {
        api.getProduct(res.data[0].contractId).then(result => {
          console.log(result.data);
          this.paramInsert = Object.assign(res.data[0], {
            productList: this.prevDetail(result.data),
            type: 1
          });
          this.disabled=true;
        }).catch(e=>{
          this.paramInsert=obj;
        });
      }).catch(e=>{
        this.paramInsert=obj
      });
    },
    filterDetail(index) {
      let paramInsert = this.paramInsert;
      this.tableLoading = true;
      if (this.goodId) {
        paramInsert.productList[index].detailList = paramInsert.productList[
          index
        ].detailList.filter(item => {
          return item.goodId == this.goodId;
        });
        this.paramInsert = paramInsert;
      } else {
        let arr = this.paramInsert.productList;
        arr[index] = JSON.parse(JSON.stringify(this.productList[index]));
        this.$set(this.paramInsert, "productList", arr);
        console.log(this.paramInsert);
      }
      this.tableLoading = false;
    },
    saving() {
      if (this.action == "edit") {
        api
          .editApply(this.paramInsert)
          .then(res => {
            console.log(res);
            if (res.code == 200) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
            }else{
              this.$message.error('修改成功')
            }
          })
          .catch(e => {
            console.log(e);
            this.$message.error("修改失败");
          });
      }
      if(this.action=="add"){
        api.addApply(this.paramInsert).then(res=>{
          if(res.code==200){
            this.$message({
                message: "添加成功",
                type: "success"
              });
              this.$emit('update-apply')
          }else{
            this.$message.error('添加失败')
          }
        })
      }
    },

    getAllUser() {
      conApi
        .getAllUser()
        .then(res => {
          this.userList = res.data ? res.data : [];
        })
        .catch(e => {
          this.userList = [];
        });
    },
    getSummaries({ columns, data }) {
      const sums = [];
      columns.forEach((column, index) => {
        if (index == 0) {
          sums[index] = "合计";
          return;
        }
        if (index > 0 && index < 4) {
          sums[index] = "/";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        sums[index] = values.reduce((prev, curr) => {
          return isNaN(prev) ? prev : prev + curr;
        }, 0);
      });
      return sums;
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 1) {
        if (row.span) {
          return {
            rowspan: row.span,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 1
          };
        }
      }
    },

    resetParamInsert() {
      this.paramInsert = obj;
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
    getParamInsert() {
      api
        .infoApply(this.applyId)
        .then(res => {
          let info = res.data;
          let arr= this.prevDetail(info.productList);
          info.productList =arr;
          this.productList = JSON.parse(JSON.stringify(arr));
          if (info["signTime"]) {
            let date = info["signTime"].split("-");
            date = date.reduce((prev, cur) => {
              return [...prev, parseInt(cur)];
            }, []);
            info["signTime"] = new Date(date);
          }
          this.paramInsert = info;
        })
        .catch(e => {
          console.log(e);
          this.paramInsert = obj;
        });
    },
    prevDetail(value) {
      let arr = value;
      return arr.map(item => {
        item.detailList.sort((a, b) => {
          return a.bomLevel - b.bomLevel;
        });
        let bomLevel;
        item.detailList.forEach(detail => {
          if (detail.bomLevel != bomLevel) {
            bomLevel = detail.bomLevel;
            detail.span = item.detailList.filter(
              child => child.bomLevel == bomLevel
            ).length;
          }
        });
        return item;
      });
    },
    getContractCodeList() {
      conApi
        .getContractList()
        .then(res => {
          this.contractCodeList = res.data.records;
        })
        .catch(e => {
          this.contractCodeList = [];
        });
    }
  },

  computed: {
    ...mapGetters(["drawerWidth", "direction"])
  },

  watch: {
    action(val) {
      if (val === "add") {
        this.getContractCodeList();
        this.disabled = false;
        this.getAllUser();
      }
      if (val === "lookShow" || val == "edit") {
        this.disabled = true;
      }
    },

    applyId(value) {
      console.log(value)
      this.resetParamInsert();
      let info;
      if (value) {
        this.getParamInsert();
      }
    }
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
  margin: 20px 0 20px 10px;
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
.action {
  display: flex;
  justify-content: center;
  .el-button {
    margin: 0 50px;
  }
}
.idea {
  margin-left: 10px;
  display: flex;
  font-size: 14px;
  .el-textarea {
    width: 500px;
    font-size: 14px;
  }
}
</style>