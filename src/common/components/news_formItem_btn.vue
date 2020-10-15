<template>
  <div>
    <div class="butLeft">
      <h-button
        v-if="showBtns.indexOf('delete') >= 0"
        :loading="loadingArr.loadingDel"
        type="ghost"
        @click="handleDelet"
        :disabled='isTimeOut'
      >
        <h-icon color="red" name="android-delete" />删除
      </h-button>
      <h-button
        v-if="showBtns.indexOf('save') >= 0"
        :loading="loadingArr.loadingBtnSave"
        :disabled="addPublic || isTimeOut || (newsType == '1' && handleStatus == '1' && pageType =='HANDLE')"
        type="success"
        @click="handleSaveInfo(pageType)"
        
      >
        <h-icon name="android-checkbox" />保存
      </h-button>
      <h-button
        v-if="showBtns.indexOf('publish') >= 0"
        :loading="loadingArr.loadingBtnPub"
        :disabled="addPublic || isTimeOut"
        type="info"
        @click="handlePublic(pageType)"
      >
        <h-icon name="android-unlock" />公开
      </h-button>
      <h-button v-if="showBtns.indexOf('newCopyPage') >= 0" type="info" @click="handleCopyDetail">
        <h-icon name="max" />另存为
      </h-button>
    </div>
    <div class="butRight">
      <h-button
        v-if="showBtns.indexOf('overProcess') >= 0"
        type="ghost"
        @click="handleOverProcessFn"
      >
        <h-icon name="label" />结束流程
      </h-button>
      <h-button :disabled='isTimeOut' v-if="showBtns.indexOf('allLabel') >= 0" type="ghost" @click="handleAllLabelFn">
        <h-icon name="label" />一键打标
      </h-button>
      <h-button
        v-if="showBtns.indexOf('similar') >= 0 && showSimilar"
        type="ghost"
        @click="handleSimilarNews"
      >
        <h-icon name="ios-copy-outline" />相似资讯
      </h-button>
      <h-button
        v-if="showBtns.indexOf('pre') >= 0"
        type="ghost"
        :loading="loadingArr.loadingBtnPre"
        @click="handlePreId"
      >
        <h-icon name="android-arrow-back" />上一条
      </h-button>
      <h-button v-if="showBtns.indexOf('next') >= 0" type="ghost" @click="handleNextId">
        <h-icon name="android-arrow-forwar" />下一条
      </h-button>
      <h-button :disabled='isTimeOut' v-if="showBtns.indexOf('discard') >= 0" type="ghost" @click="discardFn">
        <h-icon name="android-unlock" />放弃任务
      </h-button>
      <div
        class="timerContainer"
        v-if="showBtns.indexOf('timeOut') >= 0 && overplusSecs&&overplusSecs<=180&&overplusSecs>0"
      >{{leftTime}}</div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  props: {
    newsType: String,
    handleStatus: String,
    pageType: String,
    showBtns: Array,
    loadingArr: {
      loadingBtnPre: false,
      loadingBtnNext: false,
      loadingDel: false,
      loadingBtnPub: false,
      loadingBtnSave: false
    },
    addPublic: false,
    showSimilar: false,
    overplusSecs: Number,
    isTimeOut: false,
  },
  computed: {
    leftTime() {
      let second = this.overplusSecs % 60;
      let mins = Math.floor(this.overplusSecs / 60);
      if (second < 10) {
        second = `0${second}`;
      }
      return `${mins}:${second}`;
    }
  },
  methods: {
    handleDelet() {
      this.$emit("handleDelet");
    },
    handleSaveInfo(pageType) {
      this.$emit("handleSaveInfo", pageType);
    },
    handlePublic(pageType) {
      this.$emit("handlePublic", pageType);
    },
    handlePreId() {
      this.$emit("handlePreId");
    },
    discardFn() {
      this.$emit("discardFn");
    },
    handleNextId() {
      this.$emit("handleNextId");
    },
    handleCopyDetail() {
      this.$emit("handleCopyDetail");
    },
    handleSimilarNews() {
      this.$emit("handleSimilarNews");
    },
    handleAllLabelFn() {
      this.$emit("handleAllLabelFn");
    },
    handleOverProcessFn() {
      this.$emit("handleOverProcessFn");
    },
    handleTimeOut() {
      this.$emit("handleTimeOut");
    }
  }
};
</script>

<style>
.butLeft,
.butRight {
  display: inline-block;
}
.butRight {
  float: right;
}
.butBox button {
  margin-left: 20px;
  padding: 5px 15px;
}
.timerContainer{
    font-size: 20px;
    display: inline-block;
    position: relative;
    top:4px;
    box-sizing: border-box;
    height: 32px;
    padding-left: 20px;
    padding-right: 20px;
}
.timerContainer >>> .h-progress-inner{
    background: #fff;
}
</style>