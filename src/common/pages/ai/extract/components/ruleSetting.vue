<template>
  <div class="rule_setting">
    <main class="rule_content">
      <h-form
        :model="ruleListDetail"
        label-position="right"
        :label-width="110"
        ref="ruleListForm"
        @submit.native.prevent
        :rules="rules"
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
        <h-form-item label="字符英文名称：" prop="fieldEnName">
          <h-input
            placeholder="字符英文名称"
            disabled
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
          <Select v-model.trim="ruleListDetail.relyOnChar" @on-change="changeRule()">
            <Option v-for="(item) in relyOnList" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </h-form-item>
        <h-form-item label="抽取范围：">
          <h-cascader :data="extractingRangeList"
                      v-model="ruleListDetail.extractingRange"
                      @on-change="changeExtractingRange"
                      @on-remove-tag="changeExtractingRange"
                      multiple
                      clearable
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
        <span @click="addRuleTable(1)" class="i add" title="新建"></span>
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
        <span @click="addRuleTable(2)" class="i add" title="新建"></span>
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
    </main>
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
              @modalShow="addFn"
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
                @modalShow="addFn"
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
                @modalShow="addFn"
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
              <span @click="addFn">添加函数</span>
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
  </div>
</template>

<script>
import { copyDeep } from "@/filters/index";
import modalView from "../components/modalView";
import tagTextarea from "../components/tagTextarea";
export default {
  name: "ruleSetting",
  components: { modalView , tagTextarea },
  props: {
    // 表单数据
    ruleListDetail: {
      type: Object,
      default: () => {
        return {
          fieldNumber: '',
          fieldName: '',
          charType: '',
          charTypeName: [],
          fieldState: '',
          fieldChName: '',
          fieldEnName: '',
          rules: [],
          filters: [],
          extractingRange: [],
          positionList: [],
          relyOnChar: ""
        }
      }
    },
    // 字符类型列表
    strType: Array,
    // 依赖字符列表
    relyOnList: Array,
    // 抽取范围列表
    extractingRangeList: Array,
    // 函数列表
    fnList: Array,
    // 函数对应字典
    fnIdDict: Object
  },
  data () {
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
      // 表单校验规则
      rules: {},
      isShowRuleBox: false, // 规则弹窗
      isShowFnBox: false, // 函数弹窗
      rulesModalType: 1, // 弹窗类型  1规则  2 结果过滤表达式
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
      // 函数信息
      fnData: {
        value: {
          // 参数
          // argList: []
        },
        name: [],
      },
      modifyFunctionElement: '', // 添加函数/修改函数 对应的dom
      // 顺序调整
      beforeRuleIndex: 0,
      afterRuleIndex: 0,
      // 结果过滤表达式表格配置
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
      // 定位弹窗信息
      positionContent: {
        text: "", // 内容
        type: "", // 1 目录 2 内容
        index: -1 // -1 新增  其他 修改的下标
      },
    }
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
  },
  created() {
  },
  methods: {
    initFilter () {
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
    },
    // 抽取范围字段 label 模板显示自定义
    extractingRangeFormat (labels) {
      return labels[labels.length-1]
    },
    // 字符类型渲染模板
    formatStrType(labels, selectedData) {
      if (selectedData.length > 0) {
        return selectedData[selectedData.length - 1].label;
      }
      return "";
    },
    // change 触发
    changeRule (arr = null) {
      if (arr) {
        this.ruleListDetail.charType = arr[arr.length - 1];
        this.ruleListDetail.charTypeName = arr;
      }
    },
    // 抽取范围 change 事件 // 选中 移除
    changeExtractingRange () {
      // hui on change 事件触发在 v - model 更新之前
      setTimeout(() => {
        this.changeRule();
      }, 0)
    },
    // 新增规则列表
    addRuleTable (type) {
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
    // 弹窗规则类型修改
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
    // 添加 修改 函数
    addFn(e) {
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
      this.fnData = {
        value: {},
        name: [],
      }
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
        // rulesModalType  1 字符规则 2 结果过滤表达式
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
    // 交换位置
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      // console.log(this.ruleContent.ruleContent.ruleList)
      this.changeRule();
      return arr;
    },
  }
}
</script>

<style lang="scss" scoped>
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
.add-fn {
  text-align: right;
}
.add-fn span {
  cursor: pointer;
  color: #298dff;
}
.ps {
  line-height: 1;
}
.rule_setting{}
</style>
