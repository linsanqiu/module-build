<template>
  <div class="detail">
    <ul>
      <li>标题</li>
      <li>{{ detail.title }}</li>
    </ul>
    <ul>
      <li>新闻模板</li>
      <li>{{ detail.newsTemplateName }}</li>
    </ul>
    <ul>
      <li>创建时间</li>
      <li>{{ detail.createTime }}</li>
    </ul>
    <ul>
      <li>更新时间</li>
      <li>{{ detail.updateTime }}</li>
    </ul>
    <ul>
      <li>是否推送</li>
      <li>{{ detail.pushStatusName }}</li>
    </ul>
    <ul>
      <li>是否预上线</li>
      <li>{{ detail.newsStatusName }}</li>
    </ul>
    <ul>
      <li>摘要</li>
      <li>{{ detail.summary }}</li>
    </ul>
    <ul>
      <li>正文</li>
      <li>
        <div v-html="detail.content"></div>
      </li>
    </ul>
    <ul>
      <li>数据模板</li>
      <li>
        <div v-html="detail.dataTemplateName"></div>
      </li>
    </ul>
    <ul>
      <li>数据ID</li>
      <li>
        <div v-html="detail.dataId"></div>
      </li>
    </ul>
    <ul>
      <li>数据JSID</li>
      <li>
        <div v-html="detail.dataJsid"></div>
      </li>
    </ul>
    <ul>
      <li>资讯更新次数</li>
      <li>
        <div v-html="detail.updateCount"></div>
      </li>
    </ul>
      <ul>
      <li>是否删除</li>
      <li>
        <div>{{detail.isDel== 1?'是': '否'}}</div>
      </li>
    </ul>
    <ul>
      <li>标签信息：</li>
      <li>
        <div>
          <!-- <p v-if="desc">事件：{{desc}}</p>
          <p
            v-if="detail.label && detail.label.childLabelList && detail.label.childLabelList.length > 0"
          >
            标签：
            <span
              class="tab"
              v-for="(item, k) in detail.label.childLabelList"
            >{{ item.value +'('+ item.categoryName +')' }}</span>
          </p>-->
          <p v-if="desc">事件：{{desc}}</p>
          <p
            v-if="detail.label && detail.label.childLabelList && detail.label.childLabelList.length > 0"
          >
            标签：
            <span
              class="tab"
              v-for="(item, k) in detail.label.childLabelList"
            >{{ item.value +'('+ item.categoryName +')' }}</span>
          </p>
        </div>
      </li>
    </ul>
    <h-spin fix v-if="isLoading">
      <h-icon name="load-c" size="18" class="h-load-loop"></h-icon>
      <div>加载中...</div>
    </h-spin>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "RobotwritingNewsDetail",
  data() {
    return {
      id: "",
      detail: {},
      isLoading: false,
      pushStatus: ["待推送", "已推送", "推送失败"],
      newsStatus: ["否", "是"],
      desc: ""
    };
  },
  methods: {
    getDetail() {
      this.isLoading = true;
      let url = "/tm/mw/newsInfo/detail?newsId=" + this.id;
      this.$http
        .get(url)
        .then(res => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            let data = oTmp.data || {};
            data.pushStatusName = this.pushStatus[data.pushStatus];
            data.newsStatusName = this.newsStatus[data.newsStatus];
            this.detail = data;
          } else {
            this.$hMessage.error(oTmp.msg);
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
          this.$hMessage.error("网络错误，获取资讯详情失败");
        });
    },
    init() {
      let { id } = this.$route.query;
      if (id == this.id) return;
      this.id = id;
      this.getDetail();
    }
  },
  mounted() {
    this.init();
  },
  activated: function() {
    this.init();
  },
  watch: {
    detail() {
      if (this.detail.label) {
        let {
          emotionDirection = {},
          emotionLevel = {},
          eventType = {},
          childLabelList = []
        } = this.detail.label;
        if (eventType.name) {
          this.desc = `${eventType.name || ""} (${emotionDirection.name ||
            ""} ${emotionLevel.name || ""}) `;
        }
      }
    }
  }
};
</script>
<style type="text/css" scoped>
.detail {
  position: relative;
  padding-bottom: 20px;
}
ul {
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  display: flex;
  width: 100%;
  align-items: center;
}
li {
  padding: 8px;
}
ul:nth-child(1) {
  border-top: 1px solid #ccc;
}
ul li:nth-child(1) {
  width: 100px;
  text-align: right;
  font-weight: 600;
}
ul li:nth-child(2) {
  flex: 1;
  border-left: 1px solid #ccc;
  min-height: 34px;
}
.tab {
  display: inline-block;
  border-radius: 3px;
  padding: 2px 5px;
  background: #dfdfdf;
  margin-right: 5px;
}
</style>