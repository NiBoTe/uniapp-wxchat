<script>
	/* eslint-disable */
	import Vue from 'vue';
	import {
		verifyAccessToken
	} from '@/api/login'
	import {
		mapMutations
	} from 'vuex';
	import {
		initEid
	} from './mp_ecard_sdk/main';
	export default {
		async onLaunch(options) {
			 initEid();
			// #ifdef MP-WEIXIN
			if (wx.canIUse('getUpdateManager')) {
				const updateManager = wx.getUpdateManager()
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function() {
							wx.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success: function(res) {
									// res: {errMsg: "showModal: ok", cancel: false, confirm: true}
									if (res.confirm) {
										// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
										updateManager.applyUpdate()
									}
								}
							})
						})
						updateManager.onUpdateFailed(function() {
							// 新的版本下载失败
							wx.showModal({
								title: '已经有新版本了哟~',
								content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
							})
						})
					}
				})
			}
			// #endif
			await this.initData();
		},
		methods: {
			// 数据初始化
			async initData() {
				// 获取页面设置配置
				const token = uni.getStorageSync('accessToken');
				// 获取系统title高度
				await this.initSystemInfo();
				if (token) {
					// await this.handleVerifyAccessToken(token); // 验证token
				}
			},

			// 初始化系统信息
			initSystemInfo() {
				uni.getSystemInfo({
					success(e) {
						console.log(e)
						console.log(e.statusBarHeight)
						Vue.prototype.StatusBar = e.statusBarHeight;
						const custom = wx.getMenuButtonBoundingClientRect();
						Vue.prototype.Custom = custom;
						Vue.prototype.CustomBar = custom.top - e.statusBarHeight;
					}
				});
			},
			// 检验token是否有效
			async handleVerifyAccessToken(token) {
				await this.$http.post(verifyAccessToken, {
					token
				}).then(r => {
					if (!r.data.token) {
						this.$mStore.commit('logout');
					}
				});
			}
		}
	};
</script>
<style lang="scss">
	// 导入uviewUI
	@import "uview-ui/index.scss";
	@import './static/css/reset.scss';
</style>
