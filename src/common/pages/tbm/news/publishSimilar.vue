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
        @on-current-change='hoverChange'
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
import NewsFormItem from "@/components/news_formItem";
export default {
  components: { NewsFormItem },
  props: {
    similarList: Array
  },
  data() {
    return {
      id: ""
    };
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
        this.hightIndex >= 0
      ) {
        return this.similarList[this.hightIndex];
      }
      return {};
    }
  },
  data() {
    return {
      hightIndex: -1,
      nowSelectIndex: -1,
      commonTableCols: [
        {
          key: "index",
          title: "序号",
          width: 80,
          align: "left",
          render: (h, params) => {
            let index = params.index;
            if (index == 0) {
              return <div>自身</div>;
            } else {
              return <div>{params.index}</div>;
            }
          }
        },
        {
          key: "handleStatus",
          title: "公开标志",
          width: 80,
          align: "left"
        },
        {
          key: "newsId",
          title: "资讯ID",
          width: 160,
          align: "left",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  cursor: "pointer",
                  color: "#298DFF"
                },
                on: {
                  click: () => {
                    let currenNewsId = this.$route.query.newsId;
                    let id = params.row.id || '-';
                    let detailUrl = "";
                    let openMethod = currenNewsId == id ? "_self" : "_blank";
                    this.handleLock(id, res => {
                      if (!res) return;
                      if (res == 1) {
                        detailUrl =
                          "/tbm/news/handle?newsId=" + id + "&isSimilar=1" + "&ref=" + this.$md5(`${id}TBM-COMPOSE`);
                      } else if (res == 2) {
                        detailUrl =
                          "/tbm/news/view?newsId=" + id + "&isSimilar=1" + "&ref=" + this.$md5(`${id}TBM-COMPOSE`);
                      }
                      window.open(detailUrl, openMethod);
                    });
                  }
                }
              },
              params.row.id || '-'
            );
          }
        },
        // {
        //   key: "title",
        //   title: "标题",
        //   align: "left"
        // },
        {
          key: "titleSimilarity",
          title: "标题相似度",
          width: 90,
          align: "left",
          render: (h, params) => {
            let titleSimilarity = "";
            if (params.row.titleSimilarity) {
              titleSimilarity =
                (params.row.titleSimilarity * 100).toFixed(0) + "%";
            }else{
              titleSimilarity = '-'
            }
            return h("span", titleSimilarity);
          }
        },
        {
          key: "contentSimilarity",
          title: "内容相似度",
          width: 90,
          align: "left",
          render: (h, params) => {
            let similarity = "";
            if (
              params.row.contentSimilarity
            ) {
              similarity =
                (params.row.contentSimilarity * 100).toFixed(0) + "%";
            }else{
              similarity = '-'
            }
            return h("span", similarity);
          }
        },
        {
          key: "pushDate",
          title: "信息发布时间",
          width: 150,
          align: "left"
        },
        {
          key: "dsSourceName",
          title: "信息来源",
          // width: 150,
          align: "left"
        },
        {
          key: "mediaSource",
          title: "媒体出处",
          width: 150,
          align: "left"
        },
        {
          key: "duplicate",
          title: "重复标识，不勾选表示与基础资讯不重复",
          align: "center",
          width: 120,
          fixed: "right",
          renderHeader:(h, params)=>{
            return (<div>
                      <div>重复标识</div>
                      <div style='color:red'>不勾选表示与</div>
                      <div style='color:red'>基础资讯不重复</div>
                    </div>)
          },
          render: (h, params) => {
            let index = params.index;
            return h("checkbox", {
              style: {
                display: index == 0 ? "none" : "block"
              },
              props: {
                value: index == this.nowSelectIndex
              },
              on: {
                'on-change': (value) => {
                  this.changeRepeat(value, params.row.id, index);
                }
              }
            });
          }
        }
      ]
    };
  },
  methods: {
    changeRepeat(value, id, index) {
      if (value) {
        this.nowSelectIndex = index;
        this.$emit('changeDup', id)
      } else {
        this.nowSelectIndex = -1;
        this.$emit('changeDup', '')
      }
    },
    handleLock(newsId, cb) {
      let url = "/tm/news/lock?newsId=" + newsId + "&type=1";
      this.$http
        .get(url)
        .then(res => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            cb(1);
          } else {
            cb(2);
          }
        })
        .catch(err => {
          cb(0);
          this.$hLoading.error();
        });
    },
    hoverChange(currentRow, oldCurrentRow, _index){
      this.hightIndex = _index
      if (_index == 0){
        this.hightIndex = -1
      }else{
        this.hightIndex = _index
      }
    },
  },
  mounted() {
  },
  watch:{
    similarList:{
      handler(array){
        if (array && array.length >= 2){
          for (let i=1;i<array.length;i++){
            let _item = array[i]
            if (_item.isSelect){
              this.hightIndex = i
              this.nowSelectIndex = i
              this.$emit('changeDup', _item.id)
              break
            }
          }
          
        }
      },
      immediate:true
    }
  }
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