const business = '/business-service/api/'

// 查询活动列表
const queryActivityInfoList = `${business}wechat/ActivityEnterController/queryActivityInfoList`;

// 查询活动
const queryActivityInfo = `${business}wechat/ActivityEnterController/queryActivityInfo`;

// 查询报名信息
const queryActivitySignUp = `${business}wechat/ActivityEnterController/queryActivitySignUp`;

// 幼儿报名
const saveActivitySignUp = `${business}wechat/ActivityEnterController/saveActivitySignUp`;

export {
	queryActivityInfoList,
	queryActivityInfo,
	queryActivitySignUp,
	saveActivitySignUp
};
