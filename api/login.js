const login = '/login/'

// 发送验证码
const sendSmsCode = `${login}sendSmsCode`;

// 微信小程序授权登录
const mpWechatLogin = `${login}wxMiniAppLogin`;

// 手机验证码登录
const loginOrRegisterBySmsCode = `${login}loginOrRegisterBySmsCode`;

// 手机号密码登录
const loginByMobilePassword = `${login}loginByMobilePassword`;

// 重置密码
const resetPassword = `${login}resetPassword`;

// 注册账号
const register = `${login}register`;

// 刷新token
const refreshToken = ''; // TODO

// 登录令牌有效性检测
const verifyAccessToken = ''; // TODO

export {
	mpWechatLogin,
	sendSmsCode,
	loginOrRegisterBySmsCode,
	loginByMobilePassword,
	resetPassword,
	register,
	refreshToken,
	verifyAccessToken
};
