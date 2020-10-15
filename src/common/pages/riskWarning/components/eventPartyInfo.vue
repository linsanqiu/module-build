<!--
 * @Author: your name
 * @Date: 2020-05-19 13:07:25
 * @LastEditTime: 2020-05-21 10:16:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /three-admin-ui/src/pages/riskWarning/components/publishEventInfo.vue
--> 
<template>
  <div class="comMainContent">
    <div class="heder">
      <div class="title">当事人{{index+1}}</div>
      <h-button
        type="primary"
        @click="onSaveClick"
        size="small"
        v-if="isPageEditing && showEditigBtn"
      >{{this.tableTemplateDataObj.editing?'保存':'编辑'}}</h-button>
      <h-button type="success" @click="onOtherSaveClick" size="small" v-if="isPageEditing">另存为</h-button>
      <h-button
        type="warning"
        @click="onDeleteClick"
        size="small"
        v-if="canDelete && isPageEditing"
      >删除</h-button>
    </div>
    <div class="handleHeader" v-if="tableTemplateDataObj.updateOperator">
      <div class="leftBc">
        <span>处理人：{{tableTemplateDataObj.updateOperator}}</span>
        <span>处理时间：{{tableTemplateDataObj.updateTime}}</span>
      </div>
      <div class="rightBc" v-if="anncIndex">
        <span>关联公告{{anncIndex}}</span>
      </div>
    </div>
    <div class="content">
      <TableTemplate
        ref="table"
        :tableTemplateData="tableTemplateDataObj"
        :tableTemplate="tableTemplate"
        :tableType="2"
        :viewPage="!this.tableTemplateDataObj.editing || !isPageEditing"
        @addItem="addItem"
        @removeItem="removeItem"
        @selectChange='selectChange'
      ></TableTemplate>
    </div>
    <div class="footer" v-if="isPageEditing">
      <h-button type="warning" @click="onAddBtnClick" size="small">添加</h-button>
    </div>
  </div>
