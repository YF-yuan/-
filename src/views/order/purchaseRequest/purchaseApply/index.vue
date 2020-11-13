<template>
  <!-- 申请需求页面 -->
  <div id="substitude">
    <!-- 需求表单 -->
    <el-form ref="form" :model="form">
      <el-form-item label="合同性质">
        <el-select v-model="form.nature" placeholder="请选择合同性质" @change="selectType">
          <el-option label="代料" value="substitude"></el-option>
          <el-option label="自采" value="selfharvest"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="代工合同编号">
        <el-select v-model="form.ContractNo" filterable  placeholder="请选择代工合同编号">
          <el-option label="YHZZ123445hfureu389" value="shanghai"></el-option>
          <el-option label="YHZZ123445hfureu389" value="beijing"></el-option>
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
    <!-- 申请的主要材料展示 -->
    <div class="mainList">
      <boom-details v-if="showBoom" :boomList="boomList" />
      <custom-add :materielList="materielList" v-else />
    </div>

    <div class="footer">
      <el-button type="primary" @click="onSave">保存</el-button>
      <el-button type="primary" @click="onReturn">返回</el-button>
    </div>
  </div>
</template>

<script>
import UploadImage from "@/components/uploadImage.vue"
import BoomDetails from "./boomDetails.vue"
import CustomAdd from "./customAdd.vue"
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
      showBoom: true,
      // 模拟boomlist的数据
      boomList: [
        {
          goodname: 'A3131',
          goodcount: 100,
          data: [
            {
              _id: 1,
              section: 1,
              num: "xxxx001",
              count: 1,
              needCount: 1000,
              stock: 1500,
              preparatiuon: 5,
              d_count: 0
            },
            {
              _id: 2,
              section: 2,
              num: "xxxx002",
              count: 3,
              needCount: 2000,
              stock: 800,
              preparatiuon: 5,
              d_count: 1200
            },
          ],
        },
        {
          goodname: 'B4242',
          goodcount: 300,
          data: [
            {
              _id: 1,
              section: 1,
              num: "xxxx004",
              count: 4,
              needCount: 1000,
              stock: 500,
              preparatiuon: 5,
              d_count: 500,
            },
            {
              _id: 2,
              section: 2,
              num: "xxxx003",
              count: 1,
              needCount: 3000,
              stock: 1500,
              preparatiuon: 5,
              d_count: 1500,
            },
          ],
        },
      ],
      materielList: [
        {
          id: 1,
          num: "xxx001",
          needcount: 1000
        },
        {
          id: 2,
          num: "xxx002",
          needcount: 5000
        },
        {
          id: 3,
          num: "xxx003",
          needcount: 4000
        },
        {
          id: 4,
          num: "xxx004",
          needcount: 100
        }
      ]
    };
  },
  created () {
  },
  components: {
    UploadImage,
    BoomDetails,
    CustomAdd
  },
  methods: {
    // 合同性质选择之后对组件进行条件渲染
    onSave() {
      console.log("save!");
    },
    onReturn() {
      console.log("return");
    },
    selectType (e) {
      if (e == 'selfharvest') {
        this.showBoom = false
      }else{
        this.showBoom = true
      }
    }
  }
}
</script>

<style lang='less'>
#substitude {
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