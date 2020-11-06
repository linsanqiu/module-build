<template>
  <div class="tableTemplateBox" id="tableTemplateBox">
    <table class="tableBoxCol" border cellspacing cellpadding>
      <template v-for="(rowItem,row) in tableTemplate">
        <tr @mousemove="mousemovefn" :key="row" v-if="!rowItem.array">
          <th :title="rowItem.fieldName">{{rowItem.fieldName}}</th>
          <td>
            <template>
              <!--1数字，2文本，3日期，4金额-->
              <template v-if="rowItem.fieldType  == 1 || rowItem.fieldType  == 2">
                <h-input
                  :disabled="viewPage || rowItem.disabled"
                  :type="rowItem.fieldType  == 1 ? 'int' : 'text'"
                  :maxlength="rowItem.length"
                  v-model.trim="nowData[rowItem.fieldCode]"
                  :placeholder="rowItem.placeholder"
                ></h-input>
              </template>
              <template v-else-if="rowItem.fieldType  == 3">
                <h-date-picker
                  clearOnIllegal
                  autoPlacement
                  :disabled="viewPage || rowItem.disabled"
                  :options="optionsDate"
                  format="yyyy-MM-dd"
                  :value="nowData[rowItem.fieldCode]"
                  type="date"
                  :placeholder="rowItem.required ? '请选择日期（必填）' :'请选择日期'"
                  @on-change="changeDate($event, rowItem.fieldCode)"
                ></h-date-picker>
              </template>
              <template v-else-if="rowItem.fieldType  == 4">
                <h-typefield
                  divided
                  :disabled="viewPage || rowItem.disabled"
                  suffixNum="4"
                  notFillin
                  :maxlength="rowItem.length"
                  type="money"
                  :placeholder="rowItem.placeholder"
                  v-model.trim="nowData[rowItem.fieldCode]"
                ></h-typefield>
              </template>
              <template v-else-if="rowItem.fieldType  == 5">
                <h-select
                  autoPlacement
                  filterable
                  :disabled="viewPage || rowItem.disabled"
                  :placeholder="rowItem.placeholder"
                  v-model="nowData[rowItem.fieldCode]"
                >
                  <h-option
                    v-for="(item, i) in rowItem.dataList"
                    :value="item.entryValue"
                    :key="item.entryValue"
                  >{{item.entryName}}</h-option>
                </h-select>
              </template>
              <template v-if="rowItem.fieldType  == 6">
                <h-input
                  :disabled="viewPage || rowItem.disabled"
                  type="textarea"
                  :maxlength="rowItem.length"
                  v-model.trim="nowData[rowItem.fieldCode]"
                  :placeholder="rowItem.placeholder"
                  :rows="3"
                ></h-input>
              </template>
              <template v-else-if="rowItem.fieldType  == 7">
                <h-simple-select
                  :disabled="viewPage || rowItem.disabled"
                  :placeholder="rowItem.placeholder"
                  autoPlacement
                  filterable
                  v-model="nowData[rowItem.fieldCode]"
                  label-in-value
                  @on-change='selectChange($event, rowItem.fieldCode)'
                >
                  <h-select-block :data="rowItem.dataList"></h-select-block>
                </h-simple-select>
              </template>

              <template v-else-if="rowItem.fieldType  == 8">
                <CascaderSelect
                  :required="rowItem.required"
                  :disabled="viewPage || rowItem.disabled"
                  :treeList="rowItem.dataList"
                  :listCount="rowItem.listCount"
                  :value="nowData[rowItem.fieldCode]"
                  @valueChange="valueChange($event, rowItem.fieldCode)"
                ></CascaderSelect>
              </template>
              <template v-else-if="rowItem.fieldType  == 9">
                <SearchInput
                  :placeholder="rowItem.placeholder"
                  :action="rowItem.action"
                  :valueKey="rowItem.valueKey"
                  :nameKey="rowItem.nameKey"
                  :disabled="viewPage || rowItem.disabled"
                  v-model="nowData[rowItem.fieldCode]"
                  :showKeyLabelKeyList="rowItem.showKeyLabelKeyList"
                ></SearchInput>
                <!-- <h-simple-select
                  :disabled="viewPage || rowItem.disabled"
                  :placeholder="rowItem.placeholder"
                  autoPlacement
                  filterable
                  v-model="nowData[rowItem.fieldCode]"
                >
                  <h-select-block :data="rowItem.dataList"></h-select-block>
                </h-simple-select>-->
              </template>
              <template v-if="rowItem.fieldType  == 10">
                <div
                  :class="rowItem.disabled?'disableDiv': ''"
                  v-html="formattingHtml(nowData[rowItem.fieldCode])"
                ></div>
              </template>
            </template>
          </td>
        </tr>
        <template v-if="rowItem.array && rowItem.fieldType == 8">
          <tr
            @mousemove="mousemovefn"
            :key="`${row}${index}`"
            v-for="(item, index) in nowData[rowItem.fieldCode]"
          >
            <th :title="rowItem.fieldName">{{rowItem.fieldName}}</th>
            <td>
              <div class="rowItem">
                <CascaderSelect
                  :required="rowItem.required"
                  :disabled="viewPage || rowItem.disabled"
                  :treeList="rowItem.dataList"
                  :listCount="rowItem.listCount"
                  :value="item"
                  @valueChange="valueChange($event, rowItem.fieldCode, index)"
                ></CascaderSelect>
                <div class="btnContainer" slot="btnContainer">
                  <i
                    class="icon-t-b-add iconfont"
                    title="新增"
                    @click="addItem(rowItem.fieldCode, viewPage || rowItem.disabled)"
                  ></i>
                  <i
                    class="icon-t-b-delete iconfont"
                    title="移除"
                    @click="removeItem(rowItem.fieldCode, index, viewPage || rowItem.disabled)"
                    v-if="nowData[rowItem.fieldCode].length > 1"
                  ></i>
                </div>
              </div>
            </td>
          </tr>
        </template>
        
      </template>
    </table>
    <div>
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script>
import { copyDeep } from "@/filters/index";
import utils from "@/utils";
import CascaderSelect from "./cascaderSelect";
import SearchInput from "./searchInput";
import { mapState } from "vuex";
const TODAY = utils.getToday();

