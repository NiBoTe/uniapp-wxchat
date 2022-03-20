<template>
	<view class="container">
		<view class="navbar">
			<u-navbar title="订单详情" immersive back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>

		<view class="header u-flex">
			<view class="left">
				<image :src="orderDetail.productImgUrl"></image>
			</view>

			<view class="right">
				<view class="title u-line-2">{{orderDetail.productName || ''}}</view>
				<view class="subtitle u-flex">
					<text>订单编号：</text>
					<text>{{orderDetail.id || ''}}</text>
				</view>

				<view class="subtitle u-flex">
					<text>订单时间：</text>
					<text>{{orderDetail.createdTime}}</text>
				</view>
				
				<view class="subtitle u-flex u-row-between">
					<view class="left">
						<text>费用：</text>
						<text class="unit">¥</text>
						<text class="price">{{orderDetail.price}}</text>
					</view>
					
					<view class="right">
						<text class="status success" v-if="orderDetail.status === 1">支付成功</text>
						<text class="status" v-else-if="orderDetail.status === 0">未支付</text>
						<text class="status" v-else-if="orderDetail.status === 2">已取消</text>
						<text class="status" v-else-if="orderDetail.status === 3">等待退款</text>
						<text class="status" v-else-if="orderDetail.status === 4">退款处理中</text>
						<text class="status" v-else-if="orderDetail.status === 5">退款完成</text>
						<text class="status" v-else-if="orderDetail.status === 6">已结算</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="card">
			<image :src="orderDetail.productImgUrl" mode="widthFix"></image>
			<view class="card-remark">{{orderDetail.remark}}</view>
			
			<view class="card-user u-flex" v-if="extraData.teacher">
				<u-avatar size="108" :src="extraData.teacher.headUrl"></u-avatar>
				<view class="right">
					<view class="right-name">{{extraData.teacher.fullName}}</view>
					<view class="right-subname">评画老师</view>
				</view>
			</view>
		</view>
		
		<view class="subheader" style="padding-top: 24rpx;" v-if="orderDetail.isNeedExpress !== 0">
			<view class="subheader-title u-flex u-row-between" v-if="orderDetail.isNeedExpress === 2">
				<view class="left">配送方式 ：{{orderDetail.expressName}}</view>
				<view class="right u-flex" @click="logisticsTap">
					<text>查看物流信息</text>
					<image src="/static/public/arrow_right.png"></image>
				</view>
			</view>
			<view class="item u-flex u-row-between" style="padding-top: 16rpx;" v-if="orderDetail.isNeedExpress === 2">
				<view class="left">
					<text>物流单号 ：{{orderDetail.expressNumber}}</text>
				</view>
				<view class="right">
					<view class="right-btn" @click="copyTap">复制</view>
				</view>
			</view>
			<view class="item" style="padding-top: 16rpx;">
				<view class="left">
					<text>收货地址 ：</text>
					<text>{{orderDetail.address}}</text>
				</view>
			</view>
		</view>

		<view class="footer" v-if="orderDetail.status === 0">
			<view class="footer-btn esc" @click="escTap">取消订单</view>
			<view class="footer-btn" @click="submitTap">立即支付</view>
		</view>

		<view class="footer" v-if="orderDetail.state === 'DELIVERED'">
			<view class="footer-btn" @click="receivingTap">确认收货</view>
		</view>


		<!-- 选择地址 -->
		<u-popup v-model="popShow" mode="bottom" :safe-area-inset-bottom="true" border-radius="40">
			<view class="pop-header">订单取消</view>
			<view class="pop-subheader">请选择取消订单原因</view>
			<view class="pop-content">
				<view class="list">
					<u-radio-group v-model="cancelReason" @change="radioGroupChange" size="40">

						<view class="item u-flex u-row-between" v-for="(item, index) in list" :key="index"
							@click="selectTap(item)">
							<view class="left">{{item.name}}</view>
							<view class="right">
								<u-radio shape="circle" :name="item.name"></u-radio>
							</view>
						</view>

					</u-radio-group>
				</view>
			</view>

			<view class="pop-footer u-flex">
				<view class="pop-btn esc u-flex u-row-center" @click="popShow = false">暂不取消</view>
				<view class="pop-btn u-flex u-row-center" @click="enterTap">确定取消</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		orderDetail,
		orderPay,
		orderCancel,
		confirmDelivered
	} from '@/api/order.js'

	import moment from '@/common/moment.js'
	export default {
		data() {
			return {
				popShow: false,
				cancelReason: '',
				orderId: null,
				list: [{
						name: '价格有点贵',
						checked: false,
					},
					{
						name: '信息有误',
						checked: false,
					},
					{
						name: '暂时不需要了',
						checked: false,
					},
					{
						name: '其他',
						checked: false,
					}
				],
				orderDetail: {},
				productDetail: {},
				extraData: {}
			};
		},
		onLoad(options) {
			if (options.orderId) {
				this.orderId = options.orderId
				this.initData()
			}
		},
		methods: {

			initData() {
				this.$http.post(orderDetail, {
					orderId: this.orderId
				}).then(res => {
					this.orderDetail = res.data.order
					this.productDetail = res.data.product
					this.extraData = res.data.extraData;
				}).catch(err => {
					console.log(err)
				})
			},
			radioGroupChange(e) {
				console.log(e)
			},
			selectTap(item) {
				this.value = item.name
			},
			// 取消订单
			escTap() {
				this.popShow = true;
			},
			// 立即支付
			submitTap() {
				this.goPay()
			},
			// 确认收货
			receivingTap() {
				uni.showModal({
					title: '提示',
					confirmText: '确认',
					content: '确认收货吗？',
					success: (res) => {
						if (res.confirm) {
							this.$http.post(confirmDelivered, {
								orderId: this.orderId
							}).then(res => {
								this.initData();
							}).catch(err => {
								this.$mHelper.toast(err.msg)
							})
						}
					}
				});

			},
			goPay() {
				this.$http.post(orderPay, {
					openid: this.$mStore.state.openid,
					orderId: this.orderId,
					payType: 1,
					tradeType: 'JSAPI'
				}).then(res => {
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
							this.initData()
						},
						fail: (err) => {
							this.$mHelper.toast('支付失败')
						}
					});
				}).catch(err => {
					this.$mHelper.toast(err.msg)
					uni.hideLoading()
				})
			},
			// 取消订单
			enterTap() {
				this.$http.post(orderCancel, {
					orderId: this.orderId,
					cancelReason: this.cancelReason
				}).then(res => {
					console.log(res)
					this.initData()
				}).catch(err => {
					console.log(err)
					this.$mHelper.toast(err.msg)
				})
			},
			// 复制
			copyTap() {
				uni.setClipboardData({
					data: this.orderDetail.expressNumber, //要被复制的内容
					success: () => { //复制成功的回调函数
						this.$mHelper.toast('复制成功')
					}
				});
			},
			// 查看物流
			logisticsTap() {
				uni.navigateTo({
					url: `/pages/set/logistics?orderId=${this.orderId}`
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		box-sizing: border-box;
		padding-bottom: 160rpx;

		.navbar {
			height: 360rpx;
			background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/myApplication/navbar_bg.png');
			background-size: cover;
		}

		.header {
			margin: -140rpx 34rpx 0 28rpx;
			background: #FFFFFF;
			box-shadow: 0px 6rpx 16rpx 6rpx rgba(161, 161, 161, 0.05);
			border-radius: 24rpx;

			padding: 22rpx;

			.left {
				image {
					width: 180rpx;
					height: 180rpx;
					border-radius: 24rpx;
				}
			}

			.right {
				margin-left: 20rpx;
				flex: 1;

				.title {
					font-size: 28rpx;
					font-weight: bold;
					color: #3A3D71;
					line-height: 40rpx;
				}

				.subtitle {
					margin-top: 10rpx;

					text {
						font-size: 26rpx;
						color: #9E9E9E;

						&.unit {
							font-size: 28rpx;
							font-weight: bold;
							color: #3A3D71;
						}

						&.price {
							font-size: 34rpx;
							font-weight: 800;
							color: #3A3D71;
						}
					}

					.right{
						text-align: right;
						text {
							font-size: 26rpx;
							&.status {
								color: $u-type-primary;
						
								&.success {
									color: #35CE96;
								}
							}
						}
					}
				}
			}
		}

		.subheader {
			margin: 28rpx 34rpx 0 28rpx;
			padding: 6rpx 30rpx 36rpx;
			background: #FFFFFF;
			box-shadow: 0px 6rpx 16rpx 6rpx rgba(230, 230, 230, 0.5);
			border-radius: 24rpx;

			&-title {
				padding-bottom: 32rpx;
				border-bottom: 2rpx solid #E9E9E9;

				.left {
					font-size: 26rpx;
					color: #3A3D71;
				}

				.right {
					text {
						font-size: 24rpx;
						color: #9E9E9E;
					}

					image {
						margin-left: 12rpx;
						width: 12rpx;
						height: 22rpx;
					}
				}
			}

			.item {
				padding-top: 32rpx;

				.left {
					text {
						font-size: 26rpx;
						color: #3A3D71;

						&.status {
							color: $u-type-primary;

							&.success {
								color: #35CE96;
							}
						}
					}
				}

				.right {
					text {
						font-size: 26rpx;
						color: #9E9E9E;

						&.unit {
							font-size: 28rpx;
							font-weight: bold;
							color: #35CE96;
						}

						&.price {
							font-size: 34rpx;
							font-weight: 800;
							color: #35CE96;
						}
					}


					&-btn {
						padding: 0 16rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						height: 38rpx;
						background: #EFF2FF;
						box-shadow: 0px 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
						border-radius: 26rpx;
						font-size: 22rpx;
						color: #2C3AFF;
					}
				}
			}

			.line {
				margin-top: 36rpx;
				height: 2rpx;
				background-color: #E9E9E9;
			}
		}
			
		.card{
			margin: 28rpx 34rpx 0 28rpx;
			padding: 22rpx;
			background: #FFFFFF;
			box-shadow: 0px 6rpx 16rpx 6rpx rgba(230, 230, 230, 0.5);
			border-radius: 24rpx;
			
			& > image{
				width: 100%;
				border-radius: 24rpx;
			}
			
			&-remark{
				padding: 20rpx 0 18rpx 0;
				border-bottom: 2rpx solid #E9E9E9;
				font-size: 26rpx;
				color: #3A3D71;
				line-height: 36px;
			}
			
			&-user{
				margin-top: 26rpx;
				.right{
					margin-left: 24rpx;
					
					&-name{
						font-size: 28rpx;
						font-weight: bold;
						color: #1B1B1B;
					}
					
					&-subname{
						font-size: 28rpx;
						color: #9E9E9E;
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
			display: flex;
			justify-content: center;
			padding: 14rpx 34rpx;
			padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
			padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
			background-color: #fff;

			&-btn {
				flex: 1;
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

				&.esc {
					margin-right: 34rpx;
					background: #EFF2FF;
					box-shadow: 0px 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
					color: #3A3D71;
				}
			}
		}

		.pop-header {
			margin: 0 34rpx 0 28rpx;
			padding: 40rpx 0;
			text-align: center;
			font-size: 32rpx;
			font-weight: bold;
			color: #3A3D71;
			border-bottom: 2rpx solid #E9E9E9;
		}

		.pop-subheader {
			margin: 38rpx 0 0 28rpx;
			font-size: 24rpx;
			color: #9E9E9E;
		}

		.pop-content {
			.list {
				padding: 0 34rpx 0 28rpx;

				.item {
					margin-top: 60rpx;

					.left {
						font-size: 26rpx;
						font-weight: bold;
						color: #3A3D71;
					}
				}
			}
		}

		.pop-footer {
			padding: 60rpx 34rpx 34rpx 28rpx;

			.pop-btn {
				flex: 1;
				height: 88rpx;
				background: #EFF2FF;
				box-shadow: 0px 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
				border-radius: 44rpx;

				font-size: 32rpx;
				color: $u-type-primary;

				&.esc {
					margin-right: 34rpx;
				}
			}
		}
	}
</style>
