<template>
	<view class="container">

		<view class="list">

			<view class="line"></view>
			<view class="item u-flex" v-for="(item, index) in logisticsList" :key="index">
				<view class="left u-flex">
					<view class="left-text" :class="item.statusCode == '3' ? 'active' : ''"
						v-if="item.statusCode == '3'">已签收</view>
					<view class="left-text" v-else-if="item.statusCode == '1'">已收件</view>
					<view class="left-text" v-else>运送中</view>
					<view class="left-label">

						<view class="img u-flex u-row-center">
							<image v-if="item.statusCode == '1'" :src="setSrc('my/logistics_begin.png')"></image>
							<image v-else-if="item.statusCode == '3'" :src="setSrc('my/logistics_end.png')"></image>
							<view v-else class="default"></view>
						</view>

					</view>
				</view>
				<view class="right">
					<view class="right-title" :class="item.statusCode == '3' ? 'active' : ''">{{item.ftime}}</view>
					<view class="right-subtitle" :class="item.statusCode == '3' ? 'active' : ''">{{item.context}}</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		queryExpressV2
	} from '@/api/order.js'
	export default {
		data() {
			return {
				orderId: null,
				logisticsList: []
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
				this.$http.post(queryExpressV2, {
					orderId: this.orderId
				}).then(res => {
					console.log(res)
					this.logisticsList = res.data
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		
		padding-bottom: 60rpx;
		.list {
			padding: 0 50rpx 0 28rpx;
			position: relative;

			.line {
				position: absolute;
				z-index: 1;
				left: 142rpx;
				top: 0;
				bottom: 40rpx;
				border: 2rpx dashed #CBCCCD;
			}

			.item {
				align-items: flex-start;
				margin-top: 40rpx;
				position: relative;
				z-index: 2;

				.left {
					.img {
						width: 56rpx;

						image {
							width: 100%;
							height: 56rpx;
						}

						.default {
							width: 22rpx;
							height: 22rpx;
							background: #CBCCCD;
							border-radius: 2rpx;
							transform: rotate(45deg);
						}
					}

					&-text {
						margin-right: 12rpx;
						font-size: 26rpx;
						font-weight: 500;
						color: #9E9E9E;

						&.active {
							color: #E2283F;
						}
					}
				}

				.right {
					margin-left: 14rpx;
					flex: 1;

					&-title {
						font-size: 26rpx;
						color: #9E9E9E;
						line-height: 40rpx;

						&.active {
							color: #3A3D71;
						}
					}

					&-subtitle {
						font-size: 26rpx;
						color: #9E9E9E;
						line-height: 40rpx;

						&.active {
							color: #3A3D71;
						}
					}
				}
			}
		}
	}
</style>
