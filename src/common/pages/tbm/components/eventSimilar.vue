<template>
  <div class="similarBox">
    <div class="header">
      <h-simple-select
        placeholder="请选择"
        filterable
        @on-change="itemChange"
        v-model="businessId"
        :clearable="false"
      >
        <h-select-block :data="similarCompanyList"></h-select-block>
      </h-simple-select>
    </div>
    <div class="similarList">
      <h-table
        :loading="tableLoading"
        class="similar-table"
        size="small"
        stripe
        :columns="commonTableCols"
        maxHeight="250"
        :data="similarList"
        border
        @on-current-change="hoverChange"
        highlight-row
        rowSelectOnly
      ></h-table>
    </div>
    <h-textdiff
      leftTitle="标题(自身)："
      rightTitle="标题(当前)："
      :isShowSelect="false"
      height="32"
      :leftValue="similarItem.title || ''"
      :rightValue="selectItem.title || ''"
    ></h-textdiff>
    <h-textdiff
      leftTitle="内容(自身)："
      rightTitle="内容(当前)："
      :isShowSelect="false"
      height="190"
      :leftValue="similarItem.contentTxt || ''"
      :rightValue="selectItem.contentTxt || ''"
    ></h-textdiff>
    <div class="similarFooter">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import { getSimilarEvent } from "../api/apiManager";
