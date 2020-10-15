<template>
  <div class="selectContainer">
    <h-simple-select
      v-if="listCount > 0"
      :placeholder="required==1?'请选择(必填)':'请选择'"
      filterable
      @on-change="selectChange($event, 1)"
      v-model="firstValue"
      :disabled="disabled"
    >
      <h-select-block :data="firstList"></h-select-block>
    </h-simple-select>
    <h-simple-select
      v-if="listCount > 1"
      :placeholder="required==1?'请选择(必填)':'请选择'"
      filterable
      @on-change="selectChange($event, 2)"
      v-model="secondValue"
      :disabled="disabled"
    >
      <h-select-block :data="secondList"></h-select-block>
    </h-simple-select>
    <h-simple-select
      v-if="listCount > 2"
      :placeholder="required==1?'请选择(必填)':'请选择'"
      filterable
      @on-change="selectChange($event, 3)"
      v-model="thirdValue"
      :disabled="disabled"
    >
      <h-select-block :data="thirdList"></h-select-block>
    </h-simple-select>

    <!-- <h-simple-select
        :remote="remotFlag"
        :remote-method="changeQueryFn"
        :loading="loadingLabelTab"
        autoPlacement
        :readonly="readonlyFlag"
        v-if="formItemType == 'selectblock'"
        placeholder
        v-model="commonFilters[itemName]"
        filterable
        @on-change="changeSelectSource"
      >
        <h-select-block focusAllSelect :data="itemSelectList"></h-select-block>
    </h-simple-select>-->
  </div>
</template>
<script>
export default {
  props: {
    required: Number,
    value: {
      type: Array,
      default: () => {
        return [];
      }
    },
    disabled: Boolean,
    listCount: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    treeList: {
      type: Array,
      default: () => {
        return [];
      }
    }
    // oFirstList: {
    //   type: Array,
    //   default: () => {
    //     return [
    //       {
    //         label: "1111",
    //         value: "2222"
    //       }
    //     ];
    //   }
    // },
    // oSecondList: {
    //   type: Array,
    //   default: () => {
    //     return [
    //       {
    //         label: "1111",
    //         value: "2222"
    //       }
    //     ];
    //   }
    // },
    // oThirdList: {
    //   type: Array,
    //   default: () => {
    //     return [
    //       {
    //         label: "1111",
    //         value: "2222"
    //       }
    //     ];
    //   }
    // }
  },
  data() {
    return {
      oFirstList: [],
      oSecondList: [],
      oThirdList: [],
      firstValue: "",
      secondValue: "",
      thirdValue: "",
      valueDict: {},
      isChangeing: false
      // firstList: [],
      // secondList: [],
      // thirdList: [],
    };
  },
  computed: {
    firstList() {
      return this.oFirstList;
    },
    secondList() {
      let secondList = [];
      let oSecondList = this.oSecondList;
      if (this.firstValue) {
        secondList = oSecondList.filter(item => {
          return item.level1BizCode == this.firstValue;
        });
      } else {
        secondList = oSecondList;
      }
      return secondList;
    },
    thirdList() {
      let thirdList = [];
      let oThirdList = this.oThirdList;
      if (this.secondValue) {
        thirdList = oThirdList.filter(item => {
          return item.level2BizCode == this.secondValue;
        });
      } else {
        thirdList = oThirdList;
      }
      return thirdList;
    }
  },
  mounted(){
  },
  methods: {
    selectChange(value, level) {
      if (this.isChangeing) {
        return;
      }
      this.isChangeing = true;
      let item = {};
      switch (level) {
        case 1:
          // 选择1级数据（确定2级列表，确定3级列表，清空2级，3级数据
          item = this.valueDict[`${value}-1`] || {};
          if (this.valueChange && (this.thirdValue || this.secondValue)){
            break
          }
          if (value) {
            this.changeItemData(item);
          } else {
            this.secondValue = "";
            this.thirdValue = "";
          }
          break;
        case 2:
          // 选择2级数据（确定3级数据，确定3级列表，确定1级数据）
          if (this.valueChange && (this.thirdValue)){
            break
          }
          item = this.valueDict[`${value}-2`] || {};
          if (value) {
            this.changeItemData(item);
          } else {
            this.thirdValue = "";
          }
          break;
        case 3:
          // 选择3级数据（确定2级数据，确定2级列表，确定1级数据）
          item = this.valueDict[`${value}-3`] || {};
          if (value) {
            this.changeItemData(item);
          }
          break;
      }
      this.$nextTick(() => {
        this.isChangeing = false;
        this.valueChange = false;
        if (this.listCount == 2){
          this.$emit('valueChange', [this.firstValue, this.secondValue])
        }else{
          this.$emit('valueChange', [this.firstValue, this.secondValue, this.thirdValue])
        }
      });
    },
    changeItemData(item, level) {
      this.firstValue = item.level1BizCode || "";
      this.secondValue = item.level2BizCode || "";
      this.thirdValue = item.level3BizCode || "";
    },
    computedOriginalData() {
      let oFirstList = [];
      let oSecondList = [];
      let oThirdList = [];
      let valueDict = {};
      let treeList = this.treeList;
      for (let firstItem of treeList) {
        firstItem.label = firstItem.bizName;
        firstItem.value = firstItem.bizCode;
        oFirstList.push(firstItem);
        valueDict[`${firstItem.bizCode}-1`] = firstItem;
        let secondChildren = firstItem.children || [];
        for (let secondItem of secondChildren) {
          secondItem.label = secondItem.bizName;
          secondItem.value = secondItem.bizCode;
          oSecondList.push(secondItem);
          valueDict[`${secondItem.bizCode}-2`] = secondItem;
          let thirdChild = secondItem.children || [];
          for (let thirdItem of thirdChild) {
            thirdItem.label = thirdItem.bizName;
            thirdItem.value = thirdItem.bizCode;
            oThirdList.push(thirdItem);
            valueDict[`${thirdItem.bizCode}-3`] = thirdItem;
          }
        }
      }
      this.oFirstList = oFirstList;
      this.oSecondList = oSecondList;
      this.oThirdList = oThirdList;
      this.valueDict = valueDict;
      // console.log(oFirstList)
      // console.log(oSecondList)
      // console.log(oThirdList)
      // console.log(valueDict)
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.valueChange = true
        this.firstValue = value[0] || ''
        this.secondValue = value[1] || ''
        this.thirdValue = value[2] || ''
      }
    },
    treeList: {
      immediate: true,
      handler(data) {
        this.computedOriginalData();
      }
    }
  }
};
</script>
<style scoped lang='scss'>
.selectContainer{
  display: flex;
  width: 100%;
}
.selectContainer /deep/ input:disabled{
  color: #999;
}
.selectContainer /deep/ .h-selectTable-selection{
  border-radius: 0;
  border-right: 1px solid rgb(220, 225, 231);
}
</style>