CKEDITOR.plugins.add('labelCheck', {
    init: function( editor ) {
      editor.addCommand( 'labelCheck',{
          	exec: function(editor) {
          	}
      	});

      // 将删除添加到右键菜单中
      if(editor.addMenuItem) {
        editor.addMenuGroup("labelCheck");
        editor.addMenuItem("labelCheck", {
          label: "标签核对",
          icon: this.path + 'icons/labelCheck.png',
          command: "labelCheck",
          group: "labelCheck"
        })
      }

      if(editor.contextMenu) {
        // 监听右键菜单事件
        editor.contextMenu.addListener(function(element) {
          // 如果是在图片上右键或未选中文字，不显示删除图标
          var selectedText =  editor.getSelection().getSelectedText();
          if(element.$.localName != "img" && selectedText) {
            return {
              labelCheck: CKEDITOR.TRISTATE_OFF
            }
          }
        })
      }
    }
});