<template>
	<view class="container">
		<view class="item" :class="imgHeight !== 'auto' ? 'boxShadow' : ''" @click="detailTap">
			<view class="item-image">
				<u-lazy-load threshold="-450" border-radius="10" :height="imgHeight"
					:img-mode="imgHeight === 'auto' ? 'widthFix' :  'aspectFill'" :image="item.cover">
				</u-lazy-load>
				<!-- <view class="item-image-badge">
					<text>¥</text>
					<text>{{item.price}}</text>
				</view> -->
			</view>

			<view class="footer">
				<view class="footer-dec u-line-2">{{item.description}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "TextbookItemMy",
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
				if (this.item.type === 'image') {
					uni.navigateTo({
						url: `/pages/public/highScore/teachingMaterialDetail?id=${this.item.id}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/public/highScore/videoDetail?id=${this.item.id}`
					})
				}
			}


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
				padding: 14rpx 20rpx 18rpx;

				&-dec{
					font-size: 26rpx;
					color: #3A3D71;
				}
			}


		}
	}
</style>
