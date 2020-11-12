<template>
    <div style="height:auto" class="main-box good-index">
        <el-form
                size="small"
                :inline="true"
                :model="searchParam"
                class="demo-form-inline"
                label-width="70px"
        >
            <el-form-item label="编码">
                <el-input
                        clearable
                        v-model="searchParam.goodCode"
                        size="small"
                        placeholder="请输入编码"
                        style="width: 200px"
                />
            </el-form-item>
            <el-form-item label="名称">
                <el-input
                        clearable
                        v-model="searchParam.goodName"
                        size="small"
                        placeholder="请输入名称"
                        style="width: 200px"
                />
            </el-form-item>
            <el-form-item label="型号">
                <el-input
                        clearable
                        v-model="searchParam.goodModel"
                        size="small"
                        placeholder="请输入型号"
                        style="width: 200px"
                />
            </el-form-item>
            <el-form-item label="厂家">
                <el-select style="width: 200px" clearable filterable v-model="searchParam.factoryId">
                    <el-option
                            :key="index"
                            :label="item.factoryName"
                            :value="item.factoryId+''"
                            v-for="(item,index) in factoryList"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="单位">
                <el-select style="width: 200px" clearable filterable v-model="searchParam.unitId">
                    <el-option
                            :key="index"
                            :label="item.unitName"
                            :value="item.unitId+''"
                            v-for="(item,index) in unitList"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="一级分类">
                <el-select
                        style="width: 200px"
                        @change="typeOneChange"
                        size="small"
                        v-model="searchParam.typeOneId"
                        filterable
                        clearable
                >
                    <el-option
                            :key="index"
                            :label="item.typeName"
                            :value="item.typeId+''"
                            v-for="(item,index) in typeOneList"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select
                        @change="typeTwoChange"
                        style="width: 200px"
                        size="small"
                        v-model="searchParam.typeTwoId"
                        filterable
                        clearable
                >
                    <el-option
                            :key="index"
                            :label="item.typeName"
                            :value="item.typeId+''"
                            v-for="(item,index) in typeTwoList"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="品牌">
                <el-select style="width: 200px" clearable filterable v-model="searchParam.brandId">
                    <el-option
                            :key="index"
                            :label="item.brandName"
                            :value="item.brandId+''"
                            v-for="(item,index) in brandList"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="封装">
                <el-select style="width: 200px" clearable filterable v-model="searchParam.encap">
                    <el-option
                            :key="index"
                            :label="key"
                            :value="value"
                            v-for="(value,key,index) in encapList"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="类型">
                <el-select style="width: 200px" clearable filterable v-model="searchParam.type">
                    <el-option
                            :key="index"
                            :label="item.dictValue"
                            :value="item.dictKey+''"
                            v-for="(item,index) in dictTypeList"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="item.attributeKeyName" :key="index" v-for="(item,index) in attributeList">
                <el-select
                        multiple clearable filterable
                        autocomplete="on"
                        style="width: 200px"
                        v-model="item.attributeValueIds"
                        placeholder="">
                    <el-option
                            v-for="(child,index1) in item.valueList"
                            :key="index1"
                            :label="child.attributeValueName"
                            :value="child.attributeValueId">
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
                        @click="count=0;initSearchParam();search()"
                        type="primary"
                        size="small"
                        style="background-color: #fff; border: 1px solid #ccc ; color: #666"
                >清空
                </el-button>
            </el-form-item>
        </el-form>
        <div style="margin-bottom: 10px">
            <el-button
                    v-if="permission.good_good_add"
                    icon="el-icon-plus"
                    @click="addGood"
                    size="small"
                    type="primary"
            >添加
            </el-button>
            <el-button
                    :loading="tableLoading"
                    v-if="permission.good_good_import"
                    icon="el-icon-upload2"
                    @click="imoprtExcel"
                    size="small"
                    type="primary"
            >导入
            </el-button>
            <el-button v-if="permission.good_good_templateDown" icon="el-icon-download" @click="templateDown"
                       size="small" type="primary">模板下载
            </el-button>
            <el-button v-if="permission.good_good_export" icon="el-icon-download" @click="getGoodList(1)" size="small" type="primary">导出</el-button>
        </div>
        <el-table
                ref="table"
                :height="tableHeight"
                size="medium"
                v-loading="tableLoading"
                :data="dataList"
                border
        >
            <el-table-column :index="indexMethod" label="序号" type="index" width="80" align="center"/>
            <el-table-column min-width="80" align="center" prop="goodCode" label="编码"></el-table-column>
            <el-table-column min-width="80" align="center" prop="goodName" label="名称"></el-table-column>
            <el-table-column min-width="80" align="center" prop="goodModel" label="型号"></el-table-column>
            <el-table-column min-width="100" align="center" prop="typeOneName" label="一级分类"></el-table-column>
            <el-table-column min-width="100" align="center" prop="typeTwoName" label="二级分类"></el-table-column>
            <el-table-column min-width="80" align="center" prop="encap" label="封装"></el-table-column>
            <el-table-column min-width="80" align="center" prop="brandName" label="品牌"></el-table-column>
            <el-table-column min-width="80" align="center" prop="factoryName" label="厂家"></el-table-column>
            <el-table-column min-width="80" align="center" prop="unitName" label="单位"></el-table-column>
            <el-table-column min-width="80" align="center" prop="typeName" label="类别"></el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="{row}">
                    <el-tag size="mini" v-if="row.status==1">正常</el-tag>
                    <el-tag size="mini" v-else type="danger">禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column width="220" label="操作">
                <template slot-scope="{row}">
                    <el-button
                            v-if="permission.good_good_info"
                            @click="infoGood(row)"
                            type="primary"
                            size="mini"
                            icon="el-icon-view"
                    >查看
                    </el-button>
                    <el-button
                            v-if="permission.good_good_edit&&permission.good_good_info"
                            @click="editGood(row)"
                            type="primary"
                            size="mini"
                            icon="el-icon-edit"
                    >编辑
                    </el-button>
                    <el-button
                            v-if="permission.good_good_forbidden && row.status == 1"
                            type="danger"
                            size="mini"
                            icon="el-icon-close"
                            @click="updateStatus(row)"
                    >禁用
                    </el-button>
                    <el-button
                            v-if="permission.good_good_enable && row.status == 2"
                            type="primary"
                            size="mini"
                            icon="el-icon-check"
                            @click="updateStatus(row)"
                    >启用
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
        <goodForm
                :dictTypeList="dictTypeList"
                :isShow="isShow"
                @successSubmit="successSubmit"
                v-if="visible"
                @returnBack="visible=false"
                :goodId="goodId"
                :visible="visible"
                :factoryList="factoryList"
                :unitList="unitList"
                :typeOneList="typeOneList"
                :brandList="brandList"
                :packageList="packageList"
        ></goodForm>
        <input
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                id="uploadBillsInp"
                type="file"
                name="file"
                @change="uploadClick"
                style="display: none;"
        />
    </div>
