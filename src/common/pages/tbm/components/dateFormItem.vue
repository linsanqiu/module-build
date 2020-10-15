<template>
  <span>
    <div class="dateFormItem">
      <h-form-item prop="eventTimeText" label="事件日期：" class="inputForm">
        <h-date-picker
          autoPlacement
          format="yyyy-MM-dd"
          type="date"
          :readonly="readonlyFlag"
          placeholder="请选择时间"
          v-model="nowDate.eventTimeText"
          @on-change="onChangeDatePicker"
          :disabled='pageType=="VIEW"'
        ></h-date-picker>
      </h-form-item>
    </div>
    <slot name="second"></slot>
    <div class="dateFormItem">
      <h-form-item prop="eventDateText" class="eventDateTextFormItem">
        <h-select
          autoPlacement
          :readonly="readonlyFlag"
          placeholder="请选择日期"
          v-model="nowDate.eventDateText"
          :clearable="true"
          @on-change="onEventDateTextChange"
          :disabled='pageType=="VIEW"'
        >
          <h-option v-for="item in dayTypeList" :value="item.value" :key="item.label">{{item.label}}</h-option>
        </h-select>
      </h-form-item>
    </div>
    <slot name="third"></slot>
    <div class="dateFormItem">
      <h-form-item prop="eventDateType" label="事件日期类型：">
        <h-select
          autoPlacement
          :readonly="readonlyFlag"
          placeholder="请选择日期类型"
          v-model="nowDate.eventDateType"
          :clearable="true"
          @on-change="onDateTypeChange"
          :disabled='pageType=="VIEW"'
        >
          <h-option
            v-for="item in dateTypeList"
            :value="item.value"
            :key="item.label"
          >{{item.label}}</h-option>
        </h-select>
      </h-form-item>
    </div>
  </span>
</template>

<script>
import { checkDate } from "../events/api/apiManager";
export default {
  props: {
    readonlyFlag: false,
    detailData: Object,
    srcPublishDate: String,
    changeItemFlag: Boolean,
    pageType: String,
  },
  data() {
    return {
      isChange: false,
      nowDate: {
        eventTimeText: "",
        eventDateText: "",
        eventDateType: "",
      },
      dayTypeList: [
        {
          label: "此前",
          value: "5",
        },
        {
          label: "昨日",
          value: "6",
        },
        {
          label: "上周",
          value: "7",
        },
        {
          label: "未来",
          value: "8",
        },
      ],
      dateTypeList: [
        {
          label: "历史事件",
          value: "1",
        },
        {
          label: "当前事件",
          value: "2",
        },
        {
          label: "将来事件",
          value: "3",
        },
        {
          label: "无法判断",
          value: "4",
        },
      ],
    };
  },
  methods: {
    onChangeDatePicker(value) {
      if (this.isChange || this.changeItemFlag) {
        return;
      }
      this.isChange = true;
      if (value) {
        this.nowDate.eventDateText = "";
        this.nowDate.eventTimeText = value;
        let body = {
          eventDateText: `${value} 00:00:00`,
          eventDateType: "",
          publishDate: this.srcPublishDate,
        };
        checkDate(body)
          .then((data) => {
            this.nowDate.eventDateType = data.dateType;
            this.$emit("changeDate", this.nowDate);
            this.isChange = false;
          })
          .catch((error) => {
            this.isChange = false;
            this.$hMessage.error(error.content);
          });
      } else {
        this.isChange = false;
        this.$emit("changeDate", this.nowDate);
      }
    },
    onEventDateTextChange(value) {
      if (this.isChange || this.changeItemFlag) {
        return;
      }
      this.isChange = true;
      if (value) {
        this.nowDate.eventTimeText = "";
        let body = {
          eventDateText: "",
          eventDateType: value,
          publishDate: this.srcPublishDate,
        };
        checkDate(body)
          .then((data) => {
            this.nowDate.eventDateType = data.dateType;
            this.$emit("changeDate", this.nowDate);
            this.isChange = false;
          })
          .catch((error) => {
            this.isChange = false;
            this.$hMessage.error(error.content);
          });
      } else {
        this.isChange = false;
        this.$emit("changeDate", this.nowDate);
      }
    },
    onDateTypeChange(value) {
      if (this.isChange || this.changeItemFlag) {
        return;
      }
      this.$emit("changeDate", this.nowDate);
    },
  },
  watch: {
    detailData: {
      handler(value) {
        if (value) {
          let nowDate = {
            eventTimeText: value.eventTimeText || "",
            eventDateText: value.eventDateText || "",
            eventDateType: value.eventDateType || "",
          };
          this.nowDate = nowDate;
        } else {
          this.nowDate = {
            eventTimeText: "",
            eventDateText: "",
            eventDateType: "",
          };
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped lang='scss'>
.dateFormItemBc{
  display: inline-block;
}
.dateFormItem {
  width: 49%;
  display: inline-block;
}

.dateFormItem /deep/ .h-form-item {
  margin-bottom: 5px !important;
}
.dateFormItem /deep/ .h-form-item .h-input,
.searchBox .h-form-item .h-selectTable-input {
  width: 100% !important;
}
</style>
