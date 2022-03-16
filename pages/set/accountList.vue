<template>
	<view class="account">

		<view class="item u-flex u-row-between" @click="itemTap(0)">
			<view class="left">登录密码设置</view>
			<view class="right u-flex">
				<view class="text" v-if="!userInfo.passwordIsset">未设置</view>
				<view class="text" v-else></view>
				<image src="/static/public/arrow_right.png"></image>
			</view>
		</view>

		<view class="item u-flex u-row-between" @click="itemTap(1)">
			<view class="left">手机号</view>
			<view class="right u-flex">
				<view class="text">{{userInfo.mobile}}</view>
				<image src="/static/public/arrow_right.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hasLogin: false,
				userInfo: {}
			}
		},
		onShow() {
			this.hasLogin = this.$mStore.getters.hasLogin
			if (this.hasLogin) {
				this.userInfo = this.$mStore.state.userInfo;
				console.log(this.userInfo)
			} else {
				uni.navigateTo({
					url: '/pages/public/logintype'
				})
			}
		},
		methods: {
			itemTap(type) {
				switch (type) {
					case 0:
						uni.$on('update', (isSet) => {
							this.userInfo.passwordIsset = isSet
						})
						uni.navigateTo({
							url: '/pages/set/updatePassword'
						})
						break;
					case 1:
						uni.navigateTo({
							url: '/pages/set/changePhone/index'
						})
						break;
				}

			}
		}
	}
</script>

<style scoped lang="scss">
	.account {
		padding-top: 28rpx;
		min-height: 100vh;
		background-color: #F3F3F3;

		.item {
			margin: 0 34rpx 28rpx;
			padding: 0 30rpx 0 28rpx;
			height: 112rpx;
			background: #FFFFFF;
			border-radius: 24rpx;

			.left {
				font-size: 26rpx;
				font-weight: bold;
				color: #3A3D71;
			}

			.right {

				.text {
					font-size: 26rpx;
					color: #8F9091;
				}

				image {
					margin-left: 16rpx;
					width: 12rpx;
					height: 22rpx;
				}
			}
		}
	}
</style>
