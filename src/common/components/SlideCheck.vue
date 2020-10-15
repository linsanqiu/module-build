<template>
  <div class="slide-check"
       v-bind:style="{zIndex:show ? 10 : 4}"
       @mouseover="over"
       @mouseleave="leave">
    <transition name="slide-down">
      <div ref="slideCheckImg"
           v-show="alwaysShow || show && metadata.base"
           class="slide-check-image"
           v-bind:style="imgStyle">
        <h-icon name="refresh"
                @click.native="load"></h-icon>
      </div>
    </transition>
    <div class="slide-check-indicator"
         v-bind:style="indicatorStyle"></div>
    <h-button class="slide-check-slider"
              type="ghost"
              icon="arrow-right-c"
              v-bind:style="sliderStyle"
              @mousedown.native.prevent="down"></h-button>
    <div class="slide-check-tips"
         v-bind:style="tipStyle">
      {{tipVal}}
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { setTimeout } from 'timers'
const statusMap = {
  1: {
    tip: '向右拖动滑块填充拼图',
    desc: '初始化前'
  },
  2: {
    tip: '加载中'
  },
  3: {
    tip: '向右拖动滑块填充拼图',
    desc: '初始化完毕'
  },
  4: {
    tip: '表单内容不正确',
    desc: '滑动校验不通过',
    tipColor: 'red'
  },
  5: {
    background: '#7BC3E1',
    color: '#00A1E6',
    desc: '滑动中'
  },
  6: {
    desc: '校验中'
  },
  9: {
    background: '#C1DF9B',
    color: '#93FA10',
    desc: '成功'
  },
  10: {
    background: '#E3A071',
    color: '#FF6800',
    desc: '失败',
    tip: '验证失败，请刷新页面',
  }}
