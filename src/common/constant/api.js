export default {
	SUCCESS: 1,
	NOLOGIN: 1004,
	APPID: {
		// 1企探,2金探,3小梵
		QITAN: 1, // 默认
		JINTAN: 2,
		XIAOFAN: 3
	},
	captcha: {
		init: '/tm/login/captcha/init/',
		download: '/tm/login/captcha/download',
		validate: ' /tm/login/captcha/validate'
	}
};
