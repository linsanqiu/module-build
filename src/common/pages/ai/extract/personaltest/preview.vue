<!--
 * @Author: your name
 * @Date: 2020-04-28 11:29:54
 * @LastEditTime: 2020-05-13 09:47:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /three-admin-ui/src/pages/ai/extract/rule/detail.vue
 -->
<template>
  <div style="height: 100%">
    <template v-if="isInit">
      <detail :data="datas" @changeData="changeData"></detail>
    </template>
  </div>
</template>
<script>
import detail from "@/pages/ai/extract/components/detail";
export default {
  name: "ExtractPersonaltestPreview",
  components: { detail },
  data() {
    return {
      datas: {
        v: "",
        ruleConfigId: "",
        fileMd5: "",
        index: "",
        taskId: ""
      },
      isInit: false
    };
  },
  methods: {
    changeData(data) {
      this.datas = data;
    },
    init() {
      let {
        ruleConfigId,
        taskId,
        fileMd5,
        v,
        index,
        ruleId
      } = this.$route.query;
      if (taskId) {
        if (
          ruleConfigId == this.datas.ruleConfigId &&
          taskId == this.datas.taskId
        )
          return;
      } else {
        if (
          ruleConfigId == this.datas.ruleConfigId &&
          fileMd5 == this.datas.fileMd5
        )
          return;
      }
      this.datas = {
        v: v,
        ruleConfigId: ruleConfigId,
        fileMd5: fileMd5,
        index: index,
        taskId: taskId,
        ruleId: ruleId
      };
      this.isInit = true;
    }
  },
  mounted() {
    this.init();
    this.$store.commit("SAVE_TAB_NAME", {
      path: this.$route.path,
      name: "个人测试任务 - 抽取详情"
    });
  },
  activated: function() {
    this.init();
  }
};
</script>