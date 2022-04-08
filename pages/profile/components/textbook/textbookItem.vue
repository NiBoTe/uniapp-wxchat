<template>
	<view class="container">
		<view class="item" :class="imgHeight !== 'auto' ? 'boxShadow' : ''" @click="detailTap">

			<view class="play" v-if="item.type === 'video'">
				<image src="/static/public/video_icon.png"></image>
			</view>
			<view class="item-image">
				<u-lazy-load threshold="-450" border-radius="10" :image="item.cover">
				</u-lazy-load>
				<view class="item-image-badge">
					<text>¥</text>
					<text>{{item.price}}</text>
				</view>

				<view class="mark u-flex u-row-center" v-if="item.state === 'stop_sale'">
					<image :src="setSrc('highScore/stop_sale.png')"></image>
				</view>
			</view>

			<view class="footer">
				<view class="dec u-line-2">{{item.title}}</view>
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
				default: function() {
					return {}
				}
			}
		},
		data() {
			return {

			};
		},
		methods: {
			detailTap() {

				console.log(this.item)
				if (this.item.type === 'video') {
					uni.navigateTo({
						url: `/pages/public/highScore/videoDetail?id=${this.item.id}&type=user`
					})
				} else {
					uni.navigateTo({
						url: `/pages/public/highScore/teachingMaterialDetail?id=${this.item.id}&type=user`
					})
				}
			}


		}
	}
</script>

<style lang="scss">
	.container {
		.item {
			position: relative;
			margin: 10rpx;
			background: #FFFFFF;
			border-radius: 16rpx;

			.play {
				position: absolute;
				z-index: 22;
				top: 20rpx;
				right: 20rpx;

				image {
					width: 42rpx;
					height: 32rpx;
				}
			}

			&.boxShadow {
				margin: 0 12rpx 34rpx;
				box-shadow: 0px 6rpx 16rpx 6rpx rgba(230, 230, 230, 0.5);
				border-radius: 20rpx;

				.item-image {
					position: relative;
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

				.dec {
					padding: 14rpx 0 18rpx;
					border-bottom: 2rpx solid #E9E9E9;
					font-size: 26rpx;
					color: #3A3D71;
				}

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

			.mark {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				background: rgba($color: #000000, $alpha: .5);

				image {
					width: 148rpx;
					height: 148rpx;
				}
			}

		}
	}
</style>
