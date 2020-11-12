<template>
    <el-input
            :disabled="disabled"
            @blur="numChange"
            oninput="value=value.replace(/[^\d.]/g,'')"
            :clearable="false"
            size="small"
            v-model="sValue"
            :maxlength="maxlength"
    />
</template>

<script>

    export default {
        name: "priceInput",
        data() {
            return {
                sValue: ''
            }
        },
        props: {
            isLow: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            maxPrice: {
                type: Number,
                default() {
                    return 0;
                }
            },
            maxlength: {
                type: Number,
                default() {
                    return 12;
                }
            },
            value: {
                default() {
                    return '';
                }
            },
            disabled: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            clearValidate: {
                type: Function
            }
        },
        watch: {
            sValue() {
                this.$emit('input',this.sValue)
                if (this.sValue && this.clearValidate) {
                    this.clearValidate()
                }
            },
            value() {
                this.sValue = this.value
            }
        },
        mounted() {
            this.sValue = this.value
        },
        methods: {
            numChange(){
                let value = JSON.parse(JSON.stringify(this.sValue))
                value=value?value:''
                value = value + ''
                value = value ? (value.indexOf('.') > -1 ? parseFloat(parseFloat(value).toFixed(2)) : parseFloat(value)) : ''
                if ((!value || value === '0')&&!this.isLow) {
                    value = ''
                }else{
                    if(this.maxPrice){
                        if(value>this.maxPrice){
                            value=this.maxPrice
                        }
                    }
                }
                this.sValue=value
            }
        }
    }
</script>

<style scoped>

</style>
