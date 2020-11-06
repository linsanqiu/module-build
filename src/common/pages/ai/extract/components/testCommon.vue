<!--
 * @Author: your name
 * @Date: 2020-05-08 16:29:59
 * @LastEditTime: 2020-05-25 09:56:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /three-admin-ui/src/pages/ai/extract/components/testCommon.vue
 -->

<template>
  <div class="test">
    <div>
      <search-form :title="name">
        <ul slot="content">
          <li>
            <dl>
              <dt>业务分组：</dt>
              <dd>
                <h-cascader :data="groupList" :change-on-select="true" v-model="req.groupId" @on-change="groupChange" :render-format="formatStrType"></h-cascader>
              </dd>
            </dl>
          </li>
          <li>
            <dl>
              <dt>测试名称：</dt>
              <dd>
                <h-input
                  v-model="req.taskName"
                  placeholder="请输入"
                  icon="android-close"
                  @on-click="shitClearableClick('taskName','req')"
                  ref="taskName"
                ></h-input>
              </dd>
            </dl>
          </li>
          <li>
            <dl>
              <dt>创建时间：</dt>
              <dd>
                <h-date-picker format="yyyy-MM-dd"  type="daterange" placeholder="选择日期" v-model="dateRange"  @on-change="dateRangeChange"></h-date-picker>
              </dd>
            </dl>
          </li>
          <li>
            <dl>
              <dt>状态：</dt>
              <dd>
                <Select v-model.trim="req.taskStatus" filterable>
                  <Option
                    v-for="(option, index) in statusList"
                    :value="option.value"
                    :key="index"
                  >{{ option.label }}</Option>
                </Select>
              </dd>
            </dl>
          </li>
          <li class="search-wrapper-but">
            <h-button type="primary" @click="onPageChange(1)">查询</h-button>
            <h-button type="primary" @click="add">新建</h-button>
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
    </div>
    <div class="table-content">
      <h-table
        size="small"
        :maxHeight="(maxTableHeight - 50)"
        class="full-max-height-table"
        :columns="table"
        :data="list"
        :highlight-row="false"
        border
      ></h-table>
      <div class="tab-box">
        <h-page
          highlight-row
          size="small"
          show-total
          show-elevator
          show-sizer
          placement="top"
          class="page-box"
          :page-size-opts="pageSizeOpts"
          :total="total"
          :current="req.currentPage"
          :page-size="req.pageSize"
          @on-change="onPageChange"
          @on-page-size-change="onPageSizeChange"
        ></h-page>
      </div>
      <h-spin fix v-if="isGetList">
        <h-icon name="load-c" size="18" class="h-load-loop"></h-icon>
        <div>加载中...</div>
      </h-spin>
    </div>
    <h-msgBox
      title="新建"
      v-model="isShowMsgBox"
      @on-close="onCloseMsgBox"
      class-name="vertical-center-modal text-file-msg"
      :top="0"
      width="620"
      height="280"
    >
      <div class="file-form">
        <h-form
          :model="submit"
          ref="submitForm"
          label-position="right"
          :label-width="120"
          :rules="modulesRule"
          @submit.native.prevent
        >
          <h-form-item label="任务所属分组：" prop="ruleConfigIdList">
             <h-cascader :data="groupDisabledList" v-model="submit.ruleConfigIdList" @on-change="submitFormGroupChange"></h-cascader>
          </h-form-item>
          <h-form-item label="任务名称：" prop="taskName">
            <h-input v-model="submit.taskName" placeholder="任务名称"></h-input>
          </h-form-item>
          <h-form-item label="文件来源：" prop="select">
            <h-select v-model="submit.fileSource" :clearable="false">
              <h-option
                v-for="(item, k) in fileSource"
                :key="k"
                :value="item.dictEntry"
              >{{ item.entryName }}</h-option>
            </h-select>
            <div class="fileSourceContent">
              <template v-if="submit.fileSource == 2">
                <template v-if="!fileUpload">
<!--                  <Upload-->
<!--                    action="/tm/extractFile/upload"-->
<!--                    name="files"-->
<!--                    :multiple="true"-->
<!--                    :show-upload-list="false"-->
<!--                    :on-error="uploadError"-->
<!--                    :uploadAll="true"-->
<!--                    :on-self-success="uploadSuccess"-->
<!--                    :before-upload="sequelHandleBeforeUpload"-->
<!--                  >-->
<!--                    <h-button type="primary">上传</h-button>-->
<!--                  </Upload>-->
                  <div>
                    <customUpload @change="inputChange" title="上传"></customUpload>
                  </div>
                </template>
                <template v-else>
                  <div>
                    <h-button type="primary">文件上传中...</h-button>
                  </div>
                </template>
                <span>已上传 {{ this.submit.fileIds.length }} 个文件</span>
              </template>
              <template v-else-if="submit.fileSource == 3">
                <h-select v-model="submit.ruleFileId" filterable>
                  <h-option
                    v-for="(item, k) in fileList"
                    :key="item.id"
                    :value="item.id"
                  >{{ item.fileName }}</h-option>
                </h-select>
              </template>
              <template v-else-if="submit.fileSource == 1">
                <h-select v-model="submit.normDataId" filterable>
                  <h-option
                    v-for="(item, k) in standard"
                    :key="item.standardId"
                    :value="item.standardId"
                  >{{ item.standardName }}</h-option>
                </h-select>
              </template>
            </div>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer" class="draggable-form-footer">
        <h-button @click="onCloseMsgBox">取消</h-button>
        <h-button type="primary" @click="onSubmit" :disabled="fileUpload">确定</h-button>
      </div>
    </h-msgBox>
    <h-msgBox
      title="设置为标准数据"
      v-model="isShowStandardBox"
      @on-close="onCloseStandardMsgBox"
      class-name="vertical-center-modal text-file-msg"
      :top="0"
      width="520"
      height="100"
    >
      <div class="file-form">
        <h-form
          :model="submitStandard"
          ref="submitStandardForm"
          label-position="right"
          :label-width="100"
          :rules="modulesStandardRule"
          @submit.native.prevent
        >
          <h-form-item label="名称：" prop="standardName">
            <h-input v-model="submitStandard.standardName" placeholder="名称"></h-input>
          </h-form-item>
        </h-form>
        <p class="tips" v-if="activeStandard && activeStandard.normDataCount >= 1">*该任务已设置为标准数据</p>
      </div>
      <div slot="footer" class="draggable-form-footer">
        <h-button @click="onCloseStandardMsgBox">取消</h-button>
        <h-button type="primary" @click="onStandardSubmit">确定</h-button>
      </div>
    </h-msgBox>
  </div>
</template>
<script>
import { copyDeep } from "@/filters/index";
import customUpload from "./customUpload";
import BMF from "browser-md5-file";
export default {
  name: "testCommon",
  props: {},
  components: {
    customUpload
  },
  data() {
    return {
      isMounted: false,
      isAutoRefreshTable: true,
      isGetList: false,
      name: "",
      total: 0,
      req: {
        createTime:"",
        createTimeEnd: "",
        taskStatus: "",
        ruleConfigId: "",
        taskName: "",
        currentPage: 1,
        pageSize: 10,
      },
      dateRange: [],
      pageSizeOpts: [10, 20, 50, 100],
      list: [],
      table: [
        {
          key: "businessGroup",
          title: "业务分组",
          width:150,
        },
        {
          key: "configName",
          title: "配置名称",
          width:150,
        },
        {
          key: "taskName",
          title: "测试名称",
        },
        {
          key: "createTime",
          title: "创建时间",
          width: 150
        },
        {
          key: "completeTime",
          title: "完成时间",
          width: 150
        },
        {
          key: "taskStatusDesc",
          title: "状态",
          width: 120
        },
        {
          title: "操作",
          width: 140,
          align: "center",
          render: (h, params) => {
            let row = params.row;
            let viewBtn, standardBtn;
            if (row.taskStatus == 2) {
              viewBtn = h("span", {
                attrs: {
                  title: "查看抽取结果"
                },
                class: ["icon-view", "iconfont", "tab-icon-btn"],
                on: {
                  click: () => {
                    this.$router.push(
                       "/extract/personaltest/detail?id=" +
                        params.row.id +
                        "&name=" +
                        row.taskName
                    )
                  }
                }
              });
            }
            let originalBtn = h("span", {
              attrs: {
                title: "查看测试规则"
              },
              class: ["icon-activity_fill", "iconfont", "tab-icon-btn"],
              on: {
                click: () => {
                  this.$router.push(
                    "/extract/personaltest/ruleView?view=" + params.row.id + ""
                  );
                }
              }
            });

            let deleteBtn = h("span", {
              attrs: {
                title: "删除"
              },
              class: ["icon-t-b-delete", "iconfont", "tab-icon-btn"],
              style: {
                color: "#F5222D"
              },
              on: {
                click: () => {
                  this.$hMsgBox.confirm({
                    title: "温馨提示",
                    content: "确定要删除：" + row.taskName + "?",
                    onOk: () => {
                      this.del(row.id);
                    }
                  });
                }
              }
            });
            return h(
              "div",
              {
                class: ["tab-operation"]
              },
              [viewBtn, originalBtn, deleteBtn]
            );
          }
        }
      ],
      page: 1,
      statusList: [
        {
          value: 1,
          label: "执行中"
        },
        {
          value: 2,
          label: "已完成"
        },
        {
          value: 3,
          label: "执行失败"
        }
      ],
      isShowMsgBox: false,
      submit: {
        id: "",
        taskName: "",
        fileSource: "2",
        fileIds: [],
        ruleFileId: "",
        normDataId: "",
        ruleConfigIdList: []
      },
      fileSource: [],
      modulesRule: {
        ruleConfigIdList: [
          { type:'array', required: true, message: "请选择", trigger: "blur" },
        ],
        taskName: [
          { required: true, message: "请输入", trigger: "blur" },
          { max: 20, message: "不可超过20个字符", trigger: "blur" }
        ]
      },
      submitStandard: {
        taskId: "",
        standardName: ""
      },
      modulesStandardRule: {
        standardName: [
          { required: true, message: "请输入", trigger: "blur" },
          { max: 20, message: "不可超过20个字符", trigger: "blur" }
        ]
      },
      fileList: [],
      maxFileSum: 100,
      maxFileAll: 1000,
      fileUpload: false,
      isShowStandardBox: false,
      isSetStandard: false,
      activeStandard: {},
      standard: [],

      //   业务分组
      groupList: [],
      // 业务分组禁止点击列表
      groupDisabledList:[]
    };
  },
  computed: {
    maxTableHeight() {
      return this.$store.state.maxTableHeight;
    }
  },
  methods: {
    // 显示最后一个
    formatStrType(labels, selectedData) {
      if (selectedData.length > 0) {
        return selectedData[selectedData.length - 1].label;
      }
      return "";
    },
    submitFormGroupChange(values){
      if (values.length > 0){
        this.submit.ruleConfigId = values[values.length-1]
        this.getStandard()
      }else{
        this.submit.ruleConfigId = ""
        this.standard = []
      }
    },
    groupChange(values){
      if (values.length > 0){
        this.req.ruleConfigId = values[values.length-1]
      }else{
        this.req.ruleConfigId = ""
      }
    },
    dateRangeChange(values){
      this.req.createTime = values[0]
      this.req.createTimeEnd = values[1]
    },
    // 获取分组列表
    getGroupList() {
      let url = "/tm/businessGroup/getTree";
      let params = {};
      this.$http.get(url, params).then(res => {
        let data = res.data;
        if (data.status == this.$api.SUCCESS) {
          let {treeList=[], treeVoList=[]} = data.body
          this.groupList = treeVoList
          this.groupDisabledList = treeList
        } else {
          this.$hMessage.error(data.msg);
        }
      });
    },
    onCloseStandardMsgBox() {
      this.isShowStandardBox = false;
      this.submitStandard = {
        taskId: "",
        dataName: ""
      };
      this.isSetStandard = false;
      this.$refs["submitStandardForm"].resetFields();
    },
    onStandardSubmit() {
      this.$refs["submitStandardForm"].validate(valid => {
        if (valid) {
          if (this.isSetStandard) return;
          this.isSetStandard = true;
          let url = "/tm/standardData/setAsStandardData?";
          let obj = copyDeep(this.submitStandard);
          for (let k in obj) {
            url += "&" + k + "=" + encodeURIComponent(obj[k]);
          }
          this.$http
            .get(url, obj)
            .then(res => {
              if (
                obj.taskId != this.submitStandard.taskId &&
                this.submitStandard.taskId != ""
              )
                return;
              let oTmp = res.data;
              if (oTmp.status == this.$api.SUCCESS) {
                this.$hMessage.success("设置标准数据成功");
                this.onCloseStandardMsgBox();
              } else {
                this.$hMessage.error(oTmp.msg);
              }
              this.isSetStandard = false;
            })
            .catch(err => {
              this.isSetStandard = false;
              this.$hMessage.error("设置标准数据失败");
            });
        }
      });
    },
    showStandard() {
      this.isShowStandardBox = true;
    },
    onCloseMsgBox() {
      this.isShowMsgBox = false;
      this.submit = {
        id: "",
        ruleConfigId: "",
        taskName: "",
        fileSource: "2",
        fileIds: [],
        ruleFileId: "",
        normDataId: ""
      };
      this.$refs["submitForm"].resetFields();
    },
    onSubmit() {
      this.$refs["submitForm"].validate(valid => {
        if (valid) {
          let submit = copyDeep(this.submit);
          if (submit.fileSource == 3 && submit.ruleFileId == "") {
            this.$hMessage.error("请选择文件");
            return;
          }
          if (submit.fileSource == 1 && submit.normDataId == "") {
            this.$hMessage.error("请选择标准数据");
            return;
          }
          if (
            submit.fileSource == 2 &&
            submit.fileIds.length == 0 &&
            submit.id == ""
          ) {
            this.$hMessage.error("请上传文件");
            return;
          }
          if (submit.fileSource == 3) {
            delete submit.fileIds;
            delete submit.normDataId;
          } else if (submit.fileSource == 2) {
            submit.fileIds = submit.fileIds.toString();
            delete submit.ruleFileId;
            delete submit.normDataId;
          } else {
            delete submit.ruleFileId;
            delete submit.fileIds;
          }
          if (this.isPOST) return;
          this.isPOST = true;
          let url = "/tm/testTask/addOrModify";
          this.$http
            .post(url, submit)
            .then(res => {
              let oTmp = res.data;
              if (oTmp.status == this.$api.SUCCESS) {
                this.onCloseMsgBox();
                this.getList(true);
              } else {
                this.$hMessage.error(oTmp.msg);
              }
              this.isPOST = false;
            })
            .catch(err => {
              this.isPOST = false;
              this.$hMessage.error("提交失败");
            });
        }
      });
    },
    // 获取文件MD5值
    codeMD5 (file) {
      return new Promise((resolve) => {
        const bmf = new BMF();
        bmf.md5(
          file,
          (err, md5) => {
            resolve(md5)
          },
          progress => {
          },
        );
      })
    },
    // 文件上传 change 事件
    async inputChange (event) {
      const files = event.target.files;
      this.fileLen = files.length;
      if(this.fileLen > this.maxFileSum){
        this.$hMessage.error({
          duration: 3,
          content: '单次上传文件数量不可以超过'+ this.maxFileSum +'个'
        });
        return;
      }
      if(this.activeFileSum + this.fileLen > this.maxFileAll){
        this.$hMessage.error({
          duration: 3,
          content: '文件总数不可以超过'+ this.maxFileAll +'个'
        });
        return;
      }
      let sizes = [];
      for (let item of files) {
        sizes.push(item.size)
      }
      if (Math.max(...sizes) > 1024 * 1024 * 200) {
        this.$hMessage.error({
          duration: 3,
          content: '单个文件大小不得超过200M!'
        });
        return;
      }
      this.fileUpload = true;
      let md5List = [];
      for (let item of files) {
        let value = await this.codeMD5(item);
        md5List.push(value.toLocaleUpperCase());
      }
      this.checkFileNeedUpload(md5List, files);
    },
    // 校验文件是否已存在资源库中
    checkFileNeedUpload (md5List, files) {
      this.$http.post('/tm/rcFile/verifyUploadFiles', {
        fileMd5s: md5List
      }).then((res) => {
        let data = res.data;
        if(data.status === this.$api.SUCCESS){
          const { repeatUploadFileMd5s } = data.body.verifyResult;
          let fileList = Object.values(files);
          let list = []
          if (repeatUploadFileMd5s.length) {
            md5List.forEach((item) => {
              if (repeatUploadFileMd5s.indexOf(item) === -1) {
                list.push(fileList[repeatUploadFileMd5s.indexOf(item)])
              }
            })
          }
          this.uploadFile(repeatUploadFileMd5s, list);
        } else {
          this.$hMessage.error('上传失败');
          this.fileUpload = false;
        }
      }).catch((err) => {
        this.$hMessage.error('上传失败');
        this.fileUpload = false;
        this.isSequelUp = false;
      })
    },
    // 上传文件
    uploadFile (repeatUploadFileMd5s, fileList) {
      let formData = new FormData();
      repeatUploadFileMd5s.forEach(md5 => {
        formData.append('repeatUploadFileMd5s', md5);
      })
      fileList.forEach(file => {
        formData.append('files', file, file.name);
      })
      this.$http.post('/tm/extractFile/upload', formData).then(res => {
        let response = res.data;
        this.fileUpload = false;
        if (response.status === this.$api.SUCCESS) {
          let data = response.body || {};
          this.submit.fileIds = [...this.submit.fileIds, ...data.idList];
          this.$hMessage.success("上传成功");
        } else {
          this.$hMessage.error(response.msg);
        }
      }).catch(() => {
        this.$hMessage.error('上传失败');
        this.fileUpload = false;
      })
    },
    sequelHandleBeforeUpload(list) {
      let fileLen = list.length;
      if (fileLen > this.maxFileSum) {
        this.$hMessage.error({
          duration: 3,
          content: "单次上传文件数量不可以超过" + this.maxFileSum + "个"
        });
        return false;
      }
      let len = this.submit.fileIds.length;
      if (len + fileLen > this.maxFileAll) {
        this.$hMessage.error({
          duration: 3,
          content: "文件总数不可以超过" + this.maxFileAll + "个"
        });
        return false;
      }
      this.fileUpload = true;
    },
    uploadSuccess(response, file, fileList) {
      this.fileUpload = false;
      if (response.status == this.$api.SUCCESS) {
        let data = response.body || {};
        this.submit.fileIds = [...this.submit.fileIds, ...data.idList];
        this.$hMessage.success("上传成功");
      } else {
        this.$hMessage.error(response.msg);
      }
    },
    uploadError() {
      this.fileUpload = false;
      this.$hMessage.error("上传失败");
    },
    add() {
      this.isShowMsgBox = true;
    },
    shitClearableClick(a, b) {
      this[b][a] = "";
      this.$refs[a].focus();
    },
    onPageChange(val) {
      this.req.currentPage = val;
      this.getList();
    },
    onPageSizeChange(size) {
      this.req.pageSize = size;
      this.onPageChange(1);
    },
    getList(goOn = false) {
      if (this.isGetList && !goOn) return;
      this.isGetList = true;
      let url = "/tm/testTask/personal/getList";
      let obj = copyDeep(this.req);
      delete obj['groupId']
      this.$http
        .post(url, obj)
        .then(res => {
          // if (obj.ruleConfigId != this.req.ruleConfigId) return;
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            let data = oTmp.body ? oTmp.body : {};
            let total = data.total || 0;
            if (total && data.records && data.records.length == 0) {
              this.req.currentPage = Math.ceil(total / this.req.pageSize);
              this.getList(true);
              return;
            }
            this.total = total;
            this.list = data.records;
            this.page = obj.currentPage;
          } else {
            this.$hMessage.error(oTmp.msg);
          }
          this.isGetList = false;
        })
        .catch(err => {
          this.isGetList = false;
          this.$hMessage.error("获取任务列表失败");
        });
    },
    getFilelist() {
      let url = "/tm/ruleFile/getRuleFiles";
      this.$http
        .get(url)
        .then(res => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            let data = oTmp.body ? oTmp.body : {};
            this.fileList = data.ruleFileList || [];
          } else {
            this.$hMessage.error(oTmp.msg);
          }
        })
        .catch(err => {
          this.$hMessage.error("获取文件列表失败");
        });
    },
    del(id) {
      if (this.isGetList) return;
      this.isGetList = true;
      let url = "/tm/testTask/remove?id=" + id;
      this.$http
        .delete(url)
        .then(res => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            this.getList(true);
            this.$hMessage.success("删除成功");
          } else {
            this.$hMessage.error(oTmp.msg);
          }
          this.isGetList = false;
        })
        .catch(err => {
          this.isGetList = false;
          this.$hMessage.error("删除失败");
        });
    },
    getFileSource() {
      // let url = "/tm/tbmDictList?dictCode=1121";
      let url = "/tm/ecc/dict/queryByCode?dictCode=1121";
      this.$http
        .get(url)
        .then(res => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            // this.fileSource = oTmp.body.tbmDictList || [];
            this.fileSource = oTmp.body.dictList || [];
          } else {
            this.$hMessage.error(oTmp.msg);
          }
        })
        .catch(err => {
          this.isGetFileList = false;
          this.$hMessage.error("获取文件来源失败");
        });
    },

    getStandard() {
      let url = "/tm/standardData/getStandard?ruleId=" + this.submit.ruleConfigId;
      this.$http
        .get(url)
        .then(res => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            this.standard = oTmp.body.standardList || [];
          } else {
            this.$hMessage.error(oTmp.msg);
          }
        })
        .catch(err => {
          this.$hMessage.error("获取标准数据列表失败");
        });
    },
    init() {
      this.req.currentPage = 1;
      this.getList();
    }
  },
  mounted() {
    this.isMounted = true;
    this.$store.commit("SAVE_TAB_NAME", {
      path: this.$route.path,
      name: "个人测试任务"
    });
    this.init();
    this.getFilelist();
    this.getFileSource();
    // this.getStandard();
    this.getGroupList()
  },
  activated: function() {
    this.isMounted = false;
    this.getFilelist();
    this.getGroupList();
    if (!this.isMounted && this.isAutoRefreshTable) {
      this.getList();
      return;
    }
  }
};
</script>
<style lang="scss" scoped>
.fileSourceContent {
  margin-top: 10px;
}
>>> .text-file-msg .h-modal-body {
  overflow-y: unset !important;
}
.table-content {
  position: relative;
}
.tips {
  color: red;
  padding-left: 100px;
}
</style>
