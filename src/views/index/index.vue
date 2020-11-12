<template>
    <div class="index-box">
        <el-menu
                style="max-width: 220px"
                :style="{minWidth:isCollapse?'50px':'220px'}"
                unique-opened
                :collapse="isCollapse"
                router
                :default-active="$route.path"
                class="el-menu-vertical-demo left-menu"
                background-color="#304156"
                text-color="#bfcbd9"
                active-text-color="#409EFF">
            <el-menu-item style="text-align: center" index="/">
                <img style="width: 26px;height: 26px;margin-right: 8px"
                     src="../../assets/img/logo.png">
                <span style="color: #fff;font-weight: 600;">MSDAMP</span>
            </el-menu-item>
            <el-tooltip class="item" effect="dark" content="首页" placement="right">
                <el-menu-item index="/index">
                    <i class="el-icon-s-home"></i>
                    <span>首页</span></el-menu-item>
            </el-tooltip>
            <filterMenu :menuList="menuList" :key="index"
                        v-for="(menu,index) in menuList.filter(item=>item.parentId==0&&item.menuType != 'F')" :menu="menu">
            </filterMenu>
        </el-menu>
        <div class="box-right">
            <div class="box-right-head">
                <div class="right-head-top">
                    <div>
                        <i @click="isCollapse=!isCollapse" :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"></i>
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item style="cursor:pointer " :to="{ path: '/' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item :key="index" v-for="(item,index) in breadcrumb">{{item}}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <div class="peo">
                        <el-popover
                                placement="bottom-start"
                                width="100"
                                trigger="hover">
                            <el-menu
                                    default-active="2"
                                    class="el-menu-vertical-demo">
                                <el-menu-item @click="proClick(1)">修改密码</el-menu-item>
                                <el-menu-item @click="proClick(2)">注销</el-menu-item>
                            </el-menu>
                            <el-button slot="reference">
                                <div class="top-user"><img src="@/assets/img/user.png">{{info?info.nickname:''}}</div>
                            </el-button>
                        </el-popover>
                    </div>
                </div>
                <div class="right-head-center">
                    <el-tag style=" cursor:pointer;" @click="tagClick(1)" :style="{color:isIndexTag?void(0):'black'}"
                            :color="isIndexTag?void(0):'#fff'" size="medium">首页
                    </el-tag>
                    <el-tag @click="tagClick(2,item)" @close="closeClick(item)"
                            :style="{color:item.isSelect?void(0):'black'}"
                            :color="item.isSelect?void(0):'#fff'" class="tag-box" :key="index"
                            v-for="(item,index) in tagList"
                            closable size="medium">{{item.menuName}}
                    </el-tag>
                </div>
            </div>
            <div :style="{height:height+'px'}" class="route-box">
                <router-view v-if="browser" v-wechat-title="$route.meta.title"></router-view>
                <transition v-else name="fade">
                    <router-view v-wechat-title="$route.meta.title"></router-view>
                </transition>
            </div>
        </div>
        <el-dialog
                class="center-dialog"
                center
                title="修改密码"
                :visible.sync="visible"
                width="500px"
                :before-close="handleClose">
            <el-form ref="passwordForm" :model="passwordForm" size="small" label-width="100px"
                     class="form">
                <el-form-item label="原密码" prop="oldPassword" :rules="[
              {required: true, message: '原密码不能为空', trigger: 'blur'}
              ]">
                    <el-input show-password type="password" auto-complete="new-password" clearable
                              v-model="passwordForm.oldPassword" size="small"
                              placeholder="请输入原密码"/>
                </el-form-item>
                <el-form-item label="新密码" prop="password" :rules="[
              {required: true, message: '新密码不能为空', trigger: 'blur'}
              ]">
                    <el-input show-password type="password" auto-complete="new-password" clearable
                              v-model="passwordForm.password" size="small"
                              placeholder="请输入新密码"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                 <el-button :loading="addBtnLoading" type="primary" size="small"
                            @click="submitForm('passwordForm')">立即提交
                </el-button>
                <el-button @click="visible=false" size="medium">返回</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import store from '../../store'
    import filterMenu from './filterMenu'
    import userApi from '@/api/user/user'
    import {mapGetters} from "vuex";

    export default {
        name: "index",
        data() {
            return {
                drawerWidth: '500px',
                direction: 'rtl',
                isCollapse: false,
                visible: false,
                height: document.body.clientHeight - 110,
                browser: '',
                activeName: 'password',
                passwordForm: {
                    oldPassword: '',
                    password: '',
                },
                addBtnLoading: false,
                pageFlag: 0,
                // 当前页
                currentPage: 1,
                // 总条数
                count: 0,
                // 每页条数
                pageSize: 10,
                tableHeight: document.body.clientHeight - 305,
                tableLoading: false
            }
        },
        created() {
            this.browser = this.isIE()
            this.pageSize = parseInt((document.body.clientHeight - 344) / 50)
            let that = this
            window.onresize = () => {
                return (() => {
                    if (document.body.clientWidth < 1000) {
                        that.isCollapse = true
                    } else {
                        that.isCollapse = false
                    }
                })()
            }
        },
        computed: {
            ...mapGetters(["isIndexTag", "breadcrumb", "tagList", "info", "menuList"]),
        },
        watch: {
        },
        components: {filterMenu},
        methods: {
            handleClose(done) {
                if (done) {
                    done();
                }
            },
            initPassword() {
                let info = this.info
                this.passwordForm = {
                    id: info.id,
                    old_password: '',
                    password: '',
                    password_confirm: '',
                }
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addBtnLoading = true
                        userApi.updatePwd(this.passwordForm).then(res => {
                            this.addBtnLoading = false
                            this.initPassword()
                            this.$message({
                                type: 'success',
                                message: '修改密码成功'
                            })
                            this.visible = false
                            store.dispatch('user/logout').then(res => {
                                this.$router.push({name: 'login'});
                            })
                        }).catch(e => {
                            this.addBtnLoading = false
                        })
                    }
                })
            },
            isIE() {
                if (!!window.ActiveXObject || "ActiveXObject" in window) {
                    return true;
                } else {
                    return false;
                }
            },
            proClick(type) {
                if (type == 1) {
                    this.initPassword()
                    this.visible = true
                } else if (type == 2) {
                    store.dispatch('user/logout').then(res => {
                        this.$message({
                            type: 'success',
                            message: '注销成功！'
                        })
                        this.$router.replace({name: 'login'});
                    }).catch(e => {
                        this.$message({
                            type: 'error',
                            message: '注销失败！'
                        })
                    })
                }
            },
            tagClick(type, data) {
                if (type == 1) {
                    this.$router.push({name: 'index'});
                } else {
                    this.$router.push({path: data.path});
                }
            },
            closeClick(data) {
                let tagList = JSON.parse(JSON.stringify(this.tagList))
                if (tagList.length == 1) {
                    store.dispatch('user/setTagList', [])
                    this.$router.push({name: 'index'});
                } else {
                    let index = 0
                    for (let i = 0; i < tagList.length; i++) {
                        if (tagList[i].menuId == data.menuId) {
                            index = i
                        }
                    }
                    if (!data.isSelect) {
                        tagList.splice(index, 1)
                        store.dispatch('user/setTagList', tagList)
                    } else {
                        if (index == tagList.length - 1) {
                            tagList.splice(index, 1)
                            store.dispatch('user/setTagList', tagList)
                            this.$router.push({path: tagList[tagList.length - 1].path});
                        } else {
                            let path = tagList[index + 1].path
                            tagList.splice(index, 1)
                            store.dispatch('user/setTagList', tagList)
                            this.$router.push({path: path});
                        }
                    }
                }
            },
        }
    }
