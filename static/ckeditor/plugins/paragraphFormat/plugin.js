CKEDITOR.plugins.add( 'paragraphFormat', {
    init: function( editor ) {
      	editor.ui.addButton( 'paragraphFormat', {
	        label: '段落格式化',
	        command: 'paragraphFormat',
	        toolbar: 'insert',
	        icon: this.path + 'icons/paragraphFormat.png' // 在toolbar中的图标
	    });

      	editor.addCommand( 'paragraphFormat', {
          	exec: function(editor) {
//        		var mySelection = editor.getSelection();
//        		var labelName =  editor.getSelection().getSelectedText();
//        		if(labelName){
//        			window.delLabelFn(labelName);
//        		}
          	}
      	});

    }
});