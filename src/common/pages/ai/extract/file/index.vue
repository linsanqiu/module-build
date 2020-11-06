<template>
	<div class="file">
		<search-form>
			<ul slot="content">
				<li>
					<dl>
						<dt>文件名称：</dt>
						<dd>
							<h-input ref="fileName" placeholder="请输入" v-model="req.fileName" icon="android-close" @on-click="shitClearableClick('fileName','req')" @on-enter="onPageChange(1)" ></h-input>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>文件来源：</dt>
						<dd>
							<h-select v-model="req.source" >
								<h-option v-for="(item, k) in fileSource" :key="item.dictEntry" :value="item.dictEntry" >
								{{ item.entryName }}
							</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>更新人：</dt>
						<dd>
							<h-select v-model="req.updaterId" filterable>
								<h-option v-for="(item, k) in changeUser" :key="k" :value="item.id" >
									{{ item.realName }}
								</h-option>
							</h-select>
						</dd>
					</dl>
				</li>
				<li class="search-wrapper-but">
					<h-button type="primary" @click="onPageChange(1)">查询</h-button>
					<h-button type="primary" @click="delAll()">批量删除</h-button>
					<h-button type="primary" v-if="activeRoutersButton.indexOf('add') != -1" @click="add" >新建</h-button>
				</li>
			</ul>
		</search-form>
		<div class="list">
			<h-table
				size="small"
				:maxHeight="maxTableHeight"
				class="full-max-height-table"
				:columns="aryHeaderData"
				:data="list"
				:highlight-row="false"
				@on-selection-change="selectionFileList"
				border>
			</h-table>
			<div class="tab-box">
				<h-page highlight-row size="small" show-elevator show-total show-sizer placement="top" class="page-box"  :page-size-opts="pageSizeOpts" :total="total" :current="req.currentPage" :page-size="req.pageSize" @on-change="onPageChange" @on-page-size-change="onPageSizeChange"></h-page>
			</div>
			<h-spin fix v-if="isGetList">
				<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
				<div>加载中...</div>
			</h-spin>
		</div>
		<h-msgBox :title="submit.id ? '编辑' : '新建'" v-model="isShowMsgBox" @on-close="onCloseMsgBox" class-name="vertical-center-modal" width="620" height="300">
			<div class="file-form">
				<h-form :model="submit" ref="submitForm" label-position="right" :label-width="100" :rules="modulesRule" @submit.native.prevent>
					<h-form-item label="文件名称："  prop="fileName">
						<h-input v-model="submit.fileName" placeholder="文件名称"></h-input>
					</h-form-item>
					<h-form-item label="文件来源：">
						<h-select v-model="submit.source" :clearable="false" :disabled="submit.id ? true : false">
							<h-option v-for="(item, k) in fileSource" :key="item.dictEntry" :value="item.dictEntry" >
								{{ item.entryName }}
							</h-option>
						</h-select>
						<div class="fileSourceContent">
							<template v-if="submit.source == 1 || submit.source == 3">
								<h-input type="textarea" :rows="4" v-model="submit.content" placeholder="请输入"></h-input>
							</template>
							<template v-else-if="submit.source == 2">
								<template v-if="fileUpload">
									<h-button type="primary">文件上传中...</h-button>
								</template>
								<template v-else>
