<template>

	<view class="page-index">
		<view class="contenBox">
			<view class="content-view">
				<view class="item" @tap="toAccount">
					<view class="menu-title">账户与安全</view>
					<view class="right">
						<view class="subtitle">
						</view>
						<image src="../../../static/public/arrow_right.png" mode=""></image>
					</view>

				</view>
			</view>
		</view>

		<view class="contenBox">
			<view class="content-view">
				<view class="item" @click="navTo('/pages/set/address/index')">
					<view class="menu-title">我的收货地址</view>
					<view class="right">
						<view class="subtitle">
						</view>
						<image src="/static/public/arrow_right.png" mode=""></image>
					</view>
				</view>
			</view>
		</view>

		<view class="contenBox">
			<view class="content-view">
				<view class="item" @click="navTo('/pages/set/about/agreement')">
					<view class="menu-title">用户协议</view>
					<view class="right">
						<view class="subtitle">
						</view>
						<image src="/static/public/arrow_right.png" mode=""></image>
					</view>
				</view>
				<view class="item" @click="navTo('/pages/set/about/detail')">
					<view class="menu-title">隐私政策</view>
					<view class="right">
						<view class="subtitle">
						</view>
						<image src="/static/public/arrow_right.png" mode=""></image>
					</view>
				</view>
				<view class="item" @click="navTo('/pages/set/roleSelection')">
					<view class="menu-title">切换角色</view>
					<view class="right">
						<view class="subtitle">
						</view>
						<image src="/static/public/arrow_right.png" mode=""></image>
					</view>
				</view>
			</view>

		</view>
		<view class="contenBox" v-if="userInfo.roleSelect === 'teacher'">
			<view class="content-view">
				<view class="item" @click="navTo('/pages/set/paintingEvaluationPrice')">
					<view class="menu-title">专业评画价格</view>
					<view class="right">
						<view class="subtitle">
						</view>
						<image src="/static/public/arrow_right.png" mode=""></image>
					</view>
				</view>
				<view class="item" @click="navTo('/pages/set/bindAccount')">
					<view class="menu-title">绑定收款账号</view>
					<view class="right">
						<view class="subtitle">
						</view>
						<image src="/static/public/arrow_right.png" mode=""></image>
					</view>
				</view>
				<view class="item" @click="navTo('/pages/set/teacherAuth')">
					<view class="menu-title">教师认证</view>
					<view class="right">
						<view class="subtitle success" v-if="userInfo.authStatus === 1">
							已认证
						</view>
						<image src="/static/public/arrow_right.png" mode=""></image>
					</view>
				</view>
			</view>

		</view>
		<view class="contenBox">
			<view class="content-view">
				<view class="item">
					<view class="menu-title">当前版本</view>
					<view class="right">
						<view class="subtitle">
							当前版本：{{version_number}}
						</view>
						<image src="/static/public/arrow_right.png"></image>
					</view>
				</view>
				<view class="item" @click="navTo('/pages/set/about/index')">
					<view class="menu-title">关于易考绘</view>
					<view class="right">
						<view class="subtitle"></view>
						<image src="/static/public/arrow_right.png"></image>
					</view>
				</view>
				<view class="item" @click="clearStorageTap">
					<view class="menu-title">清除缓存</view>
					<view class="right">
						<view class="subtitle">
							{{currentSize}} kb
						</view>
						<image src="/static/public/arrow_right.png" mode=""></image>
					</view>
				</view>
				<view class="item" @click="navTo('/pages/set/feedback')">
					<view class="menu-title">意见反馈</view>
					<view class="right">
						<view class="subtitle">
						</view>
						<image src="../../../static/public/arrow_right.png" mode=""></image>
					</view>
				</view>
			</view>

		</view>

		<view class="bottom">
			<view class="loginOut" @tap="escTap">
				退出登录
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				currentSize: 0,
				background: {
					background: "#0680FD",
				},
				userInfo: {},
				version_number: '1.0'
			}
		},
		onLoad: function(options) {
			this.currentSize = uni.getStorageInfoSync().currentSize;
			this.userInfo = this.$mStore.state.userInfo;

			const accountInfo = wx.getAccountInfoSync();
			console.log(accountInfo)
			this.version_number = accountInfo.miniProgram.version !== '' ? accountInfo.miniProgram.version : '1.0'// 小程序 版本号
		},

		methods: {
			toAccount: function() {
				uni.navigateTo({
					url: '/pages/set/accountList'
				})
			},
			navTo(url) {
				uni.navigateTo({
					url
				})
			},
			// 清除缓存

			clearStorageTap() {
				uni.showModal({
					content: '确定要清除缓存吗',
					success: e => {
						if (e.confirm) {
							uni.clearStorageSync();
							this.currentSize = 0;
							this.$mStore.commit('login', {});
							this.$mHelper.toast('清除缓存成功');
						}
					}
				});
			},
			// 退出登录
			escTap() {
				let _this = this
				uni.showModal({
					title: '提示',
					content: '确认退出登录吗?',
					success: async res => {
						if (res.confirm) {
							_this.profileInfo = {}
							await _this.$mStore.commit('logout');
							let pages = getCurrentPages() // 获取页面栈
							let prePage = pages[pages.length - 2] //获取上一页
							prePage.$vm.needRefresh = true // 需要刷新
							// _this.$mRouter.back();
							uni.reLaunch({
								url:'/pages/index/index'
							})
							uni.$emit('isRefresh', true)
							// uni.redirectTo({
							// 	url: '/pages/public/logintype'
							// })
						}
					}
				});
			},

		},
	}
</script>

<style lang="scss" scoped>
	.page-index {
		background-color: #F3F3F3;
		min-height: 100vh;
		padding-bottom: 28rpx;
		overflow-x: hidden;
	}


	.contenBox {
		padding: 0 30rpx;
		margin-top: 28rpx;

	}

	.content-view {
		border-radius: 24rpx;
		width: 100%;
		background: #fff;
	}


	.item {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 28rpx;
		height: 112rpx;

		.menu-title {
			font-size: 26rpx;
			font-family: PingFang-SC-Bold, PingFang-SC;
			font-weight: bold;
			color: #3A3D71;
		}

	}

	.item .right {
		display: flex;
		justify-content: flex-start;
		align-items: center;

		.subtitle {
			font-size: 26rpx;
			font-family: PingFang-SC-Regular, PingFang-SC;
			font-weight: 400;
			color: #8F9091;
			margin-right: 24rpx;

			&.success {
				color: #35CE96;
			}
		}

		image {
			width: 15rpx;
			height: 28rpx;
		}

	}


	.bottom {
		width: 100%;
		height: 112rpx;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: center;
		margin-top: 24rpx;

		.loginOut {
			border-radius: 24rpx;
			width: 682rpx;
			height: 112rpx;
			background: #fff;
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #2C3AFF;
			text-align: center;
			line-height: 112rpx;
		}
	}
</style>
