import indexConfig from './index.config.js';
const PATH = indexConfig.assetsPath;
/*
 * 图片静态资源表
 */

export default {
	// 默认头像
	headImg: PATH + '/missing-face.png',

	// 出错填充图片
	errorImage: PATH + '/errorImage.jpg',

	// 应用logo
	logo: PATH + '/logo.png',

	// 用户默认头像
	userBg: PATH + '/user-bg.png',
	
	// 用户身份LOGO
	identityLogo : PATH + '/identity_logo.png',

	// 500
	noNetWorkImg: PATH + '/noNetWork.png',

	// 404
	notFoundImg: PATH + '/notFound.png',
};
