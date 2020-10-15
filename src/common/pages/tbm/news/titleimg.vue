<template>
	<div id="">
		<ul class="imgFileBox" v-if="showFile">
			<li @click="openImgFile(item,index)" v-for="(item,index) in imgDataFile">
				<span>{{item ? item.substring(8) : ''}}</span>
			</li>
		</ul>
		<ul class="imgBox" v-if="!showFile">
				<div class="fileTitle">
					<span  @click="backToFile">{{imgDataFile[currentFileIndex] ? imgDataFile[currentFileIndex].substring(8)+' >' : ''}}</span>
					<span>{{imgData[currentIndex] ? imgData[currentIndex] : ''}}</span>
				</div>
			<li :class="{'activeImg':index == currentIndex}"  v-for="(item,index) in imgData" @click="checkImgFn(item,index)">
				<img :src="item"/>
			</li>
		</ul>
	</div>
</template>

<script>
	export default{
		props:{
			imgDataFile:Array,	
			initShowFile:true,
		},
		data(){
			return{
				imgData:[],
				showFile:true,
				currentIndex:-1,
				currentFileIndex:-1,
			}
		},
		methods:{
			openImgFile(item,index){
				this.$emit('loadingImg',true);
				this.showFile = false;
				this.currentFileIndex = index;
				let url = '/tm/news/all?fileName='+ item;
				this.$http.get(url).then((res) => {
					let data = res.data;
					if (data.status == this.$api.SUCCESS) {
						this.imgData = data.data || [];
						this.$emit('loadingImg',false);					
					} 
				}).catch(err => {
					this.$hLoading.error();
				})
			},
			checkImgFn(item,index){
				this.currentIndex = index;
				this.$emit('imageName',item)
			},
			backToFile(){
				this.showFile = true;
			}
		},
		watch:{
			initShowFile(newdata){
				this.showFile = newdata;
			}
		},

	}
</script>

<style scoped>
	.imgFileBox li{
		position: relative;
		display: inline-block;
		width: 46px;
		height: 38px;
		margin-right: 10px;
		background: url('../../../assets/img/fileimage.png') no-repeat center center;
		cursor: pointer;
	}
	.imgFileBox li span{
		position: absolute;
		bottom:-15px;
		min-width:40px;
		text-align: center;
	}
	.imgBox li{
		margin-right: 10px;
		display: inline-block
	}
	.imgBox li{
		margin-right: 10px;
		display: inline-block;
		width: 160px;
		height:90px;
	}
	.imgBox li img{
		width: 158px;
		height:88px;
		cursor: pointer;
	}
	.activeImg{
		background:darkblue;
		border: 1px dashed #ccc;
		box-sizing: border-box;
		
	}
	.activeImg img{
		transform: scale(0.96);
	}
	.fileTitle{
		margin-bottom: 10px;
		font-size: 14px;
	}
	.fileTitle span:first-child{
		color: #298DFF;
		cursor: pointer;
		font-weight: bold;
	}
</style>