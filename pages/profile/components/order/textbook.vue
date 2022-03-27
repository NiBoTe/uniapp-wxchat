<template>
	<view class="container">

		<scroll-view :scroll-y="isFixed" class="scroll-warper" @scrolltolower="lower">
			<view class="list">
				<view class="item" v-for="(item, index) in list" :key="index" @click="detailTap(item)">
					<view class="item-main u-flex">
						<view class="left">
							<image :src="item.productImgUrl"></image>
						</view>
						<view class="right">
							<view class="right-title u-line-2">{{item.productName}}</view>
							<view class="right-subtitle u-line-2">{{item.productDescription}}</view>
						</view>
					</view>

					<view class="item-order u-flex u-row-between">
						<view class="left">订单编号：{{item.id}}</view>
						<view class="right success" v-if="item.state === 'COMPLETED'">付款成功</view>
						<view class="right no" v-else-if="item.state === 'NOT_PAY'">未支付</view>
						<view class="right close" v-else-if="item.state === 'CLOSED'">交易关闭</view>
						<view class="right close" v-else-if="item.state === 'NOT_DELIVERED'">待发货</view>
						<view class="right close" v-else-if="item.state === 'DELIVERED'">已发货</view>
					</view>

					<view class="item-footer u-flex u-row-between">
						<view class="left">订单时间：{{item.createdTime}}</view>
						<view class="right">
							<text>费用：</text>
							<text class="unit">¥</text>
							<text class="price">{{item.amount}}</text>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore margin-top="30" :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
		</scroll-view>
	</view>
</template>

<script>
	import {
		orderList,
	} from '@/api/order.js';
	export default {
		name: "TextBook",
		data() {
			return {
				isFixed: false,
				loadStatus: 'loadmore',
				current: 1,
				size: 10,
				list: [],
				userInfo: {},
				state: ''
			}
		},
		created() {
			this.userInfo = this.$mStore.state.userInfo
			this.getList();
		},
		methods: {
			lower() {
				this.loadStatus = 'loading';
				this.addRandomData();
			},
			getList() {
				this.loadStatus = 'loading';
				this.$http.post(orderList, {
					isTeacher: this.userInfo.roleSelect === 'teacher',
					productType: 3,
					state: this.state,
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
			// 刷新
			refresh(status){
				this.state = status;
				this.current = 1;
				this.getList();
			},
			detailTap(item){
				uni.$on('textbookRefresh', () => {
					this.current = 1;
					this.getList();
				})
				uni.navigateTo({
					url: `/pages/set/order/textbookDetail?orderId=${item.id}`
				})
			}
		}
	}
</script>


<style lang="scss" scoped>
	.scroll-warper {
		height: calc(100vh - 94rpx);
		padding-bottom: 170rpx;
	}

	.list {

		.item {
			margin: 28rpx 34rpx 0;
			padding: 20rpx;
			background: #FFFFFF;
			box-shadow: 0px 6rpx 16rpx 6rpx rgba(230, 230, 230, 0.5);
			border-radius: 24rpx;

			&-main {
				.left {
					image {
						width: 180rpx;
						height: 180rpx;
						border-radius: 16rpx;
					}
				}

				.right {
					margin-left: 20rpx;

					&-title {
						font-size: 28rpx;
						font-weight: bold;
						color: #3A3D71;
					}

					&-subtitle {
						margin-top: 18rpx;
						font-size: 26rpx;
						color: #3A3D71;
					}
				}
			}

			&-order {
				padding-bottom: 12rpx;
				border-bottom: 2rpx solid #E9E9E9;

				.left {
					font-size: 26rpx;
					color: #9E9E9E;
				}

				.right {
					font-size: 24rpx;

					&.success {
						color: #35CE96;
					}

					&.no {
						color: $u-type-primary;
					}

					&.close {
						color: #FF334D;
					}
				}
			}


			&-footer {
				margin-top: 10rpx;
				.left {
					font-size: 26rpx;
					color: #9E9E9E;
				}

				.right {
					text {
						font-size: 26rpx;
						color: #9E9E9E;

						&.unit {
							font-size: 28rpx;
							font-weight: bold;
							color: #3A3D71;
						}

						&.price {
							margin-left: 4rpx;
							font-size: 34rpx;
							font-weight: 800;
							color: #3A3D71;
						}
					}
				}
			}
		}
	}
</style>
