<template>
	<view class="container">
		<view class="item" @click="itemClick">
			<view class="content">
				<view class="content-text u-flex">
					<view class="left">
						<image :src="item.url"></image>
						<view class="left-badge">
							<text>¥</text>
							<text>{{(item.price / 100).toFixed(2)}}</text>
						</view>
					</view>
					<view class="right">
						<view class="right-title">{{item.name}}</view>
						<view class="right-text">{{item.remark}}</view>
					</view>
				</view>

				<view class="content-footer u-flex u-row-between">
					<view class="left u-flex">
						<text>考试日期：{{item.examStartTime}}至{{item.examEndTime}}</text>
					</view>

					<view class="right u-flex">
						<text>查看详情</text>
						<image src="/static/public/arrow_right.png"></image>
					</view>
				</view>
			</view>


			<view class="item-footer u-flex u-row-between">
				<view class="left u-flex">
					<text>报名日期：{{item.enrollStartTime}}至{{item.enrollEndTime}}</text>
				</view>
				<view class="right u-flex u-row-center">
					<text>快捷报名</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ExaminationItem",
		props: {
			item: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		data() {
			return {

			};
		},
		methods:{
			itemClick(){
				this.$emit('itemClick', this.item)
				uni.navigateTo({
					url: `/pages/public/top/detail?id=${this.item.id}&type=0`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.item {
			margin: 28rpx 32rpx 0;
			background: #FFFFFF;
			box-shadow: 0px 6rpx 16rpx 6rpx rgba(230, 230, 230, 0.5);
			border-radius: 24rpx;

			.header {
				height: 56rpx;
				line-height: 56rpx;
				padding-left: 24rpx;
				background: linear-gradient(90deg, #FFFFFF 0%, #EFF2FF 100%);
				border-radius: 16rpx 16rpx 0px 0px;
				font-size: 28rpx;
				color: #3A3D71;
			}

			.content {

				&-text {
					padding: 14rpx 24rpx;
					
					
					
					.left{
						position: relative;
						width: 132rpx;
						height: 132rpx;
						border-radius: 16rpx;
						overflow: hidden;
						image{
							width: 132rpx;
							height: 132rpx;
						}
						
						&-badge{
							position: absolute;
							right: 0;
							bottom: 0;
							height: 34rpx;
							line-height: 34rpx;
							padding:0 12rpx;
							background: rgba($color: #000000, $alpha: .5);
							border-radius: 16rpx 0px 0px 0px;
							font-size: 20rpx;
							font-weight: 800;
							color: #FFFFFF;
							text{
								&:first-of-type{
									font-size: 16rpx;
									font-weight: bold;
								}
							}
						}
					}
					
					.right{
						margin-left: 16rpx;
						flex: 1;
						&-title{
							font-size: 28rpx;
							font-weight: bold;
							color: #3A3D71;
						}
						
						&-text{
							padding-top: 10rpx;
							font-size: 26rpx;
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
					
				}

				&-footer {
					margin: 0 24rpx;
					padding-bottom: 30rpx;

					border-bottom: 4rpx solid #E9E9E9;

					.left {
						text {
							font-size: 20rpx;
							color: #9E9E9E;
						}
					}

					.right {
						text {
							font-size: 24rpx;
							color: #9E9E9E;
						}

						image {
							margin-left: 8rpx;
							width: 12rpx;
							height: 21rpx;
						}
					}
				}
			}


			&-footer {
				padding: 26rpx 24rpx 28rpx 24rpx;

				.left {
					text {
						font-size: 20rpx;
						color: #9E9E9E;
					}
				}

				.right {
					width: 128rpx;
					height: 50rpx;
					background: #EFF2FF;
					border-radius: 30rpx;
					text{
						font-size: 24rpx;
						font-weight: 500;
						color: $u-type-primary;
					}
					
					
					&.end{
						background: #EFF2FF;
						text{
							color: #9E9E9E;
						}
					}
				}
			}
		}
	}
</style>
