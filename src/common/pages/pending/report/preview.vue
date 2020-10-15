<template>
	<div class="m-preview-content">
	    <br>
	    <h-row type="flex" justify="center">
	        <h-col>
	        	<h1>{{ reportInfo.title }}</h1>
	    	</h-col>
	    </h-row>

	    <br>
	    <h-row type="flex">
    		<div v-html='reportInfo.content'></div>
	    </h-row>
		
	</div>
</template>
<script type="text/javascript">
export default {  
	data () {
		return{
        	spinShow: true,
        	content: '',
            config: {
                height: 500
            },
            reportInfo: {},
            id: this.$route.query.id + '',
            uploadData: {
            	id: this.$route.query.id + '',
            },
            uploadLoading: false,
            tagModal: false,
            tagNames: [],
            tagData: [],
            tagInfo: []
		}
	},
	components: { },
	methods:{
		getInfo() {
			let url = '/tm/report/anon/' + this.id
			this.$http.get(url).then((res)=>{
				let tmpObj = res.data
				if(tmpObj.status == this.$api.SUCCESS){
					this.reportInfo = tmpObj.data
					let tagNames = []
					tmpObj.data.tags.forEach(function(d){
						tagNames.push(d.tagName)
					})
					this.tagNames = tagNames
				}else{
					this.reportInfo = {}
				}
			}).catch(err=>{
				this.reportInfo = {}
        	})
		},
	},
	mounted(){
		this.getInfo()
	},
	watch: {

    }
}
</script>
<style scoped>
  h1 { font-size: 1.5em; }
  img { max-width: 100% }
  .m-preview-content { padding: 10px }


</style>
<style type="text/css">
	.m-preview-content img{ max-width: 100%; }
</style>