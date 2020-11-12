<template>
    <el-drawer
            class="genForm"
            title="编辑生成配置"
            :visible.sync="visible"
            :direction="direction"
            :size="drawerWidth+'px'"
            :before-close="handleClose"
    >
        <el-form ref="ruleForm" :model="ruleForm" size="small" label-width="100px">
            <h5>基本信息</h5>
            <el-row>
                <el-col :span="10">
                    <el-form-item
                            label="表名称"
                            prop="tableName"
                            :rules="{ required: true, message: '表名称不能为空', trigger: 'blur' }"
                    >
                        <el-input clearable v-model="ruleForm.tableName" size="small"/>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item
                            label="表描述"
                            prop="tableComment"
                            :rules="{ required: true, message: '表描述不能为空', trigger: 'blur' }"
                    >
                        <el-input clearable v-model="ruleForm.tableComment" size="small"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item
                            label="实体类名称"
                            prop="className"
                            :rules="{ required: true, message: '实体类名称不能为空', trigger: 'blur' }"
                    >
                        <el-input clearable v-model="ruleForm.className" size="small"/>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item
                            label="作者"
                            prop="functionAuthor"
                            :rules="{ required: true, message: '作者不能为空', trigger: 'blur' }"
                    >
                        <el-input clearable v-model="ruleForm.functionAuthor" size="small"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="21">
                    <el-form-item
                            label="备注"
                            prop="remark"
                    >
                        <el-input clearable type="textarea"
                                  :rows="4" v-model="ruleForm.remark" size="small"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <h5>字段信息</h5>
            <el-table
                    v-if="ruleForm.columns"
                    stripe
                    ref="table"
                    :data="ruleForm.columns"
                    border
                    size="small"
            >
                <el-table-column label="序号" type="index" width="80" align="center"/>
                <el-table-column
                        min-width="100"
                        show-overflow-tooltip
                        prop="columnName"
                        label="字段列名"
                        align="center"
                ></el-table-column>
                <el-table-column min-width="100" prop="columnComment" label="字段描述" align="center">
                    <template slot-scope="{row}">
                        <el-input clearable v-model="row.columnComment" size="small"/>
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="100"
                        show-overflow-tooltip
                        prop="columnType"
                        label="物理类型"
                        align="center"
                ></el-table-column>
                <el-table-column min-width="100" prop="javaType" label="JAVA类型" align="center">
                    <template slot-scope="{row}">
                        <el-select clearable v-model="row.javaType" size="small">
                            <el-option value="Lone" key="Lone" label="Lone"></el-option>
                            <el-option value="String" key="String" label="String"></el-option>
                            <el-option value="Integer" key="Integer" label="Integer"></el-option>
                            <el-option value="Double" key="Double" label="Double"></el-option>
                            <el-option value="BigDecimal" key="BigDecimal" label="BigDecimal"></el-option>
                            <el-option value="Date" key="Date" label="Date"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column min-width="100" prop="javaField" label="JAVA属性" align="center">
                    <template slot-scope="{row}">
                        <el-input clearable v-model="row.javaField" size="small"/>
                    </template>
                </el-table-column>
                <el-table-column prop="javaField" label="插入" align="center">
                    <template slot-scope="{row}">
                        <el-checkbox v-model="row.isInsert" true-label="1" false-label="0"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="javaField" label="编辑" align="center">
                    <template slot-scope="{row}">
                        <el-checkbox v-model="row.isEdit" true-label="1" false-label="0"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="javaField" label="列表" align="center">
                    <template slot-scope="{row}">
                        <el-checkbox v-model="row.isList" true-label="1" false-label="0"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="javaField" label="查询" align="center">
                    <template slot-scope="{row}">
                        <el-checkbox v-model="row.isQuery" true-label="1" false-label="0"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column min-width="100" prop="queryType" label="查询方式" align="center">
                    <template slot-scope="{row}">
                        <el-select clearable v-model="row.queryType" size="small">
                            <el-option value="EQ" key="EQ" label="="></el-option>
                            <el-option value="NE" key="NE" label="!="></el-option>
                            <el-option value="GT" key="GT" label=">"></el-option>
                            <el-option value="GTE" key="GTE" label=">="></el-option>
                            <el-option value="LT" key="LT" label="<"></el-option>
                            <el-option value="LTE" key="LTE" label="<="></el-option>
                            <el-option value="LIKE" key="LIKE" label="LIKE"></el-option>
                            <el-option value="BETWEEN" key="BETWEEN" label="BETWEEN"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="javaField" label="必填" align="center">
                    <template slot-scope="{row}">
                        <el-checkbox v-model="row.required"></el-checkbox>
                    </template>
                </el-table-column>
            </el-table>
            <h5>生成信息</h5>
            <el-row>
                <el-col :span="10">
                    <el-form-item
                            label="生成模板"
                            prop="tableName"
                            :rules="{ required: true, message: '生成模板不能为空', trigger: 'blur' }"
                    >
                        <el-select clearable v-model="ruleForm.tplCategory" size="small">
                            <el-option value="crud" key="crud" label="单表(增删改查)"></el-option>
                            <el-option value="tree" key="tree" label="树表(增删改查)"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item
                            label="生成包路径"
                            prop="packageName"
                            :rules="{ required: true, message: '生成包路径不能为空', trigger: 'blur' }"
                    >
                        <el-input clearable v-model="ruleForm.packageName" size="small" placeholder="生成在哪个java包下，例如 com.ruoyi.system"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item
                            label=" 生成模块名"
                            prop="moduleName"
                            :rules="{ required: true, message: ' 生成模块名不能为空', trigger: 'blur' }"
                    >
                        <el-input clearable v-model="ruleForm.moduleName" size="small" placeholder="可理解为子系统名，例如 system"/>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item
                            label=" 生成业务名"
                            prop="businessName"
                            :rules="{ required: true, message: ' 生成业务名不能为空', trigger: 'blur' }"
                    >
                        <el-input clearable v-model="ruleForm.businessName" size="small" placeholder="可理解为功能英文名，例如 user"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item
                            label="生成功能名"
                            prop="functionName"
                            :rules="{ required: true, message: '生成功能名不能为空', trigger: 'blur' }"
                    >
                        <el-input clearable v-model="ruleForm.functionName" size="small" placeholder="用作类描述，例如 用户"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <h5 v-if="ruleForm.tplCategory=='tree'">其他信息</h5>
            <el-row v-if="ruleForm.tplCategory=='tree'">
                <el-col :span="10">
                    <el-form-item
                            label="树编码字段">
                        <el-select clearable v-model="ruleForm.treeCode" size="small" placeholder="树显示的编码字段名， 如：dept_id">
                            <el-option v-for="(item,index) in ruleForm.columns" :value="item.columnName" :key="index" :label="item.columnName"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item
                            label="树父编码字段">
                        <el-select clearable v-model="ruleForm.treeParentCode" size="small" placeholder="树显示的父编码字段名， 如：parent_Id">
                            <el-option v-for="(item,index) in ruleForm.columns" :value="item.columnName" :key="index" :label="item.columnName"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="ruleForm.params&&ruleForm.tplCategory=='tree'">
                <el-col :span="10">
                    <el-form-item
                            label="树名称字段 "
                    >
                        <el-select clearable v-model="ruleForm.treeName" size="small" placeholder="树节点的显示名称字段名， 如：dept_name">
                            <el-option v-for="(item,index) in ruleForm.columns" :value="item.columnName" :key="index" :label="item.columnName"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <div style="text-align: center;margin-top: 15px">
                <el-button
                        v-if="permission.tool_gen_editColumn"
                        :loading="submitLoading"
                        @click="submitForm('ruleForm')"
                        type="primary"
                        size="medium"
                >确定
                </el-button>
                <el-button @click="$emit('returnBack')" size="medium">返回</el-button>
            </div>
        </el-form>
    </el-drawer>
