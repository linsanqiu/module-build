<template>
  <div class="rule_periphery">
    <!-- <div class="header-content">
      <div>解析html文件地址 <a :href="webUrl" target="__blank">{{webUrl}}</a></div>
    </div>-->
    <windowDrag leftW="50%">
      <div class="box-right-content" slot="right">
        <div class="rule">
          <div class="contentbox">
            <div class="header-content" v-if="!isView">
              <div class="bussinessCode">
                <div style="width: 80px">业务码：</div>
                <h-input v-model="ruleContent.businessCode" :maxlength="10"></h-input>
              </div>
            </div>
            <h-form
              :model="ruleContent"
              ref="ruleContentForm"
              label-position="right"
              :label-width="100"
              :rules="modulesRule"
              @submit.native.prevent
            >
              <h-form-item label="抽取名称：" prop="configName">
                <h-input ref="configName" v-model="ruleContent.configName" placeholder="文件名称"></h-input>
              </h-form-item>
              <h-form-item label="抽取描述：" prop="configDesc">
                <h-input
                  type="textarea"
                  :rows="2"
                  v-model="ruleContent.configDesc"
                  placeholder="抽取描述"
                ></h-input>
              </h-form-item>
            </h-form>
            <div class="contentsbox">
              <div class="textareabox">
                <template v-if="tabsName == 1 || tabsName == 2">
                  <div class="list">
                    <div class="title setting_title">
                      字符配置
                      <h-upload
                                action="/tm/ruleConfig/importFields"
                                :show-upload-list="false"
                                :data="{ ruleFileId: 1 }"
                                :on-success="settingUploadSuccess"
                                :on-error="settingUploadError"
                                :before-upload="settingBeforeUpload"
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">
                        <h-button type="primary" icon="ios-cloud-upload-outline">导入字符</h-button>
                      </h-upload>
                    </div>
                    <div class="ruleList" v-if="ruleContent.ruleContent.ruleList.length > 0">
                      <div class="ruleListleft">
                        <div class="ruleListleft-wrapper">
                          <div class="title">
                            字符
                            <span @click="addRule()" class="i add" title="新建" v-if="!isView"></span>
                          </div>
                          <ul class="ztree">
                            <li v-for="(item,i) in ruleContent.ruleContent.ruleList">
                              <a :class="item.fieldNumber == rulesNumber ? 'curSelectedNode' : '' ">
                                <span
                                  :title=" item.fieldChName ? item.fieldChName : ''"
                                  class="name"
                                  @click="onSelectFieldName(i)"
                                >{{ item.fieldName }}{{ item.fieldState == 1 && item.fieldEnName ? '('+ item.fieldEnName +')' : '' }}</span>
                                <Poptip
                                  offset="30"
                                  confirm
                                  placement="top-start"
                                  title="确定移除?"
                                  width="120"
                                  @on-ok="ruleListRemove(i)"
                                >
                                  <i
                                    v-if="ruleContent.ruleContent.ruleList.length != 1 && !isView "
                                    class="icon-t-b-delete iconfont"
                                    title="移除"
                                  ></i>
                                </Poptip>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div class="ruleListright">
                        <h-form
                          :model="ruleListDetail"
                          label-position="right"
                          :label-width="110"
                          ref="ruleListForm"
                          @submit.native.prevent
                          :rules="ruleListContentRule"
                        >
                          <h-form-item label="字符名称：">
                            <h-input placeholder="字符名称" v-model="ruleListDetail.fieldName" disabled></h-input>
                          </h-form-item>
                          <h-form-item label="字符类型：">
                            <Cascader
                              v-model="ruleListDetail.charTypeName"
                              :render-format="formatStrType"
                              :data="strType"
                              @on-change="changeRule"
                              trigger="click"
                              :clearable="false"
                              change-on-select
                            ></Cascader>
                          </h-form-item>
                          <!-- <h-form-item label="是否字符：">
														<RadioGroup v-model="ruleListDetail.fieldState" @on-change="changeRule()">
															<Radio :label="1">是</Radio>
															<Radio :label="0">否</Radio>
														</RadioGroup>
                          </h-form-item>-->
                          <h-form-item label="字符英文名称：" prop="fieldEnName">
                            <h-input
                              placeholder="字符英文名称"
                              v-model.trim="ruleListDetail.fieldEnName"
                              @input="changeRule()"
                            ></h-input>
                          </h-form-item>
                          <h-form-item label="字符中文名称：" prop="fieldChName">
                            <h-input
                              placeholder="字符中文名称"
                              v-model.trim="ruleListDetail.fieldChName"
                              @input="changeRule()"
                            ></h-input>
                          </h-form-item>
                          <h-form-item label="依赖字符：">
                            <Select
                              v-model.trim="ruleListDetail.relyOnChar"
                              @on-change="changeRule()"
                            >
                              <Option
                                v-for="(item, index) in ruleContent.ruleContent.ruleList"
                                :value="item.fieldName"
                                :key="item.fieldName"
                                v-if="item.fieldName != ruleListDetail.fieldName"
                              >{{ item.fieldName }}</Option>
                            </Select>
                          </h-form-item>
                          <h-form-item label="抽取范围：">
                            <h-cascader :data="extractingRangeList"
                                        v-model="ruleListDetail.extractingRange"
                                        @on-change="changeExtractingRange"
                                        @on-remove-tag="changeExtractingRange"
                                        multiple
                                        clearable
                                        placeholder="11"
                                        :render-format="extractingRangeFormat"
                            ></h-cascader>
                          </h-form-item>
                        </h-form>
                        <h-button-group>
                          <h-button v-for="item in ruleFilterBtnListShow"
                                    :key="item.id"
                                    @click="changeRuleFilter(item)"
                                    :type="item.selected ? 'primary' : 'ghost'">{{item.name}}</h-button>
                        </h-button-group>
                        <div id="ruleTitle" class="title">
                          字符规则
                          <span @click="addRuleTable(1)" class="i add" title="新建" v-if="!isView"></span>
                        </div>
                        <h-table
                          size="small"
                          :maxHeight="150"
                          class="full-max-height-table"
                          :columns="ruleTableSet"
                          :data="ruleListBeforeFilter"
                          :highlight-row="false"
                          border
                        ></h-table>
                        <div class="title">
                          结果过滤表达式
                          <span v-if="!isView" @click="addRuleTable(2)" class="i add" title="新建"></span>
                        </div>
                        <h-table
                          size="small"
                          :maxHeight="150"
                          class="full-max-height-table"
                          :columns="expressionTable"
                          :data="expressionListBeforeFilter"
                          :highlight-row="false"
                          border
                        ></h-table>
                        <div class="title positionbox">
                          字符定位
                          <span
                            @click="addPositionList"
                            class="i add"
                            title="新建"
                            v-if="!isView"
                          ></span>
                        </div>
                        <div
                          v-show="ruleListDetail.positionList && ruleListDetail.positionList.length > 0"
                        >
                          <div class="position_tabs">
                            <Tabs
                              type="card"
                              showArrow
                              closable
                              @on-click="onPositionTabs"
                              @on-tab-remove="removePositionTabs"
                              v-model="activePositionTabsKey"
                            >
                              <TabPane
                                v-for="(tab,k) in ruleListDetail.positionList"
                                :key="tab"
                                :name="tab"
                                :label="'定位' + (k+1)"
                              ></TabPane>
                            </Tabs>
                          </div>
                          <div class="position">
                            <div class="list">
                              <div class="title">
                                目录定位
                                <span
                                  @click="addPosition(1)"
                                  class="i add"
                                  title="新建"
                                  v-if="!isView"
                                ></span>
                              </div>
                              <div class="ztree-box">
                                <p
                                  class="position-ps"
                                  v-show="activePosition.catalogPosition.length == 0"
                                >暂无数据</p>
                                <ul
                                  v-show="activePosition.catalogPosition.length > 0"
                                  id="targetPositionTree"
                                  class="ztree"
                                ></ul>
                              </div>
                            </div>
                            <div class="list">
                              <div class="title">
                                内容定位
                                <span
                                  @click="addPosition(2)"
                                  class="i add"
                                  title="新建"
                                  v-if="!isView"
                                ></span>
                              </div>
                              <div class="ztree-box">
                                <p
                                  class="position-ps"
                                  v-show="activePosition.contentPosition.length < 1"
                                >暂无数据</p>
                                <ul
                                  v-show="activePosition.contentPosition.length > 0"
                                  id="contentPositionTree"
                                  class="ztree"
                                ></ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          class="position-ps"
                          v-show="!ruleListDetail.positionList || ruleListDetail.positionList.length == 0"
                        >暂无数据</div>
                      </div>
                    </div>
                    <div class="ruleList ps" v-else>暂无数据</div>
                  </div>
                  <!-- <div class="list">
										<div class="title">
											字段列表
											<span @click="addFieldsTable" class="i add" title="新建" v-if="!isView"></span>
										</div>
										<div>
											<h-table
												size="small"
												:maxHeight="300"
												class="full-max-height-table"
												:columns="fieldsTable"
												:data="ruleContent.ruleContent.fieldList"
												:highlight-row="false"
												border>
											</h-table>
										</div>
                  </div>-->
                </template>
                <template v-else-if="tabsName == 3">
                  <div class="list">
                    <div class="title">
                      列名列表
                      <span @click="addTable" class="i add" title="新建" v-if="!isView"></span>
                    </div>
                    <div>
                      <h-table
                        size="small"
                        :maxHeight="300"
                        class="full-max-height-table"
                        :columns="tableTable"
                        :data="ruleContent.ruleContent.tableList"
                        :highlight-row="false"
                        border
                      ></h-table>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="btnbox" v-if="!isView">
          <div class="btnbox-wrapper">
            <h-button @click="onCancel">取消</h-button>
            <h-button type="primary" @click="onSave()">保存</h-button>
            <h-button type="primary" @click="onTest()">预览</h-button>
          </div>
        </div>
        <h-spin fix v-if="isGetDetail">
          <h-icon name="load-c" size="18" class="h-load-loop"></h-icon>
          <div>加载中...</div>
        </h-spin>
      </div>
      <div class="box-left-content" slot="left">
        <div class="pdf-file-list">
          <p>
            切换PDF
            <template v-if="fileUpload">
              <span>上传中...</span>
            </template>
            <template v-else>
              <!-- <uploadFile
                action="/tm/ruleConfigFile/upload"
                :data="{ ruleConfigId: ruleContent.id }"
                :multiple="true"
                :uploadSuccess="uploadSuccess"
                :beforeUpload="handleBeforeUpload"
                :uploadError="uploadError"
              >
                <span>上传</span>
              </uploadFile>-->
