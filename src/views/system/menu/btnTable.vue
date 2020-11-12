<template>
  <el-drawer
    class="btn-table"
    title="设置按钮"
    :visible.sync="visible"
    :direction="direction"
    :size="drawerWidth+'px'"
    :before-close="handleClose"
  >
    <el-button
      style="margin-bottom: 10px"
      icon="el-icon-plus"
      @click="addBtn"
      size="small"
      type="primary"
    >添加按钮
    </el-button>
    <el-table size="medium" v-loading="tableLoading" :data="dataList" row-key="menuId" border>
      <el-table-column prop="menuId" align="center" label="ID"></el-table-column>
      <el-table-column width="100" align="center" prop="sort" label="排序"></el-table-column>
      <el-table-column align="center" prop="menuName" label="名称"></el-table-column>
      <el-table-column align="center" prop="perms" label="权限"></el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="{row}">
          <span v-if="row.status">{{row.status==1?'显示':'隐藏'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160" label="操作">
        <template slot-scope="{row}">
          <el-button @click="editMenu(row)" type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(row)"
            >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 15px">
      <el-button @click="$emit('returnBack')" size="medium">返回</el-button>
    </div>
    <menuForm
      @successSubmit="successSubmit"
      @returnBack="addVisible=false"
      :menuForm="menuForm"
      :visible="addVisible"
      :menuType="menuType"
    ></menuForm>
  </el-drawer>
</template>

<script>
  import api from "@/api/system/menu/menu";
  import {mapGetters} from "vuex";
  import menuForm from "./menuForm";

  export default {
    name: "btnTable",
    data() {
      return {
        tableLoading: false,
        dataList: [],
        menuForm: {},
        menuType: 'F',
        addVisible: false,
      };
    },
    props: {
      visible: {
        type: Boolean,
        default() {
          return false;
        }
      },
      menuId: {
        type: Number,
        default() {
          return 0;
        }
      }
    },
    components: {menuForm},
    computed: {
      ...mapGetters(["direction", "drawerWidth","permission"])
    },
    mounted() {
      this.getListByPid()
    },
    methods: {
      handleDelete(row) {
        this.$confirm('此操作将删除该按钮, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableLoading = true;
          api
            .dropMenu(row.menuId)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getListByPid()
            })
            .catch(e => {
              this.tableLoading = false;
            });
        }).catch(() => {
        });
      },
      successSubmit() {
        this.addVisible = false
        this.getListByPid()
      },
      editMenu(row) {
        this.menuForm = JSON.parse(JSON.stringify(row))
        this.$nextTick(function () {
          this.addVisible = true;
        });
      },
      addBtn() {
        this.menuForm = {
          status: 1,
          sort: 1,
          parentId: this.menuId,
          menuType:'F'
        };
        this.$nextTick(function () {
          this.addVisible = true;
        });
      },
      getListByPid() {
        this.tableLoading = true
        api
          .getListByPid(this.menuId)
          .then(res => {
            this.dataList = res.data ? res.data : []
            this.tableLoading = false;
          })
          .catch(e => {
            this.dataList = []
            this.tableLoading = false;
          });
      },
      handleClose(hide) {
        if (hide) {
          hide();
        }
        this.$emit("returnBack");
      }
    }
  };
</script>

<style lang="less">
  .btn-table {
  }
</style>
