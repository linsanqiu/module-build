<template>
  <div class="ruleContent">
    <h-edit-gird
      v-if="!disabled"
      :columns="columns"
      :data="dataList"
      :showEditInput="true"
      ref="editGird"
      :canMove="false"
      size="small"
    ></h-edit-gird>
    <h-table v-if="disabled" :columns="viewColumns" :data="dataList" size="small" border></h-table>
    <h-button
      type="info"
      style="width:100%;margin-top:20px"
      @on-click="addVerify"
      v-if="!disabled"
    >+</h-button>
  </div>
</template>
<script>
export default {
  props: {
    selectOptions: Array,
    dataList: Array,
    disabled: Boolean,
  },
  data() {
    return {
      viewColumns: [
        {
          key: "verifyNotice",
          title: "提示文案",
          align: "left",
        },
        {
          key: "verifyExp",
          title: "表达式",
          align: "left",
        },
      ],
      columns: [
        {
          type: "text",
          key: "verifyNotice",
          title: "提示文案",
          align: "left",
          rule: { required: true, message: "请输入" },
        },
        {
          type: "text",
          key: "verifyExp",
          title: "表达式",
          align: "left",
          rule: { required: true, message: "请输入" },
        },
        {
          key: "operation",
          title: "操作",
          width: 150,
          align: "center",
          render: (h, params) => {
            let { index, row } = params;
            let {} = row;
            return (
              <div class="btnContainer">
                <div class="btn2" onClick={this.deleteVerify.bind(this, index)}>
                  删除
                </div>
              </div>
            );
          },
        },
      ],
      tablColumns: [
        {
          key: "title",
          title: "字段",
          width: 150,
          align: "left",
        },
        {
          key: "text",
          title: "提示文案",
          align: "left",
        },
        {
          key: "operation",
          title: "操作",
          width: 150,
          align: "center",
          render: (h, params) => {
            let { index, row } = params;
            let {} = row;
            return (
              <div class="btnContainer">
                <div class="btn" onClick={this.editVerify.bind(this, index)}>
                  编辑
                </div>
                <div class="btn2" onClick={this.deleteVerify.bind(this, index)}>
                  删除
                </div>
              </div>
            );
          },
        },
      ],
      modalShow: false,
      formData: {
        name: "",
        type: "",
        verificationRule: "",
        relation: "",
        specialValue: "",
      },
      editIndex: 0,
    };
  },
  watch: {},
  methods: {
    addVerify() {
      let allData = this.$refs.editGird.getAllData();
      this.$emit("addVerify", {}, allData);
    },
    deleteVerify(index) {
      this.$hMsgBox.confirm({
        title: "提示",
        content: "确定删除该条校验吗？",
        onOk: () => {
          let allData = this.$refs.editGird.getAllData();
          this.$emit("deleteVerify", index, allData);
        },
        onCancel: () => {},
      });
    },
    editVerify(index) {
      this.modalType = 2;
      this.modalShow = true;
      this.editIndex = index;
    },
    checkTable(callback) {
      this.$refs.editGird.validate((pass) => {
        if (pass) {
          let allData = this.$refs.editGird.getAllData();
          callback(true, allData);
        } else {
          callback(false);
        }
      });
    },
  },
};
</script>
<style scoped lang='scss'>
.ruleContent {
  //   padding: 10px;
  //   border: 1px solid #dfdfdf;
}
.ruleContent /deep/ .btnContainer {
  display: flex;
  justify-content: center;
  width: 100%;
  .btn,
  .btn2 {
    color: #298dff;
    cursor: pointer;
  }
  .btn2 {
    margin-left: 10px;
  }
}
</style>