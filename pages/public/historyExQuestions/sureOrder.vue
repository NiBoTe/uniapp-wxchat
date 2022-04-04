<template>
	<view class="sureOrder">
		<view class="top">
			<view class="top-t">
				<view v-if="detail && detail.isNeedExpress">
					<view class="operation" @click="selectTap">
						<view class="left">
							收货地址
						</view>
						<view class="right">
							<text v-if="addressDetail">修改</text>
							<text v-else>选择地址</text>
							<u-icon name="arrow-right" color="#8A8A8A" size="28"></u-icon>
						</view>
					</view>
					<view class="user" @click="selectTap" v-if="addressDetail">
						<view class="tag"
							:class="addressDetail.tag === '家' ? 'home' : addressDetail.tag === '公司' ? 'company' : 'school'">
							{{addressDetail.tag}}
						</view>
						<view class="user-name">
							{{addressDetail.realname}}
						</view>
						<view class="user-iphone">
							{{addressDetail.mobile}}
						</view>
					</view>
					<view class="address" @click="selectTap" v-if="addressDetail">
						{{addressDetail.areaNames.replace(/,/g, ' ')}}{{addressDetail.address}}
					</view>
					<view class="line">

					</view>
				</view>


				<view class="parameter-list">
					商品名称 ：{{detail.question.title}}
				</view>
				<view class="parameter-list">
					商品数量 ：1张
					<view class="price">
						¥<text>{{detail.price}}</text>
					</view>
				</view>
			</view>
			<u-gap height="16" bg-color="#F7F7F7"></u-gap>
			<view class="img">
				<image :src="detail.hdImg !== '' ? detail.hdImg : detail.mosaicImg" mode="widthFix"></image>
			</view>
			<view class="content">
				<u-checkbox-group>
					<u-checkbox v-model="checked" size="28" icon-size="20" shape="circle"><text>我已阅读并同意 </text><text
							class="agreement" @click.stop="navTo">《付费内容使用协议》</text>
					</u-checkbox>
				</u-checkbox-group>
			</view>
		</view>

		<view class="footer">
			<view class="footer-btn" @click="submitTap">去支付</view>
		</view>

		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
	import {
		examPaperImgDetail
	} from '@/api/history_exam.js';
	import {
		addressList
	} from '@/api/receive-address.js';

	import {
		orderLaunch,
		orderPay
	} from '@/api/order.js';
	export default {
		data() {
			return {
				loading: true,
				id: null,
				detail: null,
				checked: false,
				addressList: [],
				addressDetail: null,
				productDetail: null,
				btnLoading: false,
			}
		},
		onLoad(options) {
			if (options.id) this.id = options.id;
			this.getAddressList();
			this.initData();
			uni.$on('selectAddress', (data) => {
				this.addressDetail = data.item
			})
		},
		methods: {
			initData() {
				this.$http.post(examPaperImgDetail, null, {
					params: {
						examPaperImgId: this.id
					}
				}).then(res => {
					this.detail = res.data
					this.loading = false;
				}).catch(err => {
					this.loading = false;
				})
			},
			async createOrder() {
				this.$http.post(orderLaunch, {
					productId: this.id,
					productType: 0,
					receiveAddressId: this.addressDetail ? this.addressDetail.id : '',
					total: 1,
				}).then(res => {
					this.productDetail = res.data
					this.goPay();
				})
			},
			// 选择地址
			selectTap() {
				this.$mRouter.push({
					route: '/pages/set/address/index'
				})
			},
			// 获取地址
			getAddressList() {
				this.$http.post(addressList).then(res => {
					if (res.data.length) {
						this.addressDetail = res.data[0]
					}
				})
			},
			// 去支付
			async submitTap() {
				
				uni.showLoading({
					title: '支付中'
				})
				if (!this.checked) {
					return this.$mHelper.toast('请先勾选阅读付费内容使用协议')
				}
				if (this.detail.isNeedExpress && !this.addressDetail) {
					return this.$mHelper.toast('请选择收货地址')
				}
				
				if(this.btnLoading) return
				this.btnLoading = true;
				await this.createOrder();
			},
			goPay() {
				this.$http.post(orderPay, {
					openid: this.$mStore.state.openid,
					orderId: this.productDetail.id,
					payType: 1,
					tradeType: 'JSAPI'
				}).then(res => {
					let params = res.data
					uni.hideLoading()
					this.btnLoading = false;
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
							if (err.code === 201) {
								this.$mHelper.toast('购买成功，可以查看高清图')
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									})
								}, 1500)
							} else {
								this.$mHelper.toast('支付失败')
							}
						}
					});
				}).catch(err => {
					this.btnLoading = false;
					if (err.code === 201) {
						this.$mHelper.toast('购买成功，可以查看高清图')
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 1500)
					} else {
						this.$mHelper.toast('支付失败')
					}
					
				})
			},
			navTo() {
				uni.navigateTo({
					url: '/pages/set/about/paymentAgreement'
				})
			}
		}
	}
</script>
<style lang="scss">
	view {
		line-height: 1;
	}

	.sureOrder {
		height: 100vh;
		width: 100%;

		.top {
			width: 100%;
			padding-bottom: 160rpx;

			.img {
				width: 100%;
				box-sizing: border-box;
				padding: 28rpx 34rpx;

				image {
					width: 100%;
					border-radius: 16rpx;
				}
			}

			.top-t {
				padding: 28rpx 34rpx;

				.operation {
					display: flex;

					.left {
						flex: 1;
						font-size: 26rpx;
						font-family: Helvetica;
						color: #3A3D71;
					}

					.right {
						text-align: right;
						flex: 1;
						font-size: 26rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #9E9E9E;
					}

					margin-bottom: 28rpx;
				}

				.user {
					view {
						display: inline-block;
					}

					.tag {
						background: #EFF2FF;
						border-radius: 23rpx;
						padding: 10rpx 34rpx;
						font-weight: 500;

						&.home {
							background-color: #EFF2FF;
							color: $u-type-primary;
						}

						&.school {
							background-color: #FFF3EA;
							color: #FF8827;
						}

						&.company {
							background-color: rgba(53, 206, 150, 0.08);
							color: #35CE96;
						}
					}

					.user-name {
						margin-left: 24rpx;
						font-size: 28rpx;
						font-family: Helvetica;
						color: #3A3D71;
						line-height: 46rpx;
					}

					.user-iphone {
						margin-left: 26rpx;
						font-size: 26rpx;
						font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;
						color: #8F9091;
					}
				}

				.address {
					font-size: 26rpx;
					font-family: PingFang-SC-Regular, PingFang-SC;
					font-weight: 400;
					color: #3A3D71;
					margin-top: 22rpx;
				}

				.line {
					width: 100%;
					height: 2rpx;
					background: #E9E9E9;
					margin-top: 26rpx;
				}

				.parameter-list {
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #3A3D71;
					margin-top: 28rpx;
					position: relative;

					.price {
						position: absolute;
						right: 0rpx;
						top: 0rpx;
						text-align: right;
						font-size: 28rpx;
						font-family: PingFang-SC-Bold, PingFang-SC;
						color: #3A3D71;

						text {
							font-size: 40rpx;
							font-family: PingFang-SC-Heavy, PingFang-SC;
							font-weight: 800;
						}
					}
				}

			}

			.content {
				padding: 28rpx 34rpx;

				text {
					font-size: 24rpx;
					color: #1B1B1B;

					&.agreement {
						font-size: 24rpx;
						color: #2C3AFF;
					}
				}

			}

		}

		.footer {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
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
