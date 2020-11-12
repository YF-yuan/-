<template>
  <!-- 采购申请页面 -->
  <div id="purchaseRequest">
    <!-- 需求表单 -->
    <el-form ref="form" :model="form" label-width="80px">
       <el-form-item label="合同性质">
        <el-select v-model="form.nature" placeholder="请选择合同性质" @change="chooseNature(form.nature)">
          <el-option label="代料" value="boom"></el-option>
          <el-option label="自采" value="custom"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="代工合同编号">
        <el-select v-model="form.ContractNo" placeholder="请选择代工合同编号">
          <el-option label="0001" value="shanghai"></el-option>
          <el-option label="0002" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="客户简称">
        <el-input v-model="form.abbreviation"></el-input>
      </el-form-item>
      <el-form-item label="活动时间">
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="请选择日期"
            v-model="form.date"
            style="width: 100%"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="负责人">
        <el-select v-model="form.chargeman" placeholder="请选择负责人">
          <el-option label="张三" value="shanghai"></el-option>
          <el-option label="李四" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传附件">
        <upload-image />
      </el-form-item>
      <!-- 申请详情展示  -->
      <el-form-item v-if="detailFlag === 'boom'">
        <boom-details></boom-details>
      </el-form-item>
      <el-form-item v-else>
        <custom-add></custom-add>
      </el-form-item>
      <el-form-item>
        <el-button class="submitbtn" type="primary" @click="onSubmit">保存</el-button>
        <el-button>返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import UploadImage from '@/components/uploadImage.vue'
import BoomDetails from './boomDetails.vue'
import CustomAdd from './customAdd.vue'
export default {
  data() {
    return {
      form: {
        nature: "",
        ContractNo: '',
        name: '',
        abbreviation: '',
        date: "",
        chargeman: '',
        picture: ""
      },
      detailFlag: 'boom'
    }
  },
  components: {
    UploadImage,
    BoomDetails,
    CustomAdd
  },
  methods: {
    chooseNature (value) {
      console.log(value, '=========================');

    },
    onSubmit () {
      console.log("submit!");
    }
  }
}
</script>

<style lang='less'>
  .submitbtn {
    background-color: #1890ff;
  }
</style>