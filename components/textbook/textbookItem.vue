<template>
	<view class="container">
		<view class="item" :class="imgHeight !== 'auto' ? 'boxShadow' : ''">
			<view class="item-image">
				<u-lazy-load threshold="-450" border-radius="10" :height="imgHeight"
					:img-mode="imgHeight === 'auto' ? 'widthFix' :  'aspectFill'"
					:image="item.cover">
				</u-lazy-load>
				<view class="item-image-badge">
					<text>¥</text>
					<text>{{item.price}}</text>
				</view>
			</view>

			<view class="footer">
				<view class="footer-title u-flex">
					<view class="image">
						<u-avatar size="65"
							:src="item.teacherHeadUrl">
						</u-avatar>
					</view>
					<view class="text">{{item.teacherFullName}}</view>
				</view>

				<view class="footer-subtitle u-flex u-row-between">
					<view class="left">热度值</view>
					<view class="right u-flex">
						<image src="/static/public/hot.png"></image>
						<text>{{item.hotValue}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "TextbookItem",
		props: {
			imgHeight: {
				type: String | Number,
				default: 'auto'
			},
			item: {
				type: Object,
				default:function(){
					return {}
				}
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.container {
		.item {
			margin: 10rpx;
			background: #FFFFFF;
			border-radius: 16rpx;

			&.boxShadow {
				margin: 0 12rpx 34rpx;
				box-shadow: 0px 6rpx 16rpx 6rpx rgba(230, 230, 230, 0.5);
				border-radius: 20rpx;

				.item-image {
					border-top-left-radius: 20rpx;
					border-top-right-radius: 20rpx;

					&-badge {
						border-radius: 20rpx 0px 0px 0px;
					}
				}
			}

			&-image {
				position: relative;
				overflow: hidden;
				border-top-left-radius: 16rpx;
				border-top-right-radius: 16rpx;

				&-badge {

					position: absolute;
					right: 0;
					bottom: 0;
					height: 40rpx;
					line-height: 40rpx;
					padding: 0 10rpx 0 14rpx;
					background: rgba($color: #000000, $alpha: .5);
					border-radius: 16rpx 0px 0px 0px;
					font-size: 26rpx;
					font-weight: 800;
					color: #FFFFFF;

					text {
						&:first-of-type {
							font-size: 22rpx;
							font-weight: bold;
						}
					}
				}
			}


			.footer {
				padding: 0 20rpx 26rpx;

				&-title {
					position: relative;
					z-index: 2;
					margin-top: -16rpx;

					.image {
						// width: 74rpx;
						// height: 74rpx;
						// line-height: 74rpx;
						padding: 4rpx;
						text-align: center;
						overflow: hidden;
						border-radius: 50rpx;
						background-color: #fff;

						image {
							width: 65rpx;
							height: 65rpx;
						}
					}

					.text {
						margin-left: 16rpx;
						font-size: 24rpx;
						font-weight: 500;
						color: #3A3D71;
					}
				}


				&-subtitle {

					margin-top: 16rpx;

					.left {
						font-size: 24rpx;
						color: #9E9E9E;
					}

					.right {
						align-items: flex-start;

						image {
							width: 24rpx;
							height: 30rpx;
						}

						text {
							margin-left: 8rpx;
							font-size: 24rpx;
							color: #3A3D71;
						}
					}
				}
			}


		}
	}
</style>
