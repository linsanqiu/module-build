<!--
 * @Author: your name
 * @Date: 2020-05-18 09:09:10
 * @LastEditTime: 2020-05-26 17:45:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /three-admin-ui/src/pages/riskWarning/violate/list.vue
--> 

<template>
  <div class="mainContent">
    <searchHeader ref="searchHeader">
      <h-button type="primary" @click="onReSetData">重置</h-button>
      <h-button type="primary" @click="handleSearch">查询</h-button>
      <h-button type="primary" @click="enterProcess">进入流程</h-button>
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
    </searchHeader>
    <div>
      <h-table
        ctrSelection
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
      <!-- <div class="checkNum">{{'当前已选择 '+ selectIdArr.length+' 条'}}</div> -->
    </div>
  </div>
</template> 
<script>
import searchHeader from "../components/searchHeader";
// import { mapState, mapActions } from 'vuex'
import {
  getViolateList,
  enterProcess as apiEnterProcess,
  lockViolate,
} from "../api/apiManager";
export default {
  name: "RiskWarningViolateList",
  components: {
    searchHeader,
  },
  computed: {
    // ...mapState('constList', ['statusList', 'involvingSecuritiesList', 'noticeTypeList', 'dealUserList', 'companyList', 'fileTypeList', 'businessTypeList', 'mediaSourceList']),
    maxTableHeight() {
      return this.$store.state.maxTableHeight;
    },
  },
  data() {
    return {
      tablColumns: [
        {
          key: "processStatus",
          title: "处理状态",
          width: 100,
          align: "left",
          sortable: "custom",
          render: (h, params) => {
            let row = params.row;
            let { lockType, processStatusDesc, lockUserName } = row;
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
                    {processStatusDesc}
                  </div>
                ) : (
                  <span>{processStatusDesc}</span>
                )}
              </div>
            );
          },
        },
        {
          key: "anncId",
          title: "公告ID",
          width: 180,
          align: "left",
        },
        {
          key: "effectiveDesc",
          title: "是否有效",
          width: 100,
          align: "left",
        },
        {
          key: "title",
          title: "公告标题",
          width: 400,
          align: "left",
          sortable: "custom",
          ellipsis: true,
          render: (h, params) => {
            // jsx语法
            return (
              <span title={params.row.title}>{params.row.title}</span>
            );
          },
        },
        {
          key: "anncCompany",
          title: "涉及公司",
          width: 150,
          align: "left",
          sortable: "custom",
        },
        {
          key: "anncSecurity",
          title: "涉及证券",
          width: 150,
          align: "left",
          sortable: "custom",
        },
        {
          key: "releaseTime",
          title: "发布时间",
          width: 150,
          align: "left",
          sortable: "custom",
        },
        {
          key: "anncTypeDesc",
          title: "公告类型",
          width: 150,
          align: "left",
          sortable: "custom",
        },
        {
          key: "mediaSource",
          title: "媒体出处",
          width: 150,
          align: "left",
          sortable: "custom",
        },
        {//QzjCode
          key: "downUrl",
          title: "链接地址",
          width: 150,
          align: "left",
          ellipsis: true,
          sortable: "custom",
          render: (h, params) => {
            // jsx语法
            return (
            <a title={params.row.downUrl} href={params.row.downUrl} target="_blank">{params.row.downUrl}</a>
            );
          },
        },
        {
          key: "extension",
          title: "文件格式",
          width: 150,
          align: "left",
          sortable: "custom",
        },
        {
          key: "createTime",
          title: "任务创建时间",
          width: 150,
          align: "left",
          sortable: "custom",
        },
        {
          key: "handleName",
          title: "处理人",
          width: 150,
          align: "left",
          sortable: "custom",
        },
        {
          key: "handleTime",
          title: "最后处理时间",
          width: 150,
          align: "left",
          sortable: "custom",
        },
        {
          key: "operation",
          title: "操作",
          width: 130,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let {taskId, lockType, lockUserName } = params.row;
            return (
              <div class='btnContainer'>
                <div onClick={this.goDetailsView.bind(this, taskId)} style='cursor: pointer;'>
                  <h-icon name="view" color='#298DFF'></h-icon>
                </div>
                <span
                  style="marginLeft:10px;color:#298DFF;cursor: pointer;"
                  class="iconfont icon-t-b-message"
                  onClick={this.goDetails.bind(
                    this,
                    taskId,
                    lockType,
                    lockUserName
                  )}
                ></span>
              </div>
            );
          },
        },
      ],
      dataList: [],
      tableLoading: false,
      isAutoRefreshTable: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
      },
      pageSizeOpts: [10, 20, 50, 100],
    };
  },
  mounted() {
    this.initView();
  },
  methods: {
    // ...mapActions('constList', {

    // }),
    initView() {
      this.getDataList();
    },
    getDataList() {
      this.tableLoading = true;
      let body = { ...this.$refs.searchHeader.searchData, ...this.pagination };
      getViolateList(body)
        .then((data) => {
          this.tableLoading = false;
          this.dataList = data.dataList;
          this.pagination.totalSize = data.totalSize;
        })
        .catch((error) => {
          this.tableLoading = false;
          this.$hMessage.error(error.content);
        });
    },
    enterProcess(e) {
      apiEnterProcess({})
        .then((data) => {
          this.$router.push({
            query: {
              offset: data.offset,
              taskId: data.taskId,
              lock: true
            },
            path: "details",
          });
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
        });
    },
    onReSetData(e) {
      this.$refs.searchHeader && this.$refs.searchHeader.restData();
    },
    handleSearch(e) {
      this.pagination.currentPage = 1;
      this.getDataList();
    },
    onPageSizeChange(size) {
      this.pagination.pageSize = size;
      this.getDataList();
    },
    onPageChange(currentPage) {
      this.pagination.currentPage = currentPage;
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
    goDetailsView(taskId) {
      this.$router.push({
        query: {
          taskId: taskId,
        },
        path: "view",
      });
    },
    goDetails(taskId, lockType = "", lockUserName = "") {
      if (lockType && lockType == 1) {
        this.$hMessage.error(`该任务正在被【${lockUserName}】处理！`);
        return;
      }
      let body = {
        taskId: taskId,
      };
      lockViolate(body)
        .then((data) => {
          this.$router.push({
            query: {
              taskId: taskId,
              lock: true,
            },
            path: "details",
          });
        })
        .catch((error) => {
          this.$hMessage.error(error.content);
        });
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
</style>