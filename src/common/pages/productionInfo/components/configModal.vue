<template>
  <h-msgBox
    title="编辑属性"
    v-model="modalValue"
    @on-close="onCloseFileMsgBox"
    class-name="vertical-center-modal"
    width="800"
    height='600'
    :mask-closable='false'
  >
    <div class="file-form">
      <h-form
        :model="form"
        ref="detailForm"
        label-position="right"
        :label-width="100"
        @submit.native.prevent
        :rules="modulesRule"
      >
        <h-form-item label="字段名称：" prop="fieldCode" v-if='detailsConfigType'>
          <h-simple-select
            filterable
            v-model="form.fieldCode"
            placeholder="请选择字段名称"
            :clearable="false"
            @on-change="changeBizCode"
          >
            <h-select-block :data="attrList"></h-select-block>
          </h-simple-select>
        </h-form-item>
        <h-form-item label="字段名称：" prop="fieldName" v-else>
          <h-input v-model.trim="form.fieldName" placeholder="请输入名称"></h-input>
        </h-form-item>
        <h-form-item label="字段编码：" prop="fieldCode">
          <h-input v-model.trim="form.fieldCode" placeholder="请输入编码" :disabled='!isRuleAdd'></h-input>
        </h-form-item>
        <h-form-item label="业务类型：" prop="bizTypes">
          <Select
            :disabled="bizTypeDisabled"
            v-model="form.bizTypes"
            placeholder="请配置业务类型"
            multiple
            isCheckall
            filterable
            multClearable
            @on-change='changeBizType'
          >
            <Option
              v-for="(option, index) in bizTypeList"
              :value="option.entryValue"
              :key="index"
            >{{ option.entryName }}
            </Option>
          </Select>
        </h-form-item>
        <h-form-item label="业务属性：" prop="bizGroupCode">
          <Select
            v-model="form.bizGroupCode"
            placeholder="请配置业务属性"
            :clearable="false"
            :disabled='!isRuleAdd'
            @on-change='bizGroupCodeChange'
          >
            <Option
              v-for="(option, index) in groupList"
              :value="option.bizGroupCode"
              :key="index"
            >{{ option.bizGroupName }}
            </Option>
          </Select>
        </h-form-item>

        <h-form-item label="字段类型：" prop="fieldType">
          <Select
            v-model="form.fieldType"
            placeholder="请配置字段格式"
            :clearable="false"
            @on-change="changeFieldType"
            :disabled='!isRuleAdd'
          >
            <Option
              v-for="(option, index) in fieldTypeList"
              :value="option.entryOrder"
              :key="index"
            >{{ option.entryName }}
            </Option>
          </Select>
        </h-form-item>
        <h-form-item
          label="常量项："
          v-if="form.fieldType == 5"
          prop="defaultValue"
          :rules="{ required: form.fieldType == 5 ? true : false,validator: validateDefaultValue, trigger:'change'}"
        >
          <Select v-model="form.defaultValue" placeholder="请选择常量项" :disabled='detailsConfigType'>
            <Option v-for="(value, key, index) in DictItem" :value="key" :key="key">{{ value }}</Option>
          </Select>
        </h-form-item>
        <h-form-item
          label="常量(搜索)项："
          v-if="form.fieldType == 6"
          prop="defaultValue"
          :rules="{ required: form.fieldType == 6 ? true : false,validator: validateDefaultValue, trigger:'change'}"
        >
          <Select v-model="form.defaultValue" placeholder="请选择常量(搜索)项" :disabled='detailsConfigType'>
            <Option
              v-for="(item, key) in SearchDict"
              :value="item.entryValue"
              :key="key"
            >{{ item.entryName }}
            </Option>
          </Select>
        </h-form-item>
        <h-form-item label="字段描述：" prop="fieldDesc">
          <h-input v-model.trim="form.fieldDesc" placeholder="请输入字段描述" type='textarea'></h-input>
        </h-form-item>
        <h-form-item
          label="字段长度："
          v-if="form.fieldType != 5 && form.fieldType != 6"
          prop="length"
          :rules="{ required: form.fieldType != 5 || form.fieldType != 6 ? true : false,validator: validateLength, trigger:'change'}"
        >
          <h-input v-model="form.length" placeholder="请输入字段长度" @on-keyup="inputChange"
                   :disabled='detailsConfigType'></h-input>
        </h-form-item>
        <h-form-item label="是否必填：">
          <RadioGroup v-model="form.required">
            <Radio :label="1">
              <span>是</span>
            </Radio>
            <Radio :label="0">
              <span>否</span>
            </Radio>
          </RadioGroup>
        </h-form-item>
        <h-form-item label="分组类型：">
          <RadioGroup v-model="form.bizGroupType">
            <Radio v-for='(item, index) in bizGroupTypeList' :key='index' :label="parseInt(item.entryValue)"
                   :disabled='true'>
              <span>{{ item.entryName }}</span>
            </Radio>
          </RadioGroup>
        </h-form-item>
        <h-form-item label="备注：" prop="len">
          <h-input v-model.trim="form.remark" placeholder="请输入备注"></h-input>
        </h-form-item>
      </h-form>
      <dl v-if='detailsConfigType'>
        <dt>替换规则：</dt>
        <dd>
          <div v-for="(rule, index) in form.repRules" :key="index">
            <ReplaceRules :rule="rule" :disabled='detailsConfigType'>
              <div slot="deleteBtn" @click="deleteRule(index)" class="deleteBtn">删除</div>
            </ReplaceRules>
          </div>
          <div v-if='detailsConfigType && form.repRules && form.repRules.length == 0' style="line-height:30px">无法修改
          </div>
          <h-button type="info" style="width:100%;" @on-click="addRule" v-if='!detailsConfigType'>+</h-button>
        </dd>
      </dl>
      <dl v-if='detailsConfigType'>
        <dt>前台校验：</dt>
        <dd>
          <Verification
            :disabled='detailsConfigType'
            :dataList="form.verifyRules"
          ></Verification>
        </dd>
      </dl>
    </div>
    <div slot="footer" class="draggable-form-footer">
      <h-button @click="onCloseFileMsgBox">取消</h-button>
      <h-button type="info" @click="onOk">确定</h-button>
    </div>
  </h-msgBox>
