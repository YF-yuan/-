<template>
    <div id="app">
        <keep-alive>
            <router-view v-wechat-title="$route.meta.title" v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-wechat-title="$route.meta.title" v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<style lang="less">
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        height: 100%;
        width: 100%;
        color: #2c3e50;
        line-height: 16px;
    }

    body, html {
        height: 100%;
        width: 100%;
        overflow: hidden;
        background-color: #f2f2f2;
        padding: 0;
        margin: 0;
    }

    img {
        margin: 0;
        padding: 0;
    }

    .main-box{
        height: calc(100% - 30px);
        background: #ffffff;
        padding: 15px;
    }

    *{
        outline: none;
    }

    .fade-leave-active {
        opacity: 0;
        transition: all 500ms;
    }

    .fade-enter-active {
        opacity: 1;
        transform: translateX(0);
        transition: all 500ms;
    }

    .fade-enter {
        opacity: 0;
        transform: translateX(100%);
    }

    .fade-leave {
        opacity: 1;
        transform: translateX(0);
    }
    .el-button--mini {
        padding: 5px 7px!important;
        font-size: 12px!important;
    }

    .el-form--inline .el-form-item{
        margin-bottom: 10px!important;
    }

    .el-select {
        width: 100%
    }

    .el-table--border th{
        background-color: #f2f2f2!important;
        color: #666666!important;
    }

    .page-current{
        text-align: right;
        padding: 15px 5px;
        padding-bottom: 0px;
    }

    a{text-decoration:none}

    .el-tabs__header .el-tabs__item.is-active {
        color: #fff!important;
        background-color: #409eff!important;
    }

    .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
        padding-left: 20px
    }

    .el-tabs--top .el-tabs__item.is-top:last-child {
        padding-right: 20px;
    }

    .el-table th.gutter {
        display: table-cell!important;
    }

    .el-drawer__body{
        padding: 0px 20px 20px 20px;
        overflow-y: auto;
    }

    .el-textarea.is-disabled .el-textarea__inner {
        background-color: #ffffff!important;
        color: #333333!important;
    }
</style>
