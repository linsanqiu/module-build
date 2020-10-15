<template>
  <div class="modalContant">
    <!-- <div
      v-for="(item, index) in showRemarkList"
      :key="index"
      class="desContent"
    >{{`${item.updateTime} ${item.handleUserName} ${item.remark}`}}</div>
    <div v-if="showRemarkList.length == 0" class="noData">暂无数据</div> -->
    <h-table size="small" :maxHeight="320" class="full-max-height-table" :columns="columns" :data="showRemarkList" :highlight-row="false" border></h-table>
  
  </div>
</template>


<script>
export default {
  props: {
    remarkList: Array
  },
  data() {
    return {
      columns: [
        {
					key: "handleUserName",
					title: "处理人",
					align: "center",
        },
        {
					key: "handleBeginTime",
					title: "开始时间",
					align: "center",
        },
        {
					key: "handleEndTime",
					title: "结束时间",
					align: "center",
        },
        {
					key: "timePeriod",
					title: "处理时长",
          align: "center",
          render: (h, params) => {
            let row = params.row
            return(
              <span>{`${row.timePeriod}秒`}</span>
            )
          }
        },
         {
					key: "action",
					title: "操作",
          align: "center",
          render: (h, params) => {
            let row = params.row
            return(
              <span>公开</span>
            )
          }
				},
      ]
    };
  },
  methods: {},
  mounted() {},
  computed: {
    showRemarkList() {
      return this.remarkList;
    }
  }
};
</script>
<style lang='scss' scoped>
.desContent {
  padding: 10px;
  box-sizing: border-box;
}
.modalContant {
  width: 100%;
  max-height: 400px;
  overflow: auto;
}
.noData {
  padding: 10px;
  text-align: center;
}
</style>