</template>

<script>
import Verification from "./verification";
import ReplaceRules from "./replaceRules";
import {copyDeep} from '@/filters/index'
import {getTempGroups} from '../api/apiManager'

export default {
  components: {Verification, ReplaceRules},
  props: {
    value: Boolean,
    bizTypeDisabled: Boolean,
    formValue: Object,
    attrList: Array,
    groupList: Array,
    bizTypeList: Array,
    fieldTypeList: Array,
    DictItem: Object,
    SearchDict: Array,
    detailsConfigType: Boolean,
    isRuleAdd: Boolean,
    bizGroupTypeList: Array,
  },
  computed: {},
  data() {
    return {
      modalValue: false,
      modulesRule: {
        fieldCode: [{required: true, message: "请输入", trigger: "change"}],
        fieldName: [
          {
            required: true,
            message: "请输入",
            // validator: this.validateFieldName,
            trigger: "change",
          },
        ],
        bizTypes: [{required: true, message: "请选择", trigger: "change", type: 'array'}],
        bizGroupCode: [{required: true, message: "请选择", trigger: "change"}],
        length: [{required: true, message: "请输入", trigger: "change"}],
        fieldDesc: [{required: false, message: "请输入", trigger: "change"}],
      },
      form: {
        bizGroupCode: '',
        bizTypes: [],
        id: "", //字段id
        fieldName: "", //字段名
        fieldCode: "", //字段编码
        fieldType: 2, //字段类型，1数字，2文本，3日期，4金额
        required: 0, //是否必填，1是，0否
        fieldDesc: "", //字段描述
        length: "", //字段长度
        remark: "", //备注
        defaultValue: "", //枚举类型,
        bizGroupType: 1,
      },
      // groupList: [],
      rules: [],
      formValueChange: false,
      id: '',
    };
  },
  watch: {
    formValue(value) {
      if (value.fieldCode) {
        this.formValueChange = true
      }
      this.form = value;
      this.id = value.id
      setTimeout(() => {
        this.$nextTick(() => {
          this.resetFields()
        }, 0)
      })
    },
    value(value) {
      this.modalValue = value;
    }
  },
  methods: {
    onCloseFileMsgBox() {
      this.$emit("input", false);
    },
    changeFieldType() {
      if (this.form.fieldType === 5 || this.form.fieldType === 6) {
        this.form.length = "";
      } else {
        this.form.defaultValue = "";
      }
    },
    inputChange() {
      this.form.length = this.form.length.toString().replace(/[^\d]/g, "");
      if (this.form.length == "0") {
        this.form.length = "";
      }
    },
    validateLength(rule, value, callback) {
      if (this.form.fieldType != 5 && value == "") {
        callback(new Error("请输入"));
      } else {
        callback();
      }
    },
    validateDefaultValue(rule, value, callback) {
      if ((this.form.fieldType == 5 || this.form.fieldType == 6) && value == '') {
        callback(new Error('请选择'));
      } else {
        callback();
      }
    },
    validateFieldName(rule, value, callback) {
      if (value == "") {
        callback(new Error("请输入"));
      } else {
        let isOk = true;
        let a = this.rowList;
        let b = this.colList;
        let item = this.activeItem;
        let k = this.activeInex;
        for (let i = 0, len = a.length; i < len; i++) {
          if (a[i].fieldName == value && i != k && item == "row") {
            isOk = false;
          }
        }
        for (let i = 0, len = b.length; i < len; i++) {
          if (b[i].fieldName == value && i != k && item == "col") {
            isOk = false;
          }
        }
        if (isOk) {
          if (this.$parent[this.validateName]) {
            let repetition = this.$parent[this.validateName](this.index, value);
            if (repetition) {
              callback(new Error("已存在"));
              return;
            }
          }
          callback();
        } else {
          callback(new Error("已存在"));
        }
      }
    },
    deleteRule(index) {
      this.$hMsgBox.confirm({
        isOkLeft: true,
        title: "提示",
        content: "是否删除该条替换规则",
        onOk: () => {
          this.rules.splice(index, 1);
        },
      });
    },
    addRule() {
      this.rules.push(
        {
          after: '',
          before: '',
        }
      )
    },
    onOk() {
      this.$refs['detailForm'].validate((valid) => {
        if (valid) {
          let obj = copyDeep(this.form)
          obj.id = this.id
          if (this.isRuleAdd) {
            this.$emit("addAttr", obj);
          } else {
            this.$emit("changeAttr", obj);
          }
          this.$refs['detailForm'] && this.$refs['detailForm'].resetValidate()
          // let obj = copyDeep(this.form)
          // if(this.activeItem == 'row'){
          // 	this.rowList[this.activeInex] = obj;
          // }else{
          // 	this.colList[this.activeInex] = obj;
          // }
          // this.changeValue();
          // this.onCloseFileMsgBox();
        }
      })
    },
    changeBizType(value) {
      return;
      if (!value) {
        return
      }
      getTempGroups({}).then(
        data => {
          this.groupList = data.bizGroups || []
        }
      )
    },
    changeBizCode(value) {
      if (this.formValueChange) {
        this.formValueChange = false
        return
      }
      for (let i = 0; i < this.attrList.length; i++) {
        let fieldCode = this.attrList[i].fieldCode
        if (fieldCode == value) {
          let form = copyDeep(this.attrList[i])
          // form.bizTypes = form.bizTypes.toString()
          form.bizTypes = form.bizTypes || []
          form.fieldId = form.fieldId
          this.form = form
          break
        }
      }
    },
    bizGroupCodeChange(value) {
      for (let i = 0; i < this.groupList.length; i++) {
        let item = this.groupList[i]
        if (item.bizGroupCode == value) {
          this.form.bizGroupType = item.bizGroupType
          break
        }
      }
    },
    resetFields() {
      this.$refs['detailForm'] && this.$refs['detailForm'].resetValidate()
    }

  },
};
</script>

<style style='scss' scoped>
dl + dl {
  margin-top: 20px;
}

dt,
dd {
  display: inline-block;
  vertical-align: top;
}

dt {
  line-height: 30px;
  width: 100px;
  text-align: right;
}

dd {
  width: calc(100% - 105px);
}

.deleteBtn {
  color: #298dff;
  cursor: pointer;
}

.deleteBtn:hover {
  color: #0067dc;
}
</style>
