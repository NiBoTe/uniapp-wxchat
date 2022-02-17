<template>
	<view class="top">
		<view class="navbar">
			<u-navbar title="交易详情" immersive back-icon-color="#1B1B1B" :background="background" :border-bottom="false"
				title-color="#1B1B1B">
			</u-navbar>
		</view>

		<view class="content">
			<view class="header">
				<image :src="setSrc('paySuccess/label_bg.png')"></image>
			</view>
			<view class="main">
				<view class="main-shadow"></view>


				<view class="main-header">
					<view class="status u-flex u-row-center">
						<u-icon v-if="payStatus == 1" name="checkmark-circle-fill" color="#52C41A" size="40"></u-icon>
						<u-icon v-else name="close-circle-fill" color="#FF334D" size="40"></u-icon>
						<text v-if="payStatus == 1">支付成功</text>
						<text v-else>支付失败</text>
					</view>

					<view class="price u-flex u-row-center">
						<text class="unit">¥</text>
						<text>{{orderDetail.amount}}</text>
					</view>
					<view class="order u-flex u-row-center">
						<text>订单编号 ：{{orderDetail.id}}</text>
					</view>
				</view>

				<view class="main-list">

					<view class="main-item u-flex u-row-between">
						<view class="left">商品</view>
						<view class="right">
							<text>{{productDetail.name}}</text>
						</view>
					</view>
					<view class="main-item u-flex u-row-between">
						<view class="left">交易号</view>
						<view class="right">
							<text>{{orderDetail.traceId || ''}}</text>
						</view>
					</view>

					<view class="main-item u-flex u-row-between">
						<view class="left">当前状态</view>
						<view class="right">
							<text :class="payStatus ==1 ? 'suceess' : 'error'">
								{{payStatus == 1 ? '支付成功' : '支付失败'}}
							</text>
						</view>
					</view>

					<view class="main-item u-flex u-row-between">
						<view class="left">成交时间</view>
						<view class="right">
							<text class="suceess">{{payStatus == 1 ? orderDetail.payTime :orderDetail.createdTime}}</text>
						</view>
					</view>

					<view class="main-item u-flex u-row-between">
						<view class="left">支付方式</view>
						<view class="right">
							<text class="suceess">微信支付</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		orderDetail
	} from '@/api/order.js'
	export default {
		data() {
			return {
				orderDetail: {},
				productDetail: {},
				payStatus: 1,
			};
		},
		onLoad(options) {
			if (options.orderId) {
				this.orderId = options.orderId;
				this.payStatus = options.payStatus
				this.initData();
			}
		},
		methods: {
			initData() {
				this.$http.post(orderDetail, {
					orderId: this.orderId
				}).then(res => {
					console.log(res)
					this.orderDetail = res.data.order
					this.productDetail = res.data.product
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		height: calc(100vh);
		background-color: #fff;
	}

	.navbar {
		height: 608rpx;
		background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/paySuccess/header_bg.png');
		background-size: cover;
	}


	.content {
		position: relative;
		margin-top: -440rpx;
	}

	.header {
		margin: 0 34rpx;

		image {
			width: 100%;
			height: 24rpx;
		}
	}

	.main {
		position: relative;
		z-index: 2;
		margin: -20rpx 52rpx 0;
		height: 975rpx;
		background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/paySuccess/content_bg.png');
		background-size: 100% 100%;


		&-shadow {
			width: 100%;
			height: 32rpx;
			background: linear-gradient(360deg, rgba(238, 242, 255, 0) 0%, #E2E8FF 88%, #C5D0F8 100%);
		}

		&-header {
			.status {
				margin-top: 54rpx;

				text {
					margin-left: 16rpx;
					font-size: 34rpx;
					font-weight: bold;
					color: #3A3D71;
				}
			}

			.price {
				margin-top: 42rpx;

				text {
					font-size: 40rpx;
					font-weight: 800;
					color: #3A3D71;

					&.unit {
						margin-right: 4rpx;
						font-size: 28rpx;
						font-weight: bold;
						color: #3A3D71;
					}
				}
			}

			.order {
				margin-top: 10rpx;
				font-size: 26rpx;
				color: #3A3D71;
			}
		}

		&-list {

			margin-top: 70rpx;

			.main-item {
				margin: 0 36rpx;
				padding: 36rpx 0 40rpx 0;
				border-bottom: 2rpx solid #E9E9E9;

				&:last-of-type {
					border-bottom: none;
				}

				.left {
					font-size: 26rpx;
					font-weight: bold;
					color: #3A3D71;
				}

				.right {
					text {
						font-size: 26rpx;
						color: #3A3D71;

						&.success {
							color: #35CE96;
						}

						&.error {
							color: #FF334D;
						}
					}
				}
			}
		}
	}
</style>
