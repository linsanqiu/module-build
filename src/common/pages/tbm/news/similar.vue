<template>
  <div class="similarBox">
    <div class="similarList">
      <h2>相似资讯列表：</h2>
      <h-table
        class="similar-table"
        size="small"
        stripe
        :columns="commonTableCols"
        maxHeight="200"
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
      :leftValue="similarItem.contentText || ''"
      :rightValue="selectItem.contentText || ''"
    ></h-textdiff>
  </div>
</template>

<script>
import { deleteNewsList } from "../api/apiManager";
export default {
  props: {
    similarList: Array,
  },
  computed: {
    similarItem() {
      if (this.similarList && this.similarList.length > 0) {
        this.id = this.similarList[0].id;
        return this.similarList[0];
      }
      return {};
    },
    selectItem() {
      if (
        this.similarList &&
        this.similarList.length > 0 &&
        this.hightIndex > 0
      ) {
        return this.similarList[this.hightIndex];
      }
      return {};
    },
  },
  data() {
    return {
      id: "",
      hightIndex: 1,
      commonTableCols: [
        {
          key: "index",
          title: "类型",
          width: 80,
          align: "center",
          fixed:"left",
          render: (h, params) => {
            let index = params.index;
            if (index == 0) {
              return <div>自身资讯</div>;
            } else {
              return <div>对比资讯</div>;
            }
          },
        },
        {
          key: "newsId",
          title: "资讯ID",
          width: 160,
          align: "center",
          render: (h, params) => {
            let {row, index} = params
            return h(
              "span",
              {
                style: {
                  cursor: "pointer",
                  color: "#298DFF",
                },
                on: {
                  click: () => {
                    if (index == 0){
                      return
                    }
                    let id = params.row.id || "-";
                    let detailUrl = "";
                    let openMethod = "_self"
                    this.handleLock(id, (res) => {
                      if (!res) return;
                      if (res == 1) {
                        detailUrl =
                          "/tbm/news/handle?newsId=" + id + "&ref=" + this.$md5(`${id}TBM-COMPOSE`);;
                      } else if (res == 2) {
                        openMethod = "_blank"
                        detailUrl =
                          "/tbm/news/view?newsId=" + id + "&ref=" + this.$md5(`${id}TBM-COMPOSE`);;
                      }
                      window.open(detailUrl, openMethod);
                    });
                  },
                },
              },
              params.row.id || "-"
            );
          },
        },
        {
          key: "handleStatus",
          title: "公开标志",
          width: 80,
          align: "center",
        },
        {
          key: "copyrightStatus",
          title: "是否有版权",
          width: 100,
          align: "center",
        },
        {
          key: "pushDate",
          title: "信息发布时间",
          width: 150,
          align: "center",
        },
        {
          key: "dsSourceName",
          title: "信息来源",
          // width: 150,
          align: "center",
        },
        {
          key: "mediaSource",
          title: "媒体出处",
          width: 150,
          align: "center",
        },

        {
          key: "contentSimilarity",
          title: "内容相似度",
          width: 90,
          align: "center",
          render: (h, params) => {
            let similarity = "";
            if (params.row.contentSimilarity) {
              similarity =
                (params.row.contentSimilarity * 100).toFixed(0) + "%";
            } else {
              similarity = "-";
            }
            return h("span", similarity);
          },
        },
        {
          key: "titleSimilarity",
          title: "标题相似度",
          width: 90,
          align: "center",
          render: (h, params) => {
            let titleSimilarity = "";
            if (params.row.titleSimilarity) {
              titleSimilarity =
                (params.row.titleSimilarity * 100).toFixed(0) + "%";
            } else {
              titleSimilarity = "-";
            }
            return h("span", titleSimilarity);
          },
        },
        {
          key: "level",
          title: "信息级别",
          width: 80,
          align: "center",
        },
        {
          key: "appName",
          title: "所属项目",
          width: 200,
          align: "center",
        },
        {
          key: "action",
          title: "操作",
          align: "center",
          width: 50,
          fixed: "right",
          render: (h, params) => {
            let { row, index } = params;
            return index==0?null:(
              <div>
                <h-icon
                  name="android-delete"
                  color="red"
                  on-on-click={this.deleteItem.bind(this, row.id, index)}
                ></h-icon>
              </div>
            );
          },
        },
      ],
    };
  },
  methods: {
    handleLock(newsId, cb) {
      let url = "/tm/news/lock?newsId=" + newsId + "&type=1";
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
    deleteItem(newsId, index) {
      this.$hMsgBox.confirm({
        isOkLeft: true,
        title: "删除资讯",
        content: "确定要删除该条资讯:" + newsId + "?",
        onOk: () => {
          this.handleDelete(newsId, index);
        },
      });
    },
    handleDelete(newsId, index) {
      let body = {
        newsIdList: [newsId],
      };
      deleteNewsList(body)
        .then((data) => {
          this.$hMessage.info({
            content: "删除成功",
            duration: 3,
          });
          this.hightIndex = 0
          this.$emit('deleteSimilarItem', {index: index})
        })
        .catch((error) => {
          this.$hMessage.error({
            content: error.content,
            duration: 3,
          });
        });
    },
  },
  mounted() {},
  watch: {
    similarList: {
      handler(array) {
        if (array && array.length >= 2) {
          let item = array[1];
          this.$emit("changeDup", item.id);
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.similar-table {
  text-align: left;
}
.similarBox h2 {
  font-size: 14px;
  padding: 5px;
  color: #495060;
}
.similarBox {
  margin-bottom: 10px;
}
.similarBox >>> .h-textdiff .h-textdiff-wrapper .h-textdiff-content pre code {
  min-width: 1px;
  width: 100%;
  overflow: hidden;
  white-space: pre-wrap;
  padding: 0 10px;
}
</style>