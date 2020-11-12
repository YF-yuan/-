<template>
    <el-input
            :disabled="disabled"
            @blur="numChange"
            oninput="value=value.replace(/[^\d]/g,'')"
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
            maxNum: {
                type: Number,
                default() {
                    return 0;
                }
            },
            maxlength: {
                type: Number,
                default() {
                    return 6;
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
                value = value ? parseInt(value) :0
                if (this.maxNum&&value > this.maxNum) {
                    value= this.maxNum
                }
                if (!value || value === '0') {
                    value = ''
                }
                this.sValue=value
            }
        }
    }
</script>

<style scoped>

</style>
