<template>
	<view class="order">

		<view class="card">
			<view class="header u-flex u-row-between">
				<view class="label">应付金额</view>
				<view class="right">
					<text class="unit">¥</text>
					<text>{{params.amount || 0}}</text>
				</view>
			</view>

			<view class="item u-flex u-row-between">
				<view class="label">收款人</view>
				<view class="text">{{params.fullName || ''}}</view>
			</view>
			<view class="item u-flex u-row-between">
				<view class="label">商品名称</view>
				<view class="text">{{params.productName || ''}}</view>
			</view>
			<view class="item u-flex u-row-between">
				<view class="label">订单编号</view>
				<view class="text">{{params.orderId || ''}}</view>
			</view>

			<view class="grap u-flex">
				<view class="circle" style="left: -20rpx;"></view>
				<view class="line"></view>
				<view class="circle" style="right: -20rpx;"></view>
			</view>


			<view class="total u-flex u-row-between">
				<view class="label">商品数量</view>
				<view class="num u-flex u-row-center">{{params.total || 0}}</view>
			</view>
		</view>


		<view class="pay">
			<view class="pay-label">付款方式</view>

			<view class="pay-main u-flex u-row-between">
				<view class="left u-flex">
					<image src="/static/public/weixin_pay.png"></image>
					<text>微信支付</text>
				</view>

				<view class="right">
					<u-icon name="checkmark-circle-fill" color="#35CE96" size="42"></u-icon>
				</view>
			</view>
		</view>

		<view class="footer">
			<view class="footer-btn" @click="submitTap">立即支付</view>
		</view>
	</view>
</template>

<script>
	import {
		orderLaunch,
		orderPay
	} from '@/api/order.js';
	export default {
		data() {
			return {
				params: {}
			};
		},
		onLoad(options) {
			if (options.params) this.params = JSON.parse(options.params)
		},
		methods: {
			// 去支付
			async submitTap() {
				uni.showLoading({
					title: '支付中'
				})
				// await this.createOrder();
				this.goPay();
			},
			// async createOrder() {
			// 	this.$http.post(orderLaunch,
			// 		this.params).then(res => {
			// 		this.productDetail = res.data
			// 		this.goPay();
			// 	}).catch(err => {
			// 		this.$mHelper.toast(err.msg)
			// 		uni.hideLoading()
			// 	})
			// },
			goPay() {
				this.$http.post(orderPay, {
					openid: this.$mStore.state.openid,
					orderId: this.params.orderId,
					payType: 1,
					tradeType: 'JSAPI'
				}).then(res => {
					console.log(res)
					let params = res.data
					uni.hideLoading()
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: params.timeStamp,
						nonceStr: params.nonceStr,
						package: params.packageValue,
						signType: params.signType,
						paySign: params.paySign,
						success: (res) => {
							this.$mHelper.toast('支付成功')
							setTimeout(() => {
								uni.navigateBack({
									delta: 2
								})
							}, 1500)
						},
						fail: (err) => {
							this.$mHelper.toast('支付失败')
						}
					});
				}).catch(err => {
					this.$mHelper.toast(err.msg)
					if(err.code === 201) {
						setTimeout(() => {
							uni.navigateBack({
								delta: 2
							})
						}, 1500)
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.order {
		padding-top: 30rpx;
		min-height: 100vh;
		background-color: #F3F3F3;
		box-sizing: border-box;

		.card {

			margin: 0 34rpx;
			background: #FFFFFF;
			border-radius: 24rpx;

			.label {
				font-size: 26rpx;
				color: #9E9E9E;
			}

			.header {
				padding: 46rpx 28rpx 40rpx 30rpx;
				border-bottom: 2rpx solid #E9E9E9;

				.right {
					text {
						font-size: 52rpx;
						font-weight: bold;
						color: #1B1B1B;

						&.unit {
							font-size: 32rpx;
							font-weight: bold;
							color: #1B1B1B;
						}
					}
				}
			}


			.item {
				margin: 40rpx 30rpx 0;

				.text {
					font-size: 26rpx;
					color: #3A3D71;
				}
			}


			.grap {
				position: relative;
				padding: 50rpx 0;

				.circle {
					position: absolute;
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					background-color: #F3F3F3;
				}

				.line {
					margin: 0 44rpx;
					flex: 1;
					border: 2rpx dashed #E9E9E9;
				}
			}

			.total {
				padding: 0 30rpx 44rpx;

				.num {
					min-width: 100rpx;
					height: 48rpx;
					background: #EFF2FF;
					border-radius: 27rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: $u-type-primary;
				}
			}
		}

		.pay {
			margin: 28rpx 34rpx 0;
			padding: 40rpx 28rpx 40rpx 30rpx;
			background: #FFFFFF;
			border-radius: 24rpx;

			&-label {
				font-size: 28rpx;
				font-weight: bold;
				color: #3A3D71;
			}


			&-main {
				margin-top: 32rpx;

				.left {
					image {
						width: 52rpx;
						height: 46rpx;
					}

					text {
						margin-left: 18rpx;
						font-size: 28rpx;
						color: #1B1B1B;
					}
				}
			}
		}


		.footer {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 999;
			padding: 14rpx 34rpx;
			padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
			padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
			background-color: #fff;

			&-btn {
				height: 88rpx;
				line-height: 88rpx;
				text-align: center;
				background: $u-type-primary;
				box-shadow: 0px 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
				border-radius: 44rpx;
				font-size: 32rpx;
				color: #fff;

				&.disabled {
					background: #EDEFF2;
					color: #8F9091;
				}
			}
		}
	}
</style>
