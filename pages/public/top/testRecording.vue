<template>
	<view class="top">
		<view>
			<camera :device-position="devicePosition" resolution="low" frame-size="small" flash="off"
				@error="error" class="camera"></camera>
			<view class="temp" :style="{zIndex: isStop ? 1 : -1}">
				<image :src="tempThumbPath"></image>
			</view>
			<view class="content">
				<view class="header" :style="{paddingTop: StatusBar + 'px'}">
					<view class="header-switch" @click="devicePositionTap" v-if="!isBegin">
						<image src="/static/public/switch_camera.png"></image>
					</view>

					<view class="header-switch" v-else></view>
					<view class="header-btn u-flex u-row-center" @click="questionTap">
						<text v-if="!isQuestions">查看考题</text>
						<text v-else>隐藏考题</text>
					</view>
				</view>

				<view class="subheader" v-show="isQuestions">
					<view class="subheader-wrapper">
						<view class="subtitle">{{examName}}</view>
						<view class="title">{{examQuestion.course || ''}}</view>

						<view class="cells">
							<view class="cell">
								<view class="cell-label">考试题目：</view>
								<view class="cell-content">
									<text>{{examQuestion.content || ''}}</text>
								</view>
							</view>
							<view class="cell">
								<view class="cell-label">考试要求：</view>
								<view class="cell-content">
									<text>{{examQuestion.rule || ''}}</text>
								</view>
							</view>

							<view class="cell" v-if="examQuestion.url">
								<view class="cell-label">考试图片：</view>
								<view class="cell-content">
									<image :src="examQuestion.url">
									</image>
								</view>
							</view>
							<view class="cell">
								<view class="cell-label">备 注：</view>
								<view class="cell-content">
									<text>{{examQuestion.remark || ''}}</text>
								</view>
							</view>
						</view>
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
	import {
		examQuestionDetail,
		recordVideoSave
	} from '@/api/exam.js'

	import {
		generatePostPolicy
	} from '@/api/basic.js'
	export default {
		data() {
			return {
				modalShow: false,
				StatusBar: this.StatusBar - 20,
				devicePosition: 'front',
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
				isEnd: false,
				examSubjectItem: {},
				examId: null,
				examName: '',
				examQuestion: {},
				type: 0,
				isStop: false,
				tempThumbPath: ''
			};
		},
		onLoad(options) {
			if (options.examId) {
				this.examSubjectItem = JSON.parse(options.examSubjectItem);
				this.examId = options.examId;
				this.type = Number(options.type) || 0;
				this.initData()
			}
		},
		methods: {
			initData() {
				this.$http.post(examQuestionDetail, {
					course: this.examSubjectItem.subjectName,
					examId: this.examId,
				}).then(res => {
					this.examName = res.data.examName
					this.examQuestion = res.data.examQuestion;
				}).catch(err => {
					console.log(err)
					this.$mHelper.toast(err.msg)
				})
			},
			submitTap() {
				if (!this.isBegin) {
					this.isBegin = true
					this.settingTimer();
					const ctx = wx.createCameraContext()
					this.isStop = false;
					ctx.startRecord({
						timeout: 60 * 60 * 4,
						success(e) {
							console.log(e)
						},
						complete(e){
							console.log('开始录制回调========')
							console.log(e)
						}
					})
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
				const _this = this;
				if (!this.isEnd) {
					clearInterval(this.timer)
					_this.isStop = true;
					const ctx = wx.createCameraContext()
					ctx.stopRecord({
						compressed: true,
						success(e) {
							_this.tempThumbPath = e.tempThumbPath;
							_this.enterClick(e.tempVideoPath)
						}
					})
				} else {
					this.$refs.uModal.clearLoading();
					uni.redirectTo({
						url: `/pages/public/top/testContent?examId=${this.examId}&examSubjectItem=${JSON.stringify(this.examSubjectItem)}&type=${this.type}`
					})
				}

			},
			enterClick(tempFilePath) {
				const _this = this
				_this.$http.get(generatePostPolicy, {
					app_token: uni.getStorageSync('accessToken')
				}).then(res => {
					console.log(res)
					let data = res.data;
					_this.$http
						.upload(data.host, {
							filePath: tempFilePath,
							formData: {
								key: data.dir,
								policy: data.policy,
								OSSAccessKeyId: data.accessid,
								signature: data.signature,
							},
							getTask: _this.getTask
						}).then(r => {
							console.log('上传成功==============')
							console.log(r)
							_this.$mHelper.toast('上传成功')
							_this.recordVideoUpload(r)
						}).catch(err => {
							_this.$mHelper.toast(err);
						});
				}).catch(err => {
					console.log('上传错误==============')
					console.log(err)
					_this.$mHelper.toast(err);
				})
			},
			getTask(requestTask, handleRe) {
				console.log('上传进度监听')
				requestTask.onProgressUpdate((res) => {
					console.log('上传进度' + res.progress);
					console.log('已经上传的数据长度' + res.totalBytesSent);
					console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
					if (res.progress < 100) {
						uni.showLoading({
							title: `上传进度${res.progress}%`
						})
					} else {
						uni.hideLoading()
					}
				});
			},
			recordVideoUpload(url) {
				console.log(url)
				this.$http.post(recordVideoSave, {
					course: this.examSubjectItem.subjectName,
					examId: this.examId,
					url
				}).then(res => {
					this.isEnd = true
					this.showCancelButton = false
					this.$refs.uModal.clearLoading();
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			},
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

		.temp {
			position:absolute;
			background-color: #000;
			top: 0;
			width: 100%;
			height: 100vh;
			
			image {
				width: 100%;
				height: 100%;
			}
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
					padding: 30rpx;
					transform: rotate(90deg);
					height: 750rpx;
					overflow: auto;

					.subtitle {
						font-size: 30rpx;
						text-align: center;
						color: #3A3D71;
					}

					.title {
						margin-top: 14rpx;
						font-size: 34rpx;
						font-weight: bold;
						text-align: center;
						color: #3A3D71;
					}

					.cells {
						.cell {
							margin-bottom: 30rpx;
							display: flex;

							&-label {
								width: 134rpx;
								font-size: 26rpx;
								font-weight: bold;
								color: #3A3D71;
							}

							&-content {
								// width: 0;
								flex: 1;

								text {
									ont-size: 26rpx;
									color: #3A3D71;
									text-align: justify;
								}

								image {
									width: 100%;
								}
							}
						}
					}
				}
			}
		}

		// 录制时间
		.time {
			transform: rotate(90deg);
			position: absolute;
			z-index: 23;
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
