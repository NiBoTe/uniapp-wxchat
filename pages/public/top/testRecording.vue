<template>
	<view class="top">
		<camera :device-position="devicePosition" flash="off" @error="error" class="camera"></camera>

		<view class="content">
			<view class="header" :style="{paddingTop: StatusBar + 'px'}">
				<view class="header-switch" @click="devicePositionTap">
					<image src="/static/public/switch_camera.png"></image>
				</view>
				<view class="header-btn u-flex u-row-center" @click="questionTap">
					<text v-if="!isQuestions">查看考题</text>
					<text v-else>隐藏考题</text>
				</view>
			</view>

			<view class="subheader" v-show="isQuestions">
				<view class="subheader-wrapper">
					<view class="">考试题目</view>
				</view>
			</view>

			<view class="time u-flex u-row-center" v-show="isBegin">
				<image src="/static/public/camera_time.png"></image>
				<text>{{timeText}}</text>
			</view>

			<view class="tips u-flex" v-show="isBegin">
				<image src="/static/public/camera_time.png"></image>
				<text>考试已经开始，作画过程录制中</text>
			</view>
		</view>
		<view class="footer">
			<view class="footer-btn" @click="submitTap">{{!isBegin ? '请点击开始' : '点击结束'}}</view>
		</view>

		<u-modal v-model="modalShow" ref="uModal" :async-close="true" :show-title="false" border-radius="32"
			cancel-color="#9E9E9E" :show-cancel-button="showCancelButton" :cancel-style="cancelStyle"
			:confirm-style="confirmStyle" :cancel-text="cancelText" :confirm-text="confirmText"
			:confirm-color="themeColor" :mask-close-able="true" @confirm="confirmTap">
			<view class="modal-content">
				<!-- 结束 -->
				<view class="save" v-if="!isEnd">
					<image :src="setSrc('camera_begin.png')"></image>
					<text>是否结束录制并上传？</text>
				</view>

				<!-- 提交 -->
				<view class="submit" v-else>
					<image :src="setSrc('signUp_submit_bg.png')"></image>
					<text>作画过程已上传</text>
					<text class="dec">作画过程已在后台上传，请保持手机电量及网</text>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalShow: false,
				StatusBar: this.StatusBar - 20,
				devicePosition: 'back',
				isQuestions: false,
				isBegin: false,
				timer: null,
				timeText: '00:00:00',
				timeNum: 0,
				showCancelButton: true,
				cancelStyle: {
					fontWeight: '500'
				},
				confirmStyle: {
					fontWeight: '500'
				},
				cancelText: "取消",
				confirmText: "确认",
				isEnd: false
			};
		},
		methods: {
			submitTap() {
				if (!this.isBegin) {
					this.isBegin = true
					this.settingTimer();
				} else {
					this.modalShow = true;
				}
			},
			// 切换摄像头 
			devicePositionTap() {
				this.devicePosition = this.devicePosition === 'back' ? 'front' : 'back'
			},

			// 隐藏考题
			questionTap() {
				this.isQuestions = !this.isQuestions
			},
			// 计时
			settingTimer() {
				this.timer = setInterval(() => {
					this.timeNum++;
					this.timeText = this.$mHelper.formatSeconds(this.timeNum)
				}, 1000)
			},
			// 弹窗确认
			confirmTap() {
				console.log('=====')

				if (!this.isEnd) {
					clearInterval(this.timer)
					this.isEnd = true
					this.showCancelButton = false
					this.$refs.uModal.clearLoading();
				}

			}
		},
		onUnload() {
			if (this.timer) clearInterval(this.timer)
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		position: relative;

		.camera {
			width: 100%;
			height: 100vh;
		}

		.content {
			position: absolute;
			z-index: 2;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;

			.header {
				position: relative;
				z-index: 3;
				width: 100%;
				height: 160rpx;
				box-sizing: content-box;

				background: #000000;
				display: flex;
				justify-content: space-between;
				align-items: center;

				&-btn {
					margin-right: 170rpx;
					width: 134rpx;
					height: 60rpx;
					transform: rotate(90deg);
					background: #FDFEFF;
					border-radius: 16rpx;
					font-size: 26rpx;
					font-weight: 500;
					color: #2C3AFF;
				}


				&-switch {
					margin-left: 48rpx;

					image {
						width: 56rpx;
						height: 56rpx;
					}
				}
			}

			.subheader {
				background-color: #fff;

				&-wrapper {
					transform: rotate(90deg);
					height: 750rpx;
					overflow: auto;
				}
			}
		}

		// 录制时间
		.time {
			transform: rotate(90deg);
			position: absolute;
			right: -38rpx;
			top: 50%;
			width: 280rpx;
			height: 76rpx;
			background: rgba(173, 0, 22, .59);
			border-radius: 45rpx;
			font-size: 40rpx;
			font-weight: bold;
			color: #FFFFFF;

			image {
				margin-right: 16rpx;
				width: 36rpx;
				height: 36rpx;
			}
		}

		// 开始考试
		.tips {
			position: absolute;
			top: 0;
			left: 60rpx;
			width: 100vh;
			height: 120rpx;
			padding-left: 180rpx;
			background: rgba($color: #000000, $alpha: .34);
			transform-origin: left center;
			transform: rotate(90deg);

			image {
				width: 52rpx;
				height: 52rpx;
			}

			text {
				margin-left: 20rpx;
				font-size: 40rpx;
				font-weight: bold;
				color: #FFFFFF;
			}
		}

		.footer {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 3;
			padding: 14rpx 34rpx;
			padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
			padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
			background-color: #2E2F31;

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

			padding: 40rpx 38rpx 50rpx;
			font-size: 32rpx;
			font-weight: bold;
			color: #3A3D71;

			// 保存
			.save {
				padding: 0 38rpx 0;
				text-align: center;

				image {
					width: 304rpx;
					height: 202rpx;
				}

				text {
					display: block;
					margin-top: 36rpx;

					&.dec {
						margin-top: 14rpx;
						font-size: 24rpx;
						color: #9E9E9E;
					}
				}
			}

			// 提交
			.submit {
				padding: 0 38rpx 0;
				text-align: center;

				image {
					width: 268rpx;
					height: 190rpx;
				}

				text {
					display: block;
					margin-top: 36rpx;

					&.dec {
						text-align: center;
						margin-top: 14rpx;
						font-size: 24rpx;
						color: #9E9E9E;
					}
				}
			}
		}
	}

	/deep/ .u-mode-center-box {
		transform: rotate(90deg);
	}
</style>
