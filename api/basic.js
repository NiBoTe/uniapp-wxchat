import indexConfig from '@/config/index.config';

const common = '/common-service/api/'

const dictionaries = '/basedata-service/'

const otherRule = '/business-service/api/userVenueRuleController/'

// 获取省份
const getProvinceList = `${common}regionController/findAllRegion`;

// 根据ID获取省市区
const findRegionByIDs = `${common}regionController/findRegionByIDs`;

// 获取静态字典
const getAllDictionaries = `${common}dataDictController/getAll`;

// 获取动态字典
const getDataPools = `${common}dataPoolController/getDataPools`;

// 获取运动类型
const sportTypes = `${dictionaries}sport-types`

// 根据运动类型获取对于的场区以及场地类型
const sportTypesFields = `${dictionaries}sport-types/fields`

// 根据场地类型获取运动类型
const getPlaceTypeByFieldId = `${dictionaries}sport-types/getPlaceTypeByFieldId`

// 根据ID查看场地信息
const getVenueStructureById = `${dictionaries}api/SiteController/getVenueStructureById`

// 根据运动类型获取场地规则
const findUserVenueRuleBySportTypeId = `${otherRule}findUserVenueRuleBySportTypeId`

// 根据运动类型和规则状态查询场地使用规则
const getOtherRules = `${otherRule}findUserVenueRuleBySportTypeIdAndDataStatus`

// 上传图片
const uploadImage = `${indexConfig.baseUrl}${common}uploadFileController/upload`; // TODO

// 获取图片地址
const getFileId = `${indexConfig.baseUrl}${common}uploadFileController/getFileStreamById?fileId=`

export {
	getProvinceList,
	findRegionByIDs,
	getAllDictionaries,
	getDataPools,
	sportTypes,
	sportTypesFields,
	getPlaceTypeByFieldId,
	getVenueStructureById,
	getFileId,
	getOtherRules,
	uploadImage
};
