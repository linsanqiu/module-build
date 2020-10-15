<template>
  <div id='tagTextView'>
    <div class="w-textarea" ref="wTextarea" >
      <div
        @blur="blur"
        class="w-textarea_input"
        ref="wTextareaContent"
        :id="contentId"
        @click="inputClick($event)"
        @focus="focus"
        @input="handleInput($event.target)"
        :contenteditable="true"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tagTextareas",
  data() {
    return {
      // 记录currentText以计算长度
      currentText: this.value,
      valueId: null,
      // 为input区域生成随机id，当在页面上有多个组件时，用于监听光标的变化
      contentId: `content${this.getGuid()}`,
      // 输入的时候锁定，禁止更新innerHTML
      isLocked: false,
      currentTag: null,
      // 当前光标位置
      savedRange: null,
    };
  },
  props: {
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
    //this.keepLastIndex(el);
  },
  beforeDestroy() {
    // 卸载事件
    document.removeEventListener("selectionchange", this.selectHandler);
  },
  methods: {
    blur(){
      this.isLocked = false;
    },
    focus(){
      this.isLocked = true;
      this.$emit("focus");
    },    
    keepLastIndex(obj) {
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
    addTag(value) {
      if(this.currentTag){
        let t = this.currentTag;
        t.innerHTML = value;
        let target = this.$refs.wTextareaContent;
        this.handleInput(target);
        this.moveRange(t);
        this.currentTag = null;
      }else{
        // 创建模版标签
        let node = document.createElement(this.tag);
        node.innerHTML = value;
        this.insertNode(node);
      }
    },
    changeTag(value) {
      let t = this.currentTag;
      t.innerText = value;
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
    },
    tagClick(model) {
      this.$emit("tagClick", {
        mod: true,
        text: this.currentText,
        model: model
      });
    },
    inputClick(e) {
      // 监听点击事件
      this.isLocked = true;
      const TAG_NAME = e.target.nodeName;
      const PARENT_NAME = e.target.parentNode.nodeName;
      if (TAG_NAME === this.tag.toUpperCase()) {
        // 点击模版标签时，记录id
        this.currentTag = e.target
        this.currentText = e.target.innerHTML;
        this.valueId = e.target.getAttribute("valueId");
        this.tagClick(e.target);
      } else if( PARENT_NAME === this.tag.toUpperCase()){
        this.currentTag = e.target.parentNode;
        this.currentText = e.target.innerHTML;
        this.valueId = e.target.getAttribute("valueId");
        this.tagClick(e.target);
      } else {
        this.$refs.wTextareaContent.focus();
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
    box-sizing: border-box;
    padding: 10px;
    line-height: 1.5;
    word-break: break-all;
    word-wrap: break-word;
    // 允许编辑，禁止富文本
    -webkit-user-modify: read-write-plaintext-only !important;

    &:focus {
      outline: none;
    }
  }

}
</style>


