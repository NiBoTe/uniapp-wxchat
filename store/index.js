import Vue from 'vue';
import Vuex from 'vuex';
import $mConstDataConfig from '@/config/constData.config';
import $mSettingConfig from '@/config/setting.config';
import {
	http
} from '@/utils/request';
Vue.use(Vuex);
const USERINFO = uni.getStorageSync('userInfo') || {};
const ACCESSTOKEN = uni.getStorageSync('accessToken') || '';
const REFRESHTOKEN = uni.getStorageSync('refreshToken') || '';
const store = new Vuex.Store({
	state: {
		// 用户信息
		userInfo: USERINFO,
		// 用户token
		accessToken: ACCESSTOKEN,
		// 小程序openid
		openId: '',
		// 网络状态，用于下载提醒
		networkState: 'unknown',
		refreshToken: REFRESHTOKEN,
	},
	getters: {
		// 获取网络状态
		networkStatus: state => {
			return state.networkState;
		},
		// 判断用户是否登录
		hasLogin: state => {
			return !!state.accessToken;
		}
	},
	mutations: {
		login(state, provider) {
			state.userInfo = provider;
			uni.setStorageSync('userInfo', provider);
		},
		logout(state) {
			state.accessToken = '';
			state.userInfo = {};
			uni.removeStorageSync('accessToken');
			uni.removeStorageSync('userInfo');
		},
		setToken(state, token) {
			state.accessToken = token;
			uni.setStorageSync('accessToken', token);
		},
		setOpenId(state, openId) {
			state.openId = openId;
			uni.setStorageSync('openId', openId);
		},
		setNetworkState(state, provider) {
			state.networkState = provider;
		}
	},
	actions: {
		networkStateChange({
			commit
		}, info) {
			commit('setNetworkState', info);
		},
		logout({
			commit
		}) {
			commit('logout');
		}
	}
});

export default store;
