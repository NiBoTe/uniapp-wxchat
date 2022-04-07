<template>
	<view class="container u-flex">
		<view class="left" @click="isHide = !isHide">
			<view class="left-box"></view>
		</view>
		<view class="right triangle-left u-flex" :class="item.type  === 'text' ? 'text' : ''" @click="playBtn(item)" v-show="isHide">
			<image src="/static/public/voice_white.png" v-if="item.type === 'audio'"></image>
			<text v-if="item.type === 'audio'">{{item.text}}</text>
			<text v-else-if="item.type === 'text'" :style="{color: item.color || '#ffffff'}">{{item.text}}</text>
			<view class="right-triangle">
				<view class="triangle"></view>
			</view>
		</view>
	</view>
</template>

<script>
		const innerAudioContext = uni.createInnerAudioContext()
		var timer // 播放 录制倒计时
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
			},
			item: {
				type: Object,
				default: function() {
					return {}
				}
			},
		},
		data() {
			return {
				isLeft: true,
				isHide: true,
				tempFilePath: '', //音频路径
				audioLength: 0,
				playStatus: 0, //录音播放状态 0:未播放 1:正在播放
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
								_this.getBox();
							}
						}).exec();
					} else {
						_this.getBox();
					}
				}).exec();
			},
			// 播放
			playBtn(item) {
				if(item.type !== 'audio') return 
				innerAudioContext.src = item.tempFilePath
				console.log(innerAudioContext.src)
				//在ios下静音时播放没有声音，默认为true，改为false就好了。encodeURI
				innerAudioContext.obeyMuteSwitch = false
				//点击播放
				if (this.playStatus == 0) {
					this.playStatus = 1;
					innerAudioContext.play();
					this.countdown(this.time); // 倒计时
				} else {
					this.playStatus = 0;
					innerAudioContext.pause()
				}
				// //播放结束
				innerAudioContext.onEnded(() => {
					this.playStatus = 0;
					innerAudioContext.stop();
				})
			},
			// 倒计时
			countdown(val) {
				let _then = this;
				_then.count = Number(val);
				timer = setInterval(function() {
					if (_then.count > 0) {
						_then.count--
					} else {
						_then.longPress = '1';
						clearInterval(timer);
					}
				}, 1000);
			},
		}
	}
</script>

<style scoped lang="scss">
	.container {
		z-index: 2;
		max-width: 500rpx;

		.left {
			height: 64rpx;
			display: flex;
			align-items: center;
			&-box{
				width: 40rpx;
				height: 40rpx;
				background: #F0203D;
				box-shadow: 0px 4rpx 8rpx 2rpx rgba(19, 19, 19, 0.25);
				border: 6rpx solid #FFFFFF;
				border-radius: 50%;
			}
		}

		.right {
			position: relative;
			width: auto;
			min-height: 64rpx;
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
			
			&.text{
				padding: 12rpx 24rpx !important;
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