export default {
  components: { CascaderSelect, SearchInput },
  computed: {

  },
  props: {
    tableTemplate: Array, //模板
    tableTemplateData: {
      type: Object,
      required: false,
      default: function () {
        return {};
      },
    }, //模板表格数据
    taskId: "",
    anncId: "",
    viewPage: false,
  },
  data() {
    return {
      value: "",
      optionsDate: {
        disabledDate(date) {
          //return date && date.valueOf() >= Date.now();
        },
      },
      page: {
        clientX: 0,
        clientY: 0,
      },
      nowData: {},
    };
  },
  methods: {
    changeDate(value, fieldCode) {
      this.nowData[fieldCode] = value;
    },
    mousemovefn(ev) {
      this.page.clintX = ev.clientX; //ev获取的只是屏幕可视范围的x,y值
      this.page.clintY = ev.clientY; //ev获取的只是屏幕可视范围的x,y值
    },
    initDefaultData() {
      this.tableTemplate.forEach((item, index) => {
        if (item.fieldType == "1") {
          item.placeholder = "请输入数字";
        } else if (item.fieldType == "2" || item.fieldType == "6") {
          item.placeholder = "请输入文本";
        } else if (item.fieldType == "3") {
          item.placeholder = "请选择日期";
        } else if (item.fieldType == "4") {
          item.placeholder = "请输入金额";
        } else if (
          item.fieldType == "5" ||
          item.fieldType == "7" ||
          item.fieldType == "8"
        ) {
          item.placeholder = "请选择";
        }
        if (item.required) {
          item.placeholder = item.placeholder + "（必填）";
        }
        if (item.length) {
          item.length = parseInt(item.length); //表单输入最大长度
        }
        // let tableObj = {
        //   fieldCode: item.fieldCode,
        //   id: item.id,
        //   taskId: this.taskId,
        //   anncId: this.anncId,
        //   fieldValue: "",
        //   creator: "",
        //   modifier: ""
        // };
        // this.$set(this.defaultData, index, tableObj);
      });
    },
    initTemplateData() {
      this.initDefaultData();
    },
    addItem(fieldCode, disabled) {
      if (disabled) return;
      this.$emit("addItem", { fieldCode: fieldCode });
    },
    removeItem(fieldCode, index, disabled) {
      if (disabled) return;
      this.$emit("removeItem", { fieldCode: fieldCode, index: index });
    },
    valueChange(value, fieldCode, index) {
      // index = index?parseInt(index):index
      if (typeof index != 'undefined') {
        this.nowData[fieldCode][index] = value;
      } else {
        this.nowData[fieldCode] = value;
      }
    },
    selectChange(obj, fieldCode){
      this.$emit('selectChange', obj, fieldCode)
    },
    formattingHtml(str){
      if (str){
        let newStr = ''
        newStr = str.replace(/\\n/g, "<br/>");
        return newStr;
      }else{
        return ''
      }
      
		},
  },
  watch: {
    tableTemplateData: {
      immediate: true,
      deep: true,
      handler: function (data) {
        this.nowData = data;
      },
    },
  },
  mounted() {
    this.initTemplateData();
  },
};
</script>

