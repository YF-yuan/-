<template>
    <el-drawer
            class="good-form"
            :title="getOperatorName"
            :visible.sync="visible"
            :direction="direction"
            :size="drawerWidth+'px'"
            :before-close="handleClose"
    >
        <el-form
                :inline="true"
                v-loading="loading"
                ref="ruleForm"
                :model="ruleForm"
                size="small"
                label-width="100px"
        >
            <el-card style="display: flex;flex-wrap: wrap" class="box-card">
                <div slot="header" class="clearfix">
                    <span>基本信息</span>
                </div>
                <el-form-item
                        prop="goodCode"
                        label="编码"
                        :rules="{ required: true, message: '编码不能为空', trigger: 'blur' }"
                >
                    <el-input
                            :disabled="isShow||goodId"
                            maxlength="30"
                            clearable
                            v-model="ruleForm.goodCode"
                            size="small"
                            placeholder="请输入编码"
                            style="width: 200px"
                    />
                </el-form-item>
                <el-form-item
                        prop="goodName"
                        label="名称"
                        :rules="{ required: true, message: '名称不能为空', trigger: 'blur' }"
                >
                    <el-input
                            :disabled="isShow"
                            maxlength="30"
                            clearable
                            v-model="ruleForm.goodName"
                            size="small"
                            placeholder="请输入名称"
                            style="width: 200px"
                    />
                </el-form-item>
                <el-form-item
                        prop="goodModel"
                        label="型号"
                        :rules="{ required: true, message: '名称型号不能为空', trigger: 'blur' }"
                >
                    <el-input
                            :disabled="isShow"
                            clearable
                            maxlength="30"
                            v-model="ruleForm.goodModel"
                            size="small"
                            placeholder="请输入型号"
                            style="width: 200px"
                    />
                </el-form-item>
                <el-form-item
                        prop="typeOneId"
                        label="一级分类"
                        :rules="{ required: true, message: '一级分类不能为空', trigger: 'change' }"
                >
                    <el-select
                            :disabled="isShow"
                            style="width: 200px"
                            @change="typeOneChange"
                            size="small"
                            v-model="ruleForm.typeOneId"
                            filterable
                            clearable
                    >
                        <el-option
                                :key="index"
                                :label="item.typeName"
                                :value="item.typeId"
                                v-for="(item,index) in typeOneList"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        prop="typeTwoId"
                        label="二级分类"
                        :rules="{ required: true, message: '二级分类不能为空', trigger: 'change' }"
                >
                    <el-select
                            :disabled="isShow"
                            @change="typeTwoChange"
                            style="width: 200px"
                            size="small"
                            v-model="ruleForm.typeTwoId"
                            filterable
                            clearable
                    >
                        <el-option
                                :key="index"
                                :label="item.typeName"
                                :value="item.typeId"
                                v-for="(item,index) in typeTwoList"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        prop="encap"
                        label="封装"
                >
                    <el-input
                            :disabled="isShow"
                            clearable
                            maxlength="30"
                            v-model="ruleForm.encap"
                            size="small"
                            placeholder="请输入封装"
                            style="width: 200px"
                    />
                </el-form-item>
                <el-form-item label="品牌">
                    <el-select :disabled="isShow" style="width: 200px" clearable filterable v-model="ruleForm.brandId">
                        <el-option
                                :key="index"
                                :label="item.brandName"
                                :value="item.brandId"
                                v-for="(item,index) in brandList"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="厂家">
                    <el-select :disabled="isShow" style="width: 200px" clearable filterable v-model="ruleForm.factoryId">
                        <el-option
                                :key="index"
                                :label="item.factoryName"
                                :value="item.factoryId"
                                v-for="(item,index) in factoryList"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select :disabled="isShow" style="width: 200px" clearable filterable v-model="ruleForm.type">
                        <el-option
                                :key="index"
                                :label="item.dictValue"
                                :value="item.dictKey+''"
                                v-for="(item,index) in dictTypeList"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        prop="unitId"
                        label="单位"
                        :rules="{ required: true, message: '单位不能为空', trigger: 'change' }"
                >
                    <el-select :disabled="isShow" style="width: 200px" clearable filterable v-model="ruleForm.unitId">
                        <el-option
                                :key="index"
                                :label="item.unitName"
                                :value="item.unitId"
                                v-for="(item,index) in unitList"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <div style="display: flex">
                    <el-form-item label="最小包装">
                        <el-input
                                :disabled="isShow"
                                @blur="numChange()"
                                oninput="value=value.replace(/[^\d.]/g,'')"
                                clearable
                                maxlength="9"
                                v-model="ruleForm.miniPackage"
                                size="small"
                                placeholder="数量"
                                style="width: 100px"
                        />
                    </el-form-item>
                    <el-form-item label-width="0px">
                        <el-select
                                :disabled="true"
                                style="width: 100px"
                                clearable
                                filterable
                                v-model="ruleForm.unitId"
                        >
                            <el-option
                                    :key="index"
                                    :label="item.unitName"
                                    :value="item.unitId"
                                    v-for="(item,index) in unitList"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <span style="line-height:34px;font-size:30px">/</span>
                    <el-form-item label-width="0px">
                        <el-select
                                :disabled="isShow"
                                placeholder="包装"
                                style="width: 100px"
                                clearable
                                filterable
                                v-model="ruleForm.packageId"
                        >
                            <el-option
                                    :key="index"
                                    :label="item.packageName"
                                    :value="item.packageId"
                                    v-for="(item,index) in packageList"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-card>
            <el-card v-if="ruleForm.typeTwoId" style="margin-top:15px" class="box-card">
                <div slot="header" class="clearfix">
                    <span>属性信息</span>
                </div>
                <el-form-item :label="item.attributeKeyName" :key="index" v-for="(item,index) in attributeList">
                    <el-autocomplete
                            v-if="index==0"
                            :disabled="isShow"
                            class="inline-input"
                            v-model="item.attributeValueName"
                            :fetch-suggestions="querySearch1"
                    ></el-autocomplete>
                    <el-autocomplete
                            v-if="index==1"
                            :disabled="isShow"
                            class="inline-input"
                            v-model="item.attributeValueName"
                            :fetch-suggestions="querySearch2"
                    ></el-autocomplete>
                    <el-autocomplete
                            v-if="index==2"
                            :disabled="isShow"
                            class="inline-input"
                            v-model="item.attributeValueName"
                            :fetch-suggestions="querySearch3"
                    ></el-autocomplete>
                    <el-autocomplete
                            v-if="index==3"
                            :disabled="isShow"
                            class="inline-input"
                            v-model="item.attributeValueName"
                            :fetch-suggestions="querySearch4"
                    ></el-autocomplete>
                </el-form-item>
            </el-card>
            <el-card style="margin-top:15px" class="box-card">
                <div slot="header" class="clearfix">
                    <span>数据手册</span>
                </div>
                <el-upload
                        :disabled="isShow"
                        class="upload-demo"
                        drag
                        :on-success="fileSuccess"
                        :on-remove="fileRemove"
                        :on-error="fileError"
                        action="/api/file/upload/index"
                        :multiple="false"
                        :file-list="fileList"
                        :before-upload="fileBefore"
                >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                        将文件拖到此处，或
                        <em>点击上传</em>
                    </div>
                    <div class="el-upload__tip" slot="tip">支持扩展名.rar .zip .doc .docx .pdf .jpg文件</div>
                </el-upload>
            </el-card>
            <el-card style="margin-top:15px" class="box-card">
                <div slot="header" class="clearfix">
                    <span>图片信息</span>
                </div>
                <uploadImage :disabled="isShow" :isFileName="true" :limit="10" v-model="ruleForm.picList"></uploadImage>
            </el-card>
        </el-form>
        <div style="text-align: center;margin-top: 15px">
            <el-button
                    v-if="!isShow"
                    :loading="submitLoading"
                    @click="submitForm('ruleForm')"
                    type="primary"
                    size="medium"
            >确定提交
            </el-button>
            <el-button @click="handleClose" size="medium">返回</el-button>
        </div>
    </el-drawer>
