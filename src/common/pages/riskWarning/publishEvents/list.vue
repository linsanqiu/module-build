<!--
 * @Author: your name
 * @Date: 2020-05-18 09:09:10
 * @LastEditTime: 2020-05-22 15:04:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /three-admin-ui/src/pages/riskWarning/violate/list.vue
--> 

<template>
  <div class="mainContent">

    <publishEventsHeader ref="searchHeader" @handleSearch="handleSearch">

      <h-button type="primary" @click="onReSetData">重置</h-button>
      <h-button type="primary" @click="handleSearch">查询</h-button>
      <h-button type="primary" @click="deleteItemList">批量删除</h-button>

      <h-tooltip placement="top-end" content="请选择是否自动刷新表格的数据!">
        <h-switch size="large" v-model="isAutoRefreshTable">
          <div slot="open">
            <span>打开</span>
          </div>
          <div slot="close">
            <span>关闭</span>
          </div>
        </h-switch>
      </h-tooltip>
    </publishEventsHeader>

    <div class="tableBox">
      <h-table
        canMove
        class="full-max-height-table"
        :maxHeight="maxTableHeight"
        size="small"
        stripe
        :columns="tablColumns"
        :data="dataList"
        :loading="tableLoading"
        @on-sort-change="handleSort"
        :highlight-row="true"
        @on-selection-change="selectChange"
        @on-select-cancel="cancelSelect"
        border
      ></h-table>


      <h-page
        highlight-row
        size="small"
        show-elevator
        show-total
        show-sizer
        placement="top"
        class="page-box"
        :total="pagination.totalSize"
        :current="pagination.currentPage"
        :page-size-opts="pageSizeOpts"
        @on-page-size-change="onPageSizeChange"
        :page-size="pagination.pageSize"
        @on-change="onPageChange"
      ></h-page>

      <div class="checkNum">{{'当前已选择 '+ selectIdArr.length+' 条'}}</div>
    </div>
  </div>
