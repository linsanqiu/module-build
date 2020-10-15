<template>
  <transition name="fade" :duration="500">
    <div class="modalView" @click="modeHide" v-if="showModal" refs="modalView">
      <div class="content" @click.stop="contentClick">
        <div class="titleHeader" v-drag="[true,false,false]">
          <div class="title">{{title}}</div>
          <div @click="modeHide">
            <span class="close"></span>
          </div>
        </div>
        <div class="contentWrap">
          <slot name="content"></slot>
        </div>
        <div class="foot">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "modalView",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "标题"
    }
  },
  data() {
    return {
      showModal: false
    };
  },
  computed: {},
  mounted() {},
  beforeDestroy() {},
  directives: {
    drag: {
      inserted(el, binding) {
        const obj = binding.value;
        if (!obj[0]) return;
        el.onmousedown = function(ev) {
          // if (obj[2]) ev.target.click();
          let pel = el.parentNode;
          let width = parseInt(pel.clientWidth);
          let height = parseInt(pel.clientHeight);
          let clWidth = document.body.clientWidth;
          let clHeight = window.innerHeight || document.body.clientHeight;
          var disX = ev.clientX - pel.offsetLeft;
          var disY = ev.clientY - pel.offsetTop;
          document.onmousemove = function(ev) {
            pel.parentNode.style.display = "block";
            // document.body.style.userSelect = "none";
            var l = ev.clientX - disX;
            var t = ev.clientY - disY;
            // if (isVertical) t = t-pel.offsetTop;
            if (!obj[1] && l + width > clWidth) {
              l = clWidth - width;
            }
            if (!obj[1] && t + height > clHeight) {
              t = clHeight - height;
            }
            if (l < 0) l = 0;
            if (t < 0) t = 0;
            pel.style.left = l + "px";
            pel.style.top = t + "px";
          };
          document.onmouseup = function() {
            // document.body.style.userSelect = "text";
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
        el.onmouseup = function(ev) {
          // document.body.style.userSelect = "text";
          document.onmousemove = null;
          document.onmouseup = null;
        };
      },
      bind(el, binding, vnode) {},
      update() {},
      unbind(el, binding) {}
    }
    // drag: {
    //   // 指令的定义
    //   bind: function(el) {
    //     let odiv = this.$refs.modalView; //获取当前元素
    //     el.onmousedown = e => {
    //       //算出鼠标相对元素的位置
    //       let disX = e.clientX - odiv.offsetLeft;
    //       let disY = e.clientY - odiv.offsetTop;
    //       let left = "";
    //       let top = "";
    //       document.onmousemove = e => {
    //         // 获取拖拽元素的位置
    //         let left = e.clientX - disX;
    //         let top = e.clientY - disY;
    //         //console.log(document.documentElement.clientHeight,odiv.offsetHeight)
    //         // 把拖拽元素 放到 当前的位置
    //         if (left <= 0) {
    //           left = 0;
    //         } else if (
    //           left >=
    //           document.documentElement.clientWidth - odiv.offsetWidth
    //         ) {
    //           //document.documentElement.clientWidth 屏幕的可视宽度
    //           left = document.documentElement.clientWidth - odiv.offsetWidth;
    //         }

    //         if (top <= 0) {
    //           top = 0;
    //         } else if (
    //           top >=
    //           document.documentElement.clientHeight - odiv.offsetHeight
    //         ) {
    //           // document.documentElement.clientHeight 屏幕的可视高度
    //           top = document.documentElement.clientHeight - odiv.offsetHeight;
    //         }
    //         odiv.style.left = left + "px";
    //         odiv.style.top = top + "px";
    //       };
    //       document.onmouseup = e => {
    //         document.onmousemove = null;
    //         document.onmouseup = null;
    //       };
    //     };
    //   }
    // }
  },
  methods: {
    contentClick() {},
    modeHide() {
      this.showModal = false;
      this.$emit("on-close");
    }
  },
  watch: {
    value(val) {
      this.showModal = val;
    },
    showModal(val) {
      this.$emit("input", val);
    }
  }
};
</script>

<style lang="scss" scoped>
.modalView {
  z-index: 1000;
  background: rgba(55, 55, 55, 0.4) !important;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    box-sizing: border-box;
    width: 620px;
    height: auto;
    background: #fff;
    position: fixed;
    .titleHeader {
      display: flex;
      justify-content: space-between;
      padding: 14px 16px;
      cursor: pointer;
      border-bottom: 1px solid #f7f7f7;
      .title {
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        color: #495060;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .close {
        display: inline-block;
        width: 20px;
        height: 1px;
        background: #555;
        transform: rotate(45deg);
      }
      .close::after {
        content: "";
        display: block;
        width: 20px;
        height: 1px;
        background: #555;
        transform: rotate(-90deg);
      }
    }

    .contentWrap {
      padding: 32px 32px 16px 32px;
    }
    .foot {
      border-top: 1px solid #f7f7f7;
      padding: 12px 18px 12px 18px;
      text-align: right;
    }
  }
}
</style>