<!--              <Upload-->
<!--                action="/tm/ruleConfigFile/upload"-->
<!--                name="files"-->
<!--                :data="{ ruleConfigId: ruleContent.id }"-->
<!--                :uploadAll="true"-->
<!--                :multiple="true"-->
<!--                :show-upload-list="false"-->
<!--                :on-self-success="uploadSuccess"-->
<!--                :before-upload="handleBeforeUpload"-->
<!--                :mergeHook="true"-->
<!--                :on-error="uploadError"-->
<!--              >-->
<!--                <span>上传</span>-->
<!--              </Upload>-->
              <customUpload @change="inputChange" title="上传"></customUpload>
            </template>
          </p>
          <ul class>
            <li class="no-file" v-if="testFileList.length == 0">暂无文件，请上传</li>
            <li
              v-for="(item,i) in testFileList"
              :title="item.fileName"
              @click="changePDFFile(item)"
              :class="{ 'active' : activeFileMd5 == item.md5 }"
            >{{ item.fileName }}</li>
          </ul>
          <div class="icon">
            <i class="iconfont icon-arrow-r"></i>
          </div>
        </div>
        <iframe :src="PDFurl" width="100%" height="100%" frameborder="0"></iframe>
      </div>
    </windowDrag>
    <h-msgBox
      :title="positionName"
      v-model="isShowPositionBox"
      @on-close="onClosePositionMsgBox"
      class-name="vertical-center-modal"
      :top="0"
      width="620"
    >
      <div class="file-form">
        <h-form
          :model="positionContent"
          ref="positionForm"
          :rules="positionRule"
          label-position="right"
          :label-width="100"
          @submit.native.prevent
        >
          <h-form-item label="规则：" prop="text">
            <h-input type="textarea" v-model.trim="positionContent.text" :rows="6" placeholder="规则"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer" class="draggable-form-footer">
        <h-button @click="onClosePositionMsgBox">取消</h-button>
        <h-button @click="onSubmitPosition" type="primary">确定</h-button>
      </div>
    </h-msgBox>
    <modalView v-model="isShowRuleBox" title="字符规则" @on-close="onCloseRuleMsgBox">
      <div class="file-form" slot="content">
        <h-form
          :model="rulesDataDetail"
          ref="ruleForm"
          label-position="right"
          :label-width="100"
          @submit.native.prevent
        >
          <h-form-item label="规则类型：">
            <RadioGroup v-model="rulesDataDetail.ruleType" @on-change="changeRuleType">
              <Radio label="1">
                <span>文本</span>
              </Radio>
              <Radio label="2">
                <span>正则</span>
              </Radio>
              <Radio v-if="rulesModalType === 1" label="3">
                <span>表格</span>
              </Radio>
            </RadioGroup>
          </h-form-item>
          <h-form-item
            v-if="'1'.includes(rulesDataDetail.ruleType)"
            :label="rulesModalType === 2 ? '过滤内容：' : '规则内容：'"
            :rules="ruleCheckText"
            prop="ruleExpression">
            <tagTextarea
              tag="tag"
              @click.native="modifyFunctionElement = 'tagTextarea'"
              ref="tagTextarea"
              @add="addItem"
              v-model="rulesDataDetail.ruleExpression"
              :fnIdDict="fnIdDict"
              @modalShow="addfn"
            ></tagTextarea>
          </h-form-item>
          <template v-if="'3'.includes(rulesDataDetail.ruleType) && rulesModalType === 1">
            <h-form-item :label="rulesModalType === 2 ? '过滤内容：' : '表头：'" :rules="ruleCheckTableUp" prop="ruleTableUpExpression">
              <tagTextarea
                tag="tag"
                minHeight="50"
                ref="tagTableUp"
                @add="addItem"
                @click.native="modifyFunctionElement = 'tagTableUp'"
                :fnIdDict="fnIdDict"
                v-model="rulesDataDetail.ruleTableUpExpression"
                @modalShow="addfn"
              ></tagTextarea>
            </h-form-item>
            <h-form-item v-if="rulesModalType === 1" label="右下约束：" :rules="ruleCheckTableDown" prop="ruleTableDownExpression">
              <tagTextarea
                tag="tag"
                ref="tagTableDown"
                minHeight="50"
                @add="addItem"
                @click.native="modifyFunctionElement = 'tagTableDown'"
                :fnIdDict="fnIdDict"
                v-model="rulesDataDetail.ruleTableDownExpression"
                @modalShow="addfn"
              ></tagTextarea>
            </h-form-item>
          </template>
          <h-form-item v-if="'2'.includes(rulesDataDetail.ruleType)"
                       :label="rulesModalType === 2 ? '过滤内容：' : '规则内容：'"
                       :rules="ruleCheckReg"
                       prop="ruleRegExpression">
            <h-input ref="ruleRegInput" type="textarea" v-model="rulesDataDetail.ruleRegExpression"></h-input>
          </h-form-item>
          <h-form-item v-if="'1/3'.includes(rulesDataDetail.ruleType)" label=" " :rules="ruleCheckAdd">
            <div class="add-fn">
              <span @click="addfn">添加函数</span>
            </div>
            <p class="ps">
              1.${}内都代表函数，添加函数确定后会在规则表达式后面嵌入该函数
              <br />2. or : 或者，之间任一一个出现时满足条件
              <br />3. and ：和，两者同时存在
              <br />4. not ：不包含
            </p>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer" class="draggable-form-footer">
        <h-button @click="onCloseRuleMsgBox" style="margin-right:4px">取消</h-button>
        <h-button type="primary" @click="onSubmitRule">确定</h-button>
      </div>
    </modalView>
    <h-msgBox
      title="添加函数"
      v-model="isShowFnBox"
      @on-close="onCloseFNMsgBox"
      class-name="vertical-center-modal"
      :top="0"
      width="620"
    >
      <div class="file-form">
        <h-form
          :model="fnData"
          ref="rulefnForm"
          label-position="right"
          :label-width="100"
          @submit.native.prevent
        >
          <h-form-item
            label="函数列表："
            prop="name"
            :rules="{type:'array', required: true, message: '请输入参数', trigger: 'blur'}"
          >
            <Cascader
              v-model="fnData.name"
              :render-format="formatStrType"
              :data="fnList"
              @on-change="changeFn"
              trigger="click"
              :clearable="false"
            ></Cascader>
          </h-form-item>
          <h-form-item
            v-for="(item, index) in fnData.value.argList"
            :key="index"
            label="参数："
            :prop="'value.argList.' + index +'.value'"
            :rules="{required: true, message: '请输入参数', trigger: 'blur'}"
          >
            <h-input
              :rows="2"
              v-model="item.value"
              :placeholder="'参数'+(index+1)"
              style="
        width:380px;margin-right:10px"
            ></h-input>
            <span
              @click="addItem"
              class="i add"
              title="新建"
              style="margin-right:10px"
              v-if="fnData.value.paramType == 2"
            ></span>
            <i
              class="icon-t-b-delete iconfont"
              title="移除"
              @click="removeItem(index)"
              v-if="fnData.value.argList.length > fnData.value.defaultParamCount"
            ></i>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer" class="draggable-form-footer">
        <h-button @click="onCloseFNMsgBox">取消</h-button>
        <h-button type="primary" @click="onSubmitFN">确定</h-button>
      </div>
    </h-msgBox>
    <h-msgBox
      title="字段"
      :model="fieldListDetail"
      v-model="isShowFieldsBox"
      @on-close="onCloseFieldMsgBox"
      class-name="vertical-center-modal"
      :top="0"
      width="620"
    >
      <div class="file-form">
        <h-form
          :model="fieldListDetail"
          ref="fieldForm"
          :rules="fieldDetailRule"
          label-position="right"
          :label-width="120"
          @submit.native.prevent
        >
          <h-form-item label="字段英文名称：" prop="englishName">
            <h-input placeholder="字段英文名称" v-model.trim="fieldListDetail.englishName"></h-input>
          </h-form-item>
          <h-form-item label="字段中文名称：" prop="chineseName">
            <h-input placeholder="字段中文名称" v-model.trim="fieldListDetail.chineseName"></h-input>
          </h-form-item>
          <h-form-item label="组成：" prop="ruleNames">
            <h-input placeholder="字段名称，多字段组成用逗号分隔" v-model="fieldListDetail.ruleNames"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer" class="draggable-form-footer">
        <h-button @click="onCloseFieldMsgBox">取消</h-button>
        <h-button type="primary" @click="onSubmitField">确定</h-button>
      </div>
    </h-msgBox>
    <h-msgBox
      :title="isAddFather ? '新增分组' : '编辑分组'"
      v-model="isShowFatherMsgBox"
      @on-close="closeFatherMsgBox"
      class-name="vertical-center-modal"
      :top="0"
    >
      <div class="contents">
        <h-form
          ref="fatherForm"
          :model="father"
          :rules="fatherRule"
          :label-width="110"
          @submit.native.prevent
        >
          <h-form-item prop="name" label="分组名称：">
            <h-input
              type="text"
              v-model.trim="father.groupName"
              autocomplete="off"
              placeholder="请输入分组名称"
            ></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="text" @click="closeFatherMsgBox">取消</h-button>
        <h-button type="info" @click="submitFather" :loading="isSubmitForm">提交</h-button>
      </div>
    </h-msgBox>
    <h-msgBox
      title="预览"
      v-model="isShowTestMsgBox"
      @on-close="closeTestMsgBox"
      class-name="vertical-center-modal"
      :top="0"
      width="700"
    >
      <div class="testcontents">
        <div v-if="isShowTestMsgBox">
          <div class="uploadfile">
            上传文件：
            <template v-if="fileUpload">
              <h-button type="primary">文件上传中...</h-button>
            </template>
            <template v-else>
<!--              <Upload-->
<!--                action="/tm/ruleConfigFile/upload"-->
<!--                name="files"-->
<!--                :data="{ ruleConfigId: ruleContent.id }"-->
<!--                :uploadAll="true"-->
<!--                :multiple="true"-->
<!--                :show-upload-list="false"-->
<!--                :on-self-success="uploadSuccess"-->
<!--                :before-upload="handleBeforeUpload"-->
<!--                :mergeHook="true"-->
<!--                :on-error="uploadError"-->
<!--              >-->
<!--                <h-button type="primary">选择文件</h-button>-->
<!--              </Upload>-->
              <customUpload @change="inputChange" title="选择文件"></customUpload>
            </template>
          </div>
          <div class="testfile">
            <h-table
              size="small"
              :maxHeight="300"
              class="full-max-height-table"
              :columns="testFileTable"
              :data="testFileList"
              :highlight-row="false"
              @on-selection-change="onSelectionDel"
              border
            ></h-table>
            <div class="del-box">
              已选 {{ selectionDel.length }} 个文件
              <h-button type="primary" @click="onAllDel" size="small">批量删除</h-button>
            </div>
            <h-spin fix v-if="isGetFfileloading">
              <h-icon name="load-c" size="18" class="h-load-loop"></h-icon>
              <div>加载中...</div>
            </h-spin>
          </div>
        </div>
        <h-spin fix v-if="isGetDetail && isShowTestMsgBox">
          <h-icon name="load-c" size="18" class="h-load-loop"></h-icon>
          <div>加载中...</div>
        </h-spin>
      </div>
      <div slot="footer">
        <h-button type="text" @click="closeTestMsgBox">关闭</h-button>
      </div>
    </h-msgBox>
    <h-msgBox
      title="列名"
      v-model="isShowTableBox"
      @on-close="onCloseTableMsgBox"
      class-name="vertical-center-modal"
      :top="0"
      width="620"
    >
      <div class="file-form">
        <h-form
          :model="tableData"
          :rules="tableRule"
          ref="tableForm"
          label-position="right"
          :label-width="100"
          @submit.native.prevent
        >
          <h-form-item label="中文名称：" prop="chineseName">
            <h-input placeholder="规则表达式" v-model="tableData.chineseName"></h-input>
          </h-form-item>
          <h-form-item label="中文名称：" prop="englishName">
            <h-input placeholder="规则表达式" v-model="tableData.englishName"></h-input>
          </h-form-item>
          <h-form-item label="类型：" prop="type">
            <Cascader
              v-model="tableData.charTypeName"
              :render-format="formatStrType"
              :data="strType"
              trigger="click"
              :clearable="false"
              @on-change="changeTableDataCharType"
              change-on-select
            ></Cascader>
          </h-form-item>
          <h-form-item label="匹配表达式：" prop="matchExpression">
            <h-input placeholder="匹配表达式" v-model="tableData.matchExpression"></h-input>
          </h-form-item>
          <h-form-item label="过滤表达式：" prop="filterExpression">
            <h-input placeholder="过滤表达式" v-model="tableData.filterExpression"></h-input>
          </h-form-item>
          <h-form-item label="约束列：" prop="constraintColumn">
            <h-input placeholder="中文名称，多列约束用逗号分隔" v-model="tableData.constraintColumn"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer" class="draggable-form-footer">
        <h-button @click="onCloseTableMsgBox">取消</h-button>
        <h-button type="primary" @click="onSubmitTable">确定</h-button>
      </div>
    </h-msgBox>
  </div>
