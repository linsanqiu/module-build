import http from '@/http';
import Vue from 'vue'; // 引入vue
const vm = new Vue();
export default {
	/**
	 * 标签类别
	 * [tagType description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	tagType: function (callback) {
		const url = '/tm/three/tag/category/root';
		http.get(url).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
	/**
	 * 标签状态
	 * [handlerStatus description]
	 * @return {[type]} [description]
	 */
	handlerStatus: function (callback) {
		const url = '/tm/enum/taghandle/status';
		http.get(url).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
	/**
	 * 标签处理结果
	 * [handleResult description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	handleResult: function (callback) {
		const url = '/tm/enum/taghandle/result';
		http.get(url).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
	/**
	 * 标签拒绝理由
	 * [refuseReason description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	refuseReason: function (callback) {
		const url = '/tm/enum/taghandle/refusereason';
		http.get(url).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
	/**
	 * 处理人
	 * [handleUser description]
	 * @param  {[type]}   query    [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	handleUser: function (query, callback) {
		const url = '/tm/user/fuzzysearch?keyword=' + query;
		http.get(url).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
	/**
	 * 标签申请用户详细信息
	 * [applyUser description]
	 * @param  {[type]}   row      [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	applyUser: function (row, callback) {
		const url = '/tm/euser/detail?id=' + row.applyUserId;
		http.get(url).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
	/**
	 * 标签分配校验权限
	 * [assignrole description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	assignrole: function (callback) {
		const url = '/tm/tag/assignrole';
		http.get(url).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
	/**
	 *标签一键自动分配
	 * [autodistribute description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	autodistribute: function (callback) {
		const url = '/tm/tag/autodistribute';
		http.get(url).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
	/**
	 * 标签分配人员
	 * [userDuty description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	userDuty: function (handlerName, callback) {
		const url = '/tm/tag/getdutyandhistory?handle_user_name=' + handlerName;
		http.get(url).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
	/**
	 * 标签分配处理提交
	 * [submitDistri description]
	 * @param  {[type]}   data     [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	submitDistri: function (data, callback) {
		const url = '/tm/tag/distributetag';
		http.post(url, data).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
	/**
	 * 标签查询和导出参数
	 * [searchParams description]
	 * @return {[type]} [description]
	 */
	searchParams: function (tagType, handleStatus, handleResult, keyword, handleUser, source, applyTimeBegin, applyTimeEnd, handlerTimeBegin, handlerTimeEnd, tagId) {
		const urlParams = 'category_id=' + tagType + '&handle_status=' + handleStatus +
			'&handle_result=' + handleResult +
			'&apply_user_name=' + encodeURIComponent(keyword) +
			'&handle_user_id=' + handleUser +
			'&source=' + source +
			'&apply_start_time=' + applyTimeBegin +
			'&apply_end_time=' + applyTimeEnd +
			'&handler_start_time=' + handlerTimeBegin +
			'&handler_end_time=' + handlerTimeEnd +
			'&tag_id=' + encodeURIComponent(tagId);
		return urlParams;
	},
	/**
	 * 标签列表搜索
	 * [searchList description]
	 * @param  {[type]}   urlParams [description]
	 * @param  {Function} callback  [description]
	 * @return {[type]}             [description]
	 */
	searchList: function (urlParams, callback) {
		const url = '/tm/tag/page?' + urlParams;
		http.get(url).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
	/**
	 * 添加标签权限判断
	 * [checkhandler description]
	 * @param  {[type]}   row      [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	checkhandler: function (row, callback) {
		const url = '/tm/tag/checkhandler?tagId=' + row.tagId;
		http.get(url).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
	/**
	 * 同义标签
	 * [similarity description]
	 * @param  {[type]}   params      [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	similarity: function (params, callback) {
		const url = '/tm/three/tag/similarity?' + params;
		http.get(url).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
	/**
	 * 通知消息
	 * [noticeMsg description]
	 * @param  {[type]}   data     [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	noticeMsg: function (data, callback) {
		const url = '/tm/tag/noticemessage';
		http.post(url, data).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
	/**
	 * 添加提交
	 * [submitConfirm description]
	 * @param  {[type]}   data     [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	submitConfirm: function (data, callback) {
		const url = '/tm/tag/handle';
		http.post(url, data).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
	/**
	 * 拼接id【,】
	 * [joinId description]
	 * @param  {[type]} aryRows [description]
	 * @return {[type]}         [description]
	 */
	joinId: function (aryRows) {
		let id = '';
		for (let i = 0; i < aryRows.length; i++) {
			if (i === 0) {
				id = aryRows[i].tagId;
			} else {
				id += ',' + aryRows[i].tagId;
			}
		}
		return id;
	},
	/**
	 * 查看资讯文章
	 * [viewArticle description]
	 * @param  {[type]}   row      [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	viewArticle: function (row, callback) {
		const url = '/tm/tag/news/original?tagId=' + row.tagId;
		http.get(url).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
	/**
	 * 标签注册
	 * [register description]
	 * @param  {[type]}   data     [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	register: function (data, callback) {
		const url = '/tm/three/tag/register';
		http.post(url, data).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
	/**
	 * 客户留言处理状态
	 * [handlerStatusMsg description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	handlerStatusMsg: function (callback) {
		const url = '/tm/enum/feedback/handlestatus';
		http.get(url).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
	categoryTree: function (parentId, level, callback) {
		const url = '/tm/three/tag/category/tree?parent_category_id=' + parentId +
			'&category_level=' + level;
		http.get(url).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},

	checkTag: function (businessId, tagValue, categoryId, callback) {
		const url = '/tm/three/tag/check?business_id=' + businessId +
			'&tag_value=' + tagValue + '&category_id=' + categoryId;
		http.get(url).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
	getToday: function () {
		const date = new Date();
		const year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		if (month < 10) {
			month = '0' + month;
		}
		if (day < 10) {
			day = '0' + day;
		}
		const TODAY = year + '-' + month + '-' + day;
		return TODAY;
	},
	getWeekAgo: function (weekNum) {
		const now = new Date();
		const dates = new Date(now.getTime() - weekNum * 7 * 24 * 3600 * 1000);
		const year = dates.getFullYear();
		let month = dates.getMonth() + 1;
		let day = dates.getDate();
		if (month < 10) {
			month = '0' + month;
		}
		if (day < 10) {
			day = '0' + day;
		}
		return year + '-' + month + '-' + day;
	},
	getMonthAgo: function (monthNum) {
		const dates = new Date();// 创建现在的时间
		let year = dates.getFullYear();// 获取年
		let mon = dates.getMonth() + 1;// 获取月
		let day = dates.getDate();// 获取日
		const monAgo = mon - monthNum + 1;
		if (mon <= 0) {
			year = year - 1;
			mon = mon + 12;
		}
		if (mon < 10) { mon = '0' + mon; }
		if (day < 10) { day = '0' + day; }
		return year + '-' + monAgo + '-' + day;
	},
	exportDataFn: function (postdata, url, callback) {
		http.post(url, postdata, { responseType: 'blob' }).then((res) => {
			callback(res);
		}).catch(() => {
			callback(null);
		});
	},
	commonDownLoad(res, downLoadName) {
		const content = res.data;
		// 如果是返回json
		if (String(content.type) === 'application/json') {
			const blob = new Blob([content], { type: 'application/json' });
			const reader = new FileReader();
			reader.addEventListener('loadend', function () {
				const jsonRes = JSON.parse(reader.result);
				vm.$hMessage.error(jsonRes.msg);
			});
			reader.readAsText(blob, 'utf-8');
		} else {
			const blob = new Blob([content], { type: 'application/vnd.ms-excel' });
			const fileName = downLoadName + '.xlsx';
			if ('download' in document.createElement('a')) { // 非IE下载
				const elink = document.createElement('a');
				elink.download = fileName;
				elink.style.display = 'none';
				elink.href = URL.createObjectURL(blob);
				document.body.appendChild(elink);
				elink.click();
				URL.revokeObjectURL(elink.href); // 释放URL 对象
				document.body.removeChild(elink);
			}
		}
	},
	exportDataOfGet: function (url, callback) {
		http.get(url, { type: 'application/vnd.ms-excel' }).then((res) => {
			callback(res.data);
		}).catch(() => {
			callback(null);
		});
	},
    /**
     * 获取新消息数量
     * @param callback
     */
    requestNoticeCount: function (callback) {
        http.get('/tm/notice/back/count?read_status=0').then((res) => {
            callback(res.data);
        }).catch(() => {
            callback(null);
        });
    }
};
