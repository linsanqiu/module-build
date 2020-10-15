<template>
  <section class="noticeWrapBox" style="position: relative;">
    <search-form>
      <ul slot="content">
        <li>
          <dl>
            <dt>发布时间：</dt>
            <dd>
              <h-date-picker
                type="daterange"
                format="yyyy-MM-dd"
                :placeholder="placeholders.publishDateRange"
                :value="publishDateRange"
                v-model="publishDateRange"
                @on-change="onChangeDateRangePicker"
              ></h-date-picker>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>处理状态：</dt>
            <dd>
              <h-select
                multiple
                collapseTags
                placeholder="请选择处理状态"
                v-model="searchData.processTypeList"
              >
                <h-option
                  v-for="(item, i) in handleStatusList"
                  :value="item.entryValue"
                  :key="item.entryValue"
                >{{item.entryName}}</h-option>
              </h-select>
            </dd>
          </dl>
        </li>

        <li>
          <dl>
            <dt>涉及证券：</dt>
            <dd>
              <simgleSearch
                valueKey="productInnerCode"
                action="/hos-api/pic/product/queryLike"
                v-model="searchData.anncSecurity"
                :showKeyLabelKeyList="['productInnerCode', 'productCode', 'productName']"
                placeholder="请选择涉及证券"
                empty
                multiple
                isCheckAll
              ></simgleSearch>
              <!-- <h-simple-select :widthAdaption="true"  placeholder="请选择涉及证券" icon="android-close" loadingText="加载中"  :loading="loadingSearchLabelSecurity" loading-text="搜索关键字查询" :remote-method="remoteMethodSecurity" remote filterable v-model="searchData.anncSecurity">
								<h-select-block :data="selectBaseDataSecurity"></h-select-block>
              </h-simple-select>-->
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>公告类别：</dt>
            <dd>
              <h-select
                multiple
                collapseTags
                placeholder="请选择公告类别"
                v-model="searchData.anncTypeList"
              >
                <h-option
                  v-for="(item, i) in noticeTypeList"
                  :value="item.entryValue"
                  :key="item.typeCode"
                >{{item.entryName}}</h-option>
              </h-select>
            </dd>
          </dl>
        </li>
        <li class="row0"></li>
        <li class="row2">
          <dl>
            <dt>链接地址：</dt>
            <dd>
              <h-input
                placeholder="请输入链接地址"
                v-model="searchData.linkAddress"
                @on-enter="onChangeInputEnter(`taskId`)"
                icon="android-close"
                @on-click="shitClearableClick(`linkAddress`)"
              ></h-input>
            </dd>
          </dl>
        </li>

        <li>
          <dl>
            <dt>涉及公司：</dt>
            <dd>
              <h-select
                placeholder="请选择涉及公司"
                icon="android-close"
                loadingText="加载中"
                :loading="loadingSearchLabel"
                loading-text="搜索关键字查询"
                :remote-method="remoteMethod"
                remote
                filterable
                v-model="searchData.anncCompany"
                widthAdaption
                autoPlacement
                multiple
                showBottom
                :isCheckall="allCheckDict['anncCompany']"
                @on-query-change="queryChange($event, 'anncCompany')"
                multClearable
              >
                <h-option
                  v-for="item in selectBaseDataCategory"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</h-option>
              </h-select>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>处理人：</dt>
            <dd>
              <h-select filterable placeholder="请选择处理人" v-model="searchData.processor">
                <h-option
                  v-for="(item, i) in processingUserList"
                  :value="item.id"
                  :key="item.id"
                >{{item.realName}}</h-option>
              </h-select>
            </dd>
          </dl>
        </li>
        <li class="row0"></li>
        <li class="row2">
          <dl>
            <dt>媒体出处：</dt>
            <dd>
              <simgleSearch
                :special="'1'"
                valueKey="dsCode"
                action="/tm/pic/audit/anncInfo/getmediaSource"
                v-model="searchData.mediaSourceList"
                :showKeyLabelKeyList="['dsNewsColumns']"
                placeholder="请选择涉及证券"
                empty
                multiple
                isCheckAll
              ></simgleSearch>
              <!-- <h-simple-select
                showBottom
                isSelectFilter
                :isCheckall="allCheckDict['mediaSourceList']"
                multiple
                collapseTags
                placeholder="请选择媒体出处"
                filterable
                v-model="searchData.mediaSourceList"
                @on-query-change="queryChange($event, 'mediaSourceList')"
              >
                <h-select-block :data="sourceList"></h-select-block>
              </h-simple-select>-->
            </dd>
          </dl>
        </li>
        <li class="row0"></li>
        <li class="row2">
          <dl>
            <dt>公告标题：</dt>
            <dd>
              <h-input
                placeholder="请输入公告标题"
                v-model.trim="searchData.title"
                @on-enter="onChangeInputEnter(`title`)"
                icon="android-close"
                @on-click="shitClearableClick(`title`)"
              ></h-input>
            </dd>
          </dl>
        </li>

        <li>
          <dl>
            <dt>文件格式：</dt>
            <dd>
              <h-select placeholder="请选择文件格式" v-model="searchData.extension">
                <h-option
                  v-for="(item, i) in fileTypeList"
                  :value="item.entryName"
                  :key="item.entryValue"
                >{{item.entryName}}</h-option>
              </h-select>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>业务类型：</dt>
            <dd>
              <h-select
                multiple
                collapseTags
                placeholder="请选择业务类型"
                v-model="searchData.bizTypeList"
              >
                <h-option
                  v-for="(item, i) in businessTypeList"
                  :value="item.entryValue"
                  :key="item.entryValue"
                >{{item.entryName}}</h-option>
              </h-select>
            </dd>
          </dl>
        </li>
        <li class="search-wrapper-but">
          <h-button type="primary" data-ref="init-btn" @click="handleSearch">查询</h-button>
          <h-button
            v-if="activeRoutersButton.indexOf('pro_delBatchBtn') != -1"
            type="primary"
            data-ref="init-btn"
            @click="handleDeleteBatch"
          >批量删除</h-button>
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
        </li>
      </ul>
    </search-form>
    <div class="tab-box tag-relotion-tab-box">
      <h-table
        class="full-max-height-table"
        :maxHeight="maxTableHeight"
        size="small"
        stripe
        :columns="commonTableCols"
        @on-sort-change="handleSortFn"
        @on-selection-change="selectChange"
        @on-select-cancel="cancelSelect"
        :data="commonTableDatas"
        :loading="tableLoading"
        :highlight-row="true"
        @on-row-dblclick="handleDbclick"
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
        :total="total"
        :current="pagination.pageNo"
        :page-size-opts="pageSizeOpts"
        @on-page-size-change="onPageSizeChange"
        :page-size="pagination.pageSize"
        @on-change="onPageChange"
      ></h-page>
      <div class="checkNum">{{'当前已选择 '+ selectIdArr.length+' 条'}}</div>
    </div>
  </section>
