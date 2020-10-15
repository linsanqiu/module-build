<template>
	<div class="tableTemplateBox" id="tableTemplateBox" @click="onClickBox">
	     <table v-if="tableType== 2"  class="tableBoxCol" border="" cellspacing="" cellpadding="">
	     	<tr  @mousemove="mousemovefn" v-for="(rowItem,row) in tableTemplate">
	     		<th :title="rowItem.fieldName">{{rowItem.fieldName}}</th>	 	     		
	     		<td v-for="(colItem,col) in countCol"   @contextmenu.prevent="contextmenu('countCol',col)">	
	     			<template v-if="countCol[col][row]">
	     				<!--1数字，2文本，3日期，4金额-->
		     			<template v-if="rowItem.fieldType  == 1 || rowItem.fieldType  == 2">
		     				<h-input :disabled="viewPage" :type="rowItem.fieldType  == 1 ? 'int' : 'text'"    :maxlength='rowItem.length'  v-model.trim="countCol[col][row].fieldValue" @on-change="changeInput('countCol')" :placeholder="rowItem.placeholder"></h-input>
		     			</template>
		     			<template v-else-if="rowItem.fieldType  == 3">
		     				<h-date-picker   clearOnIllegal autoPlacement :disabled="viewPage" :options="optionsDate"  format="yyyy-MM-dd" :value="countCol[col][row].fieldValue"   type="date" :placeholder="rowItem.required ? '请选择日期（必填）' :'请选择日期'" @on-focus="changeOpenDate('countCol',col,row)"  @on-change="changeDate"></h-date-picker>
		     			</template>
		     			<template v-else-if="rowItem.fieldType  == 4">
		     				 <h-typefield divided :disabled="viewPage" suffixNum="4" notFillin  :maxlength="rowItem.length"  type="money" :placeholder="rowItem.placeholder" v-model.trim="countCol[col][row].fieldValue" @on-keyup="changeInput('countCol')"></h-typefield>
		     			</template>
		     			<template v-else-if="rowItem.fieldType  == 5">
		     				<h-select autoPlacement filterable :disabled="viewPage" :placeholder="rowItem.placeholder" v-model="countCol[col][row].fieldValue" @on-change="changeSelect('countCol')">
								<h-option v-for="(item, i) in selectListObj[rowItem.defaultValue]" :value="item.entryValue" :key="item.entryValue">
									{{item.entryName}}
								</h-option>
							</h-select>
		     			</template>
		     			
	     			</template>	     			
	     		</td>
	     	</tr>
	     	<div class="addIcon" @click="handleAddRow('countCol')"  v-show="showOperateBtn">
		     	<span>+</span>
		    </div>
	     </table>
	      <table v-else class="tableBoxRow" border="1" cellspacing="" cellpadding="">
		      	<tr>
		      		<th :title="item.fieldName" v-for="(item,index) in tableTemplate">
		     			{{item.fieldName}}
		     		</th>  
		      	</tr>	      		     			    		      		 
     			 <tr   @mousemove="mousemovefn" v-for="(colItem,row) in countRow">
     		     	<td v-for="(rowItem,col) in tableTemplate" @contextmenu.prevent="contextmenu('countRow',row)">
		     			<template v-if="countRow[row][col]">
			     			<template v-if="rowItem.fieldType  == 1 || rowItem.fieldType  == 2">		     				
			     				<h-input :disabled="viewPage" :type="rowItem.fieldType  == 1 ? 'int' : 'text'"   :maxlength='rowItem.length'  v-model.trim="countRow[row][col].fieldValue"  @on-change="changeInput('countRow')"  :placeholder="rowItem.placeholder"></h-input>	
			     			</template>
			     			<template v-else-if="rowItem.fieldType  == 3">
			     				<h-date-picker  validateValueChange  autoPlacement :disabled="viewPage" format="yyyy-MM-dd" :value="countRow[row][col].fieldValue"  type="date" :placeholder="rowItem.placeholder" @on-focus="changeOpenDate('countRow',row,col)"  @on-change="changeDate" ></h-date-picker>
			     			</template>
			     			<template v-else-if="rowItem.fieldType  == 4">
		     				 	<h-typefield divided :disabled="viewPage" suffixNum="4" notFillin :maxlength="rowItem.length"  type="money" :placeholder="rowItem.placeholder" v-model.trim="countRow[row][col].fieldValue" @on-keyup="changeInput('countRow')"></h-typefield>
		     				</template>    			
			     			<template v-else-if="rowItem.fieldType  == 5">
		     				<h-select filterable autoPlacement :disabled="viewPage" :placeholder="rowItem.placeholder" v-model="countRow[row][col].fieldValue" @on-change="changeSelect('countRow')">
								<h-option v-for="(item, i) in selectListObj[rowItem.defaultValue]" :value="item.entryValue" :key="item.entryValue">
								</h-option>								
							</h-select>
		     			</template>
		     			</template>
		     		</td>
     		    </tr>	     		 		     		 	     		    	     	 	     	 
		     	<div class="addIcon" @click="handleAddRow('countRow')" v-show="showOperateBtn">
			     	 <span>+</span>
			    </div>
	     </table>
	     <ul id="rightMenu" class="rightMenu" v-show="showRightMenu"  @click.stop="function(){}">			 
			<li @click="delFn(typeName)">删除第{{rightIndex+1}}{{typeName}}</li>
		 </ul>
	     <div>
	     	<slot name="buttons"></slot >   	
	     </div>	 	 
	</div>
