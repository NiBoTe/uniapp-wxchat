const CONFIG = {
	// 开发环境配置
	development: {
		assetsPath: '/static', // 静态资源路径
		baseUrl: 'http://test-ykh.msjsol.com:8090/app', // 潘西龙
		imgPath: 'https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/',
		// baseUrl: 'https://zhcg.swjtu.edu.cn:8083/onesports-gateway', // 后台接口请求地址

	},
	// 生产环境配置
	production: {
		assetsPath: '/static', // 静态资源路径
		baseUrl: 'http://test-ykh.msjsol.com:80/app', // 后台接口请求地址
		imgPath: 'https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/',
		// baseUrl: 'https://sm.one-sport.cn/onesports-gateway', // 后台接口请求地址
		// baseUrl: 'http://47.111.169.134:8061/onesports-gateway', // 后台接口请求地址
	}

};
export default CONFIG[process.env.NODE_ENV];
