import $mAssetsPath from './assets.config';
import $mConstData from './constData.config';
class Setting {
	constructor(
		appName,
		appLogo,
		appAgreementDefaultSelect,
		styleLoadingIsOpen,
		styleLoadingType,
		styleUserIsOpen,
	) {
		this._appName = appName; // 应用名称
		this._appLogo = appLogo; // 应用Logo
		this._appAgreementDefaultSelect = appAgreementDefaultSelect; // 协议默认选中
		this._styleLoadingIsOpen = styleLoadingIsOpen; // 开启加载
		this._styleLoadingType = styleLoadingType; // 可否自定义风格
		this._styleUserIsOpen = styleUserIsOpen; // 加载类型
	}

	get styleUserIsOpen() {
		return this._styleUserIsOpen;
	}

	set styleUserIsOpen(value) {
		this._styleUserIsOpen = value;
	}


	get appName() {
		return this._appName;
	}

	set appName(value) {
		this._appName = value;
	}

	get appLogo() {
		return this._appLogo;
	}

	set appLogo(value) {
		this._appLogo = value;
	}

	get appAgreementDefaultSelect() {
		return this._appAgreementDefaultSelect;
	}

	set appAgreementDefaultSelect(value) {
		this._appAgreementDefaultSelect = value;
	}


	get isOpenScan() {
		return this._isOpenScan;
	}

	set isOpenScan(value) {
		this._isOpenScan = value;
	}

	get styleLoadingIsOpen() {
		return this._styleLoadingIsOpen;
	}

	set styleLoadingIsOpen(value) {
		this._styleLoadingIsOpen = value;
	}

	get styleLoadingType() {
		return this._styleLoadingType;
	}

	set styleLoadingType(value) {
		this._styleLoadingType = value;
	}

}

export default new Setting(
	$mConstData.appName,	// 应用名称
	$mAssetsPath.logo,	// 应用logo
	false,	// 是否默认选中协议
	true,	// 是否开启loading 加载
	'loop', // loading 加载风格
	true
);
