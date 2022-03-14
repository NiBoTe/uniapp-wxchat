import indexConfig from '@/config/index.config';

const common = '/common/'

const oss = '/oss/'

// 获取省市区街道
const areaList = `${common}dict/areaList`;

// 上传文件
const generatePostPolicy = `${oss}generatePostPolicy`;

// 获取擅长的专业选择列表
const skilledMajorList = `${common}dict/skilledMajorList`;

export {
	areaList,
	generatePostPolicy,
	skilledMajorList
};