<!--									<Upload ref="upload"-->
<!--                          action="/tm/extractFile/upload"-->
<!--                          :data="{ ruleFileId: submit.id }"-->
<!--                          :uploadAll="true" name="files"-->
<!--                          :multiple="true"-->
<!--                          :show-upload-list="false"-->
<!--                          :on-self-success="uploadSuccess"-->
<!--                          :on-error="uploadError"-->
<!--                          :before-upload="handleBeforeUpload"-->
<!--                          :on-progress="filePprogress"-->
<!--                          :mergeHook="false">-->
<!--										<h-button type="primary">上传</h-button>-->
<!--									</Upload>-->
                  <div>
                    <customUpload @change="inputChange" title="上传">
                    </customUpload>
                  </div>
									<span>已上传 {{ activeFileSum }} 个文件，本次上传 {{ this.submit.fileIds.length }} 个文件</span>
								</template>
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
		<h-msgBox title="文件列表" v-model="isShowFileList" @on-close="onCloseFileMsgBox" class-name="vertical-center-modal" :top="0" width="900">
			<div class="file-form">
				<search-form>
					<div slot="head"></div>
					<ul slot="content" class="file-list-search">
						<li>
							<dl>
								<dt>文件名：</dt>
								<dd>
									<h-input ref="fileNames" placeholder="请输入" v-model="filereq.fileName" icon="android-close" @on-click="shitClearableClick('fileName','filereq','fileNames')" @on-enter="onPageChange(1)" ></h-input>
								</dd>
							</dl>
						</li>
						<li>
							<dl>
								<dt>更新人：</dt>
								<dd>
									<h-select v-model="filereq.userId" filterable>
										<h-option v-for="(item, k) in changeUser" :key="k" :value="item.id" >
											{{ item.realName }}
										</h-option>
									</h-select>
								</dd>
							</dl>
						</li>
						<li class="search-wrapper-but">
							<h-button type="primary" @click="onfilePageChange(1)">查询</h-button>
							<template v-if="isSequelUp">
								<h-button type="primary">文件上传中...</h-button>
							</template>
							<template v-else>
<!--								<Upload ref="upload"-->
<!--                        action="/tm/extractFile/upload"-->
<!--                        :data="{ ruleFileId: filereq.ruleFileId, directFlag: true }"-->
<!--                        :uploadAll="true"-->
<!--                        name="files"-->
<!--                        :multiple="true"-->
<!--                        :show-upload-list="false"-->
<!--                        :on-self-success="sequelUploadSuccess"-->
<!--                        :on-error="uploadError"-->
<!--                        :before-upload="sequelHandleBeforeUpload">-->
<!--									<h-button type="primary">继续上传</h-button>-->
<!--								</Upload>-->
                <customUpload @change="inputChangeSequel" title="继续上传">
                </customUpload>
							</template>
						</li>
					</ul>
				</search-form>
				<h-table
					size="small"
					:maxHeight="300"
					class="full-max-height-table"
					:columns="fileHeader"
					:data="fileList"
					:highlight-row="false"
					border>
				</h-table>
				<div class="tab-box">
					<h-page highlight-row size="small" show-elevator show-total show-sizer placement="top" class="page-box" :page-size-opts="pageSizeOpts" :total="filetotal" :current="filereq.currentPage" :page-size="filereq.pageSize" @on-change="onfilePageChange" @on-page-size-change="onfilePageSizeChange"></h-page>
				</div>
				<h-spin fix v-if="isGetFileList">
					<h-icon name="load-c" size=18 class="h-load-loop" ></h-icon>
					<div>加载中...</div>
				</h-spin>
			</div>
			<div slot="footer" class="draggable-form-footer">
				<h-button @click="onCloseFileMsgBox">关闭</h-button>
			</div>
		</h-msgBox>
	</div>
