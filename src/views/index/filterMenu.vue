<template>
  <el-submenu v-if="menuList.filter(item=>item.parentId==menu.menuId&&item.menuType != 'F').length>0" :key="menu.menuId" :index="menu.menuName">
    <template slot="title">
      <i v-if="menu.icon" :class="menu.icon"/>
      <span>{{menu.menuName}}</span>
    </template>
    <filter-menus :menuList="menuList"  :key="index" v-for="(child,index) in menuList.filter(item=>item.parentId==menu.menuId&&item.menuType!='F')" :menu="child"></filter-menus>
  </el-submenu>
  <el-menu-item v-else :key="menu.menuId" :index="menu.path">
    <template slot="title">
      <i v-if="menu.icon" :class="menu.icon"/>
      <span>{{menu.menuName}}</span>
    </template>
  </el-menu-item>
</template>

<script>
  export default {
    name: "filterMenus",
    props: {
      menu: {
        type:Object,
        default() {
          return {};
        }
      },
      menuList:{
        type:Array,
        default() {
          return [];
        }
      },
    },
    data() {
      return {
      }
    },
    computed: {
      // 是否还有子列表需要渲染，作为v-if的判断条件
      isFolder() {
        return this.menu.childTree && this.menu.childTree.length
      }
    },
    methods: {}
  }
</script>

<style scoped>

</style>
