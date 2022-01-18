<template>
	<view class="container u-flex">
		<view class="left"></view>
		<view class="right u-flex" :class="isLeft ? 'triangle-left' : 'triangle-right'">
			<image src="/static/public/voice_white.png"></image>
			<text>1'36"</text>

			<view class="right-triangle">
				<view class="triangle"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "VoicePlayback",
		props:{
			top: {
				type: Number,
				default: 0,
			},
			left: {
				type: Number,
				default: 0,
			}
		},
		data() {
			return {
				isLeft: true
			};
		},
		mounted() {
			this.getBox();
		},
		methods: {
			getBox() {
				
				const _this = this;
				uni.createSelectorQuery().in(this.$parent).select('.container').boundingClientRect(result => {
					if (result) {
						uni.createSelectorQuery().in(this).select('.container').boundingClientRect(res => {
							if (res) {
								_this.isLeft = result.width >= this.left + res.width
							} else {
								getBox();
							}
						}).exec();
					} else {
						getBox();
					}
				}).exec();
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		position: absolute;
		z-index: 2;
		top: 0;

		.left {
			width: 40rpx;
			height: 40rpx;
			background: #F0203D;
			box-shadow: 0px 4rpx 8rpx 2rpx rgba(19, 19, 19, 0.25);
			border: 6rpx solid #FFFFFF;
			border-radius: 50%;
		}

		.right {
			position: relative;
			width: 175rpx;
			height: 64rpx;
			border-radius: 12rpx;
			background: rgba(7, 7, 7, 0.5);

			&.triangle-left {
				padding-left: 30rpx;
				padding-right: 38rpx;
				margin-left: 26rpx;
				.right-triangle{
					left: -14rpx;
					border-top: 10rpx solid transparent;
					border-right: 15rpx solid rgba(7, 7, 7, 0.5);
					border-bottom: 10rpx solid transparent;
				}
			}

			&.triangle-right {
				padding-left: 38rpx;
				padding-right: 30rpx;
				margin-right: 26rpx;
				.right-triangle{
					right: -14rpx;
					border-top: 10rpx solid transparent;
					border-left: 15rpx solid rgba(7, 7, 7, 0.5);
					border-bottom: 10rpx solid transparent;
				}
			}

			image {
				width: 18rpx;
				height: 28rpx;
			}

			text {
				margin-left: 10rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #FFFFFF;
			}

			&-triangle {
				position: absolute;
				left: -14rpx;
				width: 0;
				height: 0;
				
			}
		}
	}
</style>
