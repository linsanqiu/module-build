<template>
    <h-form-item
        class="search-form-item"
        :show-message="showMessage"
        :class="className"
        :prop="itemName"
        :label="labelName"
        :tipWidth='tipWidth'
    >
        <template v-if="pageType == 'HANDLE' || pageType == 'ADD'">
            <h-input
                :class="readonlyFlag ? '' : 'inputEle'"
                :type="inputType"
                :autosize="inputType == 'textarea'"
                :readonly="readonlyFlag"
                :focusAllSelect="inputType == 'textarea' ? false : true"
                v-if="formItemType == 'input'"
                placeholder
                v-model="commonFilters[itemName]"
                @on-keydown="changeKeyDown"
                @on-blur="changeInput(commonFilters[itemName])"
                @on-focus="focusFn"
                :maxlength="maxlength"
                :showWordLimit="showWordLimit"
            ></h-input>
            <h-select
                autoPlacement
                :readonly="readonlyFlag"
                v-if="formItemType == 'select'"
                placeholder
                v-model="commonFilters[itemName]"
                :clearable="true"
                @on-change="selectChangeFn(itemName)"
            >
                <h-option
                    v-for="item in itemSelectList"
                    :value="item.dictEntry"
                    :key="item.dictEntry"
                >{{ item.entryName ? item.entryName : "-" }}
                </h-option
                >
            </h-select>
            <h-select
                autoPlacement
                multiple
                :readonly="readonlyFlag"
                v-if="formItemType == 'selectmultiple'"
                placeholder
                v-model="commonFilters[itemName]"
                :clearable="true"
            >
                <h-option
                    v-for="item in itemSelectList"
                    :value="item.dictEntry"
                    :key="item.dictEntry"
                >{{ item.entryName ? item.entryName : "-" }}
                </h-option
                >
            </h-select>
            <h-simple-select
                :remote="remotFlag"
                :remote-method="changeQueryFn"
                :loading="loadingLabelTab"
                autoPlacement
                :readonly="readonlyFlag"
                v-if="formItemType == 'selectblock'"
                placeholder
                v-model="commonFilters[itemName]"
                filterable
                @on-change="changeSelectSource"
            >
                <h-select-block focusAllSelect :data="itemSelectList"></h-select-block>
            </h-simple-select>
            <h-select-tree
                style="width: 215px"
                autoPlacement
                filterable
                isTreeFilter
                :readonly="readonlyFlag"
                formatValue="id"
                v-if="formItemType == 'selecttree'"
                placeholder
                :firstValue="commonFilters[itemName]"
                v-model="commonFilters[itemName]"
                :data="itemSelectList"
                @on-select-change="selectChangeTreeFn"
            ></h-select-tree>
            <h-date-picker
                autoPlacement
                :readonly="readonlyFlag"
                v-if="formItemType == 'datepicker'"
                :type="datepickerType"
                :options="optionsDate"
                placeholder
                :value="commonFilters[itemName]"
                @on-change="onChangeDatePicker"
            ></h-date-picker>
            <h-checkbox-group
                v-if="formItemType == 'checkbox'"
                v-model="commonFilters[itemName]"
            >
                <h-checkbox
                    v-for="(item, k) in itemSelectList"
                    :value="item.dictEntry"
                    :label="item.dictEntry"
                    :key="item.dictEntry"
                >
                    <span style="padding: 0 2px">{{ item.entryName }}</span>
                </h-checkbox>
            </h-checkbox-group>
            <div v-if="formItemType == 'titlediv'">
                <div
                    contenteditable="true"
                    class="titleShow"
                    @keydown="titleKeyDownFn"
                    @input="changeTitle"
                    v-html="commonFilters[itemNameIpt]"
                ></div>
            </div>
        </template>
        <template
            v-if="
        pageType == 'VIEW' ||
        pageType == 'SPECIALVIEW' ||
        pageType == 'SPECIALEDIT' ||
        pageType == 'SPECIALADD'
      "
        >
            <div class="viewPage" v-if="!linkType" v-html="commonFilters[itemName]">
                {{ commonFilters[itemName] ? commonFilters[itemName] : "-" }}
            </div>
            <div class="viewPage linkUrlItem" v-else>
                <a :href="commonFilters[itemName]" target="_blank">{{
                        commonFilters[itemName] ? commonFilters[itemName] : ""
                    }}</a>
            </div>
        </template>
    </h-form-item>
</template>

