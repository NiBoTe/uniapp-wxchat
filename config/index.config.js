const CONFIG = {
	// 开发环境配置
	development: {
		assetsPath: '/static', // 静态资源路径
		baseUrl: 'https://test-ykh.msjsol.com/app',
		imgPath: 'https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/',
		webUrl: 'https://test-ykh.msjsol.com/',

	},
	// 生产环境配置
	production: {
		assetsPath: '/static', // 静态资源路径
		baseUrl: 'https://test-ykh.msjsol.com/app', // 后台接口请求地址
		imgPath: 'https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/',
		webUrl: 'https://test-ykh.msjsol.com/',
	}

};
export default CONFIG[process.env.NODE_ENV];
