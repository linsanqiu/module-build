<template>
  <div class="news_labelList_box">
    <h-form-item prop="labelList" :label="itemName">
      <div class="label-list-box">
        <div class="label-btn-box">
          <SearchInput
            :changeValueKey="changeValueKey"
            :placeholder="placeholder"
            :action="action"
            :valueKey="valueKey"
            :nameKey="nameKey"
            :specKey='specKey'
            :disabled="!editing"
            @selectChange="addLabelInfoFn"
            :showKeyLabelKeyList="showKeyLabelKeyList"
            :value='item'
            ref='serchInput'
          ></SearchInput>
        </div>
      </div>
    </h-form-item>
  </div>
</template>

<script>

import SearchInput from "./searchInput";
export default {
  components: {SearchInput },
  props: {
    changeValueKey:String,
    placeholder:String,
    showKeyLabelKeyList: Array,
    valueKey: String,
    nameKey:String,
    specKey:String,
    action: String,
    itemType: {
      type: String,
      default: "",
    },
    itemName: String,
    editing: Boolean,
    index: Number,
    item:{
      type: Object,
      default: function(){
        return {}
      }
    }
  },
  computed: {
    // tagName() {
    //   if (this.itemType == "security") {
    //     return this.item.securityName || "";
    //   } else if (this.itemType == "company") {
    //     return this.item.companyName || "";
    //   }
    // },
  },
  data() {
    return {
      // tagName: '',
      // tagId: '',
      // categoryId: {
      //   security: "101109",
      //   company: "101102",
      // },
    };
  },
  methods: {
    rowClassNameFn(row, index) {
      if (this.editing) return;
      return "itemDisable";
    },
    addLabelInfoFn(item) {
      this.$emit("addLabelInfoFn", item, this.itemType, this.index);
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
.news_labelList_box{
  width: 100%;
}
.news_labelList_box .h-form-item {
  margin-bottom: 5px !important;
  margin-right: 10px;
  // display: flex;
  // align-items: center;
}
.news_labelList_box .h-form-item-content {
  // width: 100%;
}
.label-btn-box {
  margin-bottom: 5px;
}
.deleteIcon {
  color: red;
}

.itemDisable {
  color: #999 !important;
}
.itemDisable td {
  background: #f7f7f7 !important;
}
</style>