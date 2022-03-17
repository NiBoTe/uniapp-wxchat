<template>
	<view class="container">
		<view class="item" @click="itemClick">
			<view class="header">{{item.title}}</view>

			<view class="content">
				<view class="content-text">{{item.content}}</view>

				<view class="content-footer u-flex u-row-between">
					<view class="left u-flex">
						<text>考试时间</text>
						<text class="time">{{item.examDate}}</text>
					</view>

					<view class="right u-flex">
						<text>查看详情</text>
						<image src="/static/public/arrow_right.png"></image>
					</view>
				</view>
			</view>

			<view class="item-footer u-flex u-row-between">
				<view class="left u-flex">
					<image src="/static/public/examinationPaper_icon.png"></image>
					<text>高分试卷</text>
				</view>
				<view class="right">
					<image src="/static/public/route.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ExaminationPaperItem",
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
					url: `/pages/public/historyExQuestions/excontent?questionId=${this.item.id}&subjectName=${this.item.subjectName}`
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

				&-footer {
					margin: 0 24rpx;
					padding-bottom: 30rpx;

					border-bottom: 4rpx solid #E9E9E9;

					.left {
						text {
							font-size: 24rpx;
							color: #888C90;

							&.time {
								margin-left: 20rpx;
								color: #3A3D71;
							}
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
					image {
						width: 44rpx;
						height: 44rpx;
					}

					text {
						margin-left: 24rpx;
						font-size: 26rpx;
						color: #3A3D71;
					}
				}

				.right {
					image {
						width: 34rpx;
						height: 14rpx;
					}
				}
			}
		}
	}
</style>
