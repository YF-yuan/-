<template>
  <!-- boom表格详情展示 -->
  <div id="boomDetails">
    <ul class="tablehead">
      <li class="productname headitem">
        <span class="headtitle">产品名称</span>
        <span></span>
      </li>
      <li class="productnum headitem">
        <span class="headtitle">数量</span>
        <span></span>
      </li>
      <li class="boom headitem">
        <span class="headtitle">boom</span>
        <button class="headbtn" type="primary">查看</button>
      </li>
      <li class="searchcode headitem">
        <span class="headtitle">查询编码</span>
        <select class="select" v-model="value" placeholder="请选择">
          <option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></option>
        </select>
        <button class="headbtn" type="primary">查询</button>
      </li>
    </ul>
    <el-table
      :data="boomList"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="_id" label="序号" width="180"> </el-table-column>
      <el-table-column prop="section" label="阶层"> </el-table-column>
      <el-table-column prop="num" label="物料编码"> </el-table-column>
      <el-table-column prop="count" label="数量"> </el-table-column>
      <el-table-column prop="needCount" label="需求数量"> </el-table-column>
      <el-table-column prop="stock" label="现有库存"> </el-table-column>
      <el-table-column prop="preparatiuon" label="备损"> </el-table-column>
      <el-table-column prop="d_count" label="需采购数量"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "BoomDetails",
  props: ['boomList'],
  data() {
    return {
       options: [
            {
            value: '选项1',
            label: '黄金糕'
            }, {
            value: '选项2',
            label: '双皮奶'
            }
        ],
        value: ''
    }
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
  },
};
</script>

<style lang='less'>
     .tablehead{
    list-style: none;
    width: 100%;
    height: 40px;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #606266;
    .headitem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .headtitle {
        margin-right: 10px;
      }
      .headbtn {
        width: 55px;
        height: 22px;
        text-align: center;
        line-height: 20px;
        color: #fff;
        background-color: #409EFF;
        border: none;
        border-radius: 4px;
      }
      .select {
        width: 160px;
        height: 22px;
        border: 1px solid #eeeeee;
        border-radius: 4px;
        color: #606266;
        option {
            border: 1px solid #eeeeee;
        }
      }
    }
  }
</style>
