import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '@/views/index/index'
import Cookies from 'js-cookie';
import store from '../store'

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'login',
        component: (resolve) => require(['@/views/login/index'], resolve),
        meta: {
            'title': '登录'
        }
    },
    {
        path: '/',
        name: 'index',
        redirect: '/index',
        component: Main,
        children: [
            {
                path: 'index',
                name: 'index',
                component: (resolve) => require(['@/views/main/index'], resolve),
                meta: {
                    'title': '首页'
                }
            },
            {
                path: '403',
                name: '403',
                component: (resolve) => require(['@/views/errorPage/403'], resolve),
                meta: {
                    'title': '无权限'
                }
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    // base: process.env.BASE_URL,
    routes
})

router.onError((error) => {
    router.push({path: '/403'})
})

router.beforeEach(async (to, from, next) => {
    // 登录界面登录成功之后，会把用户信息保存在会话
    // 存在时间为会话生命周期，页面关闭即失效。
    let token = Cookies.get(location.host + '-token')
    if (!token) {
        if (to.path != '/login') {
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
            return
        } else {
            next()
            return
        }
    } else {
        if (to.path == '/login') {
            store.dispatch('user/logout')
            next()
            return
        }
        if (!store.state.user.info) {
            await store.dispatch('user/getInfo')
            await store.dispatch('user/getMenuList')
            addDynamicMenuAndRoutes()
            next(to.path)
        }
        if (to.path == '/index' || to.name == '403') {
            let tagList = store.state.user.tagList
            for (let i = 0; i < tagList.length; i++) {
                tagList[i].isSelect = false
            }
            if (to.path == '/index') {
                store.dispatch('user/setIsIndexTag', true)
            }
            if (to.name == '403') {
                store.dispatch('user/setIsIndexTag', false)
            }
            store.dispatch('user/setBreadcrumb', [])
            next()
        } else {
            store.dispatch('user/setIsIndexTag', false)
            let menuList = store.state.user.menuList
            let child = menuList.find(item => item.path == to.path && item.menuType !='F')
            if (child && menuList.filter(item => item.parentId == child.menuId && item.menuType !='F').length == 0) {
                let breadcrumb = []
                let tagList = store.state.user.tagList
                let tagChild = {
                    menuId: child.menuId,
                    menuName: child.menuName,
                    path: child.path,
                }
                if (tagList.length > 0) {
                    if (!tagList.some(item => item.menuId == child.menuId)) {
                        tagList.push(tagChild)
                    }
                } else {
                    tagList.push(tagChild)
                }
                for (let i = 0; i < tagList.length; i++) {
                    if (tagList[i].menuId == child.menuId) {
                        tagList[i].isSelect = true
                    } else {
                        tagList[i].isSelect = false
                    }
                }
                filterBreadcrumb(breadcrumb, child)
                store.dispatch('user/setBreadcrumb', breadcrumb)
                store.dispatch('user/setTagList', tagList)
            }
            next()
        }
    }
})

function filterBreadcrumb(breadcrumb, child) {
    breadcrumb.unshift(child.menuName)
    let menuList = store.state.user.menuList
    let data = menuList.find(item => item.menuId == child.parentId && item.menuType !='F')
    if (data) {
        filterBreadcrumb(breadcrumb, data)
    } else {
        return
    }
}


function addDynamicMenuAndRoutes() {
    // 添加动态路由
    let dynamicRoutes = filterChildMenuList(store.state.user.menuList.filter(item =>item.menuType !='F'), 0)
    handleStaticComponent(router, dynamicRoutes)
    router.addRoutes(router.options.routes)
}

/**
 * 处理路由到本地直接指定页面组件的情况
 * 比如'代码生成'是要求直接绑定到'Generator'页面组件
 */
function handleStaticComponent(router, dynamicRoutes) {
    router.options.routes = router.options.routes.concat(dynamicRoutes)
}

function filterChildMenuList(menuList, pid) {
    let childMenuList = menuList.filter(child => child.parentId == pid)
    let children = []
    if (childMenuList.length > 0) {
        childMenuList.map(child => {
            let childRoute = {
                path: child.path,
                name: child.path.replace(/\//g,''),
                meta: {
                    title: child.menuName
                }
            }
                if (!child.component) {
                    childRoute.component = Main
                } else {
                    childRoute.component = (resolve) => require([`@/views${child.component}`], resolve)
                }

            childRoute.children = filterChildMenuList(menuList, child.menuId)
            children.push(childRoute)
        })
    }
    return children
}

export default router