import { copyDeep } from "@/filters/index";
export default {
  components: {},
  props: {
    similarCompanyList: Array,
    similarAllList:Array,
    sureSimilarPublish: Function,
    initBusinessId: String,
    allList: Array
  },
  computed: {
    similarItem() {
      if (this.similarList && this.similarList.length > 0) {
        return this.similarList[0];
      }
      return {};
    },
    selectItem() {
      if (
        this.similarList &&
        this.similarList.length > 1 &&
        this.hightIndex > 0
      ) {
        return this.similarList[this.hightIndex];
      }
      return {};
    },
  },
  data() {
    return {
      tableLoading: false,
      similarList: [],
      businessId: "",
      hightIndex: 1,
      commonTableCols: [
        {
          key: "index",
          title: "事件详情",
          width: 80,
          align: "center",
          type: "expand",
          render: (h, params) => {
            let { row, index } = params;
            let similarEventInfoList = row.similarEventInfoList || [];
            return similarEventInfoList.map((item, index) => {
              return (
                <div class="renderItem">
                  三级事件：{item.eventThirdLevelDesc || "无"}，情感方向和级别：
                  {item.sentimentDesc || "无"}
                </div>
              );
            });
          },
        },
        {
          key: "index",
          title: "资讯类型",
          width: 80,
          align: "center",
          render: (h, params) => {
            let index = params.index;
            if (index == 0) {
              return <div>本资讯</div>;
            } else {
              return <div>对比资讯</div>;
            }
          },
        },
        {
          key: "title",
          title: "相关资讯标题",
          align: "center",
        },
        {
          key: "newsId",
          title: "资讯ID",
          align: "center",
          width: 120,
        },
        {
          key: "titleSimilar",
          title: '标题相似度',
          align: "center",
          width: 85,
        },
        {
          key: "contentSimilar",
          title: "正文相似度",
          align: "center",
          width: 85,
        },
        // {
        //   key: "event",
        //   title: "相关三级事件",
        //   width: 200,
        //   align: "center",
        //   type: 'expand',
        //   render: (h, params) => {
        //     let { row, index } = params;
        //     let options = copyDeep(row.options)
        //     return (
        //       <div>
        //          <h-simple-select
        //           placeholder="请选择相关三级事件"
        //           clearable
        //           filterable
        //           on-on-change={this.eventChange.bind(this, index)}
        //         >
        //           <h-select-block data={options}></h-select-block>
        //         </h-simple-select>
        //       </div>
        //     );
        //   },
        // },
        // {
        //   key: "event",
        //   title: "情感方向和级别",
        //   width: 150,
        //   align: "center",
        // },
        {
          key: "publishDate",
          title: "公开时间",
          width: 150,
          align: "center",
          render: (h, params) => {
            let { row, index } = params;
            return index == 0 ? (
              <div>未公开</div>
            ) : (
              <div>{row.publishDate}</div>
            );
          },
        },
        {
          key: "action",
          title: "操作",
          align: "center",
          width: 100,
          render: (h, params) => {
            let { row, index } = params;
            let id = row.newsId
            if (index == 0) {
              return;
            }
            return h(
              "span",
              {
                style: {
                  cursor: "pointer",
                  color: "#298DFF",
                },
                on: {
                  click: () => {
                    this.sureSimilarPublish(() => {
                      this.handleLock(id, (res) => {
                        let detailUrl = "";
                        let openMethod = "_self";
                        if (!res) return;
                        if (res == 1) {
                          detailUrl = "/tbm/events/detail?newsId=" + id + "&ref=" + this.$md5(`${id}TBM-COMPOSE`);
                        } else if (res == 2) {
                          openMethod = "_blank";
                          detailUrl = "/tbm/events/view?newsId=" + id + "&ref=" + this.$md5(`${id}TBM-COMPOSE`);
                        }
                        window.open(detailUrl, openMethod);
                      });
                    });
                  },
                },
              },
              "公开本条并前往"
            );
            // return index == 0 ? null : (
            //   <div
            //     style='color: #298dff;cursor: pointer;'
            //     onClick={this.goDetails.bind(this, row.newsId)}
            //   >
            //     公开本条并前往处理
            //   </div>
            // );
          },
        },
      ],
    };
  },
  methods: {
    handleLock(newsId, cb) {
      let url ='/tm/event/lock?newsId='+newsId;
      this.$http
        .get(url)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            cb(1);
          } else {
            cb(2);
          }
        })
        .catch((err) => {
          cb(0);
          this.$hLoading.error();
        });
    },
    hoverChange(currentRow, oldCurrentRow, _index) {
      this.hightIndex = _index;
      if (_index == 0) {
        this.hightIndex = -1;
      } else {
        this.hightIndex = _index;
      }
    },
    goDetails(id) {
      this.sureSimilarPublish(() => {
        this.handleLock(id, (res) => {
          let detailUrl = "";
          let openMethod = "_self";
          if (!res) return;
          if (res == 1) {
            detailUrl = "/tbm/events/detail?newsId=" + id + "&ref=" + this.$md5(`${id}TBM-COMPOSE`);
          } else if (res == 2) {
            openMethod = "_blank";
            detailUrl = "/tbm/events/view?newsId=" + id + "&ref=" + this.$md5(`${id}TBM-COMPOSE`);
          }
          window.open(detailUrl, openMethod);
        });
      });
    },
    handleLock(newsId, cb) {
      let url = "/tm/event/lock?newsId=" + newsId;
      this.$http
        .get(url)
        .then((res) => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            cb(1);
          } else {
            cb(2);
          }
        })
        .catch((err) => {
          cb(0);
          this.$hLoading.error();
        });
    },
    itemChange(value) {
      this.hightIndex = 1;
      this.getSimilar(value);
    },
    getSimilar(businessId) {
      let body = {}
      for (let i = 0; i < this.similarAllList.length;i++){
        if (this.similarAllList[i].businessId == businessId){
          body = this.similarAllList[i]
        }
      }
      this.tableLoading = true;
      getSimilarEvent(body)
        .then((data) => {
          let similarEventList = data.similarEventList;
          for (let item of similarEventList) {
            item.contentTxt = this.formContentSimilarFn(item.contentTxt) || "";
          }
          this.similarList = similarEventList;
          this.tableLoading = false;
        })
        .catch((error) => {
          this.tableLoading = false;
          this.$hMessage.error(error.content);
        });
    },
    formContentSimilarFn(conSimilar) {
      if (!conSimilar) return;
      let contentStr = conSimilar.replace(/\n+/g, "\n");
      let contentArr = contentStr.split("\n");
      if (
        contentArr[contentArr.length - 1].replace(/(^\s*)|(\s*$)/g, "") == ""
      ) {
        contentArr.pop(); //去除末尾换行符
      }
      if (contentArr[0].replace(/(^\s*)|(\s*$)/g, "") == "") {
        contentArr.shift(); //去除末尾换行符
      }
      let arr = [];
      contentArr.forEach((item) => arr.push(`    ` + `${item.trim()}`));
      return (conSimilar = arr.join("\n"));
    },
  },
  mounted() {
    // this.getSimilar()
  },
  watch: {
    similarCompanyList: {
      // handler(array, oldValue) {
      //   if (array.length > 0) {
      //     let item = array[0];
      //     this.businessId = item.businessId;
      //     this.getSimilar(item.businessId);
      //   }
      // },
    },
    initBusinessId: {
      handler(value){
        this.businessId = value
        this.getSimilar(value)
      },
      immediate: true
    }
    // similarList: {
    //   handler(array) {
    //     if (array && array.length >= 2) {
    //       let item = array[1];
    //       this.$emit("changeDup", item.id);
    //     }
    //   },
    //   immediate: true,
    // },
  },
};
</script>

<style scoped lang='scss'>
.similar-table {
  text-align: left;
}
.similarBox {
  margin-bottom: 10px;
  .header {
    width: 200px;
    margin-bottom: 10px;
  }
}
.similarBox
  /deep/
  .h-textdiff
  .h-textdiff-wrapper
  .h-textdiff-content
  pre
  code {
  min-width: 1px;
  width: 100%;
  overflow: hidden;
  white-space: pre-wrap;
  padding: 0 10px;
}
.similarFooter {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
.similarBox /deep/ .renderItem:first-child {
  margin-top: 10px;
}
.similarBox /deep/ .renderItem {
  margin-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>