<template>
  <div>
    <div class="group" v-for="(item,k) in temData">
      <p>分组名称：{{item.bizGroupName ? item.bizGroupName : '-'}}</p>
      <div class="data-table">
        <template v-if="item.rowList.length > 0">
          <table>
            <thead>
              <tr>
                <th v-for="(items, i) in item.rowList">
                  <span @click="onClickTitle(items.fieldName)">{{ items.fieldName }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value, j) in valueArr[k]" @contextmenu.prevent="contextmenu('row', k, j)">
                <td v-for="(items, i) in item.rowList">
                  <inputs
                    :disabled="viewPage"
                    :type="items.fieldType"
                    v-model="value[i]"
                    :maxLen="items.length"
                    :required="items.required ? true : false"
                    :selectCode="items.fieldType == 6 ? items.defaultValue : ''"
                    :select="items.fieldType == 5 ? selectObj[items.defaultValue] : []"
                    @input='inputValueChange($event, items.fieldCode, value[i])'
                    :repRules='items.repRules'
                  ></inputs>
                </td>
              </tr>
              <tr v-if="isAdd">
                <td class="colspan" :colspan="item.rowList.length">
                  <span class="btn_add" @click="add( item, k)" title="新增">+</span>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
        <template v-if="item.colList.length > 0">
          <table>
            <tbody>
              <tr v-for="(items, i) in item.colList">
                <th align="left">
                  <span @click="onClickTitle(items.fieldName)">{{ items.fieldName }}</span>
                </th>
                <td
                  v-for="(valueData, j) in valueArr[k][i]"
                  @contextmenu.prevent="contextmenu('col', k, j)"
                >
                  <inputs
                    :disabled="viewPage"
                    :type="items.fieldType"
                    :maxLen="items.length"
                    :required="items.required ? true : false"
                    v-model="valueArr[k][i][j]"
                    :selectCode="items.fieldType == 6 ? items.defaultValue : ''"
                    :select="items.fieldType == 5 ? selectObj[items.defaultValue] : []"
                    @input='inputValueChange($event, items.fieldCode,valueArr[k][i][j])'
                    :repRules='items.repRules'
                  ></inputs>
                </td>
                <!-- <td class="rowspan" v-if="isAdd && i == 0" :rowspan="item.colList.length">
                  <span class="btn_add" @click="add( item, k)" title="新增">+</span>
                </td> -->
              </tr>
            </tbody>
          </table>
        </template>
      </div>
    </div>
    <ul
      id="info-table-right-menu"
      class="menu"
      v-show="isMenu"
      :style="rightMenuStyle"
      @click.stop="function(){}"
    >
      <li @click="onDel">{{ rightMenuName }}</li>
    </ul>
    <div>
      <slot name="buttons"></slot>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import inputs from "./input";
