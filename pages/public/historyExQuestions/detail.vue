<template>
	<view class="detail">
		<scroll-view class="top" scroll-y="true">
			<view class="img">
				<image
					src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2F93%2F59%2F5f%2F93595f21e11a1adbe7190294058ad05f.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645435629&t=96d955bb726b23a142c81386c02ca070"
					mode="widthFix"></image>
			</view>
			<view class="content">
				<view class="title">
					杭州白塔岭富阳校区
				</view>
				<view class="level">
					<u-icon name="eye" color="#3A3D71" size="30"></u-icon>
					<view class="num">8.5万次</view>
					<view class="price">
						¥<text>12.99</text>
					</view>
				</view>
				<view class="des">
					人物半身像随意创作，性别年龄大小种族不限
				</view>
				<view class="copyright">
					版权归XXXX所有
				</view>
				<view class="delivery-content">
					<view class="left">
						<image src="../../../static/public/delivery_content.png" mode="widthFix"></image>发货内容
					</view>

					<view class="right">试卷一份</view>
				</view>
			</view>

		</scroll-view>

		<view class="bottom">
			<button type="default" class="button">立即购买</button>
		</view>
	</view>
</template>
<script>
	import {
		questionDetail
	} from '@/api/history_exam.js'
	export default {
		components: {

		},

		data() {
			return {

			}
		},
		onLoad(options) {
			if (options.questionId) this.questionId = options.questionId;
			this.initData();
		},
		methods: {
			initData() {
				this.$http.post(questionDetail, null, {
					params: {
						questionId: this.questionId
					}
				}).then(res => {
					console.log(res)
				}).catch(err => {
					console.log(err)
				})
			}
		},
	}
</script>
<style lang="scss">
	view {
		line-height: 1;
	}

	.detail {
		height: 100vh;
		width: 100%;

		.top {
			height: calc(100vh - 204rpx);
			width: 100%;

			.img {
				width: 100%;

				image {
					width: 100%;
				}
			}

			.content {
				padding: 28rpx;

				.title {
					font-size: 30rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #3A3D71;
				}

				.level {
					margin-top: 36rpx;
					position: relative;

					.price {
						position: absolute;
						right: 0rpx;
						top: -14rpx;
						text-align: right;
						font-size: 34rpx;
						font-family: PingFang-SC-Bold, PingFang-SC;
						font-weight: bold;
						color: #EF2E3B;

						text {
							font-size: 52rpx;
							font-family: PingFang-SC-Heavy, PingFang-SC;
							font-weight: 800;
						}
					}

					.num {
						display: inline-block;
						font-size: 24rpx;
						font-family: PingFang-SC-Medium, PingFang-SC;
						font-weight: 500;
						color: #3A3D71;
						margin-left: 16rpx;
					}
				}

				.des {
					margin-top: 20rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #3A3D71;
				}

				.copyright {
					margin-top: 32rpx;
					text-align: right;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #9E9E9E;
				}

				.delivery-content {
					margin-top: 32rpx;
					width: 100%;
					display: flex;

					.left {
						flex: 1;

						image {
							width: 48rpx;
							vertical-align: bottom;
							margin-right: 20rpx;
						}

						line-height: 48rpx;
						font-size: 32rpx;
						font-family: PingFangSC-Regular,
						PingFang SC;
						font-weight: 400;
						color: #3A3D71;
					}

					.right {
						flex: 1;
						text-align: right;
						font-size: 28rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #2C3AFF;
						line-height: 48rpx;
					}
				}
			}

		}

		.bottom {
			border-top: 1px solid #EDEDED;
			height: 204rpx;

			.button {
				margin: 0 auto;
				margin-top: 26rpx;
				width: 682rpx;
				height: 88rpx;
				background: #2C3AFF;
				box-shadow: 0rpx 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
				border-radius: 44rpx;
				font-size: 32rpx;
				line-height: 88rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
			}
		}
	}
</style>
