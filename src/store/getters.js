const getters = {
  direction: state => state.user.direction,
  drawerWidth: state => state.user.drawerWidth,
  menuList:state => state.user.menuList,
  isIndexTag:state => state.user.isIndexTag,
  breadcrumb:state => state.user.breadcrumb,
  tagList:state => state.user.tagList,
  info:state => state.user.info,
  permission:state => state.user.permission
}
export default getters