</template>

<script>
	import { copyDeep } from '@/filters/index'
	import utils from "@/utils";
	const TODAY = utils.getToday();
    
  export default {
  	props:{ 		
  		tableTemplate:Array,//模板
		tableTemplateData:{
			type:Array,
			required:false,
			default:function () {
                return []
            } 
		},//模板表格数据
		
  		tableType:Number,//1纵向，2横向  	
  		taskId:'',
  		anncId:'',
  		showOperateBtn:false,
  		viewPage:false
  	},
    data() {
      return {
      	optionsDate:{
            disabledDate (date) {
                //return date && date.valueOf() >= Date.now();
            }
        },
      	page:{
      		clientX:0,
      		clientY:0
      	},
      	rightIndex:0,
      	rightCountType:'countCol',
      	typeName:'列',
      	showRightMenu:false,
      	tableTemplateArr:[],
      	defaultData:[],
      	countCol:[],
      	countRow:[],
      	selectListObj:{},
      	selectDate:{
      		countType:'',
      		row:'',
      		col:''
      	}
      }
    },
    methods: {
	    changeInput(countType){
	    	this.$emit('onChangeInput',this[countType])	
	    },
	    changeSelect(countType){
	    	this.$emit('onChangeSelect',this[countType])	
	    },
	    changeOpenDate(countType,row,col){
	    	this.selectDate = {
	      		countType:countType,
	      		row:row,
	      		col:col
	      	}
	    },
	    changeDate(value){	
	    	let {countType,row,col}= this.selectDate;
	    	this[countType][row][col].fieldValue = value
	    	this.$emit('onChangeInput',this[countType]);  	
	    },
	    onClickBox(){
	       this.showRightMenu = false;
	    },
	    handleAddRow(countType){
//	      	if(this[countType].length >=2) return;     	
	        this[countType].push(copyDeep(this.defaultData));
	    },
	  	mousemovefn(ev){
	  		this.page.clintX = ev.clientX;  //ev获取的只是屏幕可视范围的x,y值
	  		this.page.clintY = ev.clientY;  //ev获取的只是屏幕可视范围的x,y值
	  	},
	    contextmenu(countType,index){
	    	if(!this.showOperateBtn)return;
	  	    this.rightIndex = index;
	  	    this.rightCountType = countType;
	  	    this.typeName = countType == 'countRow' ? '行' : '列';
	  		this.showRightMenu = true; 
	  		let clientHeight = document.body.offsetHeight;
			let clientWidth = document.body.offsetWidth;
			let initLeft = 240;
			let initTop=  140;
	  		if(clientWidth - this.page.clintX < 120){
				initLeft = 320;
			}
//			if(clientHeight - this.page.clintY < 120 ){
//				initTop = 220;
//			}
	        let scollTop= document.documentElement.scrollTop || document.body.scrollTop;   //当有下拉条的时候
	        let scollLeft= document.documentElement.scrollLeft || document.body.scrollLeft;
	        let scrollTopInner = document.getElementsByClassName('box-right-content') ? document.getElementsByClassName('box-right-content')[0].scrollTop : 0;
	        let scrollLeftInner = document.getElementsByClassName('box-right-content') ? document.getElementsByClassName('box-right-content')[0].scrollLeft : 0;
	        
	        let leftWidth =  document.getElementById('pdfBox') ? document.getElementById('pdfBox').offsetWidth : 0 ;
	        document.getElementById('rightMenu').style.left= this.page.clintX + scrollLeftInner + scollLeft - leftWidth -initLeft +'px';
	        document.getElementById('rightMenu').style.top=this.page.clintY + scrollTopInner +scollTop - initTop +'px';
	   
	    },
	    delFn(typeName){
	    	this.showRightMenu = false;
	    	if(this[this.rightCountType].length == 1){
	    		this.$hMessage.warning({content:'只剩一'+typeName+'，不能再删除了！'});
	    		return;
	    	}
	      	this[this.rightCountType].splice(this.rightIndex,1);	      		      	
	    },
	    getSelectList(dictCode){		
    		let url = '/pic/audit/sys/getDict?dictCode='+dictCode; 		
            this.$http.get(url).then((res) => {
            	let data = res.data;
                if(data.status == this.$api.SUCCESS){                	
                	this.selectListObj[dictCode]  =  [...data.body.dictList] || [];
                	this.selectListObj= Object.assign({}, this.selectListObj, [...data.body.dictList])
                }else{
                    this.$hMessage.error({content: data.msg});
                      
                }
            }).catch(err=>{
                this.$hLoading.error();
                 
            })
	    },
	    initDefaultData(){
	    	let typeArr = [];
	    	this.tableTemplate.forEach((item,index)=>{
	    		    this.selectListObj[item.defaultValue] = [];  			
      				if(item.fieldType == '1'){
						item.placeholder = '请输入数字'
					}else if(item.fieldType == '2'){
						item.placeholder = '请输入文本'
					}else if(item.fieldType == '3'){
						item.placeholder = '请选择日期'
					}else if(item.fieldType == '4'){
						item.placeholder = '请输入金额'
					}else if(item.fieldType == '5'){
						item.placeholder = '请选择';	
						if(typeArr.indexOf(item.defaultValue) == -1){
							typeArr.push(item.defaultValue);
							this.getSelectList(item.defaultValue);
						}					
					};
					if(item.required){
						item.placeholder = item.placeholder + '（必填）';
					};
					
					if(item.length){
    					item.length = parseInt(item.length);//表单输入最大长度
    				};  
    				
    				let tableObj = {
			            fieldCode: item.fieldCode, 	
			            id:item.id,
			            taskId:this.taskId,
			            anncId:this.anncId,
			            fieldValue:'', 				            					
						creator:'', 		
						modifier:'',					
			       };
			       this.$set(this.defaultData,index,tableObj);
      		});
	    },
      	initTemplateData(newArr){   
      		let countType = this.tableType== 2 ? 'countCol' : 'countRow';
      		this.initDefaultData();
      		if(newArr.length ==0){       			
      			this.countCol = [[...copyDeep(this.defaultData)]];
      			this.countRow = [[...copyDeep(this.defaultData)]];
    		}else{
    			let dateLength = newArr.length;
    			let templateLength = this.tableTemplate.length;   			
    			let productNum = newArr[dateLength-1].productIndex + 1;    	
    			for(let i=0;i<productNum;i++){
    				this[countType][i] = [];    				
					this.defaultData.forEach((defaultItem,defaultIndex) =>{						
						this[countType][i].push({...defaultItem});
						newArr.forEach((item,index) =>{
							if(item.productIndex == i && defaultItem.fieldCode == item.fieldCode){
								 this[countType][i][defaultIndex] = {...item};
							}
						})							
					})	    						    			     				
    			};
    			// 数组数据属性更新
    			this[countType].forEach((itemArr,ArrIndex)=>{
    				itemArr.forEach((item,index)=>{
    					this.$set(this[countType][ArrIndex],index,item);
    				});
    				this.$set(this[countType],ArrIndex,itemArr);
    			});
    		}
      	}
    },
    watch:{
    	tableTemplateData(newArr){
    		this.initTemplateData(newArr);  		    		
    	},
    	countCol(newData){
    		//保存时需要更新的数据
    		this.$emit('onChangeInput',newData)
    	},
    	countRow(newData){
    		//保存时需要更新的数据
    		this.$emit('onChangeInput',newData)
    	},
    },
    mounted(){
		this.initTemplateData(this.tableTemplateData);
    },
    
  }
