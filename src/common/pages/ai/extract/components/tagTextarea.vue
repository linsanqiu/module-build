<template>
  <div id='tagTextView'>
    <div class="w-textarea" ref="wTextarea" :style="{border: borderRred}">
      <div :style="tooltipsCss" class="w-tooltops">{{hoverText}}</div>
      <div
        class="w-textarea_input"
        ref="wTextareaContent"
        :id="contentId"
        @click="inputClick($event)"
        @focus="isLocked = true"
        @blur="onBlur()"
        @input="handleInput($event.target)"
        :contenteditable="true"
        :style="{minHeight: minHeight ? minHeight + 'px' : '100px'}"
        @mousemove="mouseMove($event)"
      ></div>
    </div>
    <div class="verify-tip verify-bottom" v-if="borderRred">
      <div class="verify-tip-arrow"></div>
      <div class="verify-tip-inner">请输入</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tagTextarea",
  data() {
    return {
      // 记录currentText以计算长度
      currentText: this.value,
      valueId: null,
      // 为input区域生成随机id，当在页面上有多个组件时，用于监听光标的变化
      contentId: `content${this.getGuid()}`,
      // 输入的时候锁定，禁止更新innerHTML
      isLocked: false,
      // 记录当前选中tag的ID
      currentTagId: null,
      // 当前光标位置
      savedRange: null,
      tooltipsCss: {
        left: "0px",
        top: "-500px"
      },
      hoverText: "",
      borderRred: ""
    };
  },
  props: {
    required: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    },
    tag: {
      // 自定义模版标签的标签名
      type: String,
      // 默认使用span作为标签名，并添加了默认样式
      // 当使用其他标签名的时候，需要另写标签样式
      default: "tag"
    },
    minHeight: {
      // 最小高度
      type: String,
      default: '100'
    },
    // id对应的每一项item
    fnIdDict: {}
  },
  computed: {

  },
  mounted() {
    // 初始化数据
    this.currentText &&
      (this.$refs.wTextareaContent.innerHTML = this.currentText);
    // 每次光标变化的时候，保存 range
    document.addEventListener("selectionchange", this.selectHandler);
    let el = document.getElementById(this.contentId);
    this.keepLastIndex(el);
  },
  beforeDestroy() {
    // 卸载事件
    document.removeEventListener("selectionchange", this.selectHandler);
  },
  methods: {
    checkFormError() {
      if (!this.required) return true
      if (this.currentText && this.currentText.length > 0) {
        this.borderRred = "";
        return true;
      } else {
        this.borderRred = "1px solid #F5222D !important";
        return false;
      }
    },
    // 校验是否有值
    checkHasData() {
      return Boolean(this.currentText && this.currentText.length > 0)
    },
    keepLastIndex(obj) {
      obj = obj || document.getElementById(this.contentId);
      if (window.getSelection) {
        //ie11 10 9 ff safari
        obj.focus(); //解决ff不获取焦点无法定位问题
        var range = window.getSelection(); //创建range
        range.selectAllChildren(obj); //range 选择obj下所有子内容
        range.collapseToEnd(); //光标移至最后
      } else if (document.selection) {
        //ie10 9 8 7 6 5
        var range = document.selection.createRange(); //创建选择对象
        //var range = document.body.createTextRange();
        range.moveToElementText(obj); //range定位到obj
        range.collapse(false); //光标移至最后
        range.select();
      }
    },
    updateData(text) {
      this.$emit("input", text);
    },
    openTagDialog(type) {
      // 将事件抛给父组件处理
      // 处理后需要调用 addTag() 将内容传回来
      this.$emit("add", type);
    },
    getTagStr(argList, functionName) {
      let _list = [];
      if (argList.length > 0 && argList[0].value != "") {
        for (let arg of argList) {
          let value = `"${arg.value}"`
          value = value.replace(/\,/g, "，");
          value = value.replace(/\(/g, "（");
          value = value.replace(/\)/g, "）");
          _list.push(value);
        }
        functionName = `${functionName}(${_list.join(",")})`;
      }
      return functionName;
    },
    addTag(fnData) {
      let { id, label, functionName, argList, paramType } = fnData.value;
      // 创建模版标签
      let node = document.createElement(this.tag);
      if (paramType === 1 || paramType === 2) {
        functionName = this.getTagStr(argList, functionName);
      }
      node.innerText = `\${${functionName}}`;
      // 添加id便于删除， valueId用于反查
      node.id = this.getGuid();
      node.setAttribute("valueId", id);
      this.insertNode(node);
    },
    changeTag(fnData) {
      let { id, label, functionName, argList, paramType } = fnData.value;
      let currentTagId = this.currentTagId;
      let t = document.getElementById(currentTagId);
      if (paramType === 1 || paramType === 2) {
        functionName = this.getTagStr(argList, functionName);
      }
      t.innerText = `\${${functionName}}`;
      t.setAttribute("valueId", id);
      let target = this.$refs.wTextareaContent;
      this.handleInput(target);
    },
    insertNode(node) {
      // 在内容中插入标签
      if (!this.savedRange) {
        return;
      }
      // 删掉选中的内容（如有）
      this.savedRange.deleteContents();
      // 插入链接
      this.savedRange.insertNode(node);
      // 更新双向绑定数据
      let target = this.$refs.wTextareaContent;
      this.updateData(target.innerHTML);
      this.currentText = target.innerText;
      // 光标恢复原点
      this.moveRange(node);
      this.checkFormError();
    },
    moveRange(node) {
      let range = this.savedRange;
      if (!range) {
        range = document.createRange();
      }
      range.setEndAfter(node);
      range.setStartAfter(node);
      range.collapse(false);
      let sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      node.focus();
    },
    handleInput(target) {
      // 即时更新数据
      this.updateData(target.innerHTML);
      this.currentText = target.innerText;
      this.checkFormError();
    },
    // 监听“删除”事件
    // handleDelete(e) {
    //   if (this.currentTagId) {
    //     // 若已选中模版标签，直接删除dom节点
    //     let t = document.getElementById(this.currentTagId);
    //     this.$refs.wTextareaContent.removeChild(t);
    //     this.currentTagId = null;
    //     // 阻止浏览器默认的删除事件，并手动更新数据
    //     e.preventDefault();
    //     this.handleInput(e.target);
    //   }
    // },
    modalShow() {
      let currentTagId = this.currentTagId;
      let valueId = this.valueId;
      let paramType = this.fnIdDict[valueId].paramType;
      let text = "";
      if (paramType === 1 || paramType == 2) {
        text = this.currentText;
      }
      this.$emit("modalShow", {
        mod: true,
        value: this.fnIdDict[valueId],
        text: text
      });
    },
    inputClick(e) {
      // 监听点击事件
      this.isLocked = true;
      const TAG_NAME = e.target.nodeName;
      if (TAG_NAME === this.tag.toUpperCase()) {
        // 点击模版标签时，记录id
        this.currentTagId = e.target.id;
        this.currentText = e.target.innerHTML;
        this.valueId = e.target.getAttribute("valueId");
        this.modalShow();
      } else {
        this.$refs.wTextareaContent.focus();
        this.currentTagId = null;
      }
    },
    onBlur() {
      this.isLocked = false;
      this.removeToolTops();
    },
    removeToolTops: function() {
      if (this.tooltipsCss.left == "0px" && this.tooltipsCss.top == "-500px")
        return;
      this.tooltipsCss = {
        left: "0px",
        top: "-500px"
      };
    },
    mouseMove(e) {
      const TAG_NAME = e.target.nodeName;
      if (TAG_NAME === this.tag.toUpperCase()) {
        this.currentText = e.target.innerHTML;
        let id = e.target.id;
        let valueId = e.target.getAttribute("valueId");
        let item = this.fnIdDict[valueId];
        let x = e.pageX;
        let y = e.pageY;
        if (x || y) {
          this.hoverText = item.desc;
          this.tooltipsCss = {
            left: `${x - 30}px`,
            top: `${y + 15}px`
          };
        }
      } else {
        this.removeToolTops();
      }
    },
    getGuid() {
      // 生成随机ID
      return `r${new Date().getTime()}d${Math.ceil(Math.random() * 1000)}`;
    },
    selectHandler() {
      // 监听选定文本的变动
      let sel = window.getSelection();
      let range = null;
      // let range = sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
      if (sel.rangeCount > 0) {
        range = sel.getRangeAt(0);
      } else {
        range = document.createRange();
      }
      if (
        range &&
        range.commonAncestorContainer.ownerDocument.activeElement.id ===
          this.contentId
      ) {
        this.savedRange = range;
      }
    }
  },
  watch: {
    value(val) {
      // 非锁定状态下，实时更新innerHTML
      if (!this.isLocked) {
        this.$refs.wTextareaContent.innerHTML = val;
      }
    }
  }
};
</script>

<style lang="scss">
// 给标签默认样式，不可scoped
.w-textarea {
  tag {
    cursor: pointer !important;
    color: #26a2ff;
    padding: 0 1px;
    -webkit-user-modify: read-only !important;
    user-modify: read-only !important;
    -moz-user-modify: read-only !important;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
  }
  .w-tooltops {
    position: fixed;
    padding: 0px 10px;
    color: #fff;
    background: rgba(0, 0, 0, 0.65);
    z-index: 999;
  }
}
</style>

<style lang="scss" scoped>
$borderColor: #dcdfe6;
$bgColor: #f5f7fa;
$textColor: #666;

.w-textarea {
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid $borderColor;
  overflow: hidden;
  position: relative;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  &_input {
    width: 100%;
    min-height: 100px;
    //height: 100px;
    //overflow: auto;
    box-sizing: border-box;
    padding: 10px;
    line-height: 1.5;
    word-break: break-all;
    word-wrap: break-word;
    // 允许编辑，禁止富文本
    -webkit-user-modify: read-write-plaintext-only !important;
    //&::-webkit-scrollbar-thumb{
    //  cursor: pointer !important;
    //}
    &:focus {
      outline: none;
    }
  }

}
</style>


