CKEDITOR.plugins.add( 'fn', {
    init: function( editor ) {
      editor.addCommand( 'fn', {
          	exec: function(editor) {
          	}
      	});

      // 将删除添加到右键菜单中
      if(editor.addMenuItem) {
        editor.addMenuGroup("fn");
        editor.addMenuItem("fn", {
          label: "查看函数",
          icon: this.path + 'icons/fn.png',
          command: "fn",
          group: "fn"
        })
      }

      if(editor.contextMenu) {
        // 监听右键菜单事件
        editor.contextMenu.addListener(function(element) {
          // 如果是在图片上右键或未选中文字，不显示删除图标
          var selectedText =  editor.getSelection().getSelectedText();
          if(element.$.localName != "img" && selectedText) {
            return {
              fn: CKEDITOR.TRISTATE_OFF
            }
          }
        })
      }
    }
});