<!--
 * @Author: your name
 * @Date: 2020-05-12 17:15:07
 * @LastEditTime: 2020-05-12 17:42:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /three-admin-ui/src/pages/ai/extract/personaltest/testDetail.vue
 -->
<!--
 * @Author: your name
 * @Date: 2020-04-28 11:29:54
 * @LastEditTime: 2020-05-12 16:22:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /three-admin-ui/src/pages/ai/extract/rule/detail.vue
 -->
<template>
  <div style="height: 100%">
    <testDetailCom :isPersonal="true"></testDetailCom>
  </div>
</template>
<script>
import testDetailCom from "@/pages/ai/extract/components/testDetailCom";
export default {
  name: "ExtractPersonaltestDetail",
  components: { testDetailCom },
  data() {
    return {};
  },
  methods: {},
  mounted() {},
  activated: function() {}
};
</script>