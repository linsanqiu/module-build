/*
 * @Author: huangshuai
 * @Date: 2020-05-14 17:18:12
 * @LastEditTime: 2020-05-26 17:45:13
 * @LastEditors: Please set LastEditors
 * @Description: 自定义指令
 * @FilePath: /three-admin-ui/src/directives/index.js
 */ 
import store from '@/store'
export default (Vue) => {
    // 按钮权限
    Vue.directive('power', {
        inserted: function(el, binding){
            let values = binding.value
            let activeRoutersButton = store.state.activeRoutersButton || []
            if (activeRoutersButton.indexOf(values) == -1){
                el.parentNode.removeChild(el);
            }
            // let _type = fGetCookieMes('_type')||-1
            // if (_type && _type == 0){

            // }else{
            //     el.parentNode.removeChild(el);
            // }
        }
    }),
    Vue.directive('focus', {
        update: function (el, { value }) {
            if (value) {
                el.focus();
            }
        }
    }),
    Vue.directive('blur', {
        update: function (el, { value }) {
            if (value) {
                el.blur();
            }
        }
    }),
    Vue.directive('drag', {
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
    }),
    Vue.directive('selfDrag',{
      //1.指令绑定到元素上回立刻执行bind函数，只执行一次
      //2.每个函数中第一个参数永远是el，表示绑定指令的元素，el参数是原生js对象
      //3.通过el.focus()是无法获取焦点的，因为只有插入DOM后才生效
      bind:function(el){},
      //inserted表示一个元素，插入到DOM中会执行inserted函数，只触发一次
      inserted:function(el){
        el.onmousedown = function (e) {
          var disx = e.pageX - el.offsetLeft;
          var disy = e.pageY - el.offsetTop;
          document.onmousemove = function (e) {
            el.style.left = e.pageX - disx + 'px';
            el.style.top = e.pageY - disy + 'px';
          }
          document.onmouseup = function () {
            document.onmousemove = document.onmouseup = null;
          }
        }
      },
      //当VNode更新的时候会执行updated，可以触发多次
      updated:function(el) {}
    }),
    Vue.directive('clickCopy', {
      bind:function(el){
        el.onclick=(e)=>{
         let value = e.target.innerText
         let oInput = document.createElement('input');
         oInput.value = value;
         document.body.appendChild(oInput);
         oInput.select();
         try {
            document.execCommand("Copy");
            oInput.style.display='none';
          } catch (err) {

          }
          document.body.removeChild(oInput);
        }
      },
  })
}