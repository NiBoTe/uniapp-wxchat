<template>
	<view class="container">

		<view class="panel">
			<view class="title u-flex u-row-between">
				<vlew class="left">
					<view class="left-title">{{isEyes ? totalIncome.toFixed(2) : '******'}}</view>
					<view class="left-subtitle">账户总览</view>
				</vlew>

				<view class="right" @click="showTap">
					<u-icon v-if="isEyes" name="eye" color="#fff" size="46"></u-icon>
					<image v-else src="/static/my/close_eye.png"></image>
				</view>
			</view>

			<view class="footer u-flex">

				<view class="footer-item">
					<view class="title">{{isEyes ? yesterdayIncome.toFixed(2) : '****'}}</view>
					<view class="subtitle">昨日收益</view>
				</view>

				<view class="line"></view>
				<view class="footer-item">
					<view class="title">{{isEyes ? balance.toFixed(2) : '****'}}</view>
					<view class="subtitle">可提现金额</view>
				</view>
			</view>
		</view>

		<view class="subpanel u-flex u-row-between" v-if="isTips">
			<u-icon name="info-circle" color="#EB7164" size="28"></u-icon>
			<text>每月15日发放可提现金额（会扣除平台服务费和代付手续费）</text>

			<view @click="closeTap">
				<u-icon name="close" color="#8F9091" size="28"></u-icon>
			</view>
		</view>
		<scroll-view :scroll-y="isFixed" class="scroll-warper" @scrolltolower="lower">

			<view class="list">
				<view class="item u-flex u-row-between" v-for="(item, index) in list" :key="index">
					<view class="left">
						<view class="left-title">{{item.title}}</view>
						<view class="left-subtitle">{{item.createTime}}</view>
					</view>

					<view class="right" v-if="item.type === 1">
						<view class="right-item">
							<text>实际发放</text>
							<text class="price">{{item.realMoney.toFixed(2)}}</text>
						</view>
						<view class="right-item">
							<text>可提现金额</text>
							<text class="price">{{item.money.toFixed(2)}}</text>
						</view>
					</view>
					
					<view class="right" v-else>
						<view class="right-item">
							<text class="price">+{{item.realMoney.toFixed(2)}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<nodata v-if="!loadStatus !== 'loading' && !list.length"></nodata>
			<u-loadmore v-else :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
		</scroll-view>
	</view>
</template>

<script>
	import {
		myEarningsSum,
		myEarningsList
	} from '@/api/userInfo.js';
	export default {
		name: "Profit",
		props: {
			type: {
				type: String,
				default: 'list'
			}
		},
		created() {
			console.log(this.teacherId)
			console.log('ceshi 111')
		},
		data() {
			return {
				isFixed: false,
				isTips: true,
				isEyes: true,
				loadStatus: 'loadmore',
				current: 1,
				size: 10,
				list: [],
				balance: 0,
				totalIncome: 0,
				yesterdayIncome: 0
			}
		},
		created() {
			this.initData();
			this.getList();
			uni.$on('removeHighScore', () => {
				this.current = 1
				this.getList()
			})

			uni.$on('offHighScore', () => {
				this.current = 1
				this.getList()
			})

			uni.$on('updateHighScore', () => {
				this.current = 1
				this.getList()
			})
		},
		methods: {
			initData() {
				this.$http.post(myEarningsSum).then(res => {
					console.log(res)
					let {
						balance,
						totalIncome,
						yesterdayIncome
					} = res.data
					this.balance = balance
					this.totalIncome = totalIncome
					this.yesterdayIncome = yesterdayIncome
				}).catch(err => {
					console.log(err)
				})
			},
			lower() {
				this.loadStatus = 'loading';
				this.addRandomData();
			},

			getList() {
				this.loadStatus = 'loading';
				this.$http.post(myEarningsList, {
					current: this.current,
					size: this.size,
				}).then(res => {
					let data = res.data
					if (this.current === 1) {
						this.list = res.data.records;
					} else {
						this.list = this.list.concat(res.data.records);
					}
					if (res.data.total <= this.list.length) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}

				}).catch(err => {
					console.log(err)
				})
			},
			addRandomData() {
				this.current++;
				this.getList();
			},
			noScroll(bool) {
				this.isFixed = bool
			},
			refresh(){
				this.current = 1;
				this.getList()
			},
			tabChange(e) {
				this.$refs.uWaterfall.clear();
				this.state = e.item.value
				this.current = 1;
				this.getList()
			},
			// 关闭提示
			closeTap() {
				this.isTips = false;
			},
			// 隐藏金额
			showTap() {
				this.isEyes = !this.isEyes
			}
		}
	}
</script>


<style lang="scss" scoped>
	.container {
		padding-bottom: 200rpx;
		background-color: #fff;
	}

	.scroll-warper {
		padding: 18rpx 24rpx;
		height: calc(100vh - 94rpx);
	}

	.panel {
		margin: 26rpx 34rpx 16rpx;
		padding: 28rpx 36rpx;
		height: 268rpx;
		background: url(https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/my/profit_bg.png) no-repeat center;
		background-size: cover;

		.title {
			.left {
				&-title {
					font-size: 36rpx;
					font-weight: 600;
					color: #FFFFFF;
				}

				&-subtitle {
					font-size: 24rpx;
					color: #B5CEFF;
				}
			}

			.right {
				image {
					width: 46rpx;
					height: 23rpx;
				}
			}
		}

		.footer {
			margin-top: 40rpx;

			&-item {
				.title {
					font-size: 28rpx;
					font-weight: 600;
					color: #FFFFFF;
				}

				.subtitle {
					font-size: 24rpx;
					color: #B5CEFF;
				}
			}

			.line {
				margin: 0 48rpx;
				width: 2rpx;
				height: 52rpx;
				background: #B5CEFF;
			}
		}

	}

	.subpanel {
		padding: 0 32rpx 0 6rpx;
		height: 56rpx;
		background: #FFE5E8;

		text {
			font-size: 24rpx;
			color: #3A3D71;
		}
	}

	.list {
		.item {
			margin-left: 34rpx;
			padding: 32rpx 0;
			border-bottom: 2rpx solid #E9E9E9;

			&:last-of-type {
				border-bottom: none;
			}

			.left {

				&-title {
					font-size: 26rpx;
					font-weight: bold;
					color: #3A3D71;
				}

				&-subtitle {
					margin-top: 10rpx;
					font-size: 26rpx;
					color: #9E9E9E;
				}
			}

			.right {
				text {
					font-size: 24rpx;
					font-weight: 400;
					color: #3A3D71;

					&.price {
						margin-left: 10rpx;
						font-size: 32rpx;
						font-weight: 600;
						color: #3A3D71;
					}
				}
			}
		}
	}
</style>
