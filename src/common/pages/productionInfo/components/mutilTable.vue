<template>
  <div class="mainContainer">
    <div class="addBtnBc">
      <span class="btn_add" title="新增" @click="addItem">+</span>
    </div>
    <div class="data-table">
      <table>
        <tbody>
          <tr>
            <th
              class="eidtSearchContent"
              v-for="(item, index) in optionsHeader"
              :key="index"
            >
              <span>{{ item.fieldName }}</span>
              <!-- <div class="editSearch">
              <HeaderInput
                :type="item.fieldType"
                @valueChange="editHeaderSearchDataChange($event, index)"
                :maxLen="item.length"
                :selectCode="item.fieldType == 6 ? item.defaultValue : ''"
                :select="
                  item.fieldType == 5 ? selectObj[item.defaultValue] : []
                "
              ></HeaderInput>
            </div> -->
            </th>
          </tr>
          <tr v-for="(item, index) in dataList" :key="index">
            <td v-for="(header, indexJ) in optionsHeader" :key="indexJ">
              <Sinput
                :repRules="header.fieldRepRuleList"
                :type="header.fieldType"
                v-model="item[header.fieldCode]"
                :maxLen="header.length"
                :required="header.required ? true : false"
                :selectCode="header.fieldType == 6 ? header.defaultValue : ''"
                :select="
                  header.fieldType == 5 ? selectObj[header.defaultValue] : []
                "
              ></Sinput>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Sinput from "./input";
import { copyDeep } from "@/filters/index";
export default {
  components: { Sinput },
  props: {
    selectObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
    fieldInfoList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    dataObject: {
      type: Object,
      default: () => {
        return {};
      },
    },
    prodCode: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {
      optionsHeader: [],
      dataList: [],
    };
  },
  methods: {
    getAllData() {
      let prodDataList = [];
      for (let item of this.optionsHeader) {
        let valueList = [];
        for (let _item of this.dataList) {
          valueList.push(_item[item.fieldCode]);
        }
        prodDataList.push({
          ...item,
          fieldValue: JSON.stringify(valueList),
        });
      }
      return prodDataList;
    },
    addItem() {
      let data = {};
      let dataList = copyDeep(this.dataList);
      for (let item of this.optionsHeader) {
        data[item.fieldCode] = "";
      }
      dataList.push(data);
      this.dataList = dataList;
    },
  },
  watch: {
    dataObject: {
      handler(value) {
        let { fieldInfoList } = this;
        fieldInfoList.forEach((item) => {
          item.prodCode = this.prodCode;
        });
        this.optionsHeader = fieldInfoList || [];
        let mutilEditData = [];
        let keyLength = 0;
        if (this.dataObject[fieldInfoList[0].fieldCode]) {
          keyLength = this.dataObject[fieldInfoList[0].fieldCode].length;
        }
        // 字典List
        for (let i = 0; i < keyLength; i++) {
          let dict = {};
          for (let j = 0; j < fieldInfoList.length; j++) {
            let item = fieldInfoList[j];
            let { fieldCode } = item;
            dict[fieldCode] = this.dataObject[fieldCode][i];
          }
          mutilEditData.push(dict);
        }
        this.dataList = mutilEditData;
      },
    },
  },
  computed: {},
};
</script>

<style lang='scss' scoped>
.eidtSearchContent {
  padding: 10px;
  .editSearch {
    display: flex;
    .title {
      width: 80px;
    }
  }
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
.addBtnBc {
  position: absolute;
  right: 0;
  top: -30px;
}
.mainContainer {
  position: relative;
}
.btn_add {
  width: 40px;
  height: 40px;
  font-size: 23px;
  color: dodgerblue;
  cursor: pointer;
  display: inline-block;
  line-height: 32px;
  padding: 0 10px;
}

.data-table{
    overflow-x: auto;
}
</style>