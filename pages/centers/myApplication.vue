<template>
	<view class="myApplication">
		<view class="navbar">
			<u-navbar title="我的报考" immersive back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>


		<view class="tabs u-flex">
			<view class="tab" @click="navTo('/pages/public/top/top?type=0', true)">
				<image :src="setSrc('myApplication/tab01.png')"></image>
				<text>考试信息</text>
			</view>
			<view class="line"></view>
			<view class="tab" @click="navTo('/pages/public/top/testUpload?type=0')">
				<image :src="setSrc('myApplication/tab02.png')"></image>
				<text>上传试卷</text>
			</view>
			<view class="line"></view>
			<view class="tab" @click="navTo('/pages/centers/achievement/scoreList')">
				<image :src="setSrc('myApplication/tab03.png')"></image>
				<text>成绩查询</text>
			</view>
		</view>


		<view class="subtabs u-flex">
			<view class="subtab" @click="navTo('/pages/centers/achievement/scoreList?type=1')">
				<view class="subtab-header u-flex">
					<image :src="setSrc('myApplication/subtab01.png')"></image>
					<text>准考证查询</text>
				</view>
				<view class="subtab-text">在线快捷查询准考证信息</view>
			</view>
			<view class="subtab subtab02" @click="navTo('/pages/centers/achievement/scoreList?type=2')">
				<view class="subtab-header u-flex">
					<image :src="setSrc('myApplication/subtab02.png')"></image>
					<text>二维码查询</text>
				</view>
				<view class="subtab-text">在线快捷查询二维码信息</view>
			</view>
		</view>


		<u-gap height="16" bg-color="#F7F7F7" margin-top="50"></u-gap>


		<view class="list">
			<view class="item u-flex" @click="navTo('/pages/centers/achievement/scoreList?type=3')">
				<view class="item-icon">
					<image :src="setSrc('myApplication/item01.png')"></image>
				</view>
				<view class="item-main u-flex u-row-between">
					<view class="left">考场查询</view>
					<view class="right">
						<image src="/static/public/arrow_right.png"></image>
					</view>
				</view>
			</view>
			<view class="item u-flex" @click="navTo('/pages/centers/achievement/scoreList?type=4')">
				<view class="item-icon">
					<image :src="setSrc('myApplication/item01.png')"></image>
				</view>
				<view class="item-main u-flex u-row-between">
					<view class="left">报名列表</view>
					<view class="right">
						<image src="/static/public/arrow_right.png"></image>
					</view>
				</view>
			</view>
			<view class="item u-flex" @click="navTo('/pages/public/top/takeRecord')">
				<view class="item-icon">
					<image :src="setSrc('myApplication/item01.png')"></image>
				</view>
				<view class="item-main u-flex u-row-between">
					<view class="left">上传试卷记录</view>
					<view class="right">
						<image src="/static/public/arrow_right.png"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hasLogin: false,
			}
		},
		methods: {
			navTo(url, status) {
				
				if(status) {
					uni.navigateTo({
						url
					})
					return
				}
				this.hasLogin = this.$mStore.getters.hasLogin
				if(!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/public/logintype'
					})
					return 
				}
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.myApplication {
		.navbar {
			height: 360rpx;
			background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/myApplication/navbar_bg.png');
			background-size: cover;
		}

		.tabs {
			justify-content: space-around;
			margin: -140rpx 34rpx 0 28rpx;
			height: 196rpx;
			background: #FFFFFF;
			box-shadow: 0px 6rpx 16rpx 6rpx rgba(128, 128, 128, 0.07);
			border-radius: 24rpx;

			.tab {
				display: flex;
				flex-direction: column;
				align-items: center;

				image {
					width: 112rpx;
					height: 112rpx;
				}

				text {
					font-size: 26rpx;
					color: #3A3D71;
				}
			}

			.line {
				width: 2rpx;
				height: 62rpx;
				background-color: #C2C2C2;
			}
		}


		.subtabs {
			padding: 30rpx 34rpx 0 4rpx;

			.subtab {
				margin-left: 24rpx;
				padding: 30rpx 0 0 32rpx;
				flex: 1;
				height: 172rpx;
				background: linear-gradient(90deg, #FFFFFF 0%, #E6F8F0 100%);
				border-radius: 24rpx;

				&-header {
					image {
						width: 80rpx;
						height: 80rpx;
					}

					text {
						margin-left: 20rpx;
						font-size: 26rpx;
						font-weight: 500;
						color: #3A3D71;
					}
				}

				&-text {
					font-size: 24rpx;
					color: #4ABC88;
				}


				&.subtab02 {
					background: linear-gradient(90deg, #FFFFFF 0%, #FDEFDE 100%);

					.subtab-text {
						color: #F69E3E;
					}
				}
			}
		}

		.list {
			.item {
				margin-left: 36rpx;

				&-icon {
					image {
						width: 48rpx;
						height: 58rpx;
					}
				}

				&-main {
					padding: 46rpx 32rpx 46rpx 28rpx;
					flex: 1;
					border-bottom: 2rpx solid #E9E9E9;

					.left {
						font-size: 26rpx;
						color: #3A3D71;
					}

					.right {
						image {
							width: 14rpx;
							height: 22rpx;
						}
					}
				}
			}
		}
	}
</style>
