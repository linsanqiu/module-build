CKEDITOR.plugins.add( 'labelCancelMain', {
    init: function( editor ) {
      editor.addCommand( 'labelCancelMain', {
          	exec: function(editor) {
          	}
      	});

      // 将删除添加到右键菜单中
      if(editor.addMenuItem) {
        editor.addMenuGroup("labelCancelMain");
        editor.addMenuItem("labelCancelMain", {
          label: "取消标识主体",
          icon: this.path + 'icons/cancelmain.png',
          command: "labelCancelMain",
          group: "labelCancelMain"
        })
      }

      if(editor.contextMenu) {
        // 监听右键菜单事件
        editor.contextMenu.addListener(function(element) {
          // 如果是在图片上右键或未选中文字，不显示删除图标
          var selectedText =  editor.getSelection().getSelectedText();
          if(element.$.localName != "img" && selectedText) {
            return {
              labelCancelMain: CKEDITOR.TRISTATE_OFF
            }
          }
        })
      }
    }
});