</template>

<script>
    import api from "@/api/good/good";
    import factoryApi from "@/api/good/factory";
    import unitApi from "@/api/good/unit";
    import typeApi from "@/api/good/type";
    import brandApi from "@/api/good/brand";
    import packageApi from "@/api/good/package";
    import dictApi from "@/api/system/dict/dict";
    import keyApi from "@/api/good/key";
    import {mapGetters} from "vuex";
    import goodForm from "./goodForm";
    import $ from "jquery";

    export default {
        name: "good-index",
        data() {
            return {
                searchParam: {
                    goodCode: "",
                    goodName: "",
                    goodModel: "",
                    factoryId: "",
                    typeOneId: "",
                    typeTwoId: "",
                    brandId: "",
                    packageId: "",
                    type: "",
                    encap:''
                },
                count: 0,
                page: 1,
                pageSize: 10,
                tableHeight: document.body.clientHeight - 280,
                tableLoading: false,
                dataList: [],
                visible: false,
                goodId: 0,
                attributeList: [],
                factoryList: [],
                unitList: [],
                typeOneList: [],
                typeTwoList: [],
                brandList: [],
                packageList: [],
                dictTypeList: [],
                encapList:[]
            };
        },
        mounted() {
            this.getGoodList();
            this.getEncapList()
            this.getFactoryAll();
            this.getUnitAll();
            this.getTypeList(0);
            this.getBrandAll();
            this.getPackageAll();
            this.getListByPid(5);
        },
        computed: {
            ...mapGetters(["direction", "drawerWidth", "permission"])
        },
        components: {goodForm},
        methods: {
            imoprtExcel() {
                $("#uploadBillsInp").click();
            },
            uploadClick(event) {
                let file = event.target.files[0];
                if (/\.(xls|xlsx|xlsb|xlsm)$/.test(event.target.value)) {
                    this.tableLoading = true;
                    let formdata = new window.FormData();
                    formdata.append("file", file);
                    api
                        .importGood(formdata)
                        .then(res => {
                            this.$message({
                                type: "success",
                                message: "操作成功!"
                            });
                            this.typeTwoChange()
                            this.getGoodList();
                            event.target.value = "";
                        })
                        .catch(e => {
                            this.tableLoading = false;
                            event.target.value = "";
                        });
                } else {
                    event.target.value = "";
                    this.$message.error("上传格式不对");
                }
            },
            exportGood(data) {
                this.tableLoading=true
                api.exportGood(data).then(res => {
                    this.tableLoading=false
                    window.open(res.data)
                }).catch(e => {
                    this.tableLoading=false
                });
            },
            getEncapList(){
                api.getEncapList().then(res => {
                    this.encapList=res.data?res.data:[]
                }).catch(e => {
                    this.encapList=[]
                });
            },
            templateDown() {
                this.tableLoading=true
                api.templateDown()
                    .then(res => {
                        this.tableLoading=false
                        window.open(res.data)
                    })
                    .catch(e => {
                        this.tableLoading=false
                    });
            },
            typeTwoChange() {
                if (this.searchParam.typeTwoId) {
                    keyApi
                        .getAttributeKeyList(this.searchParam.typeTwoId)
                        .then(res => {
                            this.attributeList = res.data ? res.data : []
                        })
                        .catch(e => {
                            this.attributeList = []
                        });
                } else {
                    this.attributeList = []
                }
            },
            indexMethod(index) {
                return index + 1 + (this.page - 1) * this.pageSize;
            },
            getListByPid(dictId) {
                dictApi
                    .getListByPid(dictId)
                    .then(res => {
                        this.dictTypeList = res.data ? res.data : [];
                    })
                    .catch(e => {
                        this.dictTypeList = [];
                    });
            },
            getPackageAll() {
                packageApi
                    .getPackageAll()
                    .then(res => {
                        this.packageList = res.data ? res.data : [];
                    })
                    .catch(e => {
                        this.packageList = [];
                    });
            },
            getBrandAll() {
                brandApi
                    .getBrandAll()
                    .then(res => {
                        this.brandList = res.data ? res.data : [];
                    })
                    .catch(e => {
                        this.brandList = [];
                    });
            },
            getTypeList(parentId) {
                typeApi
                    .getTypeList(parentId)
                    .then(res => {
                        const {data = []} = res;
                        if (!parentId) {
                            this.typeOneList = data;
                        } else {
                            this.typeTwoList = Object.assign([], data);
                        }
                    })
                    .catch(e => {
                        if (!parentId) {
                            this.typeOneList = [];
                        } else {
                            this.typeTwoList = [];
                        }
                    });
            },
            typeOneChange() {
                let searchParam = JSON.parse(JSON.stringify(this.searchParam));
                searchParam.typeTwoId = "";
                if (searchParam.typeOneId) {
                    this.getTypeList(searchParam.typeOneId);
                } else {
                    this.typeTwoList = [];
                }
                this.searchParam = Object.assign({}, searchParam);
            },
            getUnitAll() {
                unitApi
                    .getUnitAll()
                    .then(res => {
                        this.unitList = res.data ? res.data : [];
                    })
                    .catch(e => {
                        this.unitList = [];
                    });
            },
            getFactoryAll() {
                factoryApi
                    .getFactoryAll()
                    .then(res => {
                        this.factoryList = res.data ? res.data : [];
                    })
                    .catch(e => {
                        this.factoryList = [];
                    });
            },
            initSearchParam() {
                this.searchParam = {
                    goodCode: "",
                    goodName: "",
                    goodModel: "",
                    factoryId: "",
                    typeOneId: "",
                    typeTwoId: "",
                    brandId: "",
                    packageId: "",
                    type: "",
                    encap:''
                };
                this.attributeList=[]
            },
            updateStatus(row) {
                this.$confirm(
                    `此操作将${row.status == 1 ? "禁用" : "启用"}该元器件是否继续?`,
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                )
                    .then(() => {
                        this.tableLoading = true;
                        let method = "forbiddenGood";
                        if (row.status == 2) {
                            method = "enableGood";
                        }
                        api[method](row.goodId)
                            .then(res => {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.getGoodList();
                            })
                            .catch(e => {
                                this.tableLoading = false;
                            });
                    })
                    .catch(() => {
                    });
            },
            editGood(row) {
                this.goodId = row.goodId;
                this.isShow = false;
                this.$nextTick(function () {
                    this.visible = true;
                });
            },
            addGood() {
                this.goodId = 0;
                this.isShow = false;
                this.$nextTick(function () {
                    this.visible = true;
                });
            },
            infoGood(row) {
                this.goodId = row.goodId;
                this.isShow = true;
                this.$nextTick(function () {
                    this.visible = true;
                });
            },
            successSubmit() {
                this.visible = false;
                this.typeTwoChange()
                this.getGoodList();
            },
            search() {
                this.page = 1;
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.count = 1;
                this.getGoodList();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.$refs.table.bodyWrapper.scrollTop = 0;
                this.getGoodList();
            },
            getGoodList(isExport) {
                this.tableLoading = true;
                let data = JSON.parse(JSON.stringify(this.searchParam))
                let attributeKeys = []
                let attributeValues = []
                this.attributeList.map(item => {
                    if (item.attributeValueIds && item.attributeValueIds.length > 0) {
                        attributeKeys.push(item.attributeKeyId)
                        attributeValues = attributeValues.concat(item.attributeValueIds)
                    }
                })
                data.attributeKeys = attributeKeys
                data.attributeValues = attributeValues
                if(isExport){
                    this.exportGood(data)
                    return
                }
                data.page = this.page
                data.pageSize = this.pageSize
                api
                    .getGoodList(data)
                    .then(res => {
                        const {records, total} = res.data;
                        this.dataList = records ? records : [];
                        this.count = total ? parseInt(total) : 0;
                        this.tableLoading = false;
                    })
                    .catch(e => {
                        this.dataList = [];
                        this.tableLoading = false;
                    });
            }
        }
    };
</script>

<style lang="less">
    .good-index {
    }
</style>
