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
			<view class="item u-flex u-row-between" v-for="(item, index) in list" :key='index' @click="detailTap(item, index)">
				<view class="left">
					<view class="title">
						<text>{{item.skilledMajorName}}</text>
						<text class="default" v-if="!item.paintEvaluate">（未设置）</text>
						<text class="price" v-else>{{item.paintEvaluate.price}}元/张</text>
					</view>
					<view class="subtitle" v-if="item.paintEvaluate">{{item.paintEvaluate.description}}</view>
				</view>

				<view class="right">
					<image src="/static/public/arrow_right.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		paintEvaluatePriceList
	} from '@/api/paint_evaluate_v2_teacher.js'
	export default {
		data() {
			return {
				isTips: true,
				list: []
			};
		},

		onShow() {
			this.initData()
		},
		methods: {
			initData() {
				this.$http.post(paintEvaluatePriceList).then(res => {
					console.log(res)
					this.list = res.data
				}).catch(err => {
					console.log(err)
				})
			},
			// 详情
			detailTap(item, index){
				uni.navigateTo({
					url: `/pages/set/setPaintingEvaluationPrice?detail=${JSON.stringify(item)}`
				})
			},
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

					.subtitle {
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
