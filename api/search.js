import indexConfig from '@/config/index.config';

const search = '/search/'

// 获取热门搜索关键词列表
const hotKeywordList = `${search}hotKeywordList`;

// hotKeyword增加点击量
const hotKeywordPlusViewCount = `${search}hotKeywordPlusViewCount`;

// 根据关键词搜索结果返回各个类型搜索结果的数量
const searchCount = `${search}searchCount`;

// 搜索结构列表
const searchMatch = `${search}searchMatch`;

// 所搜考试信息
const searchExamList = `${search}searchExamList`;

// 历年考题
const searchQuestionList = `${search}searchQuestionList`;

//高分教材
const searchTeachingMaterialList = `${search}searchTeachingMaterialList`;

// 评画
const searchPaintEvaluateList = `${search}searchPaintEvaluateList`;

// 名师
const searchTeacherList = `${search}searchTeacherList`;

// 动态
const searchSnsList = `${search}searchSnsList`;

export {
	hotKeywordList,
	hotKeywordPlusViewCount,
	searchCount,
	searchMatch,
	searchExamList,
	searchQuestionList,
	searchTeachingMaterialList,
	searchPaintEvaluateList,
	searchTeacherList,
	searchSnsList
};
