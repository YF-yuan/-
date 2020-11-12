<template>
    <div class="main-box key-index">
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item label="一级分类">
                <el-select @change="typeOneChange" size="small" v-model="searchParam.typeOneId" filterable clearable>
                    <el-option :key="index" :label="item.typeName" :value="item.typeId"
                               v-for="(item,index) in typeOneList">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select size="small" v-model="searchParam.typeTwoId" filterable clearable>
                    <el-option :key="index" :label="item.typeName" :value="item.typeId"
                               v-for="(item,index) in typeTwoList">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button
                        :loading="tableLoading"
                        icon="el-icon-search"
                        @click="search"
                        size="small"
                        type="primary"
                >搜索
                </el-button>
                <el-button
                        icon="el-icon-refresh-right"
                        @click="initSearchParam();search()"
                        type="primary"
                        size="small"
                        style="background-color: #fff; border: 1px solid #ccc ; color: #666"
                >清空
                </el-button>
            </el-form-item>
        </el-form>
        <el-table ref="table" :height="tableHeight" size="medium" v-loading="tableLoading" :data="dataList" border>
            <el-table-column :index="indexMethod" label="序号" type="index" width="80" align="center"/>
            <el-table-column min-width="100" align="center" prop="typeOneName" label="一级分类"></el-table-column>
            <el-table-column min-width="100" align="center" prop="typeTwoName" label="二级分类"></el-table-column>
            <el-table-column min-width="120" align="center" prop="key1" label="属性1名称">
                <template slot-scope="{row,$index}">
                    <el-input v-if="$index==typeIndex" clearable size="small" maxlength="30" v-model="row.key1"/>
                    <span v-else>{{row.key1}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="120" align="center" prop="key2" label="属性2名称">
                <template slot-scope="{row,$index}">
                    <el-input v-if="$index==typeIndex" clearable size="small" maxlength="30" v-model="row.key2"/>
                    <span v-else>{{row.key2}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="120" align="center" prop="key3" label="属性3名称">
                <template slot-scope="{row,$index}">
                    <el-input v-if="$index==typeIndex" clearable size="small" maxlength="30" v-model="row.key3"/>
                    <span v-else>{{row.key3}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="120" align="center" prop="key4" label="属性4名称">
                <template slot-scope="{row,$index}">
                    <el-input v-if="$index==typeIndex" clearable size="small" maxlength="30" v-model="row.key4"/>
                    <span v-else>{{row.key4}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="60" label="操作">
                <template slot-scope="{row,$index}">
                    <el-button v-if="permission.good_key_edit&&$index!=typeIndex" @click="editKey($index)"
                               type="primary" size="mini" icon="el-icon-edit">编辑
                    </el-button>
                    <el-button v-if="permission.good_key_edit&&$index==typeIndex" @click="saveKey($index)"
                               type="primary" size="mini" icon="el-icon-folder-checked">保存
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-current">
            <el-pagination
                    :current-page="page"
                    :page-size="pageSize"
                    prev-text="上一页"
                    next-text="下一页"
                    background
                    layout="total, prev, pager, next, jumper"
                    style="display: inline-block;"
                    :total="count"
                    @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>

<script>
    import api from "@/api/good/key";
    import {mapGetters} from "vuex";
    import typeApi from "@/api/good/type";

    export default {
        name: "key-index",
        data() {
            return {
                searchParam: {
                    typeOneId: '',
                    typeTwoId: ''
                },
                typeIndex: -1,
                count: 0,
                page: 1,
                pageSize: parseInt((document.body.clientHeight - 280 - 43) / 44.5),
                tableHeight: document.body.clientHeight - 240,
                tableLoading: false,
                dataList: [],
                visible: false,
                typeOneList: [],
                typeTwoList: []
            };
        },
        mounted() {
            this.getTypeList(0);
            this.getKeyList()
        },
        computed: {
            ...mapGetters(["direction", "drawerWidth", "permission"])
        },
        components: {},
        methods: {
            saveKey(index) {
                let child = this.dataList[index]
                let attributeKeys = []
                attributeKeys.push(child.key1?child.key1:'')
                attributeKeys.push(child.key2?child.key2:'')
                attributeKeys.push(child.key3?child.key3:'')
                attributeKeys.push(child.key4?child.key4:'')
                let params = {
                    typeId: child.typeTwoId,
                    attributeKeys:attributeKeys
                }
                this.tableLoading = true
                api.editKey(params).then(res => {
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.typeIndex=-1
                    this.getKeyList()
                }).catch(e => {
                    this.tableLoading=false
                });
            },
            indexMethod(index) {
                return (index + 1) + ((this.page - 1) * this.pageSize);
            },
            typeOneChange() {
                let searchParam = JSON.parse(JSON.stringify(this.searchParam))
                searchParam.typeTwoId = ''
                if (searchParam.typeOneId) {
                    this.getTypeList(searchParam.typeOneId)
                } else {
                    this.typeTwoList = []
                }
                this.searchParam = Object.assign({}, searchParam)
            },
            getTypeList(parentId) {
                typeApi.getTypeList(parentId).then(res => {
                    const {data = []} = res
                    if (!parentId) {
                        this.typeOneList = data
                    } else {
                        this.typeTwoList = Object.assign([], data)
                    }
                }).catch(e => {
                    if (!parentId) {
                        this.typeOneList = []
                    } else {
                        this.typeTwoList = []
                    }
                });
            },
            initSearchParam() {
                this.searchParam = {
                    typeOneId: '',
                    typeTwoId: ''
                }
            },
            editKey(index) {
                this.typeIndex = index
            },
            handleCurrentChange(val) {
                this.page = val
                this.typeIndex = -1
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.getKeyList()
            },
            search() {
                this.page = 1
                this.typeIndex = -1
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.count = 0
                this.getKeyList()
            },
            getKeyList() {
                this.tableLoading = true;
                api.getKeyList(this.page, this.pageSize, this.searchParam).then(res => {
                    const {records, total} = res.data
                    let dataList = records ? records : []
                    dataList.map(item => {
                        let keyList = item.keyList
                        item.key1 = keyList[0] ? keyList[0].attributeKeyName : ''
                        item.key2 = keyList[1] ? keyList[1].attributeKeyName : ''
                        item.key3 = keyList[2] ? keyList[2].attributeKeyName : ''
                        item.key4 = keyList[3] ? keyList[3].attributeKeyName : ''
                    })
                    this.dataList = Object.assign([], dataList)
                    this.count = total ? parseInt(total) : 0
                    this.tableLoading = false;
                }).catch(e => {
                    this.dataList = []
                    this.tableLoading = false;
                });
            }
        }
    };
</script>

<style lang="less">
    .key-index {

    }
</style>
