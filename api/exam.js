const exam = '/exam/'

// 省份列表
const proviceList = `${exam}proviceList`;

// 考试菜单列表
const examMenuList = `${exam}examMenuList`;

// 考试列表(最近可以报名的考试)
const examList = `${exam}examList`;

// 考试列表(我的未考，我的已考)
const examList2 = `${exam}examList2`;

// 考试详情
const examDetail = `${exam}examDetail`;

// 分页查看某场考试考生列表(报名列表)
const examineeList = `${exam}examineeList`;

//考试报名下单
const examOrderCreate = `${exam}examOrderCreate`;

// 根据机构编码查询名称
const getStudioNameByStudioCode = `${exam}getStudioNameByStudioCode`;

// 去考试(学生列表)
const faceDetectExamineeList = `${exam}faceDetectExamineeList`;

// 查询成绩(可选是否返回成绩分析)
const scoreQuery = `${exam}scoreQuery`;

// 查看科目内容详情
const examQuestionDetail = `${exam}examQuestionDetail`;

// 上传录制的监考视频
const recordVideoSave = `${exam}recordVideoSave`;

// 试卷拍摄根据准考证号搜索
const searchByAdmissionTicketCode = `${exam}searchByAdmissionTicketCode`;

// 上传试卷
const examPaperUpload = `${exam}examPaperUpload`;

// 获取跟这个账户有关的所有考试科目名称
const scoreExamList = `${exam}scoreExamList`;

// 拍摄记录
const examPaperList = `${exam}examPaperList`;

// 小程序人脸核身-GetEidToken-获取E证通Token
const faceDetectGetEidToken = `${exam}faceDetectGetEidToken`;

// 小程序人脸核身-GetEidResult-获取E证通结果信息
const faceDetectGetEidResult = `${exam}faceDetectGetEidResult`;

// 批量导出准考证
const batchExportTicket = `${exam}batchExportTicket`;

// 批量导出二维码
const batchExportQrcode = `${exam}batchExportQrcode`;

// 批量导出考场信息
const batchExportExaminationRoomInfo = `${exam}batchExportExaminationRoomInfo`;

// 查看某个考生信息
const examineeDetail = `${exam}examineeDetail`;

// 编辑考生信息
const examineeUpdate = `${exam}examineeUpdate`;

export {
	proviceList,
	examMenuList,
	examList,
	examList2,
	examDetail,
	examineeList,
	examOrderCreate,
	getStudioNameByStudioCode,
	faceDetectExamineeList,
	scoreQuery,
	examQuestionDetail,
	recordVideoSave,
	searchByAdmissionTicketCode,
	examPaperUpload,
	scoreExamList,
	examPaperList,
	faceDetectGetEidToken,
	faceDetectGetEidResult,
	batchExportTicket,
	batchExportQrcode,
	batchExportExaminationRoomInfo,
	examineeDetail,
	examineeUpdate
};
