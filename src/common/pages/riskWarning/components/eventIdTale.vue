<template>
  <h-table :columns="tablColumns" :data='dataList'></h-table>
</template>
<script>
export default {
  data() {
    return {
      tablColumns: [
          {
          key: "status",
          title: "事件处理状态",
          width: 100,
          align: "center"
        },
        {
          key: "dealTime",
          title: "处理时间",
          width: 100,
          align: "center"
        },
         {
          key: "dealUser",
          title: "处理人员",
          width: 100,
          align: "center"
        },
        {
          key: "eventId",
          title: "事件编号",
          width: 100,
          align: "center"
        },
        {
          key: "company",
          title: "涉及公司",
          width: 200,
          align: "left",
          sortable: "custom"
        },
        {
          key: "bond",
          title: "涉及证券",
          width: 200,
          align: "left",
          sortable: "custom"
        },
        {
          key: "title",
          title: "公告标题",
          width: 200,
          align: "left",
          sortable: "custom"
        },
      
        {
          key: "party",
          title: "当事人",
          width: 150,
          align: "left",
          sortable: "custom"
        },       
        {
          key: "punishType",
          title: "处罚类型",
          width: 150,
          align: "left",
          sortable: "custom"
        },
        {
          key: "operation",
          title: "操作",
          width: 130,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let id = params.row.id;
            return (
              <div class="btnContainer">
                <div onClick={this.goDetails.bind(this, id)}>
                  <h-icon name="view"></h-icon>
                </div>
                <div
                  onClick={this.deleteItem.bind(this, params.row)}
                  style="marginLeft:10px"
                >
                  <h-icon name="t-b-delete" color="red"></h-icon>
                </div>
              </div>
            );
          }
        }
      ],
      dataList: [],
    };
  },
  methods:{
      
  }
};
</script>
<style scoped lang='scss'>
</style>>