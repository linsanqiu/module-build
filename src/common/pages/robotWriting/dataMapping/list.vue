<!--
 * @Author: your name
 * @Date: 2020-05-21 15:58:16
 * @LastEditTime: 2020-05-27 14:39:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /three-admin-ui/src/pages/robotWriting/dataMapping/list.vue
--> 
<template>
  <div class="mainContent">
    <search-form>
      <ul slot="content">
        <li>
          <dl>
            <dt>新闻模板名称：</dt>
            <dd>
              <h-input
                placeholder="新闻模板名称"
                v-model="newsTemplateName"
                clearable
                @on-enter="handleSearch"
              ></h-input>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>对应数数据源码：</dt>
            <dd>
              <h-select clearable filterable placeholder="对应数数据源码" v-model="dataSourceCode">
                <h-option
                  v-for="(item, i) in options"
                  :value="item.value"
                  :key="item.value"
                >{{item.label}}</h-option>
              </h-select>
            </dd>
          </dl>
        </li>
        <li class="search-wrapper-but">
          <h-button type="primary" @click="handleSearch">查询</h-button>
          <h-button type="primary" @click="saveData">保存</h-button>
        </li>
      </ul>
    </search-form>
    <h-edit-gird
      :height="maxTableHeight"
      :columns="columns"
      :data="oDataList"
      :option="tableOptions"
      :showEditInput="true"
      @on-editselect-change="selectchange"
      ref="editGird"
      :loading="loading"
      :canMove="false"
    ></h-edit-gird>
    <!-- <div class="buttons">
      <h-button type="primary" @click="saveData">保存</h-button>
    </div> -->
  </div>
</template>
<script>
import { copyDeep } from "@/filters/index";
import {mapState} from "vuex";
export default {
  name: "RobotwritingDataMappingList",
  data() {
    return {
      dataSourceCode: "",
      newsTemplateName: "",
      columns: [
        {
          key: "newsTemplateName",
          title: "新闻模板名称"
        },
        {
          key: "dataSourceCode",
          title: "对应数据源码",
          transfer: true,
          multiple: false,
          type: "select"
        }
      ],
      oDataList: [],
      loading: false,
      options: [],
      tableOptions: []
    };
  },
  mounted() {
    this.initData();
  },
  computed:{
    ...mapState(['maxTableHeight'])
  },
  methods: {
    initData() {
      this.getOptionList();
      this.getDataList();
    },
    getDataList() {
      let { dataSourceCode, newsTemplateName } = this;
      this.loading = true;
      let url = "/tm/mw/dataSourceRelation/list";
      let body = {
        dataSourceCode: dataSourceCode,
        newsTemplateName: newsTemplateName
      };
      this.$http
        .post(url, body)
        .then(res => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            this.loading = false;
            // 展示数据源，原始数据源
            data.data.forEach((item, index) => {
              item["index"] = index;
              item["dataSourceCode"] = item.dataSourceCode
                ? parseInt(item.dataSourceCode)
                : "";
            });
            this.oDataList = copyDeep(data.data);
          } else {
            this.loading = false;
            this.$hMessage.error({
              content: data.msg,
              duration: 3
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$hMessage.error({
            content: "网络请求失败",
            duration: 3
          });
        });
    },
    getOptionList() {
      let url = "/tm/mw/enum/getNewsTemplateDataSourceList";
      let body = {};
      this.$http
        .get(url, body)
        .then(res => {
          let data = res.data;
          if (data.status == this.$api.SUCCESS) {
            let options = [];
            for (let item of data.data) {
              let _item = {
                label: item.name || '',
                value: item.code || ''
              };
              options.push(_item);
            }
            this.options = options;
            this.$set(this.tableOptions, 1, options);
          } else {
            this.$hMessage.error({
              content: data.msg,
              duration: 3
            });
          }
        })
        .catch(err => {
          this.$hMessage.error({
            content: "网络请求失败",
            duration: 3
          });
        });
    },
    saveData() {
      let url = "/tm/mw/dataSourceRelation/save";
      let body = this.oDataList;
      this.$http.post(url, body).then(res => {
        let data = res.data;
        if (data.status == this.$api.SUCCESS) {
          this.getDataList()
          this.$hMessage.success(`保存成功`);
        } else {
          this.$hMessage.error({
            content: data.msg,
            duration: 3
          });
        }
      });
    },
    selectchange(value, i, j) {
      // value值， i横坐标， j纵坐标
      let filterList = this.options.filter((option, index) => {
        return value == option.value;
      });
      if (filterList.length == 0){
        let item = copyDeep(this.oDataList[j]);
        let index = item.index;
        item.dataSourceName = ''
        item.dataSourceCode = ''
        this.oDataList[index] = item;
        return
      }
      let optionItem = filterList[0];
      let item = copyDeep(this.oDataList[j]);
      let index = item.index;
      item.dataSourceName = optionItem.label || '';
      item.dataSourceCode = optionItem.value || '';
      this.oDataList[index] = item;
    },
    handleSearch() {
      this.getDataList();
      //   let { oDataList, newsTemplateName, dataSourceCode } = this;
      //   if (!dataSourceCode && !newsTemplateName) {
      //     this.showDataList = oDataList;
      //     return;
      //   }
      //   this.loading = true;
      //   let filterList = oDataList.filter((item, index) => {
      //     if (dataSourceCode == "") {
      //       return item.newsTemplateName.indexOf(newsTemplateName) != -1;
      //     } else {
      //       return (
      //         item.newsTemplateName.indexOf(newsTemplateName) != -1 &&
      //         item.dataSourceCode == dataSourceCode
      //       );
      //     }
      //   });
      //   this.showDataList = filterList;
      //   this.loading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
// .buttons {
//   width: 100%;
//   position:fixed;
//   right: 0;
//   bottom: 0;
//   display: flex;
//   justify-content: flex-end;
//   margin-top: 20px;
//   z-index: 10;
//   justify-content: center;
//   align-items: center;
// }
.mainContent{
  // padding-bottom: 60px;
}
.mainContent >>>.cur-th .h-ui-newsTemplateName,  .mainContent >>>.cur-th .h-ui-dataSourceCode{
  background: #f0f3f5;
}
</style>