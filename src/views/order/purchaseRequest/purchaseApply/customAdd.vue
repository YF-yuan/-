<template>
  <div id="customAdd">
    <el-table :data="materielList" border style="width: 100%">
      <el-table-column fixed prop="id" label="序号" width="150">
      </el-table-column>
      <el-table-column prop="num" label="物料编码" width="120"> </el-table-column>
      <el-table-column prop="needcount" label="需采购数量" width="120">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >删除</el-button
          >
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: ['materielList'],
  data() {
    return {
     
    }
  },
  methods: {
    handleClick(row) {
      console.log(row);
    }
  }
}
</script>

<style>
</style>