</template>
<script>
import { copyDeep } from '@/filters/index'
import BMF from 'browser-md5-file'
import customUpload from '../components/customUpload'
export default {
	data() {
		return {
			activeRoutersButton: this.$store.state.activeRoutersButton,
			aryHeaderData: [
				{
					type: "selection",
					width: 60,
					align: "center",
					fixed: "center",
				},{
					title: '文件名称',
					key: 'fileName',
				},{
					title: '来源类型',
					key: 'sourceName',
				},{
					title: '更新人',
					key: 'updaterName',
				},{
					title: '更新时间',
					key: 'updateTime',
				},{
					title: '操作',
					key: 'tagName',
					width: 120,
					align: 'center',
					render: (h, params) => {
						let row = params.row;
						let btn = this.activeRoutersButton;
						let viewBtn,saveBtn,deleteBtn;
						if(row.sourceCode == '2'){
							viewBtn = h('span', {
								attrs: {
									"title": '查看文件列表',
								},
								class: [
									'icon-view',
									'iconfont',
									'tab-icon-btn'
								],
								on: {
									click: () => {
										let rows = copyDeep(row);
										this.isShowFileList = true;
										this.filereq.ruleFileId = row.id;
										this.filereq.fileName = '';
										this.filereq.userId = '';
										this.activeFileSum = this.fileSum[row.id];
										//this.$router.push('/robotwriting/datatemplate/add?id=' + params.row.id);
										this.getFileList(true)
									}
								},
							})
						}
						if(btn.indexOf('add') != -1){
							saveBtn = h('span', {
								attrs: {
									"title": '编辑',
								},
								class: [
									'icon-t-b-message',
									'iconfont',
									'tab-icon-btn'
								],
								on: {
									click: () => {
										let rows = copyDeep(row);
										this.isShowMsgBox = true;
										this.activeFileSum = this.fileSum[rows.id];
										this.submit = {
											id: row.id,
											fileName: row.fileName,
											source: row.sourceCode.toString(),
											content: row.content,
											fileIds: [],
										}
									}
								},
							})
						};
						if(btn.indexOf('delete') != -1){
							deleteBtn = h('span', {
								attrs: {
									"title": '删除',
								},
								class: [
									'icon-t-b-delete',
									'iconfont',
									'tab-icon-btn'
								],
								style:{
									color:'#F5222D'
								},
								on: {
									click: () => {
										this.$hMsgBox.confirm({
											title:'温馨提示',
											content:'确定要删除：'+ row.fileName +'?',
											onOk:()=>{
												this.del(row.id);
											}
										})
									}
								},
							})
						};
						return h('div',{
							class: [
								"tab-operation",
							],
						},[viewBtn,saveBtn,deleteBtn]);
					}
				}
			],
			list: [],
			isGetList: false,
			pageSizeOpts: [10,20,50,100],
			fileSource:[],
			req: {
				fileName: '',
				source: '',
				updaterId: '',
				currentPage: 1,
				pageSize: 10,
			},
			total: 0,
			isShowMsgBox: false,
			modulesRule:{
				fileName:[
					{ required:true, message: '请输入', trigger:'blur'},
					{ max: 20, message: '不可超过20个字符', trigger:'blur'}
				],
			},
			submit: {
				id: '',
				fileName: '',
				source: '2',
				content: '',
				fileIds: [],
			},
			isPOST: false,
			fileList: [],
			fileHeader:[
				{
					title: 'id',
					key: 'id',
					width: 160,
				},{
					title: '文件名',
					key: 'fileName',
				},{
					title: '更新人',
					key: 'updaterName',
				},{
					title: '提交时间',
					key: 'uploadTime',
					width: 145,
				},{
					title: '操作',
					width: 60,
					align: 'center',
					render: (h, params) => {
						let row = params.row;
						let btn = this.activeRoutersButton;
						let deleteBtn;
						if(btn.indexOf('delete') != -1){
							deleteBtn = h('span', {
								attrs: {
									"title": '删除',
								},
								class: [
									'icon-t-b-delete',
									'iconfont',
									'tab-icon-btn'
								],
								style:{
									color:'#F5222D'
								},
								on: {
									click: () => {
										this.$hMsgBox.confirm({
											title:'温馨提示',
											content:'确定要删除：'+ row.fileName +'?',
											onOk:()=>{
												this.delfile(row.id);
											}
										})
									}
								},
							})
						};
						return h('div',{
							class: [
								"tab-operation",
							],
						},[deleteBtn]);
					}
				}
			],
			filereq: {
				ruleFileId: '',
				currentPage: 1,
				pageSize: 10,
				fileName: '',
				userId: '',
			},
			filetotal: 0,
			isShowFileList: false,
			isGetFileList: false,
			fileLen: 0,
			fileSuccessLen: 0,
			fileUpload: false,
			// uploadList: [],
			changeUser: [],
			maxFileSum: 100,
			maxFileAll: 1000,
			activeFileSum: 0,
			isSequelUp: false,
			fileSum:{},
			selectFile:[],
		}
	},
  components: {
    customUpload
  },
	computed: {
		maxTableHeight(){ return this.$store.state.maxTableHeight },
	},
	methods: {
		selectionFileList(a,b){
			let list = this.list;
			for(let i = 0,len = list.length; i < len; i++){
				if(b.indexOf(i) != -1){
					if(this.selectFile.indexOf(list[i].id) == -1){
						this.selectFile.push(list[i].id)
					}
				}else{
					let index = this.selectFile.indexOf(list[i].id);
					if(index != -1){
						this.selectFile.splice(index,1);
					}
				}
			}
		},
		onfilePageChange(val){
			this.filereq.currentPage = val;
			this.getFileList(true);
		},
		onfilePageSizeChange(size){
			this.filereq.pageSize = size;
			this.onfilePageChange(1);
		},
		onCloseFileMsgBox(){
			this.activeFileSum = 0;
			this.filetotal = 0;
			this.filereq.ruleFileId = '';
			this.filereq.currentPage = 1;
			this.isShowFileList = false;
			this.isGetFileList = false;
		},
		getFileList(goOn = false){
			if(this.isGetFileList && !goOn && !this.filereq.ruleFileId)return;
			this.isGetFileList = true;
			let url = '/tm/extractFile/getExtractFileInfos';
			let obj = copyDeep(this.filereq);
			this.$http.post(url, obj).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.fileSum[obj.ruleFileId] = oTmp.body.total || 0;
				}
				if(obj.ruleFileId != this.filereq.ruleFileId)return;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.body ? oTmp.body : {};
					let total = data.total || 0;
					if(total && data.records && data.records.length == 0){
						this.filereq.currentPage = Math.ceil(total/this.filereq.pageSize)
						this.getFileList(true);
						return;
					}
					this.filetotal = total;
					this.fileList = data.records;
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetFileList = false;
			}).catch(err=>{
				this.isGetFileList = false;
				this.$hMessage.error('获取文件列表失败');
			})
		},
		shitClearableClick(a,b, c = null){
			this[b][a] = '';
			if(c){
				this.$refs[c].focus();
			}else{
				this.$refs[a].focus();
			}
		},
		add(){
			this.isShowMsgBox = true;
		},
		filePprogress(event, file, fileList){

		},
		sequelHandleBeforeUpload(list){
			let fileLen = list.length;
			if(fileLen > this.maxFileSum){
				this.$hMessage.error({
					duration: 3,
					content: '单次上传文件数量不可以超过'+ this.maxFileSum +'个'
				});
				return false;
			}
			if(this.activeFileSum + fileLen > this.maxFileAll){
				this.$hMessage.error({
					duration: 3,
					content: '文件总数不可以超过'+ this.maxFileAll +'个'
				});
				return false;
			}
			this.isSequelUp = true;
		},
		sequelUploadSuccess(response, file, fileList){
			this.isSequelUp = false;
			let name = 'error'
			if(response.status == this.$api.SUCCESS){
				this.getFileList(true);
				name = 'info'
			}
			this.$hMessage[name]({
				duration: 3,
				content: response.msg
			});
		},
    // 文件上传 change 事件
    async inputChangeSequel (event) {
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
      this.isSequelUp = true;
      let md5List = [];
      for (let item of files) {
        let value = await this.codeMD5(item);
        md5List.push(value.toLocaleUpperCase())
      }
      this.checkFileNeedUploadSequel(md5List, files);
    },
    // 校验文件是否已存在资源库中
    checkFileNeedUploadSequel (md5List, files) {
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
          this.uploadFileSequel(repeatUploadFileMd5s, list);
        } else {
          this.$hMessage.error('上传失败');
          this.fileUpload = false;
          this.isSequelUp = false;
        }
      }).catch((err) => {
        this.$hMessage.error('上传失败');
        this.fileUpload = false;
        this.isSequelUp = false;
      })
    },
    // 上传文件
    uploadFileSequel (repeatUploadFileMd5s, fileList) {
      let formData = new FormData();
      formData.append('ruleFileId', this.submit.id);
      repeatUploadFileMd5s.forEach(md5 => {
        formData.append('repeatUploadFileMd5s', md5);
      })
      fileList.forEach(file => {
        formData.append('files', file, file.name);
      })
      this.$http.post('/tm/extractFile/upload', formData).then(res => {
        let response = res.data;
        this.isSequelUp = false;
        let name = 'error'
        if(response.status === this.$api.SUCCESS){
          this.getFileList(true);
          name = 'info'
        }
        this.$hMessage[name]({
          duration: 3,
          content: response.msg
        });
      }).catch(() => {
        this.$hMessage.error('上传失败');
        this.fileUpload = false;
        this.isSequelUp = false;
      })
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
          this.isSequelUp = false;
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
		  formData.append('ruleFileId', this.submit.id);
      repeatUploadFileMd5s.forEach(md5 => {
        formData.append('repeatUploadFileMd5s', md5);
      })
      fileList.forEach(file => {
        formData.append('files', file, file.name);
      })
		  this.$http.post('/tm/extractFile/upload', formData).then(res => {
        let data = res.data;
        this.fileUpload = false;
        let name = 'error'
        if(data.status === this.$api.SUCCESS){
          let resData = data.body || {};
          let list = resData.idList || [];
          this.submit.fileIds = [...this.submit.fileIds,...list];
          name = 'info'
        }
        this.$hMessage[name]({
          duration: 3,
          content: data.msg
        });
      }).catch(() => {
        this.$hMessage.error('上传失败');
        this.fileUpload = false;
        this.isSequelUp = false;
      })
    },
    // 文件上传前钩子
		async handleBeforeUpload(list){
		  console.log(list)
			this.fileLen = list.length;
      // const bmf = new BMF();
      // bmf.md5(
      //   list[0],
      //   (err, md5) => {
      //     console.log('err:', err);
      //     console.log('md5 string:', md5); // 97027eb624f85892c69c4bcec8ab0f11
      //   },
      //   progress => {
      //     console.log('progress number:', progress);
      //   },
      // );
			// return false
			if(this.fileLen > this.maxFileSum){
				this.$hMessage.error({
					duration: 3,
					content: '单次上传文件数量不可以超过'+ this.maxFileSum +'个'
				});
				return false;
			}
			if(this.activeFileSum + this.fileLen > this.maxFileAll){
				this.$hMessage.error({
					duration: 3,
					content: '文件总数不可以超过'+ this.maxFileAll +'个'
				});
				return false;
			}
			this.fileUpload = true;
		},
		uploadSuccess(response, file, fileList){
			this.fileUpload = false;
			let name = 'error'
			if(response.status == this.$api.SUCCESS){
				let data = response.body || {};
				let list = data.idList || [];
				this.submit.fileIds = [...this.submit.fileIds,...list];
				name = 'info'
			}
			this.$hMessage[name]({
				duration: 3,
				content: response.msg
			});
		},
		uploadError(response, file, fileList){
			this.$hMessage.error('上传失败');
			this.fileUpload = false;
			this.isSequelUp = false;
		},
		onPageChange(val){
			this.req.currentPage = val;
			this.getList();
		},
		onPageSizeChange(size){
			this.req.pageSize = size;
			this.onPageChange(1);
		},
		onCloseMsgBox(){
			this.isShowMsgBox = false;
			this.submit = {
				id:'',
				fileName: '',
				source: '2',
				content: '',
				fileIds: [],
			}
			this.activeFileSum = 0;
			this.$refs['submitForm'].resetFields();
		},
		onSubmit(){
			this.$refs['submitForm'].validate((valid) => {
				if(valid){
					let submit = copyDeep(this.submit);
					if(submit.source == 1 && submit.content == ''){
						this.$hMessage.error('请填写SQL语句');
						return;
					}
					if(submit.source == 3 && submit.content == ''){
						this.$hMessage.error('请填写共享目录地址');
						return;
					}
					if(submit.source == 2 && submit.fileIds.length == 0 && submit.id == '' ){
						this.$hMessage.error('请上传文件');
						return;
					}
					if(submit.source == 1 || submit.source == 3 ){
						submit.fileIds = [];
					}else{
						submit.content = '';
					}
					if(this.isPOST)return;
					this.isPOST = true;
					let url = '/tm/ruleFile/modify';
					this.$http.put(url, submit).then((res)=>{
						let oTmp = res.data;
						if(oTmp.status == this.$api.SUCCESS){
							this.onCloseMsgBox();
							this.getList();
						}else{
							this.$hMessage.error(oTmp.msg);
						}
						this.isPOST = false;
					}).catch(err=>{
						this.isPOST = false;
						this.$hMessage.error('提交失败');
					})
				}
			})
		},
		getList(goOn = false){
			if(this.isGetList && !goOn)return;
			this.isGetList = true;
			let url = '/tm/ruleFile/list';
			let oTmp = this.req;
			this.$http.post(url,oTmp).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					let data = oTmp.body ? oTmp.body : {};
					let total = data.total || 0;
					if(total && data.records && data.records.length == 0){
						this.req.currentPage = Math.ceil(total/this.req.pageSize)
						this.getList(true);
						return;
					}

					let list = data.records || [];
					for(let i = 0, len = list.length; i < len; i++){
						this.fileSum[list[i].id] = list[i].fileSum;
					}
					for(let i = 0,len = list.length; i < len; i++){
						if(this.selectFile.indexOf(list[i].id) != -1){
							list[i]['_checked'] = true;
						}
					}
					this.total = total;
					this.list = list;
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetList = false;
			}).catch(err=>{
				this.isGetList = false;
				this.$hMessage.error('获取列表失败');
			})
		},
		delAll(){
			let len = this.selectFile.length;
			if(len == 0){
				this.$hMessage.warning('请选择要删除的文件');
				return;
			}
			this.$hMsgBox.confirm({
				title:'批量删除',
				content:'共'+ len +'个文件，确认删除?',
				onOk:()=>{
					if(this.isDel)return;
					this.isDel = true;
					let url = '/tm/ruleFile/remove';
					this.$http.post(url, this.selectFile).then((res)=>{
						let oTmp = res.data;
						if(oTmp.status == this.$api.SUCCESS){
							this.selectFile = [];
							this.getList(true);
							this.$hMessage.success('删除成功')
						}else{
							this.$hMessage.error(oTmp.msg);
						}
						this.isDel = false;
					}).catch(err=>{
						this.isDel = false;
						this.$hMessage.error('删除失败');
					})
				},
				onCancel:()=>{

				},
			})
		},
		del(id){
			if(this.isDel)return;
			this.isDel = true;
			let url = '/tm/ruleFile/removeById?id=' + id;
			this.$http.delete(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.getList(true);
					this.$hMessage.success('删除成功')
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isDel = false;
			}).catch(err=>{
				this.isDel = false;
				this.$hMessage.error('删除失败');
			})
		},
		delfile(id){
			if(this.isGetFileList)return;
			this.isGetFileList = true;
			let url = '/tm/extractFile/delete';
			let ids = [id]
			this.$http.post(url,ids).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.getFileList(true);
					this.$hMessage.success('删除成功')
				}else{
					this.$hMessage.error(oTmp.msg);
				}
				this.isGetFileList = false;
			}).catch(err=>{
				this.isGetFileList = false;
				this.$hMessage.error('删除失败');
			})
		},
		gethandleuserlist(){
			let url = '/tm/role/getuserlist?rolecode=Guest';
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					this.changeUser = oTmp.data || [];
				}else{
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.$hMessage.error('获取更新人失败');
			})
		},
		getFileSource(){
			// let url = '/tm/tbmDictList?dictCode=1118';
			let url = '/tm/ecc/dict/queryByCode?dictCode=1118';
			this.$http.get(url).then((res)=>{
				let oTmp = res.data;
				if(oTmp.status == this.$api.SUCCESS){
					// this.fileSource = oTmp.body.tbmDictList || [];
					this.fileSource = oTmp.body.dictList || [];
				}else{
					this.$hMessage.error(oTmp.msg);
				}
			}).catch(err=>{
				this.isGetFileList = false;
				this.$hMessage.error('获取文件来源失败');
			})
		},
	},
	mounted() {
		// this.uploadList = this.$refs.upload.fileList;
		this.getList();
		this.gethandleuserlist();
		this.getFileSource();
	}
};
</script>
<style type="text/css" scoped>
.list{
	position: relative;
}
.list>>> .tab-operation{
	text-align: center;
}
.list>>> .tab-operation > span{
	margin-right:5px;
	color: #298DFF;
}
.file-form{
	position: relative;
}
.file-list-search li dt{
	width: 60px;
}
.file-list-search li dd{
	width: calc(100% - 60px);
}
.search-wrapper-but >>>.h-upload{
	display: inline-block;
}
</style>
<style lang="scss" scoped>
.fileSourceContent{
  margin-top: 10px;
}
</style>