</template>

<script>
    import api from "@/api/system/gen/gen";
    import {mapGetters} from "vuex";

    export default {
        name: "genForm",
        data() {
            return {
                submitLoading: false,
                iconVisible: false,
                ruleForm: {}
            };
        },
        props: {
            visible: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            tableId: {
                type: Number,
                default() {
                    return 0;
                }
            },
        },
        components: {},
        mounted() {
            this.getDetail()
        },
        computed: {
            ...mapGetters(["direction", "drawerWidth", "permission"]),
        },
        methods: {
            getDetail() {
                api.columns(this.tableId).then(res => {
                    this.ruleForm = res.data ? res.data : {}
                }).catch(e => {
                    this.ruleForm = {}
                });
            },
            handleClose(hide) {
                this.$emit("returnBack");
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        let ruleForm=JSON.parse(JSON.stringify(this.ruleForm))
                        if(ruleForm.tplCategory=='crud'){
                            ruleForm.options=''
                            ruleForm.params={}
                        }else{
                            ruleForm.params={
                                treeCode: ruleForm.treeCode?ruleForm.treeCode:'',
                                treeName: ruleForm.treeName?ruleForm.treeName:'',
                                treeParentCode: ruleForm.treeParentCode?ruleForm.treeParentCode:''
                            }
                        }
                        api.editColumn(ruleForm).then(res => {
                            this.$message({
                                message: '操作成功',
                                type: "success"
                            });
                            this.submitLoading = false;
                            this.$emit("successSubmit");
                        }).catch(e => {
                            this.submitLoading = false;
                        });
                    }
                });
            }
        }
    };
</script>

<style lang="less">
    .gen-from {
    }
</style>