import { copyDeep } from "@/filters/index";
import md5 from "js-md5";
export default {
  components: { inputs },
  props: {
    onTitle: Function,
    templateData: Array,
    value: Array,
    isAdd: {
      type: Boolean,
      default: true
    },
    viewPage: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      temData: [],
      valueArr: [],
      loading: {}, // ing 请求中，ok 请求成功， no 请求失败
      selectObj: {},
      selectObjCode: {},
      isMenu: false,
      rightMenuStyle: {},
      rightMenuName: "",
      rightMenuType: "",
      rightMenuIndex: "",
      rightMenuTemDataIndex: "",
    };
  },
  methods: {
    onClickTitle(str) {
      if (this.onTitle) {
        this.onTitle(str);
      }
    },
    onBodyMouseDown(event) {
      if (
        !(
          event.target.id == "info-table-right-menu" ||
          $(event.target).parents("#info-table-right-menu").length > 0
        )
      ) {
        this.onbox();
      }
    },
    onDel() {
      let index = this.rightMenuTemDataIndex;
      let key = this.rightMenuIndex;
      let type = this.rightMenuType;
      let data = copyDeep(this.valueArr[index]);
      if (type == "row") {
        data.splice(key, 1);
      } else {
        for (let i = 0, len = data.length; i < len; i++) {
          data[i].splice(key, 1);
        }
      }
      this.$set(this.valueArr, index, data);
      this.onbox();
    },
    onbox() {
      this.isMenu = false;
    },
    contextmenu(type, index, key) {
      if (!this.isAdd) return;
      let e = window.event;
      let event = { x: e.clientX, y: e.clientY };
      this.rightMenuStyle = {
        left: event.x + "px",
        top: event.y + "px"
      };
      this.rightMenuTemDataIndex = index;
      this.rightMenuType = type;
      this.rightMenuIndex = key;
      if (type == "row") {
        this.rightMenuName = "删除第" + (key + 1) + "行";
      } else {
        this.rightMenuName = "删除第" + (key + 1) + "列";
      }
      this.isMenu = true;
      $("body").bind("mousedown", this.onBodyMouseDown);
    },
    add(data, index) {
      if (data.rowList.length > 0) {
        let arr = [];
        for (let k = 0, lens = data.rowList.length; k < lens; k++) {
          arr[k] = "";
        }
        this.valueArr[index].push(arr);
      } else {
        let arr = [];
        for (let k = 0, lens = data.colList.length; k < lens; k++) {
          this.valueArr[index][k].push("");
        }
      }
    },
    getSelectList(dictCode) {
      let stauts = this.loading[dictCode];
      if (stauts && (stauts == "ing" || stauts == "ok")) {
        return;
      }
      this.loading[dictCode] = "ing";
      setTimeout(() => {
        this.$http
          .get("/pic/audit/sys/getDict?dictCode=" + dictCode)
          .then(res => {
            let data = res.data;
            if (data.status == this.$api.SUCCESS) {
              let list = data.body.dictList || [];
              this.$set(this.selectObj, dictCode, list);
              this.loading[dictCode] = "ok";
            } else {
              this.loading[dictCode] = "no";
              this.$hMessage.error({ content: data.msg });
            }
          })
          .catch(err => {
            this.loading[dictCode] = "no";
            this.$hLoading.error("网络异常，获取常量下拉框数据失败！");
          });
      }, 0);
    },
    init() {
      let arr = [];
      let data = this.templateData;
      if (data) {
        if (!(this.value && this.value.length > 0)) {
          for (let i = 0, len = data.length; i < len; i++) {
            arr[i] = [];
            arr[i][0] = [];
            if (data[i].rowList.length > 0) {
              for (let k = 0, lens = data[i].rowList.length; k < lens; k++) {
                arr[i][0][k] = "";
                if (data[i].rowList[k].fieldType == 5) {
                  this.getSelectList(data[i].rowList[k].defaultValue);
                }
              }
            } else {
              for (let k = 0, lens = data[i].colList.length; k < lens; k++) {
                arr[i][k] = [];
                arr[i][k][0] = "";

                if (data[i].colList[k].fieldType == 5) {
                  this.getSelectList(data[i].colList[k].defaultValue);
                }
              }
            }
          }
          this.valueArr = copyDeep(arr);
        } else {
          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].rowList.length > 0) {
              for (let k = 0, lens = data[i].rowList.length; k < lens; k++) {
                if (data[i].rowList[k].fieldType == 5) {
                  this.getSelectList(data[i].rowList[k].defaultValue);
                }
              }
            } else {
              for (let k = 0, lens = data[i].colList.length; k < lens; k++) {
                if (data[i].colList[k].fieldType == 5) {
                  this.getSelectList(data[i].colList[k].defaultValue);
                }
              }
            }
          }
        }
        this.temData = copyDeep(data);
      } else {
      }
    },
    setValueArr() {
      this.valueArr = this.value ? copyDeep(this.value) : [];
    },
    inputValueChange(value,fieldCode){
      if (fieldCode == 'prodCode'){
        if (!value)return
        this.$emit('prodCodeChange', value)
      }
    }
  },
  watch: {
    value: {
      handler(newArr, oldArr) {
        let newMd5 = md5(JSON.stringify(newArr || []));
        let oldMd5 = md5(JSON.stringify(oldArr || []));
        if (newMd5 != oldMd5) {
          this.setValueArr();
        }
      },
      deep: true
    },
    valueArr: {
      handler(newArr, oldArr) {
        this.$emit("input", copyDeep(newArr));
      },
      deep: true
    },
    templateData: {
      handler(newArr, oldArr) {
        this.init();
      },
      deep: true
    }
  },
  mounted() {
    this.setValueArr();
    this.init();
  }
};
</script>
<style scoped>
.menu {
  position: fixed;
  line-height: 22px;
  z-index: 99;
  background-color: #fff;
  border-radius: 2px;
  border: 1px solid #dfdfdf;
  box-shadow: 1px 1px 2px #ccc;
  color: #000;
}
.menu li:hover {
  color: #2e71f2;
  cursor: pointer;
}
.menu li.disabled,
.menu li.disabled:hover {
  color: #ccc;
  cursor: auto;
}
table {
  position: relative;
  border-collapse: collapse;
  border: none;
  table-layout: fixed;
  width: 100%;
}
th {
  background: #f0f3f5;
}
tr,
th,
td {
  border: 1px solid #dce1e7;
  height: 32px;
}
th,
td {
  width: 150px;
}
tbody th {
  padding: 0 10px;
}
th span {
  cursor: pointer;
  padding: 10px;
}
.data-table {
  width: 100%;
  overflow-x: auto;
}
.colspan {
  text-align: center;
}
.rowspan {
  text-align: center;
  width: 40px;
}
.btn_add {
  font-size: 23px;
  color: dodgerblue;
  cursor: pointer;
  display: inline-block;
  line-height: 32px;
  padding: 0 10px;
}
.group {
  margin-bottom: 10px;
}
.group p {
  line-height: 24px;
  font-weight: bold;
}
.group:nth-child(1) {
  margin-top: 0;
}
</style>