const business = '/business-service/api/weChatController/'

// 微信授权登录
const wechatH5Login = '/tiny-shop/v1/third-party/wechat';

// 微信小程序授权登录
const mpWechatLogin = `${business}weChatCreateUserAndLogin`;

// 刷新token
const refreshToken = ''; // TODO

// 登录令牌有效性检测
const verifyAccessToken = ''; // TODO

const login = `/auth-service/api/loginController/login`;
export {
	wechatH5Login,
	mpWechatLogin,
	refreshToken,
	verifyAccessToken,
	login
};