</template>
<script>
import TableTemplate from "./tableTemplate";
import { mapActions, mapState, mapGetters } from "vuex";
import { copyDeep } from "@/filters/index";
export default {
  components: { TableTemplate },
  data() {
    return {
      tableTemplate: [
        {
          fieldName: "当事人",
          fieldCode: "partyName",
          fieldType: 2,
          required: 1,
        },
        {
          fieldName: "当事人性质",
          fieldCode: "partyNature",
          fieldType: 7,
          required: 1,
          dataList: [],
        },
        {
          fieldName: "当事人编码",
          fieldCode: "partyCode",
          fieldType: 9,
          required: 0,
          action: "/hos-api/vac/company/queryLike",
          valueKey: "partyCode",
          nameKey: "partyDesc",
          showKeyLabelKeyList: ['companyCode', 'companyName'],
        },
        {
          fieldName: "开始日期",
          fieldCode: "startDate",
          fieldType: 3,
          required: 1,
        },
        {
          fieldName: "截止日期",
          fieldCode: "closeDate",
          fieldType: 3,
          required: 0,
        },
        {
          fieldName: "违规条款",
          fieldCode: "vioTerm",
          fieldType: 6,
          required: 0,
        },

        {
          fieldName: "违规类型",
          fieldCode: "vioTypes",
          fieldType: 8,
          required: 1,
          array: true,
          listCount: 3,
          dataList: [],
        },
        {
          fieldName: "违规类型说明",
          fieldCode: "vioTypeRemark",
          fieldType: 6,
          required: 0,
        },
        {
          fieldName: "关联关系",
          fieldCode: "relationTypes",
          fieldType: 8,
          required: 0,
          array: true,
          listCount: 2,
          dataList: [],
        },
        {
          fieldName: "关联关系说明",
          fieldCode: "relationRemark",
          fieldType: 6,
          required: 0,
        },
        {
          fieldName: "关联公司",
          fieldCode: "company",
          fieldType: 9,
          required: 0,
          action: "/hos-api/vac/company/queryLike",
          valueKey: "companyCode",
          nameKey: "companyName",
          showKeyLabelKeyList: ['companyCode', 'companyName'],
        },
        {
          fieldName: "处罚机构",
          fieldCode: "punishOrg",
          fieldType: 8,
          required: 1,
          listCount: 2,
          dataList: [],
        },
        {
          fieldName: "被处罚机构编码",
          fieldCode: "punishedOrgCode",
          fieldType: 9,
          required: 0,
          valueKey: "punishedOrgCode",
          nameKey: "punishedOrgDesc",
          action: "/hos-api/vac/company/queryLike",
          showKeyLabelKeyList: ['companyCode', 'companyName'],
        },
        {
          fieldName: "处罚机构说明",
          fieldCode: "punishOrgRemark",
          fieldType: 6,
          required: 0,
        },
        {
          fieldName: "处罚类型",
          fieldCode: "punishType",
          fieldType: 8,
          required: 1,
          listCount: 2,
          dataList: [],
        },
        {
          fieldName: "处罚说明",
          fieldCode: "punishRemark",
          fieldType: 6,
          required: 1,
        },
        {
          fieldName: "处罚金额（元）",
          fieldCode: "penalty",
          fieldType: 4,
          required: 0,
        },
        {
          fieldName: "处罚金额币种",
          fieldCode: "currency",
          fieldType: 7,
          required: 0,
          dataList: [],
        },
      ],
    };
  },
  props: {
    isPageEditing: Boolean,
    index: {
      type: Number,
      default: 0,
    },
    canDelete: {
      type: Boolean,
      default: false,
    },
    tableTemplateDataObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    ...mapGetters("riskWarning", {
      anncInfos: "getAnncInfos",
      eventInfo: "getEventInfo",
    }),
    ...mapState("riskWarning", {
      anncInfo: "anncInfo",
    }),
    ...mapState("constList", [
      "moneyType",
      "constRelationList",
      "punishType",
      "riskOrganizationList",
      "riskTypeList",
      "partyType",
    ]),
    anncIndex() {
      let anncId = this.tableTemplateDataObj.anncId;
      let anncInfos = this.anncInfos;
      if (!anncId || !anncInfos || anncInfos.length == 0) {
        return "";
      } else {
        for (let i = 0; i < anncInfos.length; i++) {
          let item = anncInfos[i];
          if (item.anncId == anncId) {
            return i + 1;
          }
        }
      }
    },
    showEditigBtn() {
      if (this.eventInfo) {
        let publishStatusCode = this.eventInfo.publishStatusCode;
        if (publishStatusCode == 0) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
  methods: {
    ...mapActions("riskWarning", {
      aSetParty: "setParty",
      aSetOtherParty: "setOtherParty",
      aDeleteParty: "deleteParty",
      aAddParty: "addParty",
      aAddPartyInfoRow: "addPartyInfoRow",
      aRemovePartyInfoRow: "removePartyInfoRow",
    }),
    onSaveClick() {
      let data = copyDeep(this.$refs.table.nowData);
      if (data.editing) {
        let pass = this.checkRequire(data);
        if (!pass) return;
      }
      data.editing = !data.editing;
      let payload = {
        index: this.index,
        data: data,
      };
      this.aSetParty(payload);
    },
    onOtherSaveClick() {
      let data = copyDeep(this.$refs.table.nowData);
      if (data.editing) {
        let pass = this.checkRequire(data);
        if (!pass) return;
      }
      let payload = {
        index: this.index,
        data: data,
      };
      this.aSetOtherParty(payload);
    },
    onAddBtnClick() {
      
      let data = copyDeep(this.$refs.table.nowData);
      if (data.editing) {
        let pass = this.checkRequire(data);
        if (!pass) return;
      }
      let payload = {
        index: this.index,
        data: data,
      };
      this.aAddParty(payload);
    },
    onDeleteClick() {
      this.$hMsgBox.confirm({
        isOkLeft: true,
        title: "删除当事人",
        content: "是否删除该条当事人",
        onOk: () => {
          let data = copyDeep(this.$refs.table.nowData);
          let payload = {
            index: this.index,
            data: data,
          };
          this.aDeleteParty(payload);
        },
      });
    },
    checkRequire(data) {
      data = data || copyDeep(this.$refs.table.nowData);
      let pass = true;
      for (let i = 0; i < this.tableTemplate.length; i++) {
        let item = this.tableTemplate[i];
        let { required, fieldCode, fieldName, array, fieldType } = item;
        if (required) {
          let value = data[fieldCode];
          if (fieldType == 8) {
            // 多项待完善
            if (array) {
              for (let j = 0; j < value.length; j++) {
                let _value = value[j];
                pass = this.judejArray(_value);
              }
            } else {
              pass = this.judejArray(value);
            }
            if (!pass) {
              this.$hMessage.warning({
                content: fieldName + ":请输入必填字段",
              });
              break;
            }
          } else {
            if (!value) {
              this.$hMessage.warning({
                content: fieldName + ":请输入必填字段",
              });
              pass = false;
              break;
            }
          }
        }
      }
      return pass;
    },
    judejArray(array) {
      let pass = true;
      for (let j = 0; j < array.length; j++) {
        let _value = array[j];
        if (!_value) {
          pass = false;
          break;
        }
      }
      return pass;
    },
    addItem(value) {
      value.nowIndex = this.index;
      this.aAddPartyInfoRow(value);
    },
    removeItem(value) {
      value.nowIndex = this.index;
      this.aRemovePartyInfoRow(value);
    },
    selectChange(obj, fieldCode){
      if (fieldCode == 'partyNature'){
        if (obj.label == obj.value){
          return
        }
        this.tableTemplateDataObj['partyNatureDesc'] = obj.label
      }
    }
  },
  mounted() {},
  watch: {
    // 处罚金币币种
    moneyType: {
      immediate: true,
      handler(data) {
        this.tableTemplate[17].dataList = data;
      },
    },
    // 关联关系
    constRelationList: {
      immediate: true,
      handler(data) {
        this.tableTemplate[8].dataList = data;
      },
    },
    // 处罚类型
    punishType: {
      immediate: true,
      handler(data) {
        this.tableTemplate[14].dataList = data;
      },
    },
    // 处罚机构
    riskOrganizationList: {
      immediate: true,
      handler(data) {
        this.tableTemplate[11].dataList = data;
      },
    },
    // 违规类型
    riskTypeList: {
      immediate: true,
      handler(data) {
        this.tableTemplate[6].dataList = data;
      },
    },
    partyType: {
      immediate: true,
      handler(data) {
        this.tableTemplate[1].dataList = data;
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.heder {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-top: 12px;
}
.footer {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.handleHeader {
  display: flex;
  color: #666;
  font-size: 12px;
  justify-content: space-between;
  // padding-top: 10px;
  padding-bottom: 10px;
  .leftBc {
    display: flex;
  }
  span {
    margin-right: 20px;
  }
}
</style>