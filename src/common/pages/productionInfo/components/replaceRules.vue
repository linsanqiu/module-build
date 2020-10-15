<template>
  <div class="ruleContent">
    <h-form inline :model='rule' ref='replaceForm' :rules="modulesRule">
      <!-- <h-form-item prop='name'>
        <h-select clearable filterable placeholder='请选择'>
          <h-option
            v-for="item in selectOptions"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</h-option>
        </h-select>
      </h-form-item> -->
      <h-form-item>
        <div>{{rule.fieldName}}：</div>
      </h-form-item>
      <h-form-item prop='oldStr'>
        <h-input v-model='rule.oldStr' placeholder='请输入' :disabled='disabled'></h-input>
      </h-form-item>
      <h-form-item>
        <div>替换为</div>
      </h-form-item>
      <h-form-item prop='newStr'>
        <h-input v-model='rule.newStr' placeholder='请输入' :disabled='disabled'></h-input>
      </h-form-item>
      <h-form-item v-if='!disabled'>
        <slot name='deleteBtn'></slot>
      </h-form-item>
    </h-form>
  </div>
</template>
<script>
export default {
  props: {
    // selectOptions: Array,
    rule: Object,
    disabled: Boolean,
    index: Number
  },
  data() {
    return {
      modulesRule:{
        oldStr: [{ required: true, message: "请输入", trigger: "blur" }],
        newStr: [{ required: true, message: "请输入", trigger: "blur" }],
      }
    };
  },
  methods:{
    checkForm(){
      this.$refs['replaceForm'].validate((valid) => {
        if (valid) {
          return true
        }else{
          return false
        }
      });
    }
  }
};
</script>
<style scoped lang='scss'>
.ruleContent {
//   padding: 10px;
//   border: 1px solid #dfdfdf;
}
</style>