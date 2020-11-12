<template>
  <el-drawer
    class="icon-from"
    title="图标"
    :visible.sync="visible"
    :direction="direction"
    :append-to-body="true"
    :size="drawerWidth+'px'"
    :before-close="handleClose"
  >
    <div :style="{maxHeight:iconHeight+'px'}" class="icon-body">
      <div @click="iconClick(code)" :key="index" v-for="(code,index) in iconList">
        <i :class="code" />
      </div>
    </div>
    <div style="text-align: center;margin-top:10px">
      <el-button @click="$emit('returnBack')" size="medium">返回</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { mapGetters } from "vuex";
import iconList from "@/assets/js/icon-list";

export default {
  name: "paymentFrom",
  data() {
    return {
      drawerWidth: (document.body.clientWidth - 200) * 0.7,
      iconList: [],
      iconHeight: document.body.clientHeight - 150
    };
  },
  created() {
    this.iconList = iconList;
  },
  props: {
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  components: {},
  computed: {
    ...mapGetters(["direction"])
  },
  methods: {
    handleClose(hide) {
      if (hide) {
        hide();
      }
      this.$emit("returnBack");
    },
    iconClick(code) {
      this.$emit("iconClick",code);
    },
    submitForm(formName) {}
  }
};
</script>

<style lang="less">
.icon-from {
  .icon-body {
    display: flex;
    flex-wrap: wrap;
    overflow-y: auto;
    > div {
      height: 60px;
      line-height: 60px;
      width: 60px;
      color: #666;
      font-size: 30px;
      text-align: center;
      border: 1px solid #eee;
      cursor: pointer;
    }
    > div:hover {
      color: #409eff;
      border: 1px solid #409eff;
    }
  }
}
</style>
