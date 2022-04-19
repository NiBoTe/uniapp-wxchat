const CONFIG = {
	// 开发环境配置
	development: {
		assetsPath: '/static', // 静态资源路径
		baseUrl: 'https://xxx/app',
		webUrl: 'https://xxx/',
		imgPath: 'https://xxx/wx_applet_img/',
	},
	// 生产环境配置
	production: {
		assetsPath: '/static', // 静态资源路径
		baseUrl: 'https://xxx/app',
		webUrl: 'https://xxx/',
		imgPath: 'https://xxx/wx_applet_img/',
		
	}

};
export default CONFIG[process.env.NODE_ENV];