</template>

<script>
    import api from "@/api/good/good";
    import typeApi from "@/api/good/type";
    import keyApi from '@/api/good/key'
    import {mapGetters} from "vuex";
    import uploadImage from '@/components/uploadImage'

    export default {
        name: "good-from",
        data() {
            return {
                valueList1:[],
                valueList2:[],
                valueList3:[],
                valueList4:[],
                typeTwoList: [],
                loading: false,
                submitLoading: false,
                ruleForm: {
                    picList: [],
                    attribute: []
                },
                fileList: [],
                attributeList: []
            };
        },
        props: {
            dictTypeList: {
                type: Array,
                default() {
                    return [];
                }
            },
            typeOneList: {
                type: Array,
                default() {
                    return [];
                }
            },
            unitList: {
                type: Array,
                default() {
                    return [];
                }
            },
            brandList: {
                type: Array,
                default() {
                    return [];
                }
            },
            packageList: {
                type: Array,
                default() {
                    return [];
                }
            },
            factoryList: {
                type: Array,
                default() {
                    return [];
                }
            },
            goodId: {
                type: Number,
                default() {
                    return 0;
                }
            },
            isShow: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            visible: {
                type: Boolean,
                default() {
                    return false;
                }
            }
        },
        components: {uploadImage},
        computed: {
            ...mapGetters(["direction", "drawerWidth"]),
            getOperatorName() {
                if (this.isShow) {
                    return "元器件库详情";
                } else {
                    return this.goodId ? "元器件库编辑" : "元器件库添加";
                }
            }
        },
        mounted() {
            if (this.goodId) {
                this.infoGood();
            }
        },
        methods: {
            querySearch1(queryString, cb){
                var restaurants = this.valueList1;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                let list = []
                results.map(item=>{
                    list.push({value:item.attributeValueName})
                })
                cb(list);
            },
            querySearch2(queryString, cb){
                var restaurants = this.valueList2;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                let list = []
                results.map(item=>{
                    list.push({value:item.attributeValueName})
                })
                cb(list);
            },
            querySearch3(queryString, cb){
                var restaurants = this.valueList3;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                let list = []
                results.map(item=>{
                    list.push({value:item.attributeValueName})
                })
                cb(list);
            },
            querySearch4(queryString, cb){
                var restaurants = this.valueList4;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                let list = []
                results.map(item=>{
                    list.push({value:item.attributeValueName})
                })
                cb(list);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.attributeValueName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            fileRemove(){
              this.fileList=[]
            },
            typeTwoChange() {
                let ruleForm = JSON.parse(JSON.stringify(this.ruleForm))
                if (this.ruleForm.typeTwoId) {
                    keyApi
                        .getAttributeKeyList(this.ruleForm.typeTwoId)
                        .then(res => {
                            this.attributeList = res.data ? res.data : []
                            for(let i=0;i<this.attributeList.length;i++){
                                this['valueList'+(i+1)]=this.attributeList[i].valueList
                            }
                        })
                        .catch(e => {
                            this.valueList1=[]
                            this.valueList2=[]
                            this.valueList3=[]
                            this.valueList4=[]
                            this.attributeList = []
                        });
                } else {
                    this.attributeList = []
                }
                ruleForm.attribute = []
                this.ruleForm = Object.assign({}, ruleForm)
            },
            numChange() {
                let ruleForm = JSON.parse(JSON.stringify(this.ruleForm))
                ruleForm.miniPackage = ruleForm.miniPackage ? (ruleForm.miniPackage + '') : ''
                ruleForm.miniPackage = ruleForm.miniPackage ? (ruleForm.miniPackage.indexOf('.') > -1 ? parseFloat(parseFloat(ruleForm.miniPackage).toFixed(2)) : parseFloat(ruleForm.miniPackage)) : ''
                if (ruleForm.miniPackage === 0) {
                    ruleForm.miniPackage = '0'
                } else {
                    if (!ruleForm.miniPackage) {
                        ruleForm.miniPackage = ''
                    }
                }
                this.ruleForm = Object.assign({}, ruleForm)
            },
            fileBefore(file) {
                console.log(file);
                if (/\.(rar|zip|doc|docx|pdf|jpg|RAR|ZIP|DOC|DOCX|PDF|JPG)$/.test(file.name)) {
                    let MAXSIZE = 10 * 1024 * 1024;
                    let size = file.size;
                    if (size > MAXSIZE) {
                        this.$notify.error({
                            title: "上传文件错误",
                            message: "上传文件不能超过10M"
                        });
                        return false;
                    }
                } else {
                    this.$notify.error({
                        title: "上传图片错误",
                        message: "请上传rar|zip|doc|docx|pdf|jpg格式文件"
                    });
                    return false
                }
            },
            fileSuccess(response, file, fileList) {
                this.fileList = Object.assign(
                    [],
                    [{name: response.data.fileName, url: response.data.url}]
                );
            },
            fileError(err) {
                this.$notify.error({
                    title: "错误",
                    message: err
                });
            },
            getTypeList(parentId) {
                typeApi
                    .getTypeList(parentId)
                    .then(res => {
                        const {data = []} = res;
                        this.typeTwoList = Object.assign([], data);
                    })
                    .catch(e => {
                        this.typeTwoList = [];
                    });
            },
            typeOneChange() {
                let ruleForm = JSON.parse(JSON.stringify(this.ruleForm));
                ruleForm.typeTwoId = "";
                if (ruleForm.typeOneId) {
                    this.getTypeList(ruleForm.typeOneId);
                } else {
                    this.typeTwoList = [];
                }
                this.ruleForm = Object.assign({}, ruleForm);
            },
            infoGood() {
                this.loading = true;
                api.infoGood(this.goodId).then(res => {
                        let data = res.data ? res.data : {}
                        if (data.dataFile) {
                            this.fileList = [{name: data.dataFile.fileName, url: data.dataFile.filePath}]
                        }
                        if (data.picList) {
                            data.picList.map(item => {
                                item.url = item.filePath
                            })
                        }
                        if (data.typeOneId) {
                            this.getTypeList(data.typeOneId);
                        }
                        if (data.typeTwoId) {
                            keyApi.getAttributeKeyList(data.typeTwoId).then(res => {
                                let attributeData = res.data ? res.data : []
                                if(data.attribute&&data.attribute.length>0){
                                    attributeData.map(cc=>{
                                        data.attribute.map(child=>{
                                            let keyData=child[cc.attributeKeyId]
                                            if(keyData){
                                                cc.attributeValueName=keyData.attributeValueName
                                            }
                                        })
                                    })
                                }
                                this.attributeList=Object.assign([],attributeData)
                                for(let i=0;i<this.attributeList.length;i++){
                                    this['valueList'+(i+1)]=this.attributeList[i].valueList
                                }
                            }).catch(e => {
                                this.attributeList = []
                            });
                        }
                        if(!data.brandId){
                            data.brandId=''
                        }
                        if(!data.factoryId){
                            data.factoryId=''
                        }
                        if(!data.packageId){
                            data.packageId=''
                        }
                        this.ruleForm = Object.assign({}, data);
                        this.loading = false;
                    })
                    .catch(e => {
                        this.ruleForm = {};
                        this.loading = false;
                    });
            },
            handleClose(hide) {
                this.$emit("returnBack");
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        let method = "";
                        let ruleForm = JSON.parse(JSON.stringify(this.ruleForm));
                        if (this.fileList && this.fileList.length > 0) {
                            ruleForm.dataFile = {
                                type: 2,
                                filePath: this.fileList[0].url,
                                fileName: this.fileList[0].name
                            }
                        }else{
                            ruleForm.dataFile = null
                        }
                        ruleForm.picList.map(item => {
                            item.type = 1
                            item.filePath = item.url
                        })
                        let attribute = []
                        this.attributeList.map(item => {
                            let data1 = {}
                            if (item.attributeValueName) {
                                data1[item.attributeKeyId] = [{
                                    attributeValueId: '',
                                    attributeValueName: item.attributeValueName
                                }]
                            } else {
                                data1[item.attributeKeyId] = [{attributeValueId: '', attributeValueName: ''}]
                            }
                            attribute.push(data1)
                        })
                        ruleForm.attribute = attribute
                        if (!this.goodId) {
                            method = "addGood";
                        } else {
                            method = "editGood";
                        }
                        api[method](ruleForm)
                            .then(res => {
                                this.$message({
                                    message: "操作成功",
                                    type: "success"
                                });
                                this.submitLoading = false;
                                this.$emit("successSubmit");
                            })
                            .catch(e => {
                                this.submitLoading = false;
                            });
                    }
                });
            }
        }
    };
</script>

<style lang="less">
    .good-form {
        .el-form-item--small.el-form-item {
            margin-bottom: 18px !important;
        }
    }
</style>