<style scoped lang='scss'>
.tableTemplateBox {
  height: 100%;
  position: relative;
}
.tableBoxCol,
.tableBoxRow {
  position: relative;
  border-collapse: collapse;
  border: none;
  table-layout: fixed;
  width: 100%;
}
.tableBoxCol /deep/ .h-input,
.tableBoxRow /deep/ .h-input {
  padding: 0px 12px;
  border: 0;
  width: 100%;
  display: inline-block;
}
.tableBoxCol /deep/ .h-selectTable-selection,
.tableBoxRow /deep/ .h-selectTable-selection,
.tableBoxRow /deep/ .h-select-selection,
.tableBoxCol /deep/ .h-select-selection{
  border: 0;
}
.tableBoxCol tr {
  height: 30px;
  padding: 0px 8px;
  text-align: left;
  border: 1px solid #dce1e7;
}
.tableBoxCol tr th {
  background: #f0f3f5;
  width: 30px;
  padding: 2px 8px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.tableBoxCol tr td {
  width: 120px;
  padding: 0px;
}
.tableBoxRow tr {
  height: 30px;
  border: 1px solid #dce1e7;
}
.tableBoxRow tr th {
  background: #f0f3f5;
  /*width:150px;*/
  padding: 2px 0px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
}
.tableBoxRow tr td {
  width: 250px;
}

.rightMenu {
  position: absolute;
  padding: 5px 10px;
  line-height: 22px;
  z-index: 99;
  background-color: #fff;
  border-radius: 2px;
  border: 1px solid #dfdfdf;
  -webkit-box-shadow: 1px 1px 2px #ccc;
  box-shadow: 1px 1px 2px #ccc;
  color: #000;
  width: 100px;
}
.rightMenu li:hover {
  color: #2e71f2;
  cursor: pointer;
}
.rowItem /deep/ .h-cascader {
  width: 100%;
}
.rowItem {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}
.btnContainer {
  width: 60px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex: 0;
}
.btnContainer i {
  color: #2e71f2;
  margin-left: 3px;
  margin-right: 3px;
}

.tableTemplateBox /deep/ input:disabled{
  color: #999;
}
.disableDiv{
  color: #999;
  max-height: 150px;
  overflow: auto;
}
</style>