<script>
export default {
    data () {
        return {
            titleShowStatus: true,
            optionsDate: {
                disabledDate (date) {
                    return date && date.valueOf() >= Date.now()
                }
            }
        }
    },
    props: {
        readonlyFlag: false,
        inputIndex: String,
        itemName: String,
        itemNameIpt: '',
        labelName: String,
        formItemType: String,
        inputType: '',
        pageType: String, // 页面类型
        linkType: false,
        commonFilters: Object,
        itemSelectList: Array,
        datepickerType: {
            type: String,
            default: 'datetime'
        },
        className: '',
        remotFlag: false,
        loadingLabelTab: false,
        showMessage: true,
        maxlength: Number,
        showWordLimit: Boolean,
        tipWidth: Number
    },
    methods: {
        changeSelectSource (currentValue) {
            this.$emit('changeSelectSource', currentValue)
        },
        changeQueryFn (keyWord) {
            this.$emit('changeQueryFn', keyWord)
        },
        onChangeDatePicker (values) {
            this.$emit('onChangeDatePicker', values)
        },
        selectChangeFn (itemName) {
            this.$emit('selectChangeFn', itemName)
        },
        selectChangeTreeFn (arr) {
            if (arr.length == 0) return
            let selelctData = arr[0]
            selelctData.selecItem = this.itemName
            this.$emit('selectChangeTreeFn', selelctData)
        },
        changeInput (value) {
            this.$emit('changeInput', value)
        },
        changeKeyDown (e) {
            if (e.keyCode == '13' && this.itemName == 'mediaSource') {
                /** 回车触发媒体出处常量改变**/
                this.$emit('changeInput', this.commonFilters[this.itemName])
            }
        },
        changeTitle (e) {
            this.$emit('changeTitle', e.target.innerHTML)
        },
        titleKeyDownFn (e) {
            var keyCode = e.keyCode || e.which || e.charCode
            if (keyCode === 13) {
                e.preventDefault() // 阻止title回车
            }
        },
        keepLastIndex (obj) {
            console.log(obj)
            console.log(window.getSelection)

            if (window.getSelection) {
                // ie11 10 9 ff safari
                obj.focus() // 解决ff不获取焦点无法定位问题
                var range = window.getSelection() // 创建range
                range.selectAllChildren(obj) // range 选择obj下所有子内容
                range.collapseToEnd() // 光标移至最后
            } else if (document.selection) {
                // ie10 9 8 7 6 5
                var range = document.selection.createRange() // 创建选择对象
                // var range = document.body.createTextRange();
                range.moveToElementText(obj) // range定位到obj
                range.collapse(false) // 光标移至最后
                range.select()
            }
        },
        focusFn () {
            this.$emit('focusFn', this.inputIndex)
        }
    }
}
</script>

<style>
.search-form-item {
    margin-bottom: 5px;
}

.search-form-item .h-date-picker .h-input-icon {
    right: -5px !important;
}

.search-form-item .viewPage {
    border: 1px solid #dce1e7;
    border-radius: 5px;
    padding: 0 5px;
    height: 32px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 215px;
    cursor: pointer;
}

/*资讯详情页-一列*/
.titleItem .viewPage {
    width: 100%;
}

/*资讯详情页-两列*/
.twoColItem .viewPage {
    width: 445px;
}

.search-form-item .h-select {
    width: 215px !important;
}

.search-form-item .h-form-item .h-input,
.search-form-item .h-form-item .h-selectTable-input {
    width: 215px !important;
    padding: 0 8px;
}

.search-form-item .h-checkbox-group {
    background: #fff;
    width: 215px;
}

.linkUrlItem {
    border: 1px solid #d7dde4;
    padding: 0 8px;
    border-radius: 3px;
    width: 445px;
}

.linkUrlItem a {
    text-decoration: none;
    color: #298dff;
}

.titleShow {
    box-sizing: border-box;
    min-height: 32px;
    padding: 0 8px;
    border: 1px solid #d7dde4;
    border-radius: 4px;
    color: #333;
    background: #fff;
    outline: 0px;
}

.titleItem .h-input {
    padding: 0 8px;
    width: 100%;
}

.titleItem .viewPage {
    width: 100%;
}

.titleItem .info-replace-color {
    background: #ff9999; /*粉色-替换词*/
}

.titleItem .info-highlight-color {
    background: #66ffff; /*天蓝色-高亮*/
}

.titleItem .info-label-color {
    background: #ffff00; /*-黄色-标签*/
}
</style>