export default {
  name: 'SlideCheck',
  props: {
    tip: {
      type: Object,
      default () {
        return {}
      }
    },
    alwaysShow: {
      type: Boolean,
      default: false
    },
    before: {
      type: Function
    }
  },
  data () {
    return {
      total: 0,
      width: 0,
      start: null,
      show: false,
      out: true,
      showTip: true,
      status: 1,
      metadata: {
        rate: 0,
        y: 0,
        cid: null,
        base: null,
        cutout: null
      }
    }
  },
  computed: {
    tipVal () {
      return this.tip[this.status] ? this.tip[this.status] : statusMap[this.status].tip
    },
    tipStyle () {
      return {
        width: this.total - this.width - 40 + 'px',
        color: statusMap[this.status].tipColor || '#495060'
      }
    },
    sliderStyle () {
      let color = statusMap[this.status].color
      return {
        color: color ? 'white' : '#5CA8FF',
        background: color || 'white',
        borderColor: color || '#D7DDE4'
      }
    },
    imgStyle () {
      let height = this.total / 2 + 'px'
      return {
        height: height,
        marginTop: '-' + height
      }
    },
    indicatorStyle () {
      let background = statusMap[this.status].background
      return {
        width: this.width + 'px',
        background: background || 'transparent',
        border: statusMap[this.status].color ? 'solid 1px ' + statusMap[this.status].color : 'none'
      }
    }
  },
  methods: {
    load: _.debounce(function () {
      this.width = 0
      this.status = 2
      this.$http.get(this.$api.captcha.init + 1)
        .then(res => {
          // debugger  
          if (res.data.status != this.$api.SUCCESS){
            this.status = 10
            this.$hMessage.error(res.msg || '网络请求失败')
            return
          }
          res = res.data
          this.metadata.rate = res.data.rate
          this.metadata.y = res.data.y
          this.metadata.cid = res.data.cid
          this.$http.get(this.$api.captcha.download + `?fileName=${res.data.base}&specific=${res.data.specific}`, { responseType: 'blob' })
            .then(imgObj => {
              let imgData = imgObj.data
              let img = document.createElement("img");
              img.src = window.URL.createObjectURL(imgData);
              let oldBase = this.metadata.base
              let oldCutout = this.metadata.cutout
              img.classList.add('slide-check-base')
              this.metadata.base = img
              this.$http.get(this.$api.captcha.download + `?fileName=${res.data.cutout}&specific=${res.data.specific}`, { responseType: 'blob' })
                .then(imgObj => {
                  let imgData = imgObj.data
                  let img = document.createElement("img");
                  img.src = window.URL.createObjectURL(imgData);
                  this.status = 3
                  img.classList.add('slide-check-cutout')
                  img.style.width = this.total * res.data.rate + 'px'
                  img.style.top = this.total * 0.5 * res.data.y + 'px'
                  this.metadata.cutout = img
                  if (oldBase) {
                    oldBase.remove()
                    oldCutout.remove()
                  }
                  this.$refs.slideCheckImg.appendChild(this.metadata.base)
                  this.$refs.slideCheckImg.appendChild(img)
                })
                .catch(err => {
                  this.status = 10
                })
            })
            .catch(err => {
              this.status = 10
            })
        })
        .catch(err => {
          this.status = 10
          this.$hMessage.error(err.msg)
        })
    }, 300),
    over: _.throttle(function (e) {
      this.out = false
      if (!this.metadata.base && this.status !== 2) {
        this.load()
      }
      setTimeout(() => {
        this.show = !this.out
      }, 500)
    }, 100),
    down (e) {
      if (this.status !== 3) {
        return
      }
      if (this.before && !this.before()) {
        this.status = 4
        return
      }
      this.start = {
        x: e.x,
        y: e.y
      }
      this.status = 5
      document.body.addEventListener('mousemove', this.move, false)
      document.body.addEventListener('mouseup', this.up, false)
    },
    move (e) {
      this.width = Math.min(Math.max(0, e.x - this.start.x), this.total * (1 - this.metadata.rate))
      this.metadata.cutout.style.left = this.width + 'px'
    },
    up (e) {
      document.body.removeEventListener('mousemove', this.move, false)
      document.body.removeEventListener('mouseup', this.up, false)
      if (this.before && !this.before()) {
        this.status = 4
        return
      }
      this.$http.post(this.$api.captcha.validate, {
        type: 1,
        cid: this.metadata.cid,
        checkCode: this.width + ':' + this.total
      }).then(res => {
        res = res.data
        if (res.status == this.$api.SUCCESS) {
          this.status = 9
          this.$emit('next', res.data)
          this.width = 0
          this.status = 1
          this.metadata.base.remove()
          this.metadata.cutout.remove()
          this.$set(this.metadata, 'base', null)
          this.$set(this.metadata, 'cutout', null)
        } else {
          this.status = 10
          this.load()
        }
      }).catch(err => {
        this.status = 10
      })
    },
    leave (e) {
      setTimeout(() => {
        if (this.status !== 5) {
          this.out = true
          this.show = false
        }
        if (this.status === 4) {
          this.status = 3
        }
      }, 100)
    }
  },
  mounted () {
    if (this.$el && this.$el.offsetWidth) {
      this.total = this.$el.offsetWidth
    }
    if (this.alwaysShow) {
      this.load()
    }
  }
}
</script>
<style lang="scss">
.slide-check {
  height: 40px;
  line-height: 40px;
  width: 100%;
  background: #f7f9fa;
  border: solid 1px #e4e7eb;
  border-radius: 2px;
  display: inline-block;
  position: relative;
  &-indicator,
  &-slider,
  &-tips {
    height: 40px !important;
    line-height: 40px !important;
    float: left;
  }
  &-image {
    width: 100%;
    position: relative;
    background: white;
    .h-icon {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 2;
      width: 30px;
      height: 30px;
      font-size: 30px;
      color: white;
      text-shadow: 0 0 5px #282c34;
      cursor: pointer;
    }
    .slide-check-base {
      width: 100%;
    }
    .slide-check-cutout {
    }
    img {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  &-indicator {
  }
  &-slider {
    width: 35px !important;
    text-align: center;
    padding: 0 !important;
  }
  &-tips {
    text-align: center;
  }
}
</style>
