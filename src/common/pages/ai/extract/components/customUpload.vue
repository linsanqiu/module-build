<template>
  <div class="custom_upload">
    <input type="file"
           title=""
           @click="clearFileValue($event)"
           @change="inputChange"
           multiple>
    <h-button class="upload_btn" type="primary">{{title || '上传'}}</h-button>
  </div>
</template>

<script>
export default {
  name: "customUpload",
  props: {
    title: String
  },
  methods: {
    // 重置文件个数
    clearFileValue (event) {
      event.target.value = '';
    },
    inputChange (event) {
      this.$emit('change', event)
    }
  }
}
</script>

<style lang="scss" scoped>
.custom_upload{
  position: relative;
  display: inline-flex;
  input{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    font-size: 0;
    cursor: pointer;
    &:hover + .upload_btn{
      background-color: #0067dc;
      border-color: #0067dc;
    }
  }
}
</style>
