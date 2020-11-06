<template>
  <div id="detailBox" :class="pdfInfo.processTypeCode == 4 || pdfInfo.processTypeCode == 5 ? '':'noBtn'">
    <windowDrag leftW="50%">
      <div class="box-left-content" slot="left">
        <ul id="pdfBox">
          <li class="input-box">
            <span>公告链接：</span>
            <span>
              <a :title="pdfInfo.linkAddress" v-if="pdfInfo.linkAddress" :href="pdfInfo.linkAddress"
                 target="_blank">{{ pdfInfo.linkAddress }}</a>
					 		<a v-else :title="downloadMd5Url" :href="downloadMd5Url">{{ downloadMd5Url }}</a>
					 	</span>
            <!--<h-input style="width:90%;display: inline-block;" v-model="formData.linkUrl" placeholder="请输入..."></h-input>-->
          </li>
          <li class="input-box">
            <span>公告标题：</span>
            <span :title="pdfInfo.title" class="input-box-title">{{ pdfInfo.title ? pdfInfo.title : '-' }}</span>
          </li>
          <li class="input-box">
            <span>公告内容：</span>
            <template v-if="extensionShow">
              <h-button type="info" @click="reloadPdfFn">加载文件</h-button>
            </template>
            <template v-else>
              -
            </template>
          </li>
          <template v-if="extensionShow">
            <iframe ref="pdfIframeInfo" name="pdfIframe" :src="iframeUrl" width="100%" :height="maxTableHeight-50"
                    frameborder="0"></iframe>
          </template>
        </ul>
      </div>
      <div class="box-right-content" slot="right">
        <div class="productList" v-for="(itemArr,index) in tableTemplateData">
          <TableTemplate :viewPage="true" :isAdd="false" :templateData="tableTemplate"
                         v-model="tableTemplateData[index]" :onTitle="onTableName">
          </TableTemplate>
        </div>
        <div class="saveBox">
          <!--0未处理，1处理中，2已发布，3已下架， 4已下架 5已删除-->
          <h-button disabled type="ghost" v-if="pdfInfo.processTypeCode == 4">已下架</h-button>
          <h-button disabled v-if="pdfInfo.processTypeCode == 5">已删除</h-button>
        </div>
      </div>
    </windowDrag>
  </div>
</template>
<script>
import {mapState, mapActions} from "vuex";
import windowDrag from '@/components/windowDrag';
import TableTemplate from '../components/table';

export default {
  components: {windowDrag, TableTemplate},
  data() {
    return {
      taskId: '',
      pdfUrl: '',
      tableTemplate: [],
      tableTemplateData: [],//模板字段
      templateDetail: {},//模板信息
      pdfInfo: {
        anncMd5: '',
        anncType: '',
        linkAddress: '',
        title: '',
        processTypeCode: '',
        templateId: '',
        extension: ''
      },
      tableData: [],
      reuiredName: '',
      disabledBtn: false,
      downUrlIsAllowFrame: false, // html 是否支持内嵌
    }
  },
  computed: {
    ...mapState(['maxTableHeight']),
    // 是否支持 iframe 展示 pdf 或者 可内嵌 html
    extensionShow() {
      let type = this.pdfInfo.extension.toLocaleLowerCase();
      return type === 'pdf' || (this.downUrlIsAllowFrame && ['htm', 'html', 'shtml'].includes(type))
    },
    // iframe 显示链接
    iframeUrl () {
      let type = this.pdfInfo.extension.toLocaleLowerCase();
      return ['htm', 'html', 'shtml'].includes(type) && this.downUrlIsAllowFrame ? this.pdfInfo.linkAddress : this.pdfUrl
    },
    // md5 下载链接
    downloadMd5Url() {
      return `/resource/pdf/${this.pdfInfo.anncMd5}`
    },
  },
  methods: {
    onTableName(str) {
      if (this.$refs.pdfIframeInfo.contentWindow.goSearch) {
        this.$refs.pdfIframeInfo.contentWindow.goSearch(str);
      }
    },
    reloadPdfFn() {
      window.parent.frames.pdfIframe.location.reload();
    },
    // 校验html 是否支持iframe
    checkAllowFrame(url) {
      return this.$http.get('/tm/pic/audit/anncData/getAnncResHeaders', {
        params: {
          url: url
        }
      }).then((res) => {
        let responseData = res.data
        if (responseData.status === this.$api.SUCCESS) {
          let headers = responseData.body.headers.map(item => item.name);
          this.downUrlIsAllowFrame = !headers.includes('X-Frame-Options');
        }
      })
    },
    getDetailData() {
      this.$http.get('/pic/audit/anncData/getAnncDetail?taskId=' + this.taskId).then(async (res) => {
        let data = res.data;
        if (data.status === this.$api.SUCCESS) {
          let obj = data.body || {};
          this.templateDetail = obj.tmplInfoDTO || {}; //模板信息
          this.tableTemplateData = obj.anncDataItemList || [];
          //模板数据信息
          let list = this.templateDetail.groupList || [];
          this.$set(this, 'tableTemplate', list);
          //模板字段信息
          let {anncMd5, anncType, linkAddress, title, processTypeCode, templateId, extension, anncId} = obj;
          if (['htm', 'html', 'shtml'].includes(extension.toLocaleLowerCase())) {
            await this.checkAllowFrame(linkAddress)
          }
          this.pdfInfo = {anncMd5, anncType, linkAddress, title, processTypeCode, templateId, extension, anncId};
          this.pdfUrl = '../../../../static/pdf/web/viewer.html?file=' + encodeURIComponent('/resource/pdf/' + anncMd5);
        } else {
          this.$hMessage.error({content: data.msg})
        }
      }).catch(err => {
          this.$hLoading.error();
        })
    },
    onChangeInput(arr) {
      this.tableData = arr;
    },
  },
  mounted() {
    this.taskId = this.$route.query.taskId;
    this.getDetailData();
  }
}

</script>

<style scoped>
#detailBox >>> .right {
  padding-bottom: 42px;
  position: relative;
}

.productList {
  padding: 10px;
  border: 1px solid #ccc;
  margin: 5px;
}

#detailBox {
  height: 100%;
}

.box-left-content {
  min-width: 350px;
  height: 100%;
}

.box-right-content {
  height: 100%;
  overflow: auto;
}

#pdfBox {
  width: 100%;
  height: 100%;
  min-width: 350px;
}

#tableBox {
  height: 100%;
  width: 98%;
  padding: 20px;
  min-width: 375px;
}

.input-box {
  margin-bottom: 7px;
}

.input-box a {
  text-decoration: none;
  color: #0076CB;
  font-size: 14px;
  width: 85%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
  position: relative;
  top: 6px;
}

.input-box .input-box-title {
  display: inline-block;
  width: 85%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  position: relative;
  top: 6px;
  cursor: pointer;
}

.saveBox {
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-top: 1px solid #dfdfdf;
  height: 42px;
  padding-top: 8px;
}

#detailBox.noBtn >>> .right {
  padding-bottom: 0;
}

#detailBox.noBtn .saveBox {
  display: none;
}
</style>
