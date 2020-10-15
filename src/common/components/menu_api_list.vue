<template>
	<div class="menu_api_lsit">
        <h-row class="expand-row">
        	API权限：
            <template v-if="row && row.apiList && row.apiList.length > 0">
            	<template v-for="(data,key) in row.apiList ">
            		<span>{{ data.apiName }}</span>
            	</template>
            </template>
            <template v-else>空</template>
        </h-row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        }
    };
</script>
<style type="text/css" scoped>
.menu_api_lsit{
	line-height: 32px;
	padding: 0 10px;
}
.menu_api_lsit span{
	border-radius: 2px;
	background-color: #f60;
	margin-left: 5px;
	padding: 5px;
	color: #fff;
}
</style>