</template> 
<script>
import publishEventsHeader from "../components/publishEventsHeader";
import {
  deleteEventList,
  getPublishEventList,
} from "@/pages/riskWarning/api/apiManager";
import {
  getPublishEventLis,
  getEventIdList,
  getRiskTypeList,
  getViolateTypeList,
  judjeLockEvent,
} from "../api/apiManager";
import fastVue from '../../tbm/reportStatistics/news/fast.vue';
export default {
  name: "RiskWarningPublishEventsList",
  components: {
    publishEventsHeader,
  },
  computed: {
    maxTableHeight() {
      return this.$store.state.maxTableHeight;
    },
  },
  mounted() {
    this.getDataList();
  },
  data() {
    return {
      selectIdArr: [],
      isAutoRefreshTable: false,
      tablColumns: [//下列的标签表格
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left",
        },
        {
          key: "eventId",
          title: "事件编号",
          width: 100,
          align: "center",
          render:(h, params) => {
            let row = params.row;
            let { lockType, lockUserName, eventId} = row;
            // 0未加锁， 1其他用户，2 是本用户
            return (
              <div>
                {lockType != 0 ? (
                  <div>
                    <h-icon
                      name="person"
                      title={lockUserName ? lockUserName + "处理中" : "处理中"}
                      style={{
                        color: lockType == 2 ? "rgba(243, 222, 66, 0.97)" : "",
                      }}
                    ></h-icon>
                    {eventId}
                  </div>
                ) : (
                  <span>{eventId}</span>
                )}
              </div>
            );
          }
        },
        {
          key: "title",
          title: "公告标题",
          width: 400,
          align: "left",
          ellipsis: true,
          render: (h, params) => {//QuzjCode ...111222
            var titleArray = params.row.title.split(',');
            var titleList = [];
            for (let index = 0; index < titleArray.length; index++) {
              titleList.push(
                h('div',{
                  attrs: {
                      title: titleArray[index]
                  },
                  style: {
        　　　　　　　  overflow: 'hidden',
        　　　　　　　  textOverflow: 'ellipsis',
        　　　　　　　  whiteSpace: 'nowrap',
        　　　　　　}
                },titleArray[index])
              );
            }
              return h('div',titleList)
            // jsx语法
          },
        },
        {
          key: "latestReleaseTime",
          title: "最新公告日期",
          width: 150,
          align: "left",
        },
        {
          key: "firstReleaseTime",
          title: "首次信息发布日期",
          width: 150,
          align: "left",
        },
        {
          key: "latestEventProcessDesc",
          title: "最新事件进程",
          width: 150,
          align: "left",
        },
        {
          key: "eventCompany",
          title: "涉及公司",
          width: 200,
          align: "left",
        },
        {
          key: "eventSecurity",
          title: "涉及证券",
          width: 200,
          align: "left",
        },
        {
          key: "anncTypeDesc",
          title: "公告类型",
          width: 200,
          align: "left",
        },
        {
          key: "admNo",
          title: "行政文号",
          width: 200,
          align: "left",
        },
        {
          key: "eventProcessCodeDesc",
          title: "事件进程",
          width: 200,
          align: "left",
        },
        {
          key: "partyName",
          title: "当事人",
          width: 150,
          align: "left",
          ellipsis: true,
          render: (h, params) => {
            let { partyName } = params.row;
            return <span title={partyName}>{partyName}</span>;
          },
        },
        {
          key: "partyNatureDesc",
          title: "当事人性质",
          width: 150,
          align: "left",
        },
        {
          key: "partyCode",
          title: "当事人编码",
          width: 150,
          align: "left",
        },
        {
          key: "vioTypeDesc",
          title: "违规类型",
          width: 150,
          align: "left",
          ellipsis: true,
          render: (h, params) => {
            let { vioTypeDesc } = params.row;
            return <span title={vioTypeDesc}>{vioTypeDesc}</span>;
          },
        },
        {
          key: "relationTypeDesc",
          title: "关联关系",
          width: 150,
          align: "left",
        },
        {
          key: "publicCompany",
          title: "关联公司",
          width: 150,
          align: "left",
        },
        {
          key: "punishOrgDesc",
          title: "处罚机构",
          width: 150,
          align: "left",
        },
        {
          key: "punishedOrgCode",
          title: "被处罚机构编码",
          width: 150,
          align: "left",
        },
        {
          key: "punishType",
          title: "处罚类型",
          width: 150,
          align: "left",
          ellipsis: true,
          render: (h, params) => {
            let { punishTypeDesc } = params.row;
            return <span title={punishTypeDesc}>{punishTypeDesc}</span>;
          },
        },
        {
          key: "currencyDesc",
          title: "处罚金额币种",
          width: 150,
          align: "left",
        },
        {
          key: "handleName",
          title: "最后处理人员",
          width: 150,
          align: "left",
        },
        {
          key: "updateTime",
          title: "最后处理时间",
          width: 150,
          align: "left",
        },
        {
          key: "operation",
          title: "操作",
          width: 130,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let { eventId, lockType, lockUserName } = params.row;
            return (
              <div class="btnContainer">
                <div onClick={this.goDetails.bind(this, eventId)} style='cursor: pointer;'>
                  <h-icon name="view" color='#298DFF'></h-icon>
                </div>
                <span
                  style="marginLeft:10px;color:#298DFF;cursor: pointer;"
                  class="iconfont icon-t-b-message"
                  onClick={this.goDetailsEdit.bind(this, eventId, lockType, lockUserName)}
                ></span>
                <div
                  onClick={this.deleteItem.bind(this, params.row)}
                  style="marginLeft:10px;cursor: pointer;"
                >
                  <h-icon name="t-b-delete" color="red"></h-icon>
                </div>
              </div>
            );
          },
        },
      ],
      dataList: [],
      tableLoading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
      },
      pageSizeOpts: [10, 20, 50, 100],
    };
  },
  methods: {
    goDetails(eventId) {
      this.$router.push({
        query: {
          eventId: eventId,
        },
        path: "view",
      });
    },
    goDetailsEdit(eventId, lockType, lockUserName) {
      if (lockType && lockType == 1) {
        this.$hMessage.error(`该任务正在被【${lockUserName}】处理！`);
        return;
      }
      judjeLockEvent({ eventId: eventId }, true)
        .then((data) => {
          if(data.activeEventIsLock){
            this.$hMessage.error(`该任务正在被【${data.lockUserName}】处理！`);
            return
          }
          let { taskId } = data;
          this.$router.push({
            query: {
              eventId: eventId,
              lock: true,
            },
            path: "details",
          });
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
        });
    },
    deleteItem(row) {
      let { eventId, title } = row;
      this.$hMsgBox.confirm({
        isOkLeft: true,
        title: "删除",
        content: `是否删除事件及其关联关系？`,
        onOk: () => {
          let body = {
            eventIds: [eventId],
          };
          deleteEventList(body)
            .then((data) => {
              this.$hMessage.info("删除成功");
              this.getDataList();
              this.selectIdArr = []
            })
            .catch((error) => {
              this.$hMessage.error(error.content);
            });
        },
      });
    },
    deleteItemList() {
      if (this.selectIdArr.length == 0) {
        this.$hMessage.warning("请先选择需要删除的事件");
      } else {
        this.$hMsgBox.confirm({
          isOkLeft: true,
          title: "删除",
          content: `共${this.selectIdArr.length}个事件，是否确认删除?`,
          onOk: () => {
            let body = {
              eventIds: this.selectIdArr,
            };
            deleteEventList(body)
              .then((data) => {
                this.$hMessage.info("删除成功");
                this.getDataList();
                this.selectIdArr = []
                this.pagination.currentPage = 1
              })
              .catch((error) => {
                this.$hMessage.error(error.content);
              });
          },
        });
      }
    },
    onReSetData(e) {
      this.$refs.searchHeader.onReSetData();
    },
    cancelSelect(selection, row) {
      //取消选择某一项
      let index = this.selectIdArr.indexOf(row.eventId);
      if (index != -1) {
        this.selectIdArr.splice(index, 1);
      }
    },
    selectChange(selection) {
      let selectArr = selection;
      let selectArrId = [];
      selectArr.forEach((item, index) => {
        selectArrId.push(item.eventId);
      });
      this.selectIdArr = selectArrId;
    },

    getDataList() {//点击查询按钮后函数，调用的子函数
      if (this.tableLoading) {
        return;
      }
      // 获取搜索条件
      this.tableLoading = true;
      let body = { ...this.$refs.searchHeader.searchData, ...this.pagination };//取到子组件中的searchData（也就是查询条件）,获取结果的数量

      getPublishEventList(body)//在apiManager.js扩展的函数，向/tm/vac/eventInfo/getEventPage发送searchData和this.pagination数据
      //返回return post(apiUrl.PUBLISH_EVENT_LIST, params（body）)
      //apiUrl是在apiUrl.js的拓展，PUBLISH_EVENT_LIST代表的是/tm/vac/eventInfo/getEventPage接口
        .then((data) => {
          let { dataList = [], totalSize } = data;
          this.tableLoading = false;
          this.dataList = dataList;//返回10条数据
          this.pagination.totalSize = totalSize;//返回所有的数据数目
        })
        .catch((error) => {
          this.tableLoading = false;
          this.$hMessage.error(error.content);
        });
    },
    handleSearch(e) {//点击查询后的事件
      this.pagination.currentPage = 1;
      this.selectIdArr = [];
      this.getDataList();
    },
    onPageSizeChange(size) {
      this.pagination.pageSize = size;
      this.selectIdArr = [];
      this.getDataList();
    },
    onPageChange(currentPage) {
      this.pagination.currentPage = currentPage;
      this.selectIdArr = [];
      this.getDataList();
    },
    handleSort(params) {
      let searchData = this.$refs.searchHeader.searchData;
      if (params.order == "normal") {
        searchData.order = 0;
        searchData.orderByWhich = "";
      } else {
        searchData.order = params.order == "asc" ? 1 : 0;
        searchData.orderByWhich = params.key;
      }
      this.handleSearch();
    },
  },
  activated() {
    if (this.isAutoRefreshTable) {
      this.getDataList();
    }
  },
};
</script>
<style lang="scss" scoped>
.mainContent /deep/ .btnContainer {
  display: flex;
  justify-content: center;
}
.tableBox{
  position: relative;
}
</style>