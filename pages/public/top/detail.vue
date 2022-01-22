<template>
	<view class="top">
		<view class="navbar">
			<u-navbar title="考试详情" immersive back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>

		<view class="content">

			<view class="card">
				<view class="card-header u-flex">
					<view class="left">
						<image
							src="https://img0.baidu.com/it/u=3904827974,2084857142&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500">
						</image>
						<view class="left-badge u-flex u-row-center">
							<image src="/static/public/search_white.png"></image>
						</view>

					</view>

					<view class="right">
						<view class="right-title">浙江省2021第一次美术水平测试模拟考试</view>
						<view class="right-subtitle">考试编码：266899032021</view>
						<view class="right-bottom u-flex u-row-between">
							<view class="right-bottom-left">考试费用</view>
							<view class="right-bottom-right u-flex">
								<text>¥</text>
								<text>299</text>
							</view>
						</view>
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

			};
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		height: calc(100vh);
		background-color: #F3F3F3;
	}

	.navbar {
		height: 146rpx;
		background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png');
		background-size: cover;
	}

	.content {

		.card {
			margin: 20rpx 34rpx 0 28rpx;
			padding: 20rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			
			&-header {
				border-bottom: 2rpx solid #E9E9E9;
				padding-bottom: 38rpx;
				.left {
					position: relative;
					border-radius: 16rpx;
					overflow: hidden;
					width: 248rpx;
					height: 248rpx;

					&>image {
						width: 100%;
						height: 100%;
					}

					&-badge {
						position: absolute;
						right: 0;
						bottom: 0;
						width: 64rpx;
						height: 64rpx;
						border-top-left-radius: 40rpx;
						background: rgba($color: #000000, $alpha: .5);

						image {
							width: 34rpx;
							height: 34rpx;
						}
					}
				}

				.right {
					height: 248rpx;
					flex: 1;
					margin-left: 20rpx;
					padding-top: 20rpx;
					&-title {
						font-size: 28rpx;
						font-weight: bold;
						color: #3A3D71;
						line-height: 36rpx;
					}

					&-subtitle {
						margin-top: 16rpx;
						font-size: 26rpx;
						color: #3A3D71;
					}

					&-bottom {
						margin-top: 30rpx;
						&-left {
							font-size: 26rpx;
							color: #3A3D71;
						}

						&-right {
							align-items: flex-end;
							font-size: 34rpx;
							font-weight: 800;
							color: #35CE96;

							text {
								font-size: 28rpx;
								font-weight: bold;
								color: #35CE96;
							}
						}
					}
				}
			}
		}
	}
</style>
