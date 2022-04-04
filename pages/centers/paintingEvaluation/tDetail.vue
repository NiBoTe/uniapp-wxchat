<template>
	<view class="detail">
		<view class="swiper-wrapper">
			<view class="swiper">

				<view class="swiper-item">
					<image :src="detail.evaluateUrl" mode="widthFix"></image>
					<view class="evaluateParams" v-for="(item, index) in evaluateParams" :key="index"
						:style="{top: (item.y / (upx2px(100) /100) - 20) + 'rpx', left:(item.x / (upx2px(100) / 100) - 48) + 'rpx'}">
						<view class="evaluateParams-box">
							<voicePlayback :item="item"></voicePlayback>
						</view>
					</view>
				</view>
				<!-- <swiper @change="swiperChange">
					<swiper-item>
						<view class="swiper-item">
							<image :src="detail.evaluateUrl" mode="widthFix"></image>
							<view class="evaluateParams" v-for="(item, index) in evaluateParams" :key="index" :style="{top: (item.y / (upx2px(100) /100) - 20) + 'rpx', left:(item.x / (upx2px(100) / 100) - 48) + 'rpx'}">
								<view class="evaluateParams-box">
									<voicePlayback :item="item"></voicePlayback>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper> -->
				<!-- <view class="dots u-flex u-row-center">{{currentIndex}}/3</view> -->
				<view class="score u-flex u-row-center" v-if="detail.score >= 0">
					<text>{{detail.score}}</text>
					<text class="unit">分</text>
				</view>
			</view>
			<view class="title">{{detail.title}}</view>

			<view class="label u-flex">
				<image :src="setSrc('painting/painting_dimensions.png')"></image>
				<text>纬度分析</text>
			</view>

			<view class="list">
				<view class="item" v-for="(item, index) in detail.dimensions" :key="index">
					<view class="item-header u-flex u-row-between">
						<view class="left">{{item.name}}</view>
						<view class="right">
							<u-rate :count="5" v-model="item.stars" inactive-icon="star-fill" disabled
								active-color="#35CE96" inactive-color="#E3E3E3" gutter="16" size="32"></u-rate>
						</view>
					</view>

					<view class="item-subheader">
						<text>{{item.content}}</text>
					</view>
				</view>
			</view>
		</view>


		<view class="card">


			<view class="card-title u-flex">
				<view class="image">
					<u-avatar size="65" :src="detail.teacherInfo.headUrl"></u-avatar>
				</view>
				<view class="text">
					<text>{{detail.teacherInfo.fullName}}</text>
					<text>评画老师</text>
				</view>
			</view>
			<view class="card-subtitle">
				<text>{{detail.textComment || ''}}</text>
			</view>
			<view class="card-footer u-flex">

				<view class="left">总评语</view>
				<view class="right u-flex u-row-between">
					<view class="right-vol u-flex">
						<image src="/static/public/voice_blue.png"></image>
						<text>{{$mHelper.formatMinutes(detail.voiceCommentDuration)}}</text>
					</view>

					<view class="right-btn u-flex u-row-center" @click="playBtn()">
						<u-icon v-if="!playStatus" name="play-right-fill" color="#fff" size="28"></u-icon>
						<u-icon v-else name="pause" color="#fff" size="28"></u-icon>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	const innerAudioContext = uni.createInnerAudioContext()
	import {
		orderItemPaintEvaluateDetail,
	} from '@/api/paint_evaluate_v2_teacher.js'
	export default {
		data() {
			return {
				currentIndex: 0,
				id: null,
				detail: {},
				modalShow: false,
				themeColor: this.$mConstDataConfig.themeColor,
				titleStyle: {
					fontSize: '36rpx',
					color: '#1B1B1B'
				},
				playStatus: 0, //录音播放状态 0:未播放 1:正在播放
				evaluateParams: []
			};
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id
				this.initData()
			}
		},
		methods: {
			upx2px(value) {
				if (!value) {
					return 0;
				}
				return uni.upx2px(value);
			},
			initData() {
				this.$http.get(orderItemPaintEvaluateDetail, {
					id: this.id
				}).then(res => {
					console.log(res)
					this.detail = res.data
					this.evaluateParams = this.detail.evaluateParams ? JSON.parse(this.detail.evaluateParams) : []
				})
			},
			swiperChange(e) {
				this.currentIndex = e.detail.current;
			},
			submitTap() {
				this.modalShow = true;
			},
			// 确认评画
			confirmTap() {
				uni.navigateTo({
					url: `/pages/centers/paintingEvaluation/evaluate?id=${this.id}`
				})
			},
			// 播放
			playBtn() {
				innerAudioContext.src = this.detail.voiceComment
				//在ios下静音时播放没有声音，默认为true，改为false就好了。
				// innerAudioContext.obeyMuteSwitch = false
				//点击播放
				if (this.playStatus == 0) {
					this.playStatus = 1;
					innerAudioContext.play();
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
		}
	}
</script>

<style lang="scss" scoped>
	.detail {
		min-height: 100vh;
		padding-top: 28rpx;
		padding-bottom: 160rpx;
		background-color: #F3F3F3;
	}

	.swiper-wrapper {
		margin: 0 34rpx;

		background: #FFFFFF;
		border-radius: 24rpx;

		.swiper {
			position: relative;
			// height: 910rpx;


			&>swiper {
				height: 100%;
			}

			.swiper-item {
				height: 100%;

				&>image {
					width: 100%;
					height: 100%;
					border-radius: 24rpx;
				}

				.evaluateParams {
					position: absolute;
					z-index: 99;
				}
			}

			.dots {
				padding: 0 26rpx;
				position: absolute;
				right: 20rpx;
				bottom: 20rpx;
				height: 48rpx;
				background: #8E7C71;
				border-radius: 24rpx;
				backdrop-filter: blur(10rpx);
				font-size: 28rpx;
				font-weight: 500;
				color: #FFFFFF;
			}

			.score {
				position: absolute;
				top: 62rpx;
				right: -24rpx;
				width: 156rpx;
				height: 92rpx;
				background: url(https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/painting/painting_score.png) no-repeat center;
				background-size: cover;
				align-items: baseline;

				text {
					font-size: 52rpx;
					font-weight: 500;
					color: #FFFFFF;

					&.unit {
						margin-left: 6rpx;
						font-size: 28rpx;
						font-weight: bold;
						color: #FFFFFF;
					}
				}
			}
		}

		.title {
			padding: 30rpx 32rpx;
			border-bottom: 2rpx solid #E9E9E9;
			font-size: 26rpx;
			color: #3A3D71;
		}


		.label {
			padding: 28rpx 34rpx 6rpx;

			image {
				width: 48rpx;
				height: 48rpx;
			}

			text {
				margin-left: 16rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #3A3D71;
			}
		}

		.list {
			.item {
				margin: 22rpx 34rpx 0;
				padding-bottom: 22rpx;
				border-bottom: 2rpx solid #E9E9E9;


				&:last-of-type {
					border-bottom: none;
				}

				&-header {
					.left {
						font-size: 28rpx;
						font-weight: 500;
						color: #3A3D71;
					}
				}

				&-subheader {
					font-size: 26rpx;
					color: #3A3D71;
					line-height: 36px;
				}
			}
		}
	}


	.card {
		margin: 28rpx 34rpx;
		background-color: #fff;
		border-radius: 24rpx;

		&-title {
			padding: 36rpx 32rpx 0;
			align-items: stretch;

			.text {
				margin-left: 10rpx;
				font-size: 24rpx;
				color: #3A3D71;
				display: flex;
				flex-direction: column;


				text {
					&:last-of-type {
						font-size: 20rpx;
						color: #909399;
					}
				}
			}
		}


		&-subtitle {
			margin: 0 34rpx;
			padding: 22rpx 0 26rpx;
			border-bottom: 2rpx solid #E9E9E9;
			font-size: 26rpx;
			color: #3A3D71;
			line-height: 36rpx;

			&.disabled {
				font-size: 28rpx;
				color: #9E9E9E;
				line-height: 40rpx;
			}
		}



		.tips {
			margin: 0 30rpx;
			padding: 28rpx 0 36rpx;

			.left {
				font-size: 28rpx;
				color: #3A3D71;
			}

			.right {

				width: 134rpx;
				height: 56rpx;
				line-height: 56rpx;
				text-align: center;
				background: #35CE96;
				border-radius: 28rpx;
				font-size: 24rpx;
				color: #FFFFFF;
			}
		}

		&-footer {
			padding: 28rpx 34rpx 36rpx;

			.left {
				font-size: 36rpx;
				font-weight: bold;
				color: #3A3D71;
			}

			.right {
				flex: 1;
				padding: 0 10rpx 0 26rpx;
				box-sizing: border-box;
				margin-left: 36rpx;
				height: 80rpx;
				border-radius: 40rpx;
				background: #EFF2FF;

				&-vol {
					image {
						width: 26rpx;
						height: 34rpx;
					}

					text {
						margin-left: 14rpx;
						font-size: 24rpx;
						font-weight: 500;
						color: #3A3D71;
					}
				}

				&-btn {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
					background-color: $u-type-primary;
				}
			}
		}
	}


	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;
		padding: 14rpx 34rpx;
		padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
		background-color: #fff;

		&-btn {
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			background: $u-type-primary;
			box-shadow: 0px 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
			border-radius: 44rpx;
			font-size: 32rpx;
			color: #fff;

			&.disabled {
				background: #EDEFF2;
				color: #8F9091;
			}
		}

	}

	.modal-content {
		padding: 40rpx 40rpx 70rpx;
		font-size: 28rpx;
		color: #1B1B1B;
		line-height: 40rpx;
	}
</style>