</script>

<style scoped>
	.tableTemplateBox{
		height: 100%;
		position: relative;
	}
	.tableBoxCol,.tableBoxRow{
		position: relative;
		border-collapse:collapse;
		border: none;
		table-layout: fixed;
		width: 100%;
	}
	.tableBoxCol>>> .h-input,.tableBoxRow>>> .h-input{
		padding: 0px 12px;
		border: 0;
		width:100%;
		display: inline-block;
	}
	.tableBoxCol tr{
		height: 30px;
		padding:0px 8px;
		text-align: left;
		border:1px solid #DCE1E7;
	}
	.tableBoxCol tr th{
		background:#f0f3f5;
		width:100px;
		padding:2px 8px;
		font-weight:600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;		
	}
	.tableBoxCol tr td{
		width:120px;
		padding:0px;
	}
	.tableBoxCol .addIcon{
		font-size:30px;
		color: dodgerblue;
		position: absolute;
		right:-25px;
		top: 48%;
		cursor: pointer;
	}
	.tableBoxRow tr{
		height: 30px;
		border:1px solid #DCE1E7;
	}
	.tableBoxRow tr th{
		background:#f0f3f5;
		/*width:150px;*/		
		padding:2px 0px;
		font-weight:600;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		cursor: pointer;
	}
	.tableBoxRow tr td{		 
		width:250px;
	}
	.tableBoxRow .addIcon span{
		font-size:30px;
		color: dodgerblue;
		position: absolute;
		left:50%;
		margin-left: -8px;
		bottom: -35px;
		cursor: pointer;
	}
	
	.rightMenu{
		position: absolute;
	    padding: 5px 10px;
	    line-height: 22px;
	    z-index: 99;
	    background-color: #fff;
	    border-radius: 2px;
	    border: 1px solid #dfdfdf;
	    -webkit-box-shadow: 1px 1px 2px #ccc;
	    box-shadow: 1px 1px 2px #ccc;
	    color: #000;
	    width:100px;
	    
	}
	.rightMenu li:hover{
		color: #2E71F2;
		cursor: pointer;
	}
	
</style>