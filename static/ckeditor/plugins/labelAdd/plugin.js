CKEDITOR.plugins.add( 'labelAdd', {
    init: function( editor ) {

      editor.ui.addButton( 'labelAdd', {
        label: '添加标签',
        command: 'labelAdd',
        toolbar: 'insert',
        icon: this.path + 'icons/labelAdd.png' // 在toolbar中的图标
      });

      editor.addCommand( 'labelAdd', {
          	exec: function(editor) {
//        		 window.addLabelFn();
          	}
      	});

      // 将添加添加到右键菜单中
      if(editor.addMenuItem) {
        editor.addMenuGroup("labelAdd");
        editor.addMenuItem("labelAdd", {
          label: "添加标签",
          icon: this.path + 'icons/labelAdd.png',
          command: "labelAdd",
          group: "labelAdd"
        })
      }

      if(editor.contextMenu) {
        // 监听右键菜单事件
        editor.contextMenu.addListener(function(element) {
         	return {
              labelAdd: CKEDITOR.TRISTATE_OFF
            }
        })
      }
    }
});