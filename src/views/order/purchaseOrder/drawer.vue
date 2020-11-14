<template>
  <el-drawer
    :direction="direction"
    :visible.sync="visible"
    :size="drawerWidth+'px'"
    :before-close="handleClose"
  >
    <edit-form></edit-form>
    <div class="action">
      <el-button type="default" size="small">保存</el-button>
      <el-button type="default" size="small" @click="handleClose">返回</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { mapGetters } from "vuex";
import editForm from "./editForm";
export default {
  components: {
    editForm
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
  computed: {
    ...mapGetters(["drawerWidth", "direction"])
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-drawer__header {
  margin-bottom: 0;
}
.action{
  display:flex;
  justify-content:center;
  margin-top:50px;
  .el-button{
    margin: 0 50px;
  }
}
</style>