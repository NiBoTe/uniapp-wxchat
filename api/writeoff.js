const business = '/business-service/api/'

// 根据会员属性查询会员列表
const findMemberByProperties = `${business}operatingPoint/findMemberByProperties`;

// 根据会员id查询会员入场凭据以及核销状态
const listBallFriendsBillByPage = `${business}operatingPoint/listBallFriendsBillByPage`;

// 批量核销
const batchWriteOffSessions = `${business}operatingPoint/batchWriteOffSessions`;

// 根据ID 查询会员信息
const findMemberById = `${business}memberController/findMemberById`;

// 扫码核销
const writeOffSingleSessions = `${business}operatingPoint/writeOffSingleSessions`;

export {
	findMemberByProperties,
	listBallFriendsBillByPage,
	batchWriteOffSessions,
	findMemberById,
	writeOffSingleSessions
};
