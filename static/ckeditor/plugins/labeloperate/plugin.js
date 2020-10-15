CKEDITOR.plugins.add( 'labeloperate', {
    init: function( editor ) {

//    editor.ui.addButton( 'labeloperate', {
//      label: '删除标签',
//      command: 'labeloperate',
//      toolbar: 'insert',
//      icon: this.path + 'icons/labeloperate.png' // 在toolbar中的图标
//    });

      editor.addCommand( 'labeloperate', {
          	exec: function(editor) {
//        		var mySelection = editor.getSelection();
//        		var labelName =  editor.getSelection().getSelectedText();
//        		if(labelName){
//        			window.delLabelFn(labelName);
//        		}
          	}
      	});

      // 将删除添加到右键菜单中
      if(editor.addMenuItem) {
        editor.addMenuGroup("labeloperate");
        editor.addMenuItem("labeloperate", {
          label: "删除标签",
          icon: this.path + 'icons/labeloperate.png',
          command: "labeloperate",
          group: "labeloperate"
        })
      }

      if(editor.contextMenu) {
        // 监听右键菜单事件
        editor.contextMenu.addListener(function(element) {
          // 如果是在图片上右键或未选中文字，不显示删除图标
          var selectedText =  editor.getSelection().getSelectedText();
          if(element.$.localName != "img" && selectedText) {
            return {
              labeloperate: CKEDITOR.TRISTATE_OFF
            }
          }
        })
      }
    }
});