</template>
<script>
import Input from "../../../productionInfo/components/input";
require("@/assets/css/zTreeStyle.css");
require("@/assets/js/jquery-1.4.4.min.js");
require("@/assets/js/jquery.ztree.all.min.js");
import { copyDeep } from "@/filters/index";
import md5 from "js-md5";
import detail from "@/pages/ai/extract/components/detail";
import windowDrag from "@/components/windowDrag";
import tagTextarea from "../components/tagTextarea";
import modalView from "../components/modalView";
import uploadFile from "../components/uploadFile";
import customUpload from "./customUpload";
import BMF from 'browser-md5-file';
import fastVue from "../../../tbm/reportStatistics/news/fast.vue";
export default {
  name: "ruleView",
  components: {Input, detail, windowDrag, tagTextarea, modalView, uploadFile, customUpload },
  data() {
    const validateFieldEnName = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入"));
      } else {
        let isOk = true;
        let a = this.ruleContent.ruleContent.ruleList;
        let b = this.ruleContent.ruleContent.fieldList;
        let k = this.rulesIndex;
        for (let i = 0, len = a.length; i < len; i++) {
          if (a[i].fieldEnName == value && i != k) {
            isOk = false;
          }
        }
        for (let i = 0, len = b.length; i < len; i++) {
          if (b[i].englishName == value) {
            isOk = false;
          }
        }
        if (isOk) {
          callback();
        } else {
          callback(new Error("已存在"));
        }
      }
    };

    const validateEnglishName = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入"));
      } else {
        let isOk = true;
        let a = this.ruleContent.ruleContent.ruleList;
        let b = this.ruleContent.ruleContent.fieldList;
        let k = this.fieldListDetail.index;
        for (let i = 0, len = a.length; i < len; i++) {
          if (a[i].fieldEnName == value) {
            isOk = false;
          }
        }
        for (let i = 0, len = b.length; i < len; i++) {
          if (b[i].englishName == value && i != k) {
            isOk = false;
          }
        }
        if (isOk) {
          callback();
        } else {
          callback(new Error("已存在"));
        }
      }
    };

    return {
      // 字符规则 过滤列表
      ruleFilterBtnList: [
        {
          name: '文本',
          id: '1',
          selected: false
        },{
          name: '正则',
          id: '2',
          selected: false
        },{
          name: '表格',
          id: '3',
          selected: false
        }
      ],
      activeRoutersButton: this.$store.state.activeRoutersButton, // 路由按钮权限列表
      tabsName: "1",
      ruleContent: {
        businessCode: "",
        id: "",
        groupId: "0",
        configName: "",
        configDesc: "",
        ruleType: "1",
        regexpContent: "",
        ruleContent: {
          targetPosition: [],
          contentPosition: [],
          positionRuleObj: {},
          ruleList: [
            {
              fieldNumber: "1",
              fieldName: "#1",
              charType: "1",
              charTypeName: ["1"],
              rules: [],
            },
          ],
          fieldList: [],
          tableList: [],
        },
      },
      modulesRule: {
        configName: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            required: true,
            min: 2,
            max: 20,
            message: "2~20个字符",
            trigger: "blur",
          },
        ],
        configDesc: [
          {
            required: false,
            min: 2,
            max: 50,
            message: "2~50个字符",
            trigger: "blur",
          },
        ],
      },
      regexpContentRule: {
        regexpContent: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      ruleType: [
        {
          name: "文本(非正则)",
          value: 1,
        } /*,{
				name: '表格',
				value: 3,
			}*/,
        {
          name: "正则",
          value: 2,
        },
      ],
      // 抽取范围列表
      extractingRangeList: [],
      strType: [], //字符串类型列表
      strTypeName: {},
      fnList: [], //函数列表
      fnData: {
        value: {
          // 参数
          // argList: []
        },
        name: [],
      },
      modifyFunctionElement: '', // 添加函数/修改函数 对应的dom
      //   函数对应字典
      fnIdDict: {},
      tagIdParamsDict: {},
      isShowPositionBox: false,
      isShowRuleBox: false, // 字符规则弹窗显示
      isShowTypeBox: false,
      isShowFieldsBox: false,
      submit: {},
      positionName: "",
      positionContent: {
        text: "",
        type: "",
        index: -1,
      },
      positionRule: {
        text: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      positionSetting: {
        data: {
          simpleData: {
            enable: true,
          },
        },
        edit: {
          enable: true,
          showRemoveBtn: true,
          showRenameBtn: true,
          renameTitle: "编辑",
          removeTitle: "删除",
        },
        view: {
          showIcon: false,
          selectedMulti: false,
        },
        callback: {
          beforeRemove: this.positionBeforeRemove,
          beforeEditName: this.positionBeforeEditName,
        },
      },
      // 字符配置信息
      ruleListDetail: {
        fieldNumber: "1",
        fieldName: "#1",
        charType: "1",
        charTypeName: ["1"],
        fieldState: 1,
        fieldChName: "",
        fieldEnName: "",
        extractingRange: [], // 抽取范围
        rules: [], // 字符规则
        filters: [], // 过滤表达式
        positionList: [],
        relyOnChar: "",
      },
      // 字符规则弹窗  1 字符规则  2 过滤表达式
      rulesModalType: 1,
      // 字符规则弹窗 上次选择的 规则类型
      rulesModalRuleType: '1',
      // 过滤表达式弹窗 上次选择的 规则类型
      filtersModalRuleType: '1',
      // 字符规则弹窗信息
      rulesDataDetail: {
        ruleExpression: "", // 文本规则
        ruleRegExpression: '', // 正则规则
        ruleTableUpExpression: '', // 表头
        ruleTableDownExpression: '', // 右下约束
        ruleType: "1", // 规则类型  1 文本 2正则 3表格
        index: -1, // 下标  -1 新增  0 1 2 ... 其他为字符规则表格行下标
      },
      ruleCheckText:[
        { required: false, message: "请输入", trigger: "blur" },
        { required: false, message: "请输入", trigger: "change" }
      ],
      ruleCheckReg:[
        { required: false, message: "请输入", trigger: "blur" },
        { required: false, message: "请输入", trigger: "change" }
      ],
      ruleCheckTableUp:[
        { required: false, message: "请输入", trigger: "blur" },
        { required: false, message: "请输入", trigger: "change" }
      ],
      ruleCheckTableDown:[
        { required: false, message: "请输入", trigger: "blur" },
        { required: false, message: "请输入", trigger: "change" }
      ],
      ruleCheckAdd:[
        { required: false, message: "请输入", trigger: "blur" },
        { required: false, message: "请输入", trigger: "change" }
      ],
      // 字符规则表格配置
      ruleTable: [
        {
          title: "编号",
          width: 70,
          render: (h, params) => {
            // const index = this.ruleListBeforeFilter[params.index].index;
            return h("div", "规则" + (params.index + 1));
          },
        },
        {
          key: "ruleExpression",
          title: "规则内容",
          type: "html",
        },{
          // hiddenCol: true,
          key: "ruleTableUpExpression",
          title: "表头",
          type: "html",
        },{
          // hiddenCol: true,
          key: "ruleTableDownExpression",
          title: "右下约束",
          type: "html",
        },
        {
          title: "类型",
          align: "center",
          width: 60,
          render: (h, params) => {
            const ruleType = String(params.row.ruleType);
            return h("span", ruleType === '2' ? "正则" :  ruleType === '1' ? '文本' : '表格');
          },
        },
        {
          title: "操作",
          align: "center",
          width: 80,
          render: (h, params) => {
            let row = copyDeep(params.row);
            let saveBtn, deleteBtn;
            if (!this.isView) {
              saveBtn = h("span", {
                attrs: {
                  title: "编辑",
                },
                class: ["icon-t-b-message", "iconfont", "tab-icon-btn"],
                on: {
                  click: () => {
                    let { ruleExpressionTag, ruleExpression, ruleType, ruleTableUpExpressionTag, ruleTableDownExpressionTag } = row;
                    const index = this.ruleListBeforeFilter[params.index].index;
                    this.rulesDataDetail = {
                      ruleRegExpression: ruleType == 2 ? ruleExpression : "",
                      ruleExpression: ruleExpressionTag,
                      ruleTableUpExpression: ruleTableUpExpressionTag || '',
                      ruleTableUpExpressionTag: ruleTableUpExpressionTag || '',
                      ruleTableDownExpression: ruleTableDownExpressionTag || '',
                      ruleTableDownExpressionTag: ruleTableDownExpressionTag || '',
                      ruleType: ruleType || "1",
                      index: index,
                    };
                    this.isShowRuleBox = true;
                  },
                },
              });
              deleteBtn = h("span", {
                attrs: {
                  title: "删除",
                },
                class: ["icon-t-b-delete", "iconfont", "tab-icon-btn"],
                style: {
                  color: "#F5222D",
                },
                on: {
                  click: () => {
                    const index = this.ruleListBeforeFilter[params.index].index;
                    this.ruleListDetail.rules.splice(index, 1);
                    this.changeRule();
                  },
                },
              });
            }
            return h(
              "div",
              {
                class: ["tab-operation"],
              },
              [saveBtn, deleteBtn]
            );
          },
        },
        {
          title: "顺序调整",
          width: 120,
          align: "center",
          render: (h, params) => {
            // ruleListDetail.rules
            let { index } = params;
            let row = copyDeep(params.row);
            return this.isView ? null : (
              <div>
                <span
                  onClick={this.topRule.bind(this, index)}
                  style="margin-right:5px;cursor: pointer;"
                >
                  <h-icon name="android-arrow-up"></h-icon>
                </span>
                <span
                  onClick={this.downRule.bind(this, index)}
                  style="margin-right:8px;cursor: pointer;"
                >
                  <h-icon name="android-arrow-down"></h-icon>
                </span>
                <h-poptip placement="left">
                  <h-button
                    type="primary"
                    size="small"
                    onClick={this.showRuleIndexModal.bind(this, index)}
                  >
                    调整
                  </h-button>
                  <div slot="content">
                    调整至{" "}
                    <h-input
                      style="width: 80px;top:3px"
                      size="small"
                      v-model={this.afterRuleIndex}
                      filterRE={/^(0+)|[^\d]+/g}
                    ></h-input>
                    <h-button
                      on-on-click={this.updateRuleIndex}
                      size="small"
                      style="margin-left:5px"
                      type="primary"
                    >
                      确认
                    </h-button>
                  </div>
                </h-poptip>
              </div>
              // <h-button type='primary' size="small" onClick={this.updateRuleIndex.bind(this, index)}>调整</h-button>
            );
          },
        },
      ],
      // 过滤表达式表格配置
      expressionTable: [
        {
          title: "编号",
          width: 70,
          render: (h, params) => {
            // const index = this.ruleListBeforeFilter[params.index].index;
            return h("div", "规则" + (params.index + 1));
          },
        },
        {
          key: "filterExpression",
          title: "过滤内容",
          type: "html",
        },
        {
          title: "类型",
          align: "center",
          width: 60,
          render: (h, params) => {
            const ruleType = String(params.row.filterType);
            return h("span", ruleType === '2' ? "正则" : '文本');
          },
        },
        {
          title: "操作",
          align: "center",
          width: 80,
          render: (h, params) => {
            let row = copyDeep(params.row);
            let saveBtn, deleteBtn;
            if (!this.isView) {
              saveBtn = h("span", {
                attrs: {
                  title: "编辑",
                },
                class: ["icon-t-b-message", "iconfont", "tab-icon-btn"],
                on: {
                  click: () => {
                    let { filterType, filterExpressionTag, filterExpression } = row;
                    const index = this.expressionListBeforeFilter[params.index].index;
                    this.rulesDataDetail = {
                      ruleRegExpression: filterType == 2 ? filterExpression : "",
                      ruleExpression: filterExpressionTag,
                      // ruleTableUpExpression: ruleTableUpExpressionTag || '',
                      // ruleTableUpExpressionTag: ruleTableUpExpressionTag || '',
                      // ruleTableDownExpression: ruleTableDownExpressionTag || '',
                      // ruleTableDownExpressionTag: ruleTableDownExpressionTag || '',
                      ruleType: filterType || "1",
                      index: index,
                    };
                    this.rulesModalType = 2;
                    this.isShowRuleBox = true;
                    // 初始化聚焦
                    this.changeRuleType();
                  },
                },
              });
              deleteBtn = h("span", {
                attrs: {
                  title: "删除",
                },
                class: ["icon-t-b-delete", "iconfont", "tab-icon-btn"],
                style: {
                  color: "#F5222D",
                },
                on: {
                  click: () => {
                    const index = this.expressionListBeforeFilter[params.index].index;
                    this.ruleListDetail.filters.splice(index, 1);
                    this.changeRule();
                  },
                },
              });
            }
            return h(
              "div",
              {
                class: ["tab-operation"],
              },
              [saveBtn, deleteBtn]
            );
          },
        },
        {
          title: "顺序调整",
          width: 120,
          align: "center",
          render: (h, params) => {
            // ruleListDetail.rules
            let { index } = params;
            let row = copyDeep(params.row);
            return this.isView ? null : (
              <div>
                <span
                  onClick={this.topRule.bind(this, index, 2)}
                  style="margin-right:5px;cursor: pointer;"
                >
                  <h-icon name="android-arrow-up"></h-icon>
                </span>
                <span
                  onClick={this.downRule.bind(this, index, 2)}
                  style="margin-right:8px;cursor: pointer;"
                >
                  <h-icon name="android-arrow-down"></h-icon>
                </span>
                <h-poptip placement="left">
                  <h-button
                    type="primary"
                    size="small"
                    onClick={this.showRuleIndexModal.bind(this, index, 2)}
                  >
                    调整
                  </h-button>
                  <div slot="content">
                    调整至{" "}
                    <h-input
                      style="width: 80px;top:3px"
                      size="small"
                      v-model={this.afterRuleIndex}
                      filterRE={/^(0+)|[^\d]+/g}
                    ></h-input>
                    <h-button
                      on-on-click={this.updateRuleIndex.bind(this, 2)}
                      size="small"
                      style="margin-left:5px"
                      type="primary"
                    >
                      确认
                    </h-button>
                  </div>
                </h-poptip>
              </div>
              // <h-button type='primary' size="small" onClick={this.updateRuleIndex.bind(this, index)}>调整</h-button>
            );
          },
        },
      ],
      ruleListContentRule: {
        fieldChName: [
          {
            message: "请输入",
            trigger: "blur",
          },
        ],
        fieldEnName: [
          {
            required: true,
            validator: validateFieldEnName,
            trigger: "blur",
          },
        ],
      },
      rulesRule: {
        // ruleExpression: [
        //   { required: true, message: "请输入", trigger: "blur" },
        //   { required: true, message: "请输入", trigger: "change" }
        // ],
        ruleRegExpression: [
          { required: true, message: "请输入", trigger: "blur" },
          { required: true, message: "请输入", trigger: "change" },
        ],
        ruleTableDownExpression: [
          { required: true, message: "请输入", trigger: "blur" },
          { required: true, message: "请输入", trigger: "change" },
        ],
        addFun: [
          { required: false, message: "请输入", trigger: "blur" },
        ]
      },
      rulesNumber: 1,
      rulesIndex: -1,
      fieldListDetail: {
        chineseName: "",
        englishName: "",
        ruleNames: "",
        index: -1,
      },
      fieldDetailRule: {
        chineseName: [{ message: "请输入", trigger: "blur" }],
        englishName: [
          { required: true, validator: validateEnglishName, trigger: "blur" },
        ],
        ruleNames: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      fieldsTable: [
        {
          key: "chineseName",
          title: "字段中文名称",
        },
        {
          key: "englishName",
          title: "字段英文名称",
        },
        {
          key: "ruleNames",
          title: "组成",
        },
        {
          title: "操作",
          align: "center",
          width: 100,
          render: (h, params) => {
            let row = copyDeep(params.row);
            let saveBtn, deleteBtn;
            if (!this.isView) {
              saveBtn = h("span", {
                attrs: {
                  title: "编辑",
                },
                class: ["icon-t-b-message", "iconfont", "tab-icon-btn"],
                on: {
                  click: () => {
                    this.fieldListDetail = {
                      chineseName: row.chineseName,
                      englishName: row.englishName,
                      ruleNames: row.ruleNames,
                      index: params.index,
                    };
                    this.addFieldsTable();
                  },
                },
              });
              deleteBtn = h("span", {
                attrs: {
                  title: "删除",
                },
                class: ["icon-t-b-delete", "iconfont", "tab-icon-btn"],
                style: {
                  color: "#F5222D",
                },
                on: {
                  click: () => {
                    this.ruleContent.ruleContent.fieldList.splice(
                      params.index,
                      1
                    );
                  },
                },
              });
            }
            return h(
              "div",
              {
                class: ["tab-operation"],
              },
              [saveBtn, deleteBtn]
            );
          },
        },
      ],
      isGetDetail: false,
      isShowFnBox: false,
      isAddFather: true,
      isShowFatherMsgBox: false,
      father: {
        id: "",
        groupName: "",
        isLeaf: "0",
        parentId: "",
      },
      fatherRule: {
        groupName: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      isSubmitForm: false,
      isShowTestMsgBox: false,
      testFileTable: [
        {
          width: 60,
          type: "selection",
        },
        {
          key: "fileName",
          title: "文件名",
        },
        {
          title: "操作",
          width: 110,
          align: "center",
          render: (h, params) => {
            let row = params.row;
            let viewBtn = h("span", {
              attrs: {
                title: "查看抽取结果",
              },
              class: ["icon-view", "iconfont", "tab-icon-btn"],
              on: {
                click: () => {
                  this.onSave(row.md5);
                },
              },
            });
            /*let del = h('span', {
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
									this.onDel(row.id,params.index);
								}
							},
						})*/
            return h("div", [viewBtn]);
          },
        },
      ],
      testFileList: [],
      isGetFfileloading: false,
      activeTreeId: "",
      isShowTableBox: false,
      tableData: {
        chineseName: "",
        englishName: "",
        matchExpression: "",
        filterExpression: "",
        type: "",
        typeName: [],
        constraintColumn: "",
      },
      tableRule: {
        chineseName: [{ required: true, message: "请输入", trigger: "blur" }],
        englishName: [{ required: true, message: "请输入", trigger: "blur" }],
        matchExpression: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择", trigger: "change" }],
      },
      tableTable: [
        {
          key: "chineseName",
          title: "中文名称",
        },
        {
          key: "englishName",
          title: "英文名称",
        },
        {
          key: "matchExpression",
          title: "匹配表达式",
        },
        {
          key: "type",
          title: "类型",
          render: (h, params) => {
            let row = params.row;
            return h("div", this.strTypeName[row.type]);
          },
        },
        {
          key: "constraintColumn",
          title: "约束列",
        },
        {
          title: "操作",
          align: "center",
          width: 100,
          render: (h, params) => {
            let row = copyDeep(params.row);
            let saveBtn = h("span", {
              attrs: {
                title: "编辑",
              },
              class: ["icon-t-b-message", "iconfont", "tab-icon-btn"],
              on: {
                click: () => {
                  this.tableActive = params.index;
                  this.tableData = row;
                  this.isShowTableBox = true;
                },
              },
            });
            let deleteBtn = h("span", {
              attrs: {
                title: "删除",
              },
              class: ["icon-t-b-delete", "iconfont", "tab-icon-btn"],
              style: {
                color: "#F5222D",
              },
              on: {
                click: () => {
                  this.ruleContent.ruleContent.tableList.splice(
                    params.index,
                    1
                  );
                },
              },
            });
            return h(
              "div",
              {
                class: ["tab-operation"],
              },
              [saveBtn, deleteBtn]
            );
          },
        },
      ],
      tableActive: -1,
      isView: false,
      initId: -1,
      initPId: -1,
      initView: -1,
      fileUpload: false,
      activeDel: [],
      selectionDel: [],
      activePosition: {
        catalogPosition: [],
        contentPosition: [],
      },
      activePositionTabsKey: "",
      reqMd5: "",
      loaclStoTime: "",
      loaclStoMaxTime: "",
      isLocalSto: 0,
      PDFurl: "/viewer.html?1#page=1",
      activeFileMd5: "",
      beforeRuleIndex: 0,
      afterRuleIndex: 0,
    };
  },
  props: {
    // 是否从个人测试页面进入
    isPersonal: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ruleFilterBtnListShow () {
      return [
        {
          name: '文本/正则',
          id: '12',
          selected: this.activeRuleType !== '3'
        },{
          name: '表格',
          id: '3',
          selected: this.activeRuleType === '3'
        }
      ]
    },
    // 字符规则显示列表 过滤
    ruleListBeforeFilter () {
      if (!this.ruleListDetail.rules.length) return [];
      const selects = this.ruleFilterBtnList.filter(item => item.selected).map(item => item.id);
      const rules = copyDeep(this.ruleListDetail.rules).map((item, index) => {
        item.index = index;
        return item;
      })
      return selects.length && selects.length !== 3
        ? rules.filter(item => selects.includes(item.ruleType))
        : rules;
    },
    // 表达式显示列表 过滤
    expressionListBeforeFilter () {
      // return this.ruleListDetail.filters || [];
      if (!this.ruleListDetail.filters.length) return [];
      // const selects = this.ruleFilterBtnList.filter(item => item.selected).map(item => item.id);
      const selects = this.ruleFilterBtnList.map(item => item.id);
      const rules = copyDeep(this.ruleListDetail.filters).map((item, index) => {
        item.index = index;
        return item;
      })
      return selects.length && selects.length !== 3
        ? rules.filter(item => selects.includes(item.ruleType))
        : rules;
    },
    // 当前选择的字符规则类型
    activeRuleType () {
      const selected = this.ruleFilterBtnList.filter(item => item.selected)
      return selected.length ? String(selected[0].id) : String(this.ruleFilterBtnList[0].id)
    },
    // 字符规则表格配置
    ruleTableSet () {
      const left = [
        {
          title: "编号",
          width: 70,
          render: (h, params) => {
            // const index = this.ruleListBeforeFilter[params.index].index;
            return h("div", "规则" + (params.index + 1));
          },
        }
      ];
      const right = [
        {
          title: "类型",
          align: "center",
          width: 60,
          render: (h, params) => {
            const ruleType = String(params.row.ruleType);
            return h("span", ruleType === '2' ? "正则" :  ruleType === '1' ? '文本' : '表格');
          },
        },
        {
          title: "操作",
          align: "center",
          width: 80,
          render: (h, params) => {
            let row = copyDeep(params.row);
            let saveBtn, deleteBtn;
            if (!this.isView) {
              saveBtn = h("span", {
                attrs: {
                  title: "编辑",
                },
                class: ["icon-t-b-message", "iconfont", "tab-icon-btn"],
                on: {
                  click: () => {
                    let { ruleExpressionTag, ruleExpression, ruleType, ruleTableUpExpressionTag, ruleTableDownExpressionTag } = row;
                    const index = this.ruleListBeforeFilter[params.index].index;
                    this.rulesDataDetail = {
                      ruleRegExpression: ruleType == 2 ? ruleExpression : "",
                      ruleExpression: ruleExpressionTag,
                      ruleTableUpExpression: ruleTableUpExpressionTag || '',
                      ruleTableUpExpressionTag: ruleTableUpExpressionTag || '',
                      ruleTableDownExpression: ruleTableDownExpressionTag || '',
                      ruleTableDownExpressionTag: ruleTableDownExpressionTag || '',
                      ruleType: ruleType || "1",
                      index: index,
                    };
                    this.rulesModalType = 1;
                    this.isShowRuleBox = true;
                    // 初始化聚焦
                    this.changeRuleType();
                  },
                },
              });
              deleteBtn = h("span", {
                attrs: {
                  title: "删除",
                },
                class: ["icon-t-b-delete", "iconfont", "tab-icon-btn"],
                style: {
                  color: "#F5222D",
                },
                on: {
                  click: () => {
                    const index = this.ruleListBeforeFilter[params.index].index;
                    this.ruleListDetail.rules.splice(index, 1);
                    this.changeRule();
                  },
                },
              });
            }
            return h(
              "div",
              {
                class: ["tab-operation"],
              },
              [saveBtn, deleteBtn]
            );
          },
        },
        {
          title: "顺序调整",
          width: 120,
          align: "center",
          render: (h, params) => {
            // ruleListDetail.rules
            let { index } = params;
            let row = copyDeep(params.row);
            return this.isView ? null : (
              <div>
                <span
                  onClick={this.topRule.bind(this, index, 1)}
                  style="margin-right:5px;cursor: pointer;"
                >
                  <h-icon name="android-arrow-up"></h-icon>
                </span>
                <span
                  onClick={this.downRule.bind(this, index, 1)}
                  style="margin-right:8px;cursor: pointer;"
                >
                  <h-icon name="android-arrow-down"></h-icon>
                </span>
                <h-poptip placement="left">
                  <h-button
                    type="primary"
                    size="small"
                    onClick={this.showRuleIndexModal.bind(this, index, 1)}
                  >
                    调整
                  </h-button>
                  <div slot="content">
                    调整至{" "}
                    <h-input
                      style="width: 80px;top:3px"
                      size="small"
                      v-model={this.afterRuleIndex}
                      filterRE={/^(0+)|[^\d]+/g}
                    ></h-input>
                    <h-button
                      on-on-click={this.updateRuleIndex.bind(this, 1)}
                      size="small"
                      style="margin-left:5px"
                      type="primary"
                    >
                      确认
                    </h-button>
                  </div>
                </h-poptip>
              </div>
              // <h-button type='primary' size="small" onClick={this.updateRuleIndex.bind(this, index)}>调整</h-button>
            );
          },
        }
      ];
      const center = this.activeRuleType === '3' ?
        [{
        key: "ruleTableUpExpression",
        title: "表头",
        type: "html",
      },
        {
          key: "ruleTableDownExpression",
          title: "右下约束",
          type: "html",
        }] :
        [{
            key: "ruleExpression",
            title: "规则内容",
            type: "html",
          }];
      return left.concat(center.concat(right))
    },
    maxTableHeight() {
      return this.$store.state.maxTableHeight;
    },
  },
  watch: {
    ruleContent: {
      handler(newName, oldName) {
        if (!this.isView) {
          let reqMd5 = md5(JSON.stringify(newName));
          if (this.initView == -1) {
            if (this.reqMd5 != reqMd5) {
              this.setMsgContent(true);
              this.localStoMax();
              this.loaclSto();
            } else {
              this.setMsgContent(false);
              this.emptyLocalStoData();
            }
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    /**
     *  新增抽取范围字段
     */
    // 抽取范围字段 label 模板显示自定义
    extractingRangeFormat (labels) {
        return labels[labels.length-1]
    },
    // 抽取范围 change 事件 // 选中 移除
    changeExtractingRange () {
      // hui on change 事件触发在 v - model 更新之前
      setTimeout(() => {
        this.changeRule();
      }, 0)
    },
    // 获取抽取范围树
    getExtractingRangeTree () {
      this.$http.get(`/tm/ruleType/getExtractRangeTree`).then(response => {
        const data = response.data;
        if (data.status === this.$api.SUCCESS) {
          this.extractingRangeList = copyDeep(data.body.data || []);
        } else {
          this.$hMessage.error(data.msg);
        }
      }).catch(() => {
        this.$hMessage.error("获取抽取范围失败");
      })
    },
    /**
     * excel 字符导入文件上传
     */
    // 字符导入 上传前钩子函数
    settingBeforeUpload () {
      this.isGetDetail = true; // loading
    },
    // 字符导入 成功钩子函数
    settingUploadSuccess (response) {
      let name = 'error'
      if(response.status === this.$api.SUCCESS){
        let data = response.body && response.body.ruleList || [];
        name = 'info'
        const originList = copyDeep(this.ruleContent.ruleContent.ruleList);
        const number = originList[originList.length - 1].fieldNumber;
        data.forEach((item, index) => {
          let obj = {
            charType: item.charType || '',
            charTypeName: item.charTypeName || [],
            fieldChName: item.fieldChName || '',
            fieldEnName: item.fieldEnName || '',
            fieldName: `#${number + 1 + index}`,
            fieldNumber: number + 1 + index,
            fieldState: 1,
            relyOnChar: '',
            positionList: [],
            rules: [],
            filters: [],
            extractingRange: []
          };
          this.ruleContent.ruleContent.ruleList.push(obj);
        })
        // if (this.ruleContent.ruleContent.ruleList)
        // selectFieldName
      }
      this.$hMessage[name]({
        duration: 3,
        content: response.msg
      });
      this.isGetDetail = false;
    },
    // 字符导入 失败钩子函数
    settingUploadError () {
      this.isGetDetail = false;
      this.$hMessage.error('上传失败');
    },
    changePDFFile(item) {
      this.activeFileMd5 = item.md5;
      localStorage.active_file_md5 = item.md5;
      this.PDFurl =
        "/viewer.html?file=" +
        encodeURIComponent(
          "/tm/singlePreview/downloadPDF?fileMd5=" + item.md5
        ) +
        "#page=1";
    },
    localStoMax() {
      if (this.loaclStoMaxTime) return;
      this.loaclStoMaxTime = setTimeout(() => {
        this.setLocalStorage();
        clearTimeout(this.loaclStoMaxTime);
        this.loaclStoMaxTime = "";
      }, 30000);
    },
    loaclSto() {
      this.loaclStoTime = setTimeout(() => {
        this.setLocalStorage();
        clearTimeout(this.loaclStoTime);
      }, 3000);
    },
    setLocalStorage(isEmpty = false) {
      if (isEmpty) {
        localStorage.extract_rule_add_content = "";
      } else {
        localStorage.extract_rule_add_content = JSON.stringify(
          this.ruleContent
        );
      }
    },
    emptyLocalStoData() {
      this.setLocalStorage(true);
      clearTimeout(this.loaclStoTime);
      this.loaclStoTime = "";
      clearTimeout(this.loaclStoMaxTime);
      this.loaclStoMaxTime = "";
      this.setMsgContent(false);
    },
    setMsgContent(isShow) {
      let _this = this;
      let obj = {
        url: this.$route.path,
        show: isShow,
        msg: "数据暂未保存，确定关闭页面？",
        fn: () => {
          _this.emptyLocalStoData();
        },
      };
      this.$store.commit("SET_TAB_MSG", obj);
    },
    onSelectionDel(data, arr) {
      this.selectionDel = arr;
    },
    onDel(id, index) {
      this.activeDel = [index];
      if (id) {
        this.setDel([id]);
      } else {
        this.delFileData();
      }
    },
    onAllDel() {
      let arr = this.selectionDel;
      let del = [];
      for (let i = arr.length - 1; i >= 0; i--) {
        let id = this.testFileList[arr[i]].id;
        if (id) {
          del.push(id);
        }
      }
      this.activeDel = copyDeep(arr);
      if (del.length == 0) {
        this.delFileData();
      } else {
        this.setDel(del);
      }
    },
    setDel(data) {
      this.isGetFfileloading = true;
      let url = "/tm/ruleConfigFile/remove";
      this.$http
        .post(url, data)
        .then((res) => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            this.delFileData();
          } else {
            this.$hMessage.error(oTmp.msg);
          }
          this.isGetFfileloading = false;
        })
        .catch((err) => {
          this.isGetFfileloading = false;
          this.$hMessage.error("删除文件失败");
        });
    },
    delFileData() {
      let arr = this.activeDel.sort();
      for (let i = arr.length - 1; i >= 0; i--) {
        this.testFileList.splice(arr[i], 1);
      }
      this.activeDel = [];
      this.selectionDel = [];
    },
    changeFn(arr, data) {
      if (arr.length <= 1) return;
      let value = data[data.length - 1];
      // 参数个数
      let paramType = value.paramType;
      let defaultParamCount = value.defaultParamCount;
      let argList = [];
      if (paramType === 1 || paramType === 2) {
        for (let i = 0; i < defaultParamCount; i++) {
          argList.push({
            value: "",
          });
        }
      }
      value.argList = argList;
      this.fnData.value = value;
    },
    changeTableDataCharType(arr) {
      this.tableData.type = arr[arr.length - 1];
      this.tableData.typeName = arr;
    },
    formatStrType(labels, selectedData) {
      if (selectedData.length > 0) {
        return selectedData[selectedData.length - 1].label;
      }
      return "";
    },
    addTable() {
      this.isShowTableBox = true;
    },
    onCloseTableMsgBox() {
      this.isShowTableBox = false;
      this.tableData = {
        chineseName: "",
        englishName: "",
        matchExpression: "",
        filterExpression: "",
        type: "",
        typeName: [],
        constraintColumn: "",
      };
      this.tableActive = -1;
      this.$refs["tableForm"].resetFields();
    },
    onSubmitTable() {
      this.$refs["tableForm"].validate((valid) => {
        if (valid) {
          let data = copyDeep(this.tableData);
          data.constraintColumn = data.constraintColumn.replace(/，/g, ",");
          if (this.tableActive == -1) {
            this.ruleContent.ruleContent.tableList.push(data);
          } else {
            this.$set(
              this.ruleContent.ruleContent.tableList,
              this.tableActive,
              data
            );
          }
          this.onCloseTableMsgBox();
        }
      });
    },
    //取消
    onCancel(isVerify = true) {
      if (isVerify == false) {
        this.$store.commit("DEL_TAB", this.$route.path);
        this.$router.push("/extract/rule");
      } else {
        let reqMd5 = md5(JSON.stringify(this.ruleContent));
        if (reqMd5 == this.reqMd5) {
          this.onCancel(false);
          this.emptyLocalStoData();
        } else {
          this.$hMsgBox.confirm({
            title: "温馨提示",
            content: "数据暂未保存，确定退出？",
            onOk: () => {
              this.onCancel(false);
              this.emptyLocalStoData();
            },
          });
        }
      }
    },
    changePositionData() {
      let data = {};
      if (this.activePositionTabsKey && this.activePositionTabsKey > -1) {
        data = this.ruleContent.ruleContent.positionRuleObj[
          this.activePositionTabsKey
        ];
      }
      this.activePosition.catalogPosition = data.catalogPosition || [];
      this.activePosition.contentPosition = data.contentPosition || [];
      this.creationTargetTree();
      this.creationContentTree();
    },
    onPositionTabs(name) {
      this.activePositionTabsKey = name;
      this.changePositionData();
    },
    removePositionTabs(name) {
      let index = this.ruleListDetail.positionList.indexOf(name);
      if (index != -1) {
        this.ruleListDetail.positionList.splice(index, 1);
      }
      if (this.ruleContent.ruleContent.positionRuleObj[name]) {
        delete this.ruleContent.ruleContent.positionRuleObj[name];
      }
      this.changeRule();
      this.changePositionData();
    },
    addPositionList() {
      let id = new Date().getTime().toString();
      if (!this.ruleListDetail.positionList) {
        this.ruleListDetail.positionList = [];
      }
      this.ruleListDetail.positionList.push(id);
      this.activePositionTabsKey = id;
      this.changeRule();
      this.ruleContent.ruleContent.positionRuleObj[id] = {
        positionName: "",
        catalogPosition: [],
        contentPosition: [],
      };
      this.changePositionData();
    },
    addPosition(type) {
      this.positionName = "内容定位";
      if (type == 1) {
        this.positionName = "目录定位";
      }
      this.positionContent.type = type;
      this.$refs["positionForm"].resetFields();
      this.isShowPositionBox = true;
    },
    onClosePositionMsgBox() {
      this.positionContent = {
        text: "",
        type: "",
        index: -1,
      };
      this.$refs["positionForm"].resetFields();
      this.isShowPositionBox = false;
    },
    onSubmitPosition() {
      this.$refs["positionForm"].validate((valid) => {
        if (valid) {
          let id = this.activePositionTabsKey;
          if (this.positionContent.type == 1) {
            if (this.positionContent.index >= 0) {
              this.activePosition.catalogPosition[
                this.positionContent.index
              ] = this.positionContent.text;
            } else {
              this.activePosition.catalogPosition.push(
                this.positionContent.text
              );
            }
            this.ruleContent.ruleContent.positionRuleObj[
              id
            ].catalogPosition = copyDeep(this.activePosition.catalogPosition);
            this.creationTargetTree();
            this.onClosePositionMsgBox();
          } else {
            if (this.positionContent.index >= 0) {
              this.activePosition.contentPosition[
                this.positionContent.index
              ] = this.positionContent.text;
            } else {
              this.activePosition.contentPosition.push(
                this.positionContent.text
              );
            }
            this.ruleContent.ruleContent.positionRuleObj[
              id
            ].contentPosition = copyDeep(this.activePosition.contentPosition);
            this.creationContentTree();
            this.onClosePositionMsgBox();
          }
          this.changeRule();
        }
      });
    },
    formattingPositionArr(content) {
      let ary = copyDeep(content);
      let arr = [];
      for (let i = 0, len = ary.length; i < len; i++) {
        let obj = {
          pId: i,
          id: i + 1,
          name: ary[i],
          open: true,
        };
        arr.push(obj);
      }
      return arr;
    },
    creationTargetTree() {
      let arr = this.formattingPositionArr(this.activePosition.catalogPosition);
      let tree = $.fn.zTree.init(
        $("#targetPositionTree"),
        this.positionSetting,
        arr
      );
    },
    creationContentTree() {
      let arr = this.formattingPositionArr(this.activePosition.contentPosition);
      let tree = $.fn.zTree.init(
        $("#contentPositionTree"),
        this.positionSetting,
        arr
      );
    },
    positionBeforeRemove(treeId, treeNode) {
      let pId = treeNode.pId ? treeNode.pId : 0;
      if (treeId == "targetPositionTree") {
        this.activePosition.catalogPosition.splice(pId);
        this.creationTargetTree();
      } else {
        this.activePosition.contentPosition.splice(pId);
        this.creationContentTree();
      }
      return false;
    },
    positionBeforeEditName(treeId, treeNode) {
      let pId = treeNode.pId ? treeNode.pId : 0;
      let type = 2;
      this.positionName = "内容定位";
      if (treeId == "targetPositionTree") {
        this.positionName = "目录定位";
        type = 1;
      }
      this.positionContent = {
        text: treeNode.name,
        type: type,
        index: pId,
      };
      this.isShowPositionBox = true;
      return false;
    },
    addRule(is = false) {
      if (is) {
        this.initAddRule();
        return;
      }
      this.$refs["ruleListForm"].validate((valids) => {
        if (valids) {
          this.initAddRule();
        }
      });
    },
    initAddRule() {
      let fieldNumber = 1;
      let arr = this.ruleContent.ruleContent.ruleList;
      let len = arr.length;
      if (len > 0) {
        fieldNumber = Number(arr[len - 1].fieldNumber) + 1;
      }
      let obj = {
        fieldName: "#" + fieldNumber,
        fieldNumber: fieldNumber,
        charType: "1",
        charTypeName: ["1"],
        fieldState: 1,
        fieldChName: "",
        fieldEnName: "",
        rules: [],
        positionList: [],
        relyOnChar: "",
      };
      this.ruleContent.ruleContent.ruleList.push(obj);
      this.selectFieldName(len);
    },
    // 改变 筛选规则
    changeRuleFilter (item) {
      if (item.selected) return ;
      this.ruleFilterBtnList.forEach(value => {
        value.selected = item.id.includes(value.id);
      })
    },
    // 设置字符规则类型 过滤
    setActiveRuleType (type) {
      if (this.activeRuleType === type) return ;
      this.ruleFilterBtnList.forEach(item => {
        if (type === '3') {
          item.selected = item.id === type;
        } else {
          item.selected = item.id !== '3';
        }
      })
    },
    // 添加字符规则
    addRuleTable(type) {
      this.rulesModalType = type;
      this.rulesDataDetail = {
        ruleExpression: "",
        ruleType: type === 1 ?
          (this.activeRuleType === '3' ?
              '3' :
              (this.rulesModalRuleType ==='3' ?
                  '1' :
                  this.rulesModalRuleType
              )
          )
          : this.filtersModalRuleType,
        ruleRegExpression: '', // 正则规则
        ruleTableUpExpression: '', // 表头
        ruleTableUpExpressionTag: '', // 表头html
        ruleTableDownExpression: '', // 右下约束
        ruleTableDownExpressionTag: '', // 右下约束html
        index: -1,
      };
      this.positionContent = {
        text: "",
        type: "",
        index: -1,
      };
      this.$refs["ruleForm"] && this.$refs["ruleForm"].resetFields();
      this.isShowRuleBox = true;
      // 初始化聚焦 文本框
      this.$nextTick(() => {
        if (String(this.rulesDataDetail.ruleType) === '3') {
          this.$refs.tagTableUp.selectHandler();
          this.$refs.tagTableUp.keepLastIndex();
        } else if (String(this.rulesDataDetail.ruleType) === '1') {
          this.$refs.tagTextarea.selectHandler();
          this.$refs.tagTextarea.keepLastIndex();
        } else if (String(this.rulesDataDetail.ruleType) === '2') {
          this.$refs.ruleRegInput.focus();
        }
      })
    },
    // 关闭字符规则配置弹窗
    onCloseRuleMsgBox() {
      this.$refs["ruleForm"].resetFields();
      this.isShowRuleBox = false;
    },
    // 提交字符规则弹窗修改/新增
    onSubmitRule() {
      // 红色警告
      let {
        ruleExpression,
        ruleType,
        index,
        ruleTableUpExpression,
        ruleTableDownExpression,
        ruleRegExpression,
      } = this.rulesDataDetail;
      const message = `请输入${this.rulesModalType === 1 ? '规则内容' : '过滤内容'}!`;
      if (String(ruleType) === '1') {
        let ready = this.$refs.tagTextarea.checkHasData();
        if (!ready) {
          this.$hMessage.error(message);
          return;
        }
      } else if (String(ruleType) === '3') {
        const tagTableUp = this.$refs.tagTableUp.checkHasData();
        const tagTableDown = this.rulesModalType === 1 ? this.$refs.tagTableDown.checkHasData() : true;
        let ready = tagTableUp;
        // rulesModalType  1 字符规则 2 过滤表达式
        if (this.rulesModalType === 1) {
          ready = tagTableUp || tagTableDown
        }
        if (!ready) {
          if (this.rulesModalType === 1) {
            if (!tagTableUp && !tagTableDown) {
              this.$hMessage.error('请输入表头或者右下约束!');
            }
          } else {
            this.$hMessage.error(message);
          }
          return;
        }
      } else {
        if (!ruleRegExpression.trim()) {
          this.$hMessage.error(message);
          return ;
        }
      }
      // 去除标签
      let _ruleExpression = "";
      const reg = /<\/?[^>]+>/g;
      if (String(ruleType) === '1') {
        _ruleExpression = ruleExpression.replace(reg, "");
      } else {
        _ruleExpression = ruleRegExpression;
        ruleExpression = "";
      }
      let obj = {
        ruleExpression: _ruleExpression,
        ruleTableUpExpression: ruleTableUpExpression && ruleTableUpExpression.replace(reg, ""),
        ruleTableUpExpressionTag: ruleTableUpExpression,
        ruleTableDownExpression: ruleTableDownExpression && ruleTableDownExpression.replace(reg, ""),
        ruleTableDownExpressionTag: ruleTableDownExpression,
        ruleExpressionTag: ruleExpression,
        ruleType: ruleType,
      };
      if (this.rulesModalType === 1) {
        if (index == -1) {
          this.ruleListDetail.rules.push(obj);
        } else {
          this.$set(this.ruleListDetail.rules, index, obj);
        }
      } else {
        // obj = {
        //   ruleExpression: _ruleExpression,
        //   ruleExpressionTag: String(ruleType) === '3' ? ruleTableUpExpression : ruleExpression,
        //   filterExpression: String(ruleType) === '3' ? ruleTableUpExpression.replace(reg, "") : _ruleExpression,
        //   filterExpressionTag: ruleTableUpExpression,
        //   ruleType: ruleType,
        // }
        obj = {
          filterType: ruleType,
          filterExpression: _ruleExpression,
          filterExpressionTag: ruleExpression
        }
        if (index == -1) {
          this.ruleListDetail.filters.push(obj);
        } else {
          this.$set(this.ruleListDetail.filters, index, obj);
        }
      }
      // rulesModalType 弹窗类型  1 字符规则 2 结果过滤表达式
      if (this.rulesModalType === 1) {
        this.rulesModalRuleType = ruleType;
        // 将列表筛选置为新增的字符类型
        this.setActiveRuleType(ruleType);
      } else {
        this.filtersModalRuleType = ruleType;
      }
      this.onCloseRuleMsgBox();
      this.changeRule();
    },
    onSelectFieldName(i) {
      this.$refs["ruleListForm"].validate((valids) => {
        if (valids) {
          this.selectFieldName(i);
        }
      });
    },
    // 字符配置选择
    selectFieldName(i) {
      let obj = copyDeep(this.ruleContent.ruleContent.ruleList[i]);
      // 过滤表达式赋值
      obj.filters = obj.filters || [];
      // 抽取范围赋值 兼容历史数据
      obj.extractingRange = obj.extractingRange || [];
      this.ruleListDetail = obj;
      this.rulesIndex = i;
      this.rulesNumber = obj.fieldNumber.toString();
      if (obj.positionList && obj.positionList.length > 0) {
        this.activePositionTabsKey = obj.positionList[0];
        this.changePositionData();
      }
      // 设置过滤筛选 初始选择
      let typeList = this.ruleListDetail.rules.map(item => item.ruleType);
      typeList = [...new Set(typeList)];
      this.ruleFilterBtnList.forEach(item => {
        item.selected = false;
      })
      if (typeList.length === 1 && typeList[0] === '3' && this.ruleFilterBtnList.length) {
        this.ruleFilterBtnList[2].selected = true;
      } else {
        this.ruleFilterBtnList[0].selected = true;
        this.ruleFilterBtnList[1].selected = true;
      }
      this.$refs["ruleListForm"].resetFields();
    },
    // 字符类型 change 事件
    changeRule(arr = null) {
      if (arr) {
        this.ruleListDetail.charType = arr[arr.length - 1];
        this.ruleListDetail.charTypeName = arr;
      }
      let data = copyDeep(this.ruleListDetail);
      let i = this.rulesIndex;
      this.$set(this.ruleContent.ruleContent.ruleList, i, data);
    },
    ruleListRemove(key) {
      let data = copyDeep(this.ruleContent.ruleContent.ruleList[key]);
      let activeRulesNumber = this.ruleContent.ruleContent.ruleList[
        this.rulesIndex
      ].fieldNumber;
      this.ruleContent.ruleContent.ruleList.splice(key, 1);
      if (this.rulesNumber == data.fieldNumber) {
        let len = this.ruleContent.ruleContent.ruleList.length - 1;
        if (len >= key) {
          this.selectFieldName(key);
        } else if (len >= 0) {
          this.selectFieldName(len);
        }
      }
      for (
        let i = 0, len = this.ruleContent.ruleContent.ruleList.length;
        i < len;
        i++
      ) {
        if (
          activeRulesNumber ==
          this.ruleContent.ruleContent.ruleList[i].fieldNumber
        ) {
          this.rulesIndex = i;
        }
        if (
          this.ruleContent.ruleContent.ruleList[i].relyOnChar == data.fieldName
        ) {
          this.ruleContent.ruleContent.ruleList[i].relyOnChar = "";
        }
      }
    },
    addFieldsTable() {
      this.$refs["fieldForm"].resetFields();
      this.isShowFieldsBox = true;
    },
    onCloseFieldMsgBox() {
      this.fieldListDetail = {
        chineseName: "",
        englishName: "",
        ruleNames: "",
        index: -1,
      };
      this.isShowFieldsBox = false;
      this.$refs["fieldForm"].resetFields();
    },
    onSubmitField() {
      this.$refs["fieldForm"].validate((valid) => {
        if (valid) {
          let data = copyDeep(this.fieldListDetail);
          let index = data.index;
          let obj = {
            chineseName: data.chineseName,
            englishName: data.englishName,
            ruleNames: data.ruleNames.replace(/，/g, ","),
          };
          if (index == -1) {
            this.ruleContent.ruleContent.fieldList.push(obj);
          } else {
            this.$set(this.ruleContent.ruleContent.fieldList, index, obj);
          }
          this.onCloseFieldMsgBox();
        }
      });
    },
    clickTabs(name) {
      //this.ruleContent.ruleType = name;
      if (name == 1 && this.ruleContent.ruleContent.ruleList.length == 0) {
        this.addRule();
      }
      this.changeRule();
    },
    // 新增字符配置
    addNewRule(pId) {
      //this.$refs['regexpContentForm'].resetFields();
      this.$refs["ruleContentForm"].resetFields();
      this.ruleContent = {
        id: "",
        groupId: pId,
        configName: "",
        configDesc: "",
        businessCode: "",
        ruleType: "1",
        regexpContent: "",
        ruleContent: {
          targetPosition: [],
          contentPosition: [],
          positionRuleObj: {},
          ruleList: [],
          fieldList: [],
          tableList: [],
        },
      };
      this.tabsName = "1";
      this.$refs.configName.focus();
      this.addRule(true);
      this.reqMd5 = md5(JSON.stringify(this.ruleContent));
    },
    // 获取字符类型树
    getRuleStringType() {
      let url = "/tm/ruleType/getTree";
      this.$http
        .get(url)
        .then((res) => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            let list = oTmp.body.data || [];
            this.strTypeName = this.formattingStringType({}, list);
            this.strType = list;
            this.$nextTick(() => {
              if (this.$refs.ruleListForm) {
                // 防止请求慢导致显示不出来
                let charTypeName = this.ruleListDetail.charTypeName;
                this.ruleListDetail.charTypeName = copyDeep(charTypeName);
              }
            });
          } else {
            this.$hMessage.error(oTmp.msg);
          }
          if (this.isLocalSto == 1) {
            setTimeout(() => {
              this.setDetailLocalStorage();
            }, 10);
          }
        })
        .catch((err) => {
          if (this.isLocalSto == 1) {
            this.setDetailLocalStorage();
          }
          this.$hMessage.error("获取字符串类型失败");
        });
    },
    formattingStringType(obj, arr) {
      for (let i = 0, len = arr.length; i < len; i++) {
        obj[arr[i].value] = arr[i].label;
        if (arr[i].children && arr[i].children.length > 0) {
          this.formattingStringType(obj, arr[i].children);
        }
      }
      return obj;
    },
    getViewDetail(id) {
      let url = "/tm/testTask/detail?taskId=" + id;
      if (this.isGetDetail) return;
      this.isGetDetail = true;
      this.$http
        .get(url)
        .then((res) => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            let obj = oTmp.body || {};
            this.setDetail(obj);
          } else {
            this.$hMessage.error(oTmp.msg);
          }
          this.isGetDetail = false;
        })
        .catch((err) => {
          this.isGetDetail = false;
          this.$hMessage.error("获取详情失败");
        });
    },
    getDetail(id) {
      let url = "/tm/ruleConfig/getInfoById?id=" + id;
      if (this.isGetDetail) return;
      this.isGetDetail = true;
      this.$http
        .get(url)
        .then((res) => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            let obj = oTmp.body || {};
            this.setDetail(obj);
          } else {
            this.$hMessage.error(oTmp.msg);
          }
          this.isGetDetail = false;
        })
        .catch((err) => {
          this.isGetDetail = false;
          this.$hMessage.error("获取详情失败");
        });
    },
    setDetail(obj) {
      let self = this;
      //this.$refs['regexpContentForm'].resetFields();
      this.$refs["ruleContentForm"].resetFields();
      let data = {
        id: obj.id,
        configName: obj.configName,
        groupId: obj.groupId,
        ruleType: obj.ruleType,
        configDesc: obj.configDesc,
        ruleContent: obj.ruleContent,
        businessCode: obj.businessCode,
      };
      if (data.ruleType == 1) {
        data.regexpContent = "";
        data.ruleContent = JSON.parse(data.ruleContent);
        if (!data.ruleContent.positionRuleObj) {
          data.ruleContent.positionRuleObj = {};
        }
      } else {
        data.regexpContent = data.ruleContent
          ? data.ruleContent.toString()
          : "";
        data.ruleContent = {
          targetPosition: [],
          contentPosition: [],
          positionRuleObj: {},
          ruleList: [],
          fieldList: [],
        };
      }
      this.tabsName = data.ruleType.toString();
      this.ruleContent = data;
      if (data.ruleType == 1) {
        this.creationTargetTree();
        this.creationContentTree();
        if (data.ruleContent.ruleList.length > 0) {
          this.selectFieldName(0);
        }
      }
      this.reqMd5 = md5(JSON.stringify(data));
    },
    // 获取函数列表
    getFnList() {
      let url = "/tm/ruleFunc/getTree";
      this.$http
        .get(url)
        .then((res) => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            this.fnList = oTmp.body.data || [];
            this.delTree(this.fnList);
          } else {
            this.$hMessage.error(oTmp.msg);
          }
        })
        .catch((err) => {
          console.log(err)
          this.$hMessage.error("获取函数失败");
        });
    },
    delTree(fnList) {
      let fnIdDict = {};
      for (let item of fnList) {
        let children = item.children || [];
        for (let _item of children) {
          let id = _item.id;
          _item.selectValue = [item.value, _item.value];
          fnIdDict[id] = _item;
        }
      }
      this.fnIdDict = fnIdDict;
    },
    // 添加 修改 函数
    addfn(e) {
      this.tagMod = e.mod || false;
      if (this.tagMod) {
        let value = e.value;
        let text = e.text;
        if (text) {
          text.match(/\((.+)\)/g);
          let regText = RegExp.$1;
          let regList = regText.split(",");
          let argList = [];
          for (let i = 0; i < regList.length; i++) {
            let value = regList[i];
            value = value.replace(/^(")|(")$/g, "");
            argList[i] = {
              value: value,
            };
          }
          value.argList = argList;
        }
        this.fnData.value = value;
        this.fnData.name = e.value.selectValue;
      }
      this.isShowFnBox = true;
    },
    // 添加函数 弹窗关闭
    onCloseFNMsgBox() {
      this.isShowFnBox = false;
      (this.fnData = {
        value: {},
        name: [],
      }),
        this.$refs.rulefnForm.resetFields();
    },
    // 添加函数弹窗提交
    onSubmitFN() {
      // 添加函数
      this.$refs["rulefnForm"].validate((valid) => {
        if (valid) {
          if (String(this.rulesDataDetail.ruleType) === '1') {
            this.modifyFunctionElement = 'tagTextarea'
          } else {
            if (this.rulesModalType === 1) {
              this.modifyFunctionElement = this.modifyFunctionElement === 'tagTableDown' ? 'tagTableDown' : 'tagTableUp';
            } else {
              this.modifyFunctionElement = 'tagTableUp';
            }
          }
          if (this.tagMod) {
            this.$refs[this.modifyFunctionElement].changeTag(this.fnData);
          } else {
            this.$refs[this.modifyFunctionElement].addTag(this.fnData);
          }
          this.tagMod = false;
          this.onCloseFNMsgBox();
        }
      });
    },
    closeFatherMsgBox() {
      this.father = {
        id: "",
        groupName: "",
        isLeaf: "0",
        parentId: "",
      };
      this.$refs["fatherForm"].resetFields();
      this.isSubmitForm = false;
      this.isShowFatherMsgBox = false;
    },
    submitFather() {
      this.$refs["fatherForm"].validate((valid) => {
        if (valid) {
          if (this.isSubmitForm) return;
          this.isSubmitForm = true;
          this.setAddfield();
        }
      });
    },
    setAddfield() {
      let url = "/tm/businessGroup/modify";
      this.$http
        .put(url, this.father)
        .then((res) => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            this.getTree();
            this.closeFatherMsgBox();
          } else {
            this.$hMessage.error(oTmp.msg);
          }
        })
        .catch((err) => {
          this.$hMessage.error("提交失败");
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
      formData.append('ruleConfigId', this.ruleContent.id);
      repeatUploadFileMd5s.forEach(md5 => {
        formData.append('repeatUploadFileMd5s', md5);
      })
      fileList.forEach(file => {
        formData.append('files', file, file.name);
      })
      this.$http.post('/tm/ruleConfigFile/upload', formData).then(res => {
        let response = res.data;
        this.fileUpload = false;
        if (response.status === this.$api.SUCCESS) {
          let data = response.body || {};
          this.$hMessage.success("上传成功");
          let list = JSON.parse(data.json);
          this.testFileList = [...list, ...this.testFileList];
          this.selectionDel = [];
        } else {
          this.$hMessage.error(response.msg);
        }
      }).catch(() => {
        this.$hMessage.error('上传失败');
        this.fileUpload = false;
      })
    },
    handleBeforeUpload() {
      this.fileUpload = true;
    },
    uploadSuccess(response, file, fileList) {
      this.fileUpload = false;
      if (response.status == this.$api.SUCCESS) {
        let data = response.body || {};
        this.$hMessage.success("上传成功");
        let list = JSON.parse(data.json);
        this.testFileList = [...list, ...this.testFileList];
        this.selectionDel = [];
      } else {
        this.$hMessage.error(response.msg);
      }
    },
    uploadError(response, file, fileList) {
      this.fileUpload = false;
      this.$hMessage.error("上传失败");
    },
    isRepeat(arr) {
      var hash = {};
      for (var i in arr) {
        if (hash[arr[i]]) {
          return arr[i];
        }
        hash[arr[i]] = true;
      }
      return false;
    },
    onSave(id = null, cb = null) {
      this.$refs["ruleContentForm"].validate((valid) => {
        if (valid) {
          this.$refs["ruleListForm"].validate((valids) => {
            if (valids) {
              this.saveVerification(id, cb);
            }
          });
        }
      });
    },
    saveVerification(id = null, cb = null) {
      if (this.ruleContent.ruleType == "1") {
        let arr = [];
        let ruleList = this.ruleContent.ruleContent.ruleList;
        for (let i = 0, len = ruleList.length; i < len; i++) {
          arr.push(ruleList[i].fieldName);
        }
        let fieldList = this.ruleContent.ruleContent.fieldList;
        let strArr = [];
        for (let i = 0, len = fieldList.length; i < len; i++) {
          let a = fieldList[i].ruleNames.split(",");
          let isRepeat = this.isRepeat(a);
          if (isRepeat !== false) {
            this.$hMessage.error({
              content:
                "字段(中文名称)“" +
                fieldList[i].chineseName +
                "”中存在多个“" +
                isRepeat +
                "”",
              duration: 3,
            });
            return false;
          }
          strArr = [...strArr, ...a];
        }
        let err = [];
        for (let i = 0, len = strArr.length; i < len; i++) {
          let s = strArr[i];
          if (err.indexOf(s) == -1 && arr.indexOf(s) == -1 && s) {
            err.push(s);
          }
        }
        if (err.length > 0) {
          this.$hMessage.error({
            content: "未找到对应的字符配置：" + err.toString(),
            duration: 3,
          });
          return;
        }
        let content = copyDeep(this.ruleContent);
        delete content.regexpContent;
        content.ruleContent.tableList = [];
        content.ruleContent = JSON.stringify(content.ruleContent);
        this.setSave(content, id, cb);
      } else if (this.ruleContent.ruleType == "3") {
        let tableList = this.ruleContent.ruleContent.tableList;
        let arr = [];
        let strArr = [];
        for (let i = 0, len = tableList.length; i < len; i++) {
          let a = tableList[i].constraintColumn.split(",");
          if (a.indexOf(tableList[i].chineseName) != -1) {
            this.$hMessage.error({
              content:
                "列名(中文名称)：“" + tableList[i].chineseName + "”约束了自身",
              duration: 3,
            });
            return;
          }
          arr.push(tableList[i].chineseName);
          strArr = [...strArr, ...a];
        }
        let err = [];
        for (let i = 0, len = strArr.length; i < len; i++) {
          let s = strArr[i];
          if (err.indexOf(s) == -1 && arr.indexOf(s) == -1 && s) {
            err.push(s);
          }
        }
        if (err.length > 0) {
          this.$hMessage.error({
            content: "未找到对应的列名(中文名称)：" + err.toString(),
            duration: 3,
          });
          return;
        }
        let content = copyDeep(this.ruleContent);
        delete content.regexpContent;
        (content.ruleContent.ruleList = [
          {
            fieldNumber: "1",
            fieldName: "#1",
            charType: "1",
            charTypeName: ["1"],
            rules: [],
          },
        ]),
          (content.ruleContent.fieldList = []);
        content.ruleContent = JSON.stringify(content.ruleContent);
        this.setSave(content, id, cb);
      } else {
        this.$refs["regexpContentForm"].validate((valid) => {
          if (valid) {
            let content = copyDeep(this.ruleContent);
            content.ruleContent = content.regexpContent;
            delete content.regexpContent;
            this.setSave(content, id, cb);
          }
        });
      }
    },
    setSave(content, id, cb) {
      if (cb) {
        cb();
        return;
      }
      if (this.isGetDetail) return;
      this.isGetDetail = true;
      let url = "/tm/ruleConfig/modify";
      if (id) {
        url = "/tm/ruleConfig/putCache";
        if (content.id) {
          delete content.id;
        }
        content.md5 = id;
      }
      // console.log(JSON.parse(content.ruleContent))
      this.$http
        .put(url, content)
        .then((res) => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            if (content.md5) {
              this.closeTestMsgBox();
              let testFileList = this.testFileList;
              let fileIds = [];
              for (let i = 0, len = testFileList.length; i < len; i++) {
                fileIds.push(testFileList[i].md5);
              }
              let ids = JSON.stringify(fileIds);
              localStorage.preview_detail_file_md5_arr = ids;
              this.$router.push(
                "/extract/rule/preview?ruleConfigId=" +
                  oTmp.body.id +
                  "&fileMd5=" +
                  content.md5 +
                  "&ruleId=" +
                  this.initId
              );
              /*this.detailData = {
							ruleConfigId: oTmp.body.id,
							fileMd5: content.md5,
						}
						this.isShowPreview = true;*/
              this.isGetDetail = false;
              return;
            }
            this.emptyLocalStoData();
            this.$hMessage.success("保存成功");
            let id = oTmp.body && oTmp.body.id ? oTmp.body.id : "";
            if (id) {
              this.ruleContent.id = id;
              this.activeTreeId = oTmp.body.groupId;
              this.$router.push("/extract/rule/edit?id=" + id);
              this.initId = id;
              this.initPId = -1;
              this.initView = -1;
              this.$store.commit("SAVE_TAB_NAME", {
                path: this.$route.path,
                name: "配置规则 - 编辑",
              });
            }
            this.reqMd5 = md5(JSON.stringify(this.ruleContent));
          } else {
            this.$hMessage.error(oTmp.msg);
          }
          this.isGetDetail = false;
        })
        .catch((err) => {
          this.isGetDetail = false;
          if (content.md5) {
            this.$hMessage.error("预览失败");
          } else {
            this.$hMessage.error("保存失败");
          }
        });
    },
    getTestfile(id) {
      if (this.isGetFfileloading || !id) return;
      this.isGetFfileloading = true;
      let url = "/tm/ruleConfigFile/list?ruleConfigId=" + id;
      this.$http
        .get(url)
        .then((res) => {
          let oTmp = res.data;
          if (oTmp.status == this.$api.SUCCESS) {
            let data = oTmp.body || {};
            this.testFileList = data.data || [];
          } else {
            this.$hMessage.error(oTmp.msg);
          }
          this.isGetFfileloading = false;
        })
        .catch((err) => {
          this.isGetFfileloading = false;
          this.$hMessage.error("获取文件列表失败");
        });
    },
    onTest() {
      this.onSave(null, () => {
        this.isShowTestMsgBox = true;
      });

      //this.getTestfile();
    },
    closeTestMsgBox() {
      this.isShowTestMsgBox = false;
      this.selectionDel = [];
    },
    setDetailLocalStorage() {
      let data = JSON.parse(localStorage.extract_rule_add_content);
      this.reqMd5 = localStorage.extract_rule_add_content;
      this.ruleContent = data;
      if (data.ruleContent.ruleList.length > 0) {
        this.selectFieldName(0);
      }
      this.setMsgContent(true);
      this.isGetDetail = false;
    },
    initData() {
      let { id, pId, view, localSto } = this.$route.query;
      if (
        id == this.initId ||
        pId == this.initPId ||
        view == this.initView ||
        localSto == this.isLocalSto
      ) {
        if (id) {
          this.getDetail(id);
        }
        return;
      }
      if (localSto && localSto == 1 && localStorage.extract_rule_add_content) {
        this.isLocalSto = 1;
        let data = JSON.parse(localStorage.extract_rule_add_content);
        let pathName = "配置规则 - 编辑";
        if (data.id) {
          this.initId = data.id;
          this.initPId = -1;
          this.initView = -1;
          this.$router.push("/extract/rule/edit?id=" + data.id);
          this.getTestfile(data.id);
        } else {
          pathName = "配置规则 - 新增";
          this.initId = -1;
          this.initPId = data.groupId;
          this.initView = -1;
          this.$router.push("/extract/rule/add?pId=" + data.groupId);
        }
        this.isView = false;
        this.isGetDetail = true;
        this.$store.commit("SAVE_TAB_NAME", {
          path: this.$route.path,
          name: pathName,
        });
        return;
      }
      this.testFileList = [];
      this.isView = false;
      let pathName = "配置规则 - 编辑";
      if (pId) {
        pathName = "配置规则 - 新增";
      } else if (view) {
        this.isView = true;
        pathName = "配置规则 - 查看";
        if (this.isPersonal) {
          pathName = "个人测试任务 - 规则查看";
        }
      }
      this.$store.commit("SAVE_TAB_NAME", {
        path: this.$route.path,
        name: pathName,
      });
      this.$refs["ruleListForm"].resetFields();
      this.reqMd5 = "";
      if (pId) {
        this.initId = -1;
        this.initPId = pId;
        this.initView = -1;
        this.addNewRule(pId);
      } else if (view) {
        this.initId = -1;
        this.initPId = -1;
        this.initView = view;
        this.getViewDetail(view);
        this.getTestfile(view);
        this.setMsgContent(false);
        this.emptyLocalStoData();
      } else {
        this.initId = id;
        this.initPId = -1;
        this.initView = -1;
        this.getDetail(id);
        this.getTestfile(id);
      }
      this.setMsgContent(false);
    },
    // 添加参数
    addItem() {
      let fnData = this.fnData;
      let argList = this.fnData.value.argList;
      argList.push({
        value: "",
      });
      this.fnData = copyDeep(fnData);
    },
    // 删除参数
    removeItem(index) {
      let fnData = this.fnData;
      let argList = this.fnData.value.argList;
      argList.splice(index, 1);
      this.fnData = copyDeep(fnData);
    },
    changeRuleType() {
      setTimeout(() => {
        const type = String(this.rulesDataDetail.ruleType);
        this.$nextTick(() => {
          if (type === '3') {
            this.modifyFunctionElement = 'tagTableUp';
            this.$refs.tagTableUp.selectHandler();
            this.$refs.tagTableUp.keepLastIndex();
          } else if (type === '1') {
            this.modifyFunctionElement = 'tagTextarea';
            this.$refs.tagTextarea.selectHandler();
            this.$refs.tagTextarea.keepLastIndex();
          } else if (type === '2') {
            this.$refs.ruleRegInput.focus();
          }
        })
      }, 10)
      // this.$refs.ruleForm.resetFields(true);
      // this.$refs.ruleForm.resetValidate();
      // this.$refs.ruleForm.fields.forEach((e) => {
      //   e.resetValidate();
      //   if (e.prop === 'ruleRegExpression') {
      //     e.resetField();
      //   }
      // });
    },
    // 字符规则列表顺序调整  上
    topRule(index, type) {
      if (!index) {
        return this.$hMessage.warning("已经处于顶部，无法上移");
      }
      let rules = type === 1 ? this.ruleListDetail.rules : this.ruleListDetail.filters;
      const currentIndex = type === 1 ? this.ruleListBeforeFilter[index].index : this.expressionListBeforeFilter[index].index;
      const targetIndex = type === 1 ? this.ruleListBeforeFilter[index-1].index : this.expressionListBeforeFilter[index-1].index;
      this.swapArray(rules, currentIndex, targetIndex);
    },
    // 字符规则列表顺序调整  下
    downRule(index, type) {
      const length = type === 1 ? this.ruleListBeforeFilter.length-1 : this.expressionListBeforeFilter.length-1;
      if (index === length) {
        return this.$hMessage.warning("已经处于底部，无法下移");
      }
      let rules = type === 1 ? this.ruleListDetail.rules : this.ruleListDetail.filters;
      const currentIndex = type === 1 ? this.ruleListBeforeFilter[index].index : this.expressionListBeforeFilter[index].index;
      const targetIndex = type === 1 ? this.ruleListBeforeFilter[index+1].index : this.expressionListBeforeFilter[index+1].index;
      this.swapArray(rules, currentIndex, targetIndex);
    },
    // 字符规则列表顺序调整 显示弹窗
    showRuleIndexModal(index, type) {
      index = type === 1 ? this.ruleListBeforeFilter[index].index : this.expressionListBeforeFilter[index].index;
      this.beforeRuleIndex = index;
      this.afterRuleIndex = index + 2;
    },
    // 字符规则列表顺序调整 根据数字下标跟新顺序
    updateRuleIndex(type) {
      let rules = type === 1 ? this.ruleListDetail.rules : this.ruleListDetail.filters;
      document.getElementById('ruleTitle').click();
      const filterList = type === 1 ? this.ruleListBeforeFilter : this.expressionListBeforeFilter;
      if (filterList.length === 1) return ;
      let { beforeRuleIndex, afterRuleIndex } = this;
      if (afterRuleIndex > filterList.length) {
        afterRuleIndex = filterList[filterList.length-1].index;
      } else {
        afterRuleIndex = filterList[afterRuleIndex-1].index
      }
      this.swapArray(rules, beforeRuleIndex, afterRuleIndex);
    },
    //上移 将当前数组index索引与后面一个元素互换位置，向数组后面移动一位
    zIndexUp(arr, index, length) {
      if (index != 0) {
        this.swapArray(arr, index, index - 1);
      } else {
        this.$hMessage.warning("已经处于顶部，无法上移");
      }
    },
    //下移 将当前数组index索引与前面一个元素互换位置，向数组前面移动一位
    zIndexDown(arr, index, length) {
      if (index + 1 != length) {
        this.swapArray(arr, index, index + 1);
      } else {
        this.$hMessage.warning("已经处于底部，无法下移");
      }
    },
    // 交换位置
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      // console.log(this.ruleContent.ruleContent.ruleList)
      this.changeRule();
      return arr;
    },
  },

  mounted() {
    if (localStorage.active_file_md5) {
      this.activeFileMd5 = localStorage.active_file_md5;
      this.PDFurl =
        "/viewer.html?file=" +
        encodeURIComponent(
          "/tm/singlePreview/downloadPDF?fileMd5=" +
            localStorage.active_file_md5
        ) +
        "#page=1";
    }
    this.getExtractingRangeTree();
    this.getRuleStringType();
    this.getFnList();
    this.initData();
  },
  activated: function () {
    this.isMounted = false;
    this.initData();
  },
};
</script>
<style type="text/css" scoped>
.rule_periphery {
  height: 100%;
}
.header-content{
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.bussinessCode {
  display: flex;
  align-items: center;
}
.i.add {
  line-height: 0;
  margin: 0;
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  border: 0 none;
  cursor: pointer;
  outline: none;
  background-color: transparent;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-image: url("../../../../assets/css/img/zTreeStandard.png");
  *background-image: url("../../../../assets/css/img/zTreeStandard.gif");
  background-position: -144px 0;
  font-size: 0;
}
.rule {
  position: relative;
}
.rule >>> .ztree li span.button.add {
  margin-left: 5px;
  margin-right: 0;
  background-position: -144px 0;
  vertical-align: top;
  *vertical-align: middle;
}
.rule >>> .ztree li span.button.addfolder {
  margin-left: 5px;
  margin-right: 0;
  background: url(../../../../assets/css/img/diy/folder.png) no-repeat scroll 0
    0 transparent;
  vertical-align: top;
  *vertical-align: middle;
}
.rule >>> .ztree li span.button.copy {
  margin-left: 5px;
  margin-right: 0;
  background: url(../../../../assets/css/img/diy/copy.png) no-repeat scroll 0 0
    transparent;
  vertical-align: top;
  *vertical-align: middle;
}
.rule >>> .ztree li span.button.edit,
.rule >>> .ztree li span.button.remove {
  margin-left: 5px;
  margin-right: 0;
}

.rule >>> .ztree li span.button.father_ico_open {
  margin-right: 2px;
  background-position: -110px -16px;
  vertical-align: top;
  *vertical-align: middle;
}
.rule >>> .ztree li span.button.father_ico_close,
.rule >>> .ztree li span.button.father_ico_docu {
  margin-right: 2px;
  background-position: -110px 0;
  vertical-align: top;
  *vertical-align: middle;
}
.rule >>> .ztree li span.button.child_ico_docu,
.rule >>> .ztree li span.button.child_ico_docu {
  margin-right: 2px;
  background-position: -110px -32px;
  vertical-align: top;
  *vertical-align: middle;
}
.rule >>> .tab-operation {
  text-align: center;
}
.rule >>> .tab-operation > span {
  margin-right: 5px;
  color: #298dff;
  cursor: pointer;
}
.title {
  padding: 6px 0;
  font-weight: 600;
}
.title span {
  float: right;
  cursor: pointer;
  font-weight: normal;
  color: #298dff;
}
.textareabox .list {
  margin-top: 15px;
}
.btnbox {
  padding-top: 10px;
  text-align: center;
  background: #f7f7f7;
  z-index: 99;
  height: 42px;
}
.btnbox-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 43px;
  background: #f7f7f7;
  z-index: 10;
  border-top: 1px solid #dfdfdf;
  padding-top: 10px;
}
.dateFn {
  margin-right: 10px;
}
.ps {
  line-height: 1;
}
.position {
  display: flex;
  background: #fff;
}
.position_tabs >>> .h-tabs-bar {
  margin-bottom: 0;
}
.position .list {
  margin-top: 0;
  width: 50%;
  border: 1px solid #dfdfdf;
  border-top: none;
}
.position .list:first-child {
  border-right: none;
}
.position .list .title {
  padding-left: 5px;
  padding-right: 5px;
  border-bottom: 1px dotted #dfdfdf;
  font-size: 12px;
}
.position .ztree-box {
  width: 100%;
  overflow: auto;
}
.position-ps {
  padding-left: 12px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
}
.ruleList {
  font-size: 0;
  display: flex;
  transition: transform 0s;
}
.ruleList.ps {
  line-height: 24px;
  height: 24px;
  font-size: 12px;
  padding-left: 10px;
}
.ruleList .ruleListleft {
  font-size: 14px;
  width: 160px;
  display: inline-block;
  vertical-align: top;
  border: 1px solid #dfdfdf;
  position: relative;
  transition: transform 0s;
}
.ruleList .ruleListleft .ruleListleft-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.ruleList .ruleListleft .title {
  border-bottom: 1px dotted #dfdfdf;
  padding: 5px;
  background: #add8e6;
}
.ruleListleft ul {
  height: calc(100% - 34px);
  overflow: auto;
  padding: 0;
  background: #fff;
}
.ruleListleft ul li {
  line-height: 24px;
  padding: 0 5px;
  background: #f0f8ff;
  border-bottom: 1px solid #dfdfdf;
}
.ruleListleft ul li:nth-child(odd) {
  background: #fff;
}
.ruleListleft .button {
  display: none;
}
.ruleListleft >>> .curSelectedNode {
  background: none;
  border: 0;
  opacity: 1;
  color: #298dff;
  height: 24px;
  line-height: 24px;
}
.ruleListleft >>> .curSelectedNode .button {
  display: inline-block;
}
.ruleListleft >>> .ztree a {
  padding: 0;
  display: block;
  height: 24px;
  line-height: 24px;
}
.ruleListleft >>> .icon-t-b-delete.iconfont {
  font-size: 14px;
  color: rgb(245, 34, 45);
  display: none;
}
.ruleListleft >>> .curSelectedNode .icon-t-b-delete.iconfont {
  display: inline-block;
}
.ruleListleft a:hover {
  text-decoration: none;
  color: #298dff;
}
.ruleListleft a:hover .icon-t-b-delete.iconfont {
  display: inline-block;
}
.ruleListleft .name {
  float: left;
  line-height: 24px;
  padding-right: 5px;
  margin-right: 0;
  max-width: calc(100% - 12px);
  overflow: hidden;
}
.ruleList .ruleListright {
  padding: 5px;
  font-size: 14px;
  width: calc(100% - 160px);
  display: inline-block;
  vertical-align: top;
  border: 1px solid #dfdfdf;
  border-left: 0;
}
.fnList {
  padding: 0 10px;
  border: 1px solid #00f;
  margin-right: 10px;
  line-height: 28px;
  border-radius: 2px;
  display: inline-block;
}
.add-fn {
  text-align: right;
}
.add-fn span {
  cursor: pointer;
  color: #298dff;
}
.h-spin {
  font-size: 12px;
  z-index: 10;
}
.testfile {
  position: relative;
}
.testcontents {
  position: relative;
}
.testcontents .uploadfile {
  line-height: 32px;
  margin-bottom: 10px;
}
.testcontents .h-upload {
  display: inline-block;
}
.testcontents >>> .test-btn {
  color: #298dff;
  text-align: center;
  cursor: pointer;
}
.del-box {
  padding-top: 10px;
  line-height: 24px;
}
.del-box button {
  float: right;
}
.title.positionbox {
  padding-top: 15px;
}
.box-left-content,
.box-right-content {
  height: 100%;
  min-width: 500px;
}
.box-right-content {
  overflow-x: auto;
}

.pdf-file-list {
  position: absolute;
  top: 32px;
  left: 0;
  bottom: 0;
  width: 0;
  background: rgba(0, 0, 0, 0.5);
}
.pdf-file-list:hover {
  width: 200px;
}
.pdf-file-list p {
  font-weight: 600;
  padding: 0 10px;
  color: #fff;
  font-size: 13px;
  line-height: 28px;
  border-bottom: 1px dotted #fff;
  width: 100%;
  display: none;
}
.pdf-file-list ul {
  height: calc(100% - 30px);
  overflow: auto;
  padding: 0 10px 10px 10px;
  width: 100%;
  display: none;
}
.pdf-file-list li {
  color: #fff;
  overflow: hidden;
  margin-top: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.pdf-file-list li:hover {
  text-decoration: underline;
  cursor: pointer;
}
.pdf-file-list >>> p span {
  float: right;
  line-height: 28px;
  cursor: pointer;
}
.pdf-file-list >>> p .h-upload {
  float: right;
}
.pdf-file-list .icon {
  width: 30px;
  height: 24px;
  line-height: 24px;
  color: #fff;
  background: #298dff;
  text-align: center;
  cursor: pointer;
  border-radius: 0 5px 5px 0;
}
.pdf-file-list:hover .icon {
  display: none;
}
.pdf-file-list:hover p,
.pdf-file-list:hover ul {
  display: block;
}
.pdf-file-list .no-file,
.pdf-file-list .no-file:hover {
  text-align: center;
  cursor: auto;
  text-decoration: none;
}
.pdf-file-list .active {
  text-decoration: underline;
  color: #f60;
}
.ruleListleft-wrapper >>> .h-btn-small {
  padding: 0;
}
.ruleListleft-wrapper >>> .h-poptip-popper {
  cursor: auto;
}
</style>
<style lang="scss" scoped>
.rule_periphery{
  >>> .setting_title{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .h-upload{
      .h-upload-list{
        margin-top: 0;
      }
    }
  }
}
</style>
