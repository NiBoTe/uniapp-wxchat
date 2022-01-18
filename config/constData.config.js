export default {
	// app应用名称
	appName: '易考绘',
	
	// 主题色
	themeColor: '#2C3AFF',
	
	// 成功码
	errorCode: 0,

	// 验证码发送间隔
	sendCodeTime: 60,

	// 未支付订单过期时间
	expirationTime: 60 * 5,
	
	
	// 个人中心-设置中心菜单
	settingList: [{
			icon: '/static/user_order.png',
			url: '/pages/orders/order',
			title: '订单管理'
		},
		{
			icon: '/static/user_identity.png',
			url: '/pages/user/identity/identity',
			title: '我的身份'
		},
		{
			icon: '/static/user_other.png',
			url: '/pages/set/set',
			title: '其他设置'
		},
		{
			icon: '/static/user_card.png',
			url: '/pages/card/index',
			title: '我的会员卡'
		}
	],

	// 设置-设置中心
	setList: [{
			title: '个人资料',
			url: '/pages/user/userinfo/userinfo',
			content: ''
		},
		{
			title: '清除缓存',
			url: 'clearCache',
			content: ''
		},
		{
			title: '关于应用',
			url: '/pages/set/about/about',
			content: '',
			class: 'mT'
		},
		{
			title: '站点帮助',
			url: '/pages/set/helper/index',
			content: ''
		},
		{
			title: '意见反馈',
			url: '/pages/set/feedback/list',
			content: ''
		}
	]
};
