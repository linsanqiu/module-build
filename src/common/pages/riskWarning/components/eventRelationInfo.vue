<!--
 * @Author: your name
 * @Date: 2020-05-19 13:07:25
 * @LastEditTime: 2020-05-21 11:01:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /three-admin-ui/src/pages/riskWarning/components/publishEventInfo.vue
-->
<template>
  <div class="comMainContent">
    <div class="heder">
      <div class="title">关联公告{{index+1}}</div>
      <a v-if='tableTemplateDataObj.downUrl' :href="tableTemplateDataObj.downUrl" class="a-tag" target="__blank">
        <img src="../../../assets/img/irrow_down.png" alt="下载" class="down-icon" />
      </a>
      <h-button
        type="primary"
        @click="onSaveClick"
        size="small"
        v-if='isPageEditing'
      >{{this.tableTemplateDataObj.editing?'保存':'编辑'}}</h-button>
      <h-button
        type="primary"
        @click="cancelRelation"
        size="small"
        v-if='isPageEditing'
      >解除关联</h-button>
    </div>
    <div class="handleHeader" v-if="tableTemplateDataObj.updateOperator">
      <div class="leftBc">
        <span>处理人：{{tableTemplateDataObj.updateOperator}}</span>
        <span>处理时间：{{tableTemplateDataObj.updateTime}}</span>
      </div>
      <div v-if="showRemark" class="current-remark">当前公告</div>
    </div>
    <div class="content">
      <TableTemplate
        ref="table"
        :tableTemplateData="tableTemplateDataObj"
        :tableTemplate="tableTemplate"
        :tableType="2"
        :viewPage="!this.tableTemplateDataObj.editing"
      ></TableTemplate>
    </div>
  </div>
</template>
<script>
import TableTemplate from "./tableTemplate";
import { mapActions, mapState } from "vuex";
import { copyDeep } from "@/filters/index";
export default {
  components: { TableTemplate },
  data() {
    return {
      tableTemplate: [
        {
          fieldName: "公告类型",
          fieldValue: "违法违规",
          fieldCode: "anncTypeCode",
          fieldType: 5,
          required: 1,
          dataList: [],
        },
        {
          fieldName: "公告标题",
          fieldCode: "title",
          fieldType: 2,
          required: 0,
          disabled: true
        },
        {
          fieldName: "公告日期",
          fieldCode: "releaseTime",
          fieldType: 3,
          required: 0,
          disabled: true
        },
        {
          fieldName: "行政文号",
          fieldCode: "admNo",
          fieldType: 2,
          required: 0
        },
        {
          fieldName: "公告内容",
          fieldCode: "content",
          fieldType: 6,
          required: 0
        }
      ]
    };
  },
  props: {
    // 是否当前公告
    showRemark:Boolean,
    isPageEditing:Boolean,
    index: {
      type: Number,
      default: 0
    },
    tableTemplateDataObj: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    noticeTypeList: {
      immediate: true,
      handler(value) {
        this.tableTemplate[0].dataList = value;
      },
    },
  },
  computed: {
    ...mapState("constList", ["noticeTypeList"]),
    ...mapState("riskWarning", {
      anncInfo: "anncInfo",
      eventInfo: "eventInfo",
      anncInfos: "anncInfos",
      eventSelectIndex: "eventSelectIndex",
      eventList: "eventList"
    }),
    isFromEventList() {
      if (this.$route.path.indexOf("publishEvents") != -1) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    ...mapActions("riskWarning", {
      aSetRelation: "setRelation",
      aSetOtherRelation: "setOtherRelation",
      unBindRelation: 'unBindRelation',
      aAddEvent: "addEvent",
    }),
    onSaveClick() {
      let anncId = this.tableTemplateDataObj.anncId
      let data = copyDeep(this.$refs.table.nowData);
      if (data.editing) {
        let pass = this.checkRequire(data);
        if (!pass)return
      }
      data.editing = !data.editing;
      let payload = {
        index: this.index,
        data: data,
        anncId: anncId,
      };
      this.aSetRelation(payload);
    },
    cancelRelation(){
      let content = ""
      if (this.anncInfos.length == 0){
        content = `是否解绑事件${this.eventSelectIndex + 1}与公告${this.index + 1}的关联关系？该事件仅关联一个公告，解绑后事件也将被删除`
      }else{
        content = `是否解绑事件${this.eventSelectIndex + 1}与公告${this.index + 1}的关联关系？`
      }
			this.$hMsgBox.confirm({
				isOkLeft:true,
				title: '解除关联',
        content: content,
        onOk: () => {
          let body = {
            eventId: this.eventInfo.eventId,
            anncId: this.anncInfos[this.index].anncId,
            index: this.index,
          }
          if (this.eventList.length == 1) {
            // 最后一个事件逻辑
            body.callback = () => {
              if (this.isFromEventList){
                this.$store.commit("DEL_TAB", this.$route.path);
                this.$router.push("/riskWarning/publishEvents/list");
              }else{
                let anncId = this.anncInfo.anncId || "";
                this.aAddEvent({anncId: anncId});
              }
            };
          } else {
            body.callback = () => {
              this.$emit("changeLock", 0, this.eventInfo.eventId);
            };
          }
          this.unBindRelation(body)
        }
      })

    },
    checkRequire(data) {
      let pass = true;
      for (let i = 0; i < this.tableTemplate.length; i++) {
        let item = this.tableTemplate[i];
        let { required, fieldCode, fieldName } = item;
        if (item.required) {
          let value = data[fieldCode];
          if (!value) {
            this.$hMessage.warning({ content: fieldName + ":请输入必填字段" });
            pass = false;
            break;
          }
        }
      }
      return pass;
    }
  }
};
</script>
<style lang="scss" scoped>
.heder {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-top: 12px;
  .a-tag{
    display: flex;
    align-items: center;
    .down-icon{
      width: 20px;
    }
  }
}
.handleHeader {
  display: flex;
  color: #666;
  font-size: 12px;
  align-items: center;
  justify-content: space-between;
  // padding-top: 10px;
  padding-bottom: 10px;
  .leftBc {
    display: flex;
  }
  span {
    margin-right: 20px;
  }
  .current-remark{
    color: red;
    font-size: 14px;
    font-weight: 600;
    padding: 0 10px;
  }
}
</style>
