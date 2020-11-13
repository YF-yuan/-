<template>
  <!-- 代料页面 -->
  <div id="selfharvest">
    <!-- 需求表单 -->
    <el-form ref="form" :model="form">
      <el-form-item label="合同性质">
        <el-select v-model="form.nature" placeholder="请选择合同性质">
          <el-option label="代料" value="substitude"></el-option>
          <el-option label="自采" value="selfharvest"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="代工合同编号">
        <el-select v-model="form.ContractNo" placeholder="请选择代工合同编号">
          <el-option label="xxx001" value="shanghai"></el-option>
          <el-option label="xxx002" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户名称">
        <el-select v-model="form.name" placeholder="请选择客户名称">
          <el-option label="阿里巴巴" value="shanghai"></el-option>
          <el-option label="华为科技" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户简称">
        <el-select v-model="form.abbreviation" placeholder="请选择客户简称">
          <el-option label="华为" value="shanghai"></el-option>
          <el-option label="阿里" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="签订日期">
        <el-date-picker
          v-model="form.date"
          type="date"
          placeholder="请选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="负责人">
        <el-select v-model="form.chargeman" placeholder="请选择负责人">
          <el-option label="张三" value="shanghai"></el-option>
          <el-option label="王二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传附件">
        <upload-image />
      </el-form-item>
    </el-form>
    <!--  -->
    <div class="mainList">
      <custom-add :materielList="materielList"/>
    </div>

    <div class="footer">
      <el-button type="primary" @click="onSave">保存</el-button>
      <el-button type="primary" @click="onReturn">返回</el-button>
    </div>
  </div>
</template>

<script>
import UploadImage from "@/components/uploadImage.vue";
import CustomAdd from "./customAdd.vue";
export default {
  data() {
    return {
      form: {
        nature: "",
        ContractNo: "",
        name: "",
        abbreviation: "",
        date: "",
        chargeman: "",
        picture: "",
      },
      materielList: [
        {
          id: 1,
          num: "xxx001",
          needcount: 1000
        },
        {
          date: 2,
          num: "xxx002",
          needcount: 5000
        },
        {
          date: 3,
          num: "xxx003",
          needcount: 4000
        },
        {
          date: 4,
          num: "xxx004",
          needcount: 100
        }
      ]
    }
  },
  components: {
    UploadImage,
    CustomAdd,
  },
  methods: {
    // 合同性质选择之后对组件进行条件渲染
    onSave() {
      console.log("save!");
    },
    onReturn() {
      console.log("return");
    },
  },
};
</script>

<style lang='less'>
#selfharvest {
  width: 100%;
  .el-form {
    width: 80%;
    display: flex;
    justify-content: space-between;
    align-content: flex-start;
    flex-wrap: wrap;
    .el-form-item {
      width: 300px;
      margin-right: 10px;
      padding: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-form-item__label {
        width: 100px;
      }
      .el-input,
      .el-input__inner {
        width: 210px;
        height: 30px;
        .el-icon-arrow-up {
          width: 25px;
          height: 25px;
          margin-top: 8px;
        }
      }
    }
  }
  .mainList {
    width: 96%;
    margin: 100px auto;
  }
  .footer {
    width: auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>