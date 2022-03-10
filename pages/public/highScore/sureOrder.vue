<template>
	<view class="sure-order">
		<view class="content">

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
						商品名称 ：{{detail.title}}
					</view>
					<view class="parameter-list">
						商品数量 ：{{detail.items.length}}张
						<view class="price">
							¥<text>{{(detail.price * detail.items.length).toFixed(2)}}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="t-b"></view>

			<view class="swiper">
				<view class="swiper-item" :class="{'active':activeIndex === index}"
					v-for="(item, index) in detail.items" @click="handleClick(index)">
					<image :src="item.thumbImg" mode="aspectFit"></image>
				</view>
			</view>


			<view class="works">
				<view class="works-img">
					<image :src="detail.items[activeIndex].thumbImg" mode="widthFix"></image>
				</view>
				<view class="mask u-flex u-row-center">
					<image :src="setSrc('highScore/highScore_mask.png')"></image>
				</view>
			</view>

			<view class="checkbox">
				<u-checkbox-group>
					<u-checkbox v-model="checked" size="28" icon-size="20" shape="circle"><text>我已阅读并同意 </text><text
							class="agreement">《付费内容使用协议》</text>
					</u-checkbox>
				</u-checkbox-group>
			</view>

		</view>
		<view class="footer">
			<view class="footer-btn" @click="submitTap">去支付</view>
		</view>
	</view>
</template>

<script>
	import {
		getDetail
	} from '@/api/teaching_material.js'
	
	import {
		orderLaunch,
		orderPay
	} from '@/api/order.js';
	import {
		addressList
	} from '@/api/receive-address.js';
	export default {
		data() {
			return {
				checked: false,
				activeIndex: 0,
				detail: {},
				addressDetail: null,
			};
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id
				this.initData()
			}
			this.getAddressList();
			uni.$on('selectAddress', (data) => {
				this.addressDetail = data.item
			})
		},
		methods: {
			initData() {
				this.$http.get(getDetail, {
					id: this.id
				}).then(res => {
					console.log(res)
					this.detail = res.data
				}).catch(err => {
					console.log(err)
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
			handleClick(index) {
				this.activeIndex = index
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
				await this.createOrder();
			},
			async createOrder() {
				this.$http.post(orderLaunch, {
					productId: this.id,
					productType: 3,
					receiveAddressId: this.addressDetail ? this.addressDetail.id : '',
					total: this.detail.items.length,
				}).then(res => {
					this.productDetail = res.data
					this.goPay();
				}).catch(err => {
					this.$mHelper.toast(err.msg)
					uni.hideLoading()
				})
			},
			goPay(){
				this.$http.post(orderPay, {
					openid: this.$mStore.state.userInfo.openid,
					orderId: this.productDetail.id,
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
					    success: (res) =>  {
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
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss">
	.sure-order {
		display: flex;
		flex-direction: column;
		height: 100vh;



		.top {
			width: 100%;
			// padding-bottom: 160rpx;

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


		}




		.line {
			width: calc(100% - 68rpx);
			height: 2rpx;
			background: #E9E9E9;
			margin: 34rpx auto 22rpx;
		}

		.content {
			padding-bottom: 160rpx;
			flex: 1;
			overflow: auto;
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

		.tro {
			padding: 0 34rpx;

			.title {
				font-size: 28rpx;
				font-family: Helvetica;
				color: #3A3D71;
			}

			.pre {
				font-size: 26rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #3A3D71;
				line-height: 36rpx;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}

		.t-b {
			width: 100%;
			height: 16rpx;
			background: #F7F7F7;
		}

		.checkbox {
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

		.swiper {
			margin-top: 10rpx;
			width: 100vw;
			padding: 40rpx 34rpx;
			overflow-x: scroll;
			white-space: nowrap;

			.swiper-item {
				margin-right: 26rpx;
				display: inline-block;

				image {
					width: 134rpx;
					height: 158rpx;
					border-radius: 5px;
				}
			}

			.active {
				image {
					transform: scale(1.2)
				}
			}
		}

		.works {
			margin: 0 34rpx;
			border-radius: 24rpx;
			position: relative;

			&-img {
				border-radius: 24rpx;
				background: rgba($color: #D8D8D8, $alpha: .6);
				filter: blur(2rpx);

				image {
					width: 100%;
					border-radius: 24rpx;
				}
			}

			.mask {
				position: absolute;
				top: 0;
				right: 0;
				left: 0;
				bottom: 0;
				overflow: hidden;
				border-radius: 24rpx;

				image {
					width: 478rpx;
					height: 268rpx;

				}
			}
		}

		.tabs {
			padding: 0 34rpx;
			width: 100%;
			height: 76rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #9E9E9E;
			line-height: 76rpx;
			position: relative;
			margin: 28rpx 0;

			.tabs-in {
				width: 216rpx;
				height: 76rpx;
				background: #F3F3F3;
				border-radius: 46rpx;
				position: absolute;
				right: 34rpx;
				top: 0;
				display: flex;
				padding: 8rpx;

				.left {
					flex: 1;
				}

				.right {
					flex: 1;

				}

				.coms {
					width: 100rpx;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
				}

				.tabs-active {
					background: #FFFFFF;
					border-radius: 36rpx;
				}
			}
		}

		.description {
			padding: 0 34rpx;

			.title {
				image {
					width: 48rpx;
					height: 48rpx;
					vertical-align: bottom;
					margin-right: 20rpx;
				}

				font-size: 32rpx;
				font-family: Helvetica;
				color: #3A3D71;
				margin-bottom: 28rpx;
			}

			.d-c {
				font-size: 26rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #3A3D71;
				line-height: 36rpx;
			}
		}

		.delivery-content {
			padding: 0 34rpx;
			display: flex;

			.left {
				flex: 1;

				image {
					width: 48rpx;
					height: 48rpx;
					vertical-align: bottom;
					margin-right: 20rpx;
				}

				font-size: 32rpx;
				font-family: Helvetica;
				color: #3A3D71;
				margin-bottom: 28rpx;
			}

			.right {
				flex: 1;
				text-align: right;
			}
		}
	}
</style>
