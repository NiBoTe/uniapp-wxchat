<template>
	<view class="container">
		<view class="subpanel u-flex" v-if="isTips">
			<u-icon name="info-circle" color="#EB7164" size="28"></u-icon>
			<text>该页面显示的专业与您在个人资料中选择的擅长专业有关</text>
			<view @click="closeTap">
				<u-icon name="close" color="#8F9091" size="24"></u-icon>
			</view>
		</view>

		<view class="list">
			<view class="item u-flex u-row-between">
				<view class="left">
					<view class="title">
						<text>素描</text>
						<text class="default">（未设置）</text>
						<text class="price">5元/张</text>
					</view>
					<view class="subtitle">这方面我有很多年的素描画经验，也点评了很多学生，在素描领域有自己独到的见解，希望我的经验可以帮助你提升水平。</view>
				</view>

				<view class="right">
					<image src="/static/public/arrow_right.png"></image>
				</view>
			</view>
			<view class="item u-flex u-row-between">
				<view class="left">
					<view class="title">
						<text>素描</text>
						<text class="default">（未设置）</text>
						<text class="price">5元/张</text>
					</view>
				</view>
			
				<view class="right">
					<image src="/static/public/arrow_right.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isTips: true
			};
		},
		methods: {
			closeTap() {
				this.isTips = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {

		min-height: 100vh;
		background-color: #F3F3F3;

		.subpanel {
			padding: 0 32rpx 0 16rpx;
			height: 56rpx;
			background: #FFE5E8;

			text {
				margin-left: 4rpx;
				font-size: 24rpx;
				color: #3A3D71;
			}

			&>view {
				margin-left: 8rpx;
			}
		}

		.list {
			.item {
				min-height: 208rpx;
				padding: 32rpx 22rpx 28rpx 34rpx;
				box-sizing: border-box;
				background-color: #fff;
				border-bottom: 2rpx solid #E9E9E9;

				.left {
					.title {

						text {
							font-size: 30rpx;
							font-weight: bold;
							color: #3A3D71;

							&.default {
								font-size: 28rpx;
								font-weight: 300;
								color: #9E9E9E;
							}

							&.price {
								margin-left: 24rpx;
								font-size: 28rpx;
								font-weight: 300;
								color: #2C3AFF;
							}
						}
					}
					
					.subtitle{
						margin-top: 8rpx;
						font-size: 26rpx;
						color: #3A3D71;
					}
				}

				.right {
					margin-left: 46rpx;
					image {
						width: 28rpx;
						height: 52rpx;
					}
				}
			}
		}
	}
</style>