</template>

<script>
import utils from "@/utils/index";
import { mapState, mapActions } from "vuex";
import simgleSearch from "../components/simgleSearch";
import { judjeLock } from "../api/apiManager";
const TODAY = utils.getToday();
export default {
  name: "ProductionInfoNoticeDataList",
  components: { simgleSearch },
  data() {
    return {
      activeRoutersButton: this.$store.state.activeRoutersButton, //控制按钮权限
      isAutoRefreshTable: true,
      selectIdArr: [], //table选中项
      changePageflag: false,
      handleArr: [],
      bigDataCategory: [],
      bigDataSecurity: [],
      selectBaseDataCategory: [], //获取多维查询下拉列表项
      selectBaseDataSecurity: [], //获取多维查询下拉列表项
      publishDateRange: ["", ""],
      processingUserList: [], //处理人列表
      handleStatusList: [], //任务处理状态
      noticeTypeList: [], //公告数据类型
      businessTypeList: [], //业务类型
      fileTypeList: [], //文件类型
      sourceList: [], //媒体出处
      placeholders: {
        publishDateRange: "开始日期 - 结束日期",
        publishDate: "请输入发布日期",
      },
      searchData: {
        title: "",
        anncCompany: [],
        anncSecurity: [],
        startTime: "",
        endTime: "",
        linkAddress: "",
        extension: "",
        processor: "",
        processTypeList: [],
        mediaSourceList: [],
        anncTypeList: [],
        bizTypeList: [],
      },
      loadingText: "加载中",
      loadingSearchLabel: false,
      loadingSearchLabelSecurity: false,
      tableLoading: false,
      pagination: {
        pageNo: 1,
        pageSize: 10,
      },
      pageSizeOpts: [10, 20, 50, 100],
      total: 0,
      commonTableCols: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "center",
        },
        {
          key: "processType",
          title: "处理状态",
          width: 100,
          align: "left",
          sortable: "custom",
          render: (h, params) => {
            let handleStatusData = null;
            //							//0未处理，1处理中，2已发布，3已下架，4已删除
            if (
              (params.row.processTypeCode == 0 ||
                params.row.processTypeCode == 1 ||
                params.row.processTypeCode == 2) &&
              params.row.taskLockType
            ) {
              handleStatusData = [
                h("Icon", {
                  props: {
                    name: "person",
                  },
                  style: {
                    //任务锁状态(0未加锁，1其他用户持有锁，2本用户持有锁)
                    color:
                      params.row.taskLockType == "2"
                        ? "rgba(243, 222, 66, 0.97)"
                        : "",
                  },
                  attrs: {
                    title: `${params.row.lockUserName || ""}处理中`,
                  },
                }),
                h("span", params.row.processType),
              ];
            } else {
              handleStatusData = [h("span", params.row.processType)];
            }
            return h("div", handleStatusData);
          },
        },
        {
          key: "title",
          title: "公告标题",
          width: 300,
          align: "left",
          sortable: "custom",
        },
        {
          key: "anncCompany",
          title: "涉及公司",
          width: 200,
          align: "center",
          sortable: "custom",
        },
        {
          key: "anncSecurity",
          title: "涉及证券",
          width: 200,
          align: "center",
          sortable: "custom",
        },
        {
          key: "releaseDate",
          title: "发布时间",
          width: 150,
          align: "left",
          sortable: "custom",
        },
        {
          key: "anncType",
          title: "公告类别",
          width: 120,
          align: "center",
          sortable: "custom",
        },
        {
          key: "bizType",
          title: "业务类型",
          width: 100,
          align: "center",
          sortable: "custom",
        },
        {
          key: "mediaSource",
          title: "媒体出处",
          width: 150,
          align: "left",
          sortable: "custom",
        },
        {
          key: "linkAddress",
          title: "链接地址",
          width: 300,
          align: "left",
          sortable: "custom",
        },
        {
          key: "extension",
          title: "文件格式",
          width: 100,
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
          width: 120,
          align: "left",
          sortable: "custom",
        },
        {
          key: "handleTime",
          title: "处理完成时间",
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
            let btnList = [
              {
                operateDesc: "查看",
                operateType: 1,
              },
              {
                operateDesc: "编辑",
                operateType: 2,
              },
              {
                operateDesc: "删除",
                operateType: 3,
              },
              {
                operateDesc: "下架",
                operateType: 4,
              },
              {
                operateDesc: "上架",
                operateType: 5,
              },
              {
                operateDesc: "恢复",
                operateType: 6,
              },
            ];
            let links = btnList.map((obj, i) => {
              let { operateDesc: desc, operateType: type } = obj;
              let operateUrl = ``;
              let routerPath = ``;
              let btnCon = ``;
              let taskId = params.row.taskId;
              let showBtn = false;
              switch (type) {
                //0未处理，1处理中，2已发布，4已下架   5已删除
                //0未加锁，1其他用户持有锁，2本用户持有锁
                case 1:
                  operateUrl = ``;
                  routerPath = `/productionInfo/noticeData/view`;
                  btnCon = `icon-view`;
                  showBtn =
                    this.activeRoutersButton.indexOf("pro_viewBtn") != -1
                      ? true
                      : false;
                  break;
                case 2:
                  operateUrl = ``;
                  routerPath = `/productionInfo/noticeData/detail`;
                  btnCon = `icon-t-b-message`;
                  showBtn =
                    this.activeRoutersButton.indexOf("pro_editBtn") != -1 &&
                    (params.row.processTypeCode == 0 ||
                      params.row.processTypeCode == 1 ||
                      params.row.processTypeCode == 2)
                      ? true
                      : false;
                  break;

                case 3:
                  operateUrl = ``;
                  routerPath = `/pic/audit/anncInfo/deleteAnncInfo`;
                  btnCon = `icon-t-b-delete`;
                  showBtn =
                    this.activeRoutersButton.indexOf("pro_delBtn") != -1 &&
                    params.row.processTypeCode !== 2 &&
                    params.row.processTypeCode !== 5 &&
                    params.row.taskLockType != 1
                      ? true
                      : false;
                  break;
                case 4:
                  operateUrl =
                    "/pic/audit/anncData/lowerAnncDetail?taskId=" + taskId;
                  routerPath = ``;
                  btnCon = `icon-t-b-movedown`;
                  showBtn =
                    this.activeRoutersButton.indexOf("pro_offBtn") != -1 &&
                    params.row.processTypeCode == "2" &&
                    params.row.taskLockType != 1
                      ? true
                      : false;
                  break;
                case 5:
                  operateUrl =
                    "/pic/audit/anncInfo/upShelfAnncInfo?taskId=" + taskId;
                  routerPath = ``;
                  btnCon = `icon-t-b-return`;
                  showBtn =
                    this.activeRoutersButton.indexOf("pro_recoverBtn") != -1 &&
                    params.row.processTypeCode == "4" &&
                    params.row.taskLockType != 1
                      ? true
                      : false;
                  break;
                case 6:
                  operateUrl =
                    "/pic/audit/anncInfo/recoverAnncInfo?taskId=" + taskId;
                  routerPath = ``;
                  btnCon = `icon-t-b-return`;
                  showBtn =
                    this.activeRoutersButton.indexOf("pro_recoverDelBtn") !=
                      -1 && params.row.processTypeCode == "5"
                      ? true
                      : false;
                  break;
              }
              if (showBtn) {
                return h("span", {
                  attrs: {
                    "data-url": operateUrl,
                    "data-type": type,
                    title: desc,
                  },
                  style: {
                    color: type == 3 ? "#F5222D" : "#298DFF",
                  },
                  class: [btnCon, "iconfont", "tab-icon-btn"],
                  on: {
                    click: (e) => {
                      if (type == 1 || type == 2) {
                        let taskId = params.row.taskId || "";
                        if (type == 1) {
                          this.$router.push({
                            path: routerPath,
                            query: { taskId: params.row.taskId },
                          });
                        } else {
                          let body = {
                            taskId: taskId,
                          };
                          judjeLock(body)
                            .then((data) => {
                              this.$router.push({
                                path: routerPath,
                                query: { taskId: params.row.taskId },
                              });
                            })
                            .catch((error) => {
                              this.$hMessage.error(error.content);
                            });
                        }
                      }
                      if (type == 3) {
                        this.$hMsgBox.confirm({
                          title: "删除",
                          content: "确定要删除：" + params.row.title + "?",
                          onOk: () => {
                            let taskIdArr = taskId.split();
                            this.handleDelete(taskIdArr);
                          },
                        });
                      }
                      if (type == 4) {
                        this.$hMsgBox.confirm({
                          title: "下架",
                          content: "确定要下架：" + params.row.title + "?",
                          onOk: () => {
                            this.handleOffDelRecover(operateUrl, desc);
                          },
                        });
                      }
                      if (type == 5) {
                        this.$hMsgBox.confirm({
                          title: "上架",
                          content: "确定要恢复上架：" + params.row.title + "?",
                          onOk: () => {
                            this.handleOffDelRecover(operateUrl, desc);
                          },
                        });
                      }
                      if (type == 6) {
                        this.$hMsgBox.confirm({
                          title: "恢复",
                          content: "确定要恢复：" + params.row.title + "?",
                          onOk: () => {
                            this.handleOffDelRecover(operateUrl, desc);
                          },
                        });
                      }
                    },
                  },
                });
              }
            });
            return h("div", links);
          },
        },
      ],
      commonTableDatas: [],
      allCheckDict: {
        anncCompany: false,
        mediaSourceList: false,
      },
    };
  },

  methods: {
    remoteMethod(query) {
      if (query !== "") {
        let timeoutflag = null;
        if (timeoutflag != null) {
          clearTimeout(timeoutflag);
        }
        this.loadingSearchLabel = true;
        timeoutflag = setTimeout(() => {
          this.getCategoryLabelList(query, "selectBaseDataCategory", [
            "101102101",
          ]);
        }, 100);
      } else {
        this.selectBaseDataCategory = [...this.bigDataCategory];
      }
    },
    // remoteMethodSecurity(query) {
    //   if (query !== "") {
    //     let timeoutflag = null;
    //     if (timeoutflag != null) {
    //       clearTimeout(timeoutflag);
    //     }
    //     this.loadingSearchLabelSecurity = true;
    //     timeoutflag = setTimeout(() => {
    //       this.getCategoryLabelList(query, "selectBaseDataSecurity", [
    //         "101109112",
    //       ]);
    //     }, 100);
    //   } else {
    //     this.selectBaseDataSecurity = [...this.bigDataSecurity];
    //   }
    // },
    onChangeInputEnter(type = ``) {},
    onChangeDateRangePicker(values) {
      this.publishDateRange = values;
      this.searchData.startTime = values[0];
      this.searchData.endTime = values[1];
    },
    getHandleUser() {
      let url = "/tm/news/handleuserlist?newsType=" + this.searchData.newsType;
      this.$http
        .get(url)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            this.handleArr = data.data || [];
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    getCategoryLabelList(searchName, listType, categoryId) {
      let url = "/tagid/queryTagsByTagValueLikeList";
      this.$http
        .post(url, {
          category_id_list: categoryId,
          page_num: 1,
          page_size: 20,
          tag_value: searchName,
        })
        .then((res) => {
          let obj = res.data.return_value || {};
          let selectBaseDataCategory = obj.records || [];
          const list = selectBaseDataCategory.map((item) => {
            let labelName = item.tag_value || "";
            if (listType == "selectBaseDataSecurity") {
              if (item.inner_code) {
                labelName = item.inner_code + "-" + item.tag_value;
                if (item.business_code) {
                  labelName =
                    item.inner_code +
                    "-" +
                    item.business_code +
                    "-" +
                    item.tag_value;
                }
              }
            }
            return {
              value: item.business_id,
              label: labelName,
            };
          });
          if (listType == "selectBaseDataCategory") {
            this.bigDataCategory = [...list];
            this.loadingSearchLabel = false;
          } else {
            this.bigDataSecurity = [...list];
            this.loadingSearchLabelSecurity = false;
          }
          this[listType] = [...list];
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    handleSortFn(params) {
      if (params.order == "normal") {
        this.searchData.order = 0;
        this.searchData.orderByWhich = "";
      } else {
        this.searchData.order = params.order == "asc" ? 1 : 0;
        this.searchData.orderByWhich = params.key;
      }
      this.handleSearch();
    },
    selectChangePlus(type, typeParent) {
      this[type].forEach((item, i) => {
        if (item.typeCode == this.searchData[type]) {
          this.searchData[typeParent] = item.parentTypeCode;
        }
      });
    },
    getSubdivide(listName, code) {
      let url = "/tm/business/gettypepluslist?code=" + code;
      this.$http
        .get(url)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            this[listName] = data.body.typeList;
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    shitClearableClick(type = ``) {
      this.searchData[type] = ``;
    },
    onPageChange(current) {
      this.changePageflag = true;
      this.pagination.pageNo = current;
      this.getInfoList();
    },
    onPageSizeChange(size) {
      this.pagination.pageSize = size;
      this.getInfoList();
    },
    /**获取资讯列表--查询按钮**/
    handleSearch() {
      this.selectIdArr = [];
      this.changePageflag = false;
      this.pagination.pageNo = 1;
      this.getInfoList();
    },
    /**获取资讯列表**/
    getInfoList() {
      this.tableLoading = true;
      if (!this.tableLoading) return;
      let url = "/pic/audit/anncInfo/getAnncInfoPage";
      this.$http
        .post(url, { ...this.searchData, ...this.pagination })
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            let commonTableDatas = data.body.items || [];
            this.total = data.body.total;
            commonTableDatas.forEach((item, i) => {
              //0未处理，1处理中，2已发布，3已下架， 4已下架 5已删除
              if (item.processTypeCode == 4 || item.taskLockType == 1) {
                item["_disabled"] = true;
              }
            });
            this.commonTableDatas = [...commonTableDatas];
            if (this.changePageflag) {
              this.commonTableDatas.forEach((item, i) => {
                if (this.selectIdArr.indexOf(item.taskId) != -1) {
                  item["_checked"] = true;
                }
                if (item.processTypeCode == 4 && item.taskLockType == 1) {
                  item["_disabled"] = true;
                }
              });
            } else {
              this.selectIdArr = [];
            }
            /**缓存查询条件,处理页查询下一条**/
            sessionStorage.setItem(
              "searchDataEvents",
              JSON.stringify({ ...this.searchData, ...this.pagination })
            );
          } else {
            this.$hMessage.error({ content: data.msg });
          }
          this.tableLoading = false;
        })
        .catch((err) => {
          this.$hLoading.error();
          this.tableLoading = false;
        });
    },
    handleLock(taskId, cb) {
      let url = "/pic/audit/anncData/lock?taskId=" + taskId;
      this.$http
        .get(url)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            cb(true);
          } else {
            this.$hMessage.error({ content: data.msg });
            cb(true);
          }
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    cancelSelect(selection, row) {
      //取消选择某一项
      let index = this.selectIdArr.indexOf(row.taskId);
      if (index != -1) {
        this.selectIdArr.splice(index, 1);
      }
    },
    selectChange(selection) {
      let selectArr = selection;
      let selectArrId = [];
      selectArr.forEach((item, index) => {
        selectArrId.push(item.taskId);
      });
      if (this.changePageflag) {
        //翻页选择
        if (selectArr.length == 0) {
          //翻页——全选取消选择
          this.commonTableDatas.forEach((item, i) => {
            let index = this.selectIdArr.indexOf(item.taskId);
            if (index != -1) {
              this.selectIdArr.splice(index, 1);
            }
          });
          return;
        }
        let newSelectIdArr = this.selectIdArr.concat(selectArrId);
        this.selectIdArr = Array.from(new Set(newSelectIdArr));
      } else {
        //未翻页选择
        this.selectIdArr = selectArrId;
      }
    },
    /**批量删除资讯列表**/
    handleDeleteBatch() {
      if (this.selectIdArr.length == 0) {
        this.$hMessage.warning("请选择要删除的公告");
        return;
      }
      this.$hMsgBox.confirm({
        title: "批量删除",
        content: "共" + this.selectIdArr.length + "条公告，是否确认删除?",
        onOk: () => {
          this.handleDelete(this.selectIdArr);
        },
        onCancel: () => {},
      });
    },
    handleOffDelRecover(operateUrl, tip) {
      this.$http
        .get(operateUrl)
        .then((res) => {
          let data = res.data ? res.data : {};
          if (data.status == this.$api.SUCCESS) {
            if (data.body.resultCode == 1) {
              this.$hMessage.info({
                content: tip + "成功",
                duration: 3,
              });
              this.handleSearch();
            } else {
              this.$hMessage.error({ content: data.body.resultMsg });
            }
          } else {
            this.$hMessage.error({
              content: data.msg,
              duration: 3,
            });
          }
        })
        .catch((err) => {});
    },
    handleDelete(taskId) {
      let url = "/pic/audit/anncInfo/deleteAnncInfo";
      this.$http
        .post(url, taskId)
        .then((res) => {
          let data = res.data ? res.data : {};
          if (data.status == this.$api.SUCCESS) {
            if (data.body.resultCode == 1) {
              this.$hMessage.info({
                content: "删除成功",
                duration: 3,
              });
              this.handleSearch();
            } else {
              this.$hMessage.error({ content: data.body.resultMsg });
            }
          } else {
            this.$hMessage.error({
              content: data.msg,
              duration: 3,
            });
          }
        })
        .catch((err) => {});
    },
    /**双击跳转编辑页**/
    handleDbclick(dataRow) {
      if (dataRow.processTypeCode == 0 || dataRow.processTypeCode == 1) {
        if (dataRow.processTypeCode == 1 && dataRow.taskLockType == 1) {
          this.$router.push({
            path: "/productionInfo/noticeData/view",
            query: { taskId: dataRow.taskId },
          });
        } else {
          this.$router.push({
            path: "/productionInfo/noticeData/detail",
            query: { taskId: dataRow.taskId },
          });
        }
      } else {
        this.$router.push({
          path: "/productionInfo/noticeData/view",
          query: { taskId: dataRow.taskId },
        });
      }
    },
    getUserList() {
      let url = "/pic/audit/anncInfo/handleUserList";
      this.$http
        .get(url)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            let obj = data.body || {};
            this.processingUserList = obj.handleUserList || [];
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    getSelectOption(listType, dictCode) {
      let url = "/pic/audit/sys/getDict?dictCode=" + dictCode;
      this.$http
        .get(url)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            this[listType] = data.body.dictList || [];
          } else {
            this.$hMessage.error({ content: data.msg });
          }
        })
        .catch((err) => {
          this.$hLoading.error();
        });
    },
    // getSourceList() {
    //   let url = "/pic/audit/anncInfo/getmediaSource";
    //   this.$http
    //     .get(url)
    //     .then((res) => {
    //       let data = res.data;
    //       if (data.status == this.$api.SUCCESS) {
    //         let sourceList = data.body.mediaSourceList || [];
    //         const list = sourceList.map((item) => {
    //           return {
    //             value: item.dsCode,
    //             label: item.dsNewsColumns,
    //           };
    //         });
    //         this.sourceList = list;
    //       } else {
    //         this.$hMessage.error({ content: data.msg });
    //       }
    //     })
    //     .catch((err) => {
    //       this.$hLoading.error();
    //     });
    // },
    searchDatas() {
      this.getUserList();
      this.getSelectOption("handleStatusList", "TASK_STATUS");
      this.getSelectOption("noticeTypeList", "ANNC_TYPE");
      this.getSelectOption("businessTypeList", "BIZ_TYPE");
      this.getSelectOption("fileTypeList", "EXTENSION");
      this.getCategoryLabelList("", "selectBaseDataCategory", ["101102101"]);
      //   this.getCategoryLabelList("", "selectBaseDataSecurity", ["101109112"]);
      // this.getSourceList();
      this.handleSearch();
    },
    queryChange(query, key) {
      if (query) {
        this.allCheckDict[key] = true;
      } else {
        this.allCheckDict[key] = false;
        if (this.searchData[key].length == 0) {
          this.$set(this.searchData, key, []);
        }
      }
    },
  },
  computed: {
    ...mapState(["maxTableHeight"]),
  },
  mounted() {
    this.searchDatas();
  },
  activated: function () {
    if (this.isAutoRefreshTable) {
      this.searchDatas();
    }
  },
};
</script>

<style scoped>
.noticeWrapBox >>> .h-select-selection .h-tag {
  max-width: 65%;
}
/*.tag-relotion-tab-box .h-page-options-sizer{
	position: relative;
	top: 4px;
}*/
.tag-relotion-tab-box .h-table-fixed-right-patch {
  width: 0 !important;
}
.tag-relotion-tab-box .h-table table tr {
  height: auto !important;
}
.filtrate-other-box {
  padding: 5px 15px 10px 0px;
}
.filtrate-other-box legend span {
  padding-left: 15px;
  color: #0072f5;
}
</style>
<style scoped>
.checkNum {
  position: absolute;
  bottom: 10px;
  left: 0;
  color: red;
}
.filtrate-btn {
  margin: 10px;
}
/*.filtrate-head-other li{
	margin-right: 10px;
}*/
.filtrate-head li .filtrate-btn .h-btn {
  margin-right: 5px;
  margin-top: -10px;
}
.filtrate-head li .filtrate-btn .button-arrow {
  margin-top: -10px;
}
.filtrate-head li .filtrate-btn .h-tooltip {
  position: relative;
  top: -5px;
}
.button-arrow {
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  margin-left: 5px;
}
.button-arrow-active {
  transform: rotate(180deg);
}
</style>
