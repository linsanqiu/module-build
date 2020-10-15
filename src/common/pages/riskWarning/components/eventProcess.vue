<!--
 * @Author: your name
 * @Date: 2020-05-19 13:07:25
 * @LastEditTime: 2020-05-21 10:59:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /three-admin-ui/src/pages/riskWarning/components/publishEventInfo.vue
--> 
<template>
  <div class="comMainContent">
    <div class="heder">
      <div class="title">事件进程{{index+1}}</div>
      <h-button
        type="primary"
        @click="saveProcess"
        size="small"
        v-if="isPageEditing && showEditigBtn"
      >{{this.tableTemplateDataObj.editing?'保存':'编辑'}}</h-button>
      <h-button type="success" @click="saveOtherProcess" size="small" v-if="isPageEditing">另存为</h-button>
      <h-button
        type="warning"
        @click="deleteProcess"
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
        :viewPage="!this.tableTemplateDataObj.editing || !isPageEditing"
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
          fieldName: "事件进程",
          fieldCode: "eventProcessCode",
          fieldType: 5,
          required: 1,
          dataList: [],
          placeholder: "",
        },
        {
          fieldName: "事件进程日期",
          fieldCode: "eventProcessTime",
          fieldType: 3,
          required: 1,
          placeholder: "",
        },
      ],
    };
  },
  computed: {
    ...mapState("constList", ["eventProcessStatus"]),
    ...mapGetters("riskWarning", {
      anncInfos: "getAnncInfos",
      eventInfo: "getEventInfo",
    }),
    ...mapState("riskWarning", {
      anncInfo: "anncInfo",
    }),
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
    editing: {
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
  methods: {
    ...mapActions("riskWarning", {
      aSetProcess: "setProcess",
      aSetOtherProcess: "setOtherProcess",
      aDeleteProcess: "deleteProcess",
      aAddProcess: "addProcess",
    }),

    // 保存设置vuex
    saveProcess() {
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
      this.aSetProcess(payload);
    },
    saveOtherProcess() {
      let data = copyDeep(this.$refs.table.nowData);
      let payload = {
        index: this.index,
        data: data,
      };
      this.aSetOtherProcess(payload);
    },
    onAddBtnClick() {
      let data = copyDeep(this.$refs.table.nowData);
      let payload = {
        index: this.index,
        data: data,
      };
      this.aAddProcess(payload);
    },
    deleteProcess() {
      this.$hMsgBox.confirm({
        isOkLeft: true,
        title: "删除事件进程",
        content: "是否删除条事件进程",
        onOk: () => {
          let data = copyDeep(this.$refs.table.nowData);
          let payload = {
            index: this.index,
            data: data,
          };
          this.aDeleteProcess(payload);
        },
      });
    },
    checkRequire(data, init = false) {
      data = data || copyDeep(this.$refs.table.nowData);
      let pass = true;
      for (let i = 0; i < this.tableTemplate.length; i++) {
        let item = this.tableTemplate[i];
        let { required, fieldCode, fieldName } = item;
        if (item.required) {
          let value = data[fieldCode];
          if (!value) {
            if (!init) {
              this.$hMessage.warning({
                content: fieldName + ":请输入必填字段",
              });
            }
            pass = false;
            break;
          }
        }
      }
      return pass;
    },
  },
  mounted() {},
  watch: {
    eventProcessStatus: {
      immediate: true,
      handler(value) {
        this.tableTemplate[0].dataList = value;
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