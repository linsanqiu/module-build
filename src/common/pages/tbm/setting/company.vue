<template>
  <div>
    <div class="title">提示：请将多个企业编号换行输入</div>
    <div class="textAreaContainer">
      <h-input
        type="textarea"
        v-model="textValue"
        :autosize="{minRows: 10,maxRows: 20}"
        style="width: 500px;margin-right: 20px"
      ></h-input>
      <h-button type="primary" @click="companySync" :loading='loading'>同步</h-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      textValue: "",
      loading: false
    };
  },
  computed: {
    valueList() {
      let snsArr = this.textValue.split(/[(\r\n)\r\n]+/);
      snsArr.forEach((item, index) => {
        if (!item) {
          snsArr.splice(index, 1); //删除空项
        }
      });
      return snsArr;
    }
  },
  methods: {
    companySync() {
      this.loading = true
      let url = "/datasync/companyTempSync";
      this.$http
        .post(url, this.valueList)
        .then(res => {
          this.loading = false
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            this.$hMessage.info("同步成功");
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch(error => {
          this.loading = false
          this.$hMessage.error(error.content);
        });
    }
  }
};
</script>
<style scoped>
.title{
    font-size: 18px;
    padding-bottom: 10px;
    padding-top: 10px;
}
.textAreaContainer {
  /* display: flex; */
  /* min-height: 500px; */
}
</style>