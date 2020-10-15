<template>
  <div @click="UploadbtnClick">
    <label>
      <slot></slot>
    </label>
    <input type="file" @change="fileChange" ref="upload" :multiple="multiple" class="uploadClass" />
  </div>
</template>
<script>
import SparkMD5 from "spark-md5";
export default {
  name: "UploadFile",
  data() {
    return {
      md5List: [],
      fileList: [],
    };
  },
  props: {
    action: {
      type: String,
      default: ""
    },
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
    multiple:{
      type:Boolean,
      default:false,
    },
    checkSame: {
      type:Boolean,
      default:true,
    },
    beforeUpload: Function,
    uploadSuccess: Function,
    uploadError: Function
  },
  watch: {},
  created() {},
  methods: {
    UploadbtnClick: function() {
      this.$refs.upload.dispatchEvent(new MouseEvent("click"));
    },
    fileChange: function(e) {
      let self = this;
      let files = [...e.target.files];
      this.fileList = files;
      if (this.beforeUpload) {
        let go = this.beforeUpload(files) || true;
        if (go) {
          self.getMd5FromFileAsync(files);
        }
      } else {
        self.getMd5FromFileAsync(files);
      }
      let upload = this.$refs.upload;
      upload.value = "";
    },
    // 计算出文件的md5值
    async getMd5FromFileAsync(files) {
      for (let file of files) {
        let md5 = await this.getMd5FromFile(file);
        this.md5List.push(md5);
      }
      this.uploadFile();
    },
    getMd5FromFile(file, i) {
      return new Promise((resove, reject) => {
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(file);
        fileReader.onload = function(e) {
          let spark = new SparkMD5();
          spark.appendBinary(e.target.result);
          let md5 = spark.end();
          resove(md5);
        };
      });
    },
    // 去重
    getExistList() {
      return new Promise((resove, reject) => {
        let existMd5List = [];
        resove(existMd5List);
      });
    },
    uploadFile() {
      let self = this;
      // 判断是否存在，去重
      self.getExistList().then(existMd5List => {
        let uploadFileList = [];
        let fileList = this.fileList;
        let md5List = this.md5List;
        for (let i = 0; i < md5List.length; i++) {
          let md5 = md5List[i];
          let index = existMd5List.indexOf(md5);
          if (index < 0) {
            uploadFileList.push(fileList[i]);
          }
        }
        self.fileList = uploadFileList;
        self.post();
      });
    },
    post() {
      let self = this
      let formData = new FormData();
      for (let file of self.fileList) {
        formData.append("files", file);
      }
      for (let key in self.data) {
        formData.append(key, self.data[key]);
      }
      let request = new XMLHttpRequest();
      request.onload = () => {
        if (request.status == 200) {
          console.log("上传成功");
          let response = JSON.parse(request.response);
          self.uploadSuccess(response);
        } else {
          self.uploadError();
        }
      };
      request.onerror = () => {
        self.uploadError();
      };
      request.open("POST", this.action);
      request.send(formData);
    }
  }
};
</script>
<style scoped>
.uploadClass {
  display: none !important;
}
</style>