</script>

<style lang="less">

    .home-dialog {
        .el-dialog {
            width: 70% !important;
        }
    }

    /*.fade-leave-to {*/
    /*  transform: translateX(-100%);*/
    /*}*/

    .index-box {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;

        .top-user{
            display: flex;
            align-items: center;
            font-size: 16px;
            img{
                width: 30px;
                height: 30px;
                margin-right: 10px;
            }
        }

        .el-input.is-disabled .el-input__inner {
            background-color: #ffffff !important;
            color: #333333 !important;
        }

        .el-menu-item.is-active {
            color: #ffffff !important;
            background-color: #1890ff !important;
        }


        .el-menu-item:hover {
            color: #ffffff !important;
        }

        .el-menu-vertical-demo:not(.el-menu--collapse) {
            width: 200px;
            min-height: 400px;
            overflow-x: hidden;
        }


        .peo {
            display: flex;
            align-items: center;

            > div:first-child {
                margin-right: 15px;
            }
        }

        ::-webkit-scrollbar {
            width: 1px;
            height: 1px;
            background-color: rgba(0, 0, 0, 0.12);
        }

        .el-menu--collapse > .el-menu-item span, .el-menu--collapse > .el-submenu > .el-submenu__title span {
            height: 0;
            width: 0;
            overflow: hidden;
            visibility: hidden;
            display: inline-block;
        }

        .peo {
            .el-button {
                border: none;
                padding: 0;
            }

            img {
                width: 40px;
                height: 40px;
            }
        }

        .tag-box {
            margin-left: 5px;
            cursor: pointer;
        }

        .right-head-center {
            display: flex;
            padding: 0 20px;
            align-items: center;
            white-space: nowrap;
            position: relative;
            overflow: hidden;
        }

        .left-menu {
            float: left;
            height: 100%;
            overflow-y: auto;

            svg {
                height: 15px;
                width: 20px;
                margin-right: 10px;
            }
        }


        .el-submenu {
            text-align: left;
        }

        .el-menu-item {
            text-align: left;
        }

        .box-right {
            height: 100%;

            ::-webkit-scrollbar {
                width: 10px;
                height: 10px;
                background-color: #fff;
            }

            ::-webkit-scrollbar-thumb {
                border-radius: 5px;
                -webkit-box-shadow: inset005pxrgba(0, 0, 0, 0.2);
                background: rgba(0, 0, 0, 0.2);
            }

            .box-right-head {
                height: 80px;
                width: 100%;
                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
                background-color: #fff;

                .right-head-top {
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 20px;

                    > div:first-child {
                        display: flex;
                        align-items: center;

                        > i {
                            font-size: 22px;
                            cursor: pointer;
                            margin-right: 15px;
                        }
                    }
                }
            }

            .route-box {
                overflow-y: auto;
                overflow-x: hidden;
                padding: 15px;
            }
        }
    }
</style>
