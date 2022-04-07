<template>
	<view class="container">

		<view class="canvas u-flex u-row-center">
			<view class="canvas-box" v-show="!maskShow">
				<canvas-drag ref="canvasRef" id="canvas-drag" :graph="graph" enableUndo="true" :active="selectActive"
					@actionChange="actionChange">
				</canvas-drag>
			</view>
			<view class="canvas-box" v-show="maskShow">
				<image :src="canvasImage" mode="widthFix"></image>
			</view>
		</view>
		<!-- <scroll-view class="scroll-view_H" scroll-y="true">
			<canvas canvas-id="canvas" class="canvas"
				:style="{width: upx2px(canvas.width)+ 'px', height: upx2px(canvas.height) +'px'}"
				@touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"></canvas>
		</scroll-view> -->

		<view class="drawingBoard-fixed-bottom">
			<view class="drawingBoard-fixed-bottom-handle"
				v-if="selectActive !== 1 && selectActive !== 3 && selectActive !== -1">
				<view class="drawingBoard-btn" :class="audioShow ? 'active' : ''" v-if="selectActive === 0"
					@longpress="longpressBtn()" @touchend="touchendBtn()">
					<image :src="setSrc('painting/voice_start.png')"></image>
					<text>{{audioShow ? '松手结束语音录制' : '长按添加评语'}}</text>
				</view>
				<view class="drawingBoard-text" v-if="selectActive === 2" style="padding-top: 20rpx;">
					<view class="drawingBoard-color">
						<color-picker ref="colorPicker" :color="colorRgb" @confirm="colorConfirm"></color-picker>
					</view>

					<view class="thickness u-flex">
						<text>细</text>
						<view class="slider">
							<u-slider height="10" block-width="40" inactive-color="#D8D8D8" active-color="#999090"
								v-model="thicknessValue"></u-slider>
						</view>
						<text>粗</text>
					</view>
				</view>

				<view class="drawingBoard-text" v-if="selectActive === 4">
					<view class="drawingBoard-color">
						<color-picker ref="colorPicker" :color="colorCircleRgb" @confirm="colorCircleConfirm">
						</color-picker>
					</view>
				</view>
			</view>
			<view class="drawingBoard-fixed-bottom-item drawingBoard-tools">
				<view class="drawingBoard-tools-item" @click="selectHandle(0)">
					<image v-if="selectActive === 0" :src="setSrc('painting/voice_active.png')"></image>
					<image v-else :src="setSrc('painting/voice.png')"></image>
				</view>

				<view class="drawingBoard-tools-item" @click="selectHandle(1)">
					<!-- <image v-if="selectActive === 1" :src="setSrc('painting/words_active.png')"></image> -->
					<image :src="setSrc('painting/words.png')"></image>
				</view>
				<view class="drawingBoard-tools-item" @click="selectHandle(2)">
					<image v-if="selectActive === 2" :src="setSrc('painting/pen_active.png')"></image>
					<image v-else :src="setSrc('painting/pen.png')"></image>
				</view>
				<view class="drawingBoard-tools-item" @click="selectHandle(3)">
					<image :src="setSrc('painting/arrow.png')"></image>
				</view>
				<view class="drawingBoard-tools-item" @click="selectHandle(4)">
					<image v-if="selectActive === 4" :src="setSrc('painting/circle_active.png')"></image>
					<image v-else :src="setSrc('painting/circle.png')"></image>
				</view>
				<view class="drawingBoard-tools-item" @click="revoke">
					<image :src="setSrc('painting/esc.png')"></image>
				</view>
				<!-- <view class="drawingBoard-tools-item" @click="clear">
					<image src="../../static/drawingBoard/qingkong_1.png"></image>
				</view> -->
			</view>

			<view class="drawingBoard-next" @click="submitTap()">
				<view class="drawingBoard-btn">下一步</view>
			</view>
		</view>

		<!-- 		<u-popup v-model="audioShow" mode="center">
			<view class="prompt-layer">
				<view class="prompt-loader">
					<view class="em" v-for="(item,index) in 15" :key="index"></view>
				</view>
				<text class="span">松手结束录音</text>
			</view>
		</u-popup>
 -->

		<view class="mask" v-if="maskShow">
			<view class="mask-header u-flex u-row-between">
				<view class="left" @click="maskShow = false">取消</view>
				<view class="right u-flex u-row-center" @click="textConfirm">保存</view>
			</view>
			<view class="mask-content">
				<textarea placeholder="请输入" :focus="maskShow" v-model="textValue" :cursor-spacing="20"
					placeholder-style="font-size:14px;" :style="{color: textColor}" />
			</view>

			<view class="mask-footer" :style="{bottom: KeyboardHeight + 'px'}">
				<color-picker ref="colorPicker" :color="textRgb" @confirm="colorTextConfirm"></color-picker>
			</view>
		</view>
	</view>
</template>

<script>
	import canvasDrag from "@/components/canvas-drag/index";
	const recorderManager = uni.getRecorderManager()
	const innerAudioContext = uni.createInnerAudioContext()
	var init; // 录制时长计时器
	var timer; // 播放 录制倒计时
	import {
		generatePostPolicy
	} from '@/api/basic.js'
	import {
		orderItemPaintEvaluateDetail
	} from '@/api/paint_evaluate_v2_teacher.js'
	export default {

		data() {
			return {

				graph: {},
				audioShow: false, // 音频
				maskShow: false, // 文字
				StatusBar: this.StatusBar,
				selectActive: 0,
				canvasImage: '',
				// 画板

				id: null,
				url: '',
				detail: null,
				// 录音
				audioShow: false,
				count: null, // 录制倒计时
				time: 0, //录音时长
				duration: 600000, //录音最大值ms 60000/1分钟
				audioLength: 0,
				playStatus: 0, //录音播放状态 0:未播放 1:正在播放

				tempFilePath: '', //音频路径
				colorRgb: {
					r: 255,
					g: 0,
					b: 0,
					a: 0.6
				},
				colorValue: {
					r: 255,
					g: 0,
					b: 0,
					a: 0.6
				},
				thicknessValue: 3, // 线条粗细
				textRgb: {
					r: 255,
					g: 0,
					b: 0,
					a: 0.6
				},
				textColor: {
					r: 255,
					g: 0,
					b: 0,
					a: 0.6
				},
				colorCircleRgb: {
					r: 255,
					g: 0,
					b: 0,
					a: 0.6
				},
				colorCircleColor: {
					r: 255,
					g: 0,
					b: 0,
					a: 0.6
				},

				textValue: '',
				KeyboardHeight: 0
			};
		},
		components: {
			canvasDrag
		},

		watch: {
			thicknessValue(val) {
				this.$refs.canvasRef.changeLineWidth(val)
			}
		},
		onLoad(options) {
			if (options.id) {
				uni.removeStorageSync('paintingEvaluationJson')
				this.id = options.id;
				this.initData()
			}

			uni.onKeyboardHeightChange(res => {
				console.log('log', res);
				this.KeyboardHeight = res.height
			})
		},
		onShow() {
			this.$refs.canvasRef.refresh()
		},
		methods: {
			// /**
			//  * 添加测试图片
			//  */
			// onAddTest() {
			// 	this.graph = {
			// 		type: 'text',
			// 		text: 'helloworld'
			// 	}
			// 	// this.graph = {
			// 	// 	w: 120,
			// 	// 	h: 120,
			// 	// 	type: 'image',
			// 	// 	url: "/static/public/add_people.png"
			// 	// }
			// },

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
			// 长按录音事件
			longpressBtn() {

				this.audioShow = true;
				this.countdown(60 * 10); // 倒计时
				clearInterval(init) // 清除定时器
				recorderManager.onStop((res) => {
					console.log(res.tempFilePath)
					this.tempFilePath = res.tempFilePath;
					this.recordingTimer(this.time);
				})
				const options = {
					duration: this.duration, // 指定录音的时长，单位 ms
					sampleRate: 16000, // 采样率
					numberOfChannels: 1, // 录音通道数
					encodeBitRate: 96000, // 编码码率
					format: 'mp3', // 音频格式，有效值 aac/mp3
					frameSize: 50, // 指定帧大小，单位 KB
				}
				this.recordingTimer();
				recorderManager.start(options);
				// 监听音频开始事件
				recorderManager.onStart((res) => {
					console.log(res)
				})
			},
			// 长按松开录音事件
			touchendBtn() {
				this.audioShow = false;
				recorderManager.onStop((res) => {
					console.log(res)
					this.tempFilePath = res.tempFilePath
					this.audioLength = res.duration
					this.uploadAudioFile()
				})
				this.recordingTimer(this.time)
				recorderManager.stop()
			},
			// 上传语音
			async uploadAudioFile() {
				const _this = this;
				const filePath = this.tempFilePath;

				console.log(filePath)
				await _this.$http.get(generatePostPolicy, {
					app_token: uni.getStorageSync('accessToken')
				}).then(async res => {
					console.log(res)
					let data = res.data;
					await _this.$http
						.upload(data.host, {
							filePath,
							formData: {
								key: data.dir,
								policy: data.policy,
								OSSAccessKeyId: data.accessid,
								signature: data.signature,
							}
						})
						.then(async r => {
							this.graph = {
								type: 'audio',
								color: '#ffffff',
								text: this.$mHelper.formatSeconds(this.audioLength / 1000,
									'seconds'),
								tempFilePath: r
							}
						});
				}).catch(err => {
					console.log(err)
				})
			},
			recordingTimer(time) {
				var that = this;
				if (time == undefined) {
					// 将计时器赋值给init
					init = setInterval(function() {
						that.time++
					}, 1000);
				} else {
					clearInterval(init)
				}
			},

			initData() {
				this.$http.get(orderItemPaintEvaluateDetail, {
					id: this.id
				}).then(res => {
					console.log(res)
					this.detail = res.data;
					uni.downloadFile({
						url: this.detail.url,
						success: (data) => {
							 // data.tempFilePath
							// let src = 'https://top-face-detect.oss-cn-shanghai.aliyuncs.com/sys/image/2022-04-03/1510632415707828225.jpg'
							this.$refs.canvasRef.init_image(data.tempFilePath)
						}

					})
				})
			},

			// 选择项
			selectHandle(index) {
				if (this.selectActive === index) {
					this.selectActive = -1;
				} else {
					this.selectActive = index;
				}

				switch (index) {
					case 1:
						this.textValue = ''
						this.$refs.canvasRef.exportFun().then(filePath => {
							this.canvasImage = filePath;
							this.maskShow = true;
						}).catch(e => {
							console.error(e);
						});


						break;
					case 3:
						this.graph = {
							w: 120,
							h: 120,
							timestamp: new Date().getTime(),
							type: 'image',
							url: "/static/public/1.png"
						}
						break;
				}
			},
			// 选择颜色
			colorConfirm(e) {
				console.log(e)
				this.colorRgb = e.rgba
				this.colorValue = e.hex
				this.$refs.canvasRef.changeLineColor(this.colorValue)
			},
			// 选择字体颜色
			colorTextConfirm(e) {
				this.textRgb = e.rgba
				this.textColor = e.hex
				this.$refs.canvasRef.changColor(e.hex);
			},
			// 选择圆颜色
			colorCircleConfirm(e) {
				this.colorCircleRgb = e.rgba
				this.colorCircleColor = e.hex
				this.$refs.canvasRef.changCircleColor(e.hex);
			},
			// 下一步
			async submitTap() {

				uni.showLoading({
					title: '正在生成图片'
				})
				const response = await this.$refs.canvasRef.exportJson();
				console.log(response)
				uni.setStorageSync('paintingEvaluationJson', response)
				this.$refs.canvasRef.exportFun().then(filePath => {
					this.handleUploadFile(filePath)
				}).catch(e => {
					console.error(e);
					uni.hideLoading()
				});
			},
			// 保存文字
			textConfirm() {
				this.graph = {
					type: 'text',
					color: this.textColor,
					text: this.textValue
				}
				this.maskShow = false;
			},
			// 选中修改
			actionChange(e) {
				if (e.selectActive === 1) {
					console.log(e.item)
				} else if (e.selectActive === 0) {
					innerAudioContext.src = e.item.tempFilePath
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
				}
			},
			//撤销上一步
			revoke() {
				this.$refs.canvasRef.undo();
			},
			// 上传图片
			async handleUploadFile(tempFilePath) {
				const _this = this;
				await _this.$http.get(generatePostPolicy, {
					app_token: uni.getStorageSync('accessToken')
				}).then(async res => {
					console.log(res)
					let data = res.data;
					await _this.$http
						.upload(data.host, {
							filePath: tempFilePath,
							formData: {
								key: data.dir,
								policy: data.policy,
								OSSAccessKeyId: data.accessid,
								signature: data.signature,
							}
						})
						.then(async r => {
							console.log(r)
							_this.url = r;
							uni.navigateTo({
								url: `/pages/centers/paintingEvaluation/teacherEvaluate?id=${_this.id}&evaluateUrl=${r}`
							})
							uni.hideLoading()
						}).catch(err => {
							uni.hideLoading()
						});
				}).catch(err => {
					console.log(err)
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		position: relative;
	}
	
	.canvas{
		height: calc(100vh - 376rpx - constant(safe-area-inset-bottom));
		height: calc(100vh - 376rpx - env(safe-area-inset-bottom));
	}

	.canvas-box {
		height: 100%;
	
		image {
			width: 100%;
		}
	}

	.drawingBoard-fixed-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		text-align: center;
		z-index: 999;
		padding: 0 0 14rpx 0;
		padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
		background-color: #F3F3F3;

		.drawingBoard-fixed-bottom-item {
			padding: 12rpx;
		}

		view.sumbit {
			-webkit-box-flex: 1;
			-webkit-flex-grow: 1;
			flex-grow: 1;
			color: #fff;
		}


		.drawingBoard-tools {
			display: -webkit-box;
			display: -webkit-flex;
			display: flex;
			background-color: #fff;
		}

		.drawingBoard-tools-item {
			text-align: center;
			-webkit-box-flex: 1;
			-webkit-flex-grow: 1;
			flex-grow: 1;
			line-height: 35rpx;

		}

		.drawingBoard-fixed-bottom-item view image {
			width: 76rpx;
			height: 76rpx;
		}

		.drawingBoard-tools-item view {
			font-size: 22rpx;
		}

		.drawingBoard-color-main {
			position: fixed;
			bottom: 120rpx;
			left: 0;
			width: 710rpx;
			/* height: 75rpx; */
			z-index: 11;
			padding: 25rpx 20rpx;
			display: -webkit-box;
			display: -webkit-flex;
			display: flex;
			flex-wrap: wrap;
			background-color: #fff;
			border-top: 1px dashed #d9d9d9;
			transition: display 2s;
			-moz-transition: display 2s;
			/* Firefox 4 */
			-webkit-transition: display 2s;
			/* Safari 和 Chrome */
			-o-transition: display 2s;
		}

		.drawingBoard-color-item {
			width: 80rpx;
			height: 80rpx;
			background-color: #000000;
			border-radius: 100px;
			margin: 5px;
			position: relative;
		}

		.drawingBoard-lineWidth-item {
			width: 80rpx;
			height: 80rpx;
			background-color: #fff;
			border-radius: 100px;
			margin: 5px;
			position: relative;
		}

		.drawingBoard-lineWidth-item.on {
			border: 1px solid #d4a39e;
		}

		.drawingBoard-color-item .drawingBoard-color-item-icon {
			display: none;
		}

		.drawingBoard-color-item.on .drawingBoard-color-item-icon {
			display: block;
			position: absolute;
			top: 50%;
			left: 50%;
			width: 50rpx;
			height: 50rpx;
			margin-top: -25rpx;
			margin-left: -25rpx;
		}

		// 操作面板

		.drawingBoard-fixed-bottom-handle {
			height: 128rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #F3F3F3;

			// 按钮
			.drawingBoard-btn {
				width: 324rpx;
				height: 80rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background: $u-type-primary;
				border-radius: 44rpx;

				image {
					width: 52rpx;
					height: 36rpx;
				}

				text {
					margin-left: 10rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #FFFFFF;
				}

				&.active {
					background: #9E9E9E;

					text {
						color: #FFFFFF;
					}
				}
			}

			// 颜色
			.drawingBoard-text {
				width: 100%;

				.drawingBoard-color {
					padding: 0 40rpx 0 50rpx;
				}

				.thickness {
					padding: 40rpx 40rpx 0 22rpx;

					text {
						font-size: 24rpx;
						font-weight: 500;
						color: #909399;
					}

					.slider {
						margin: 0 26rpx;
						flex: 1;
					}
				}
			}
		}


		// 下一步

		.drawingBoard-next {
			padding: 24rpx 48rpx;
	
			background-color: #fff;

			.drawingBoard-btn {
				height: 80rpx;
				line-height: 80rpx;
				background: $u-type-primary;
				border-radius: 44rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #FFFFFF;
			}
		}


	}



	// 录音
	/deep/ .u-mode-center-box {
		background-color: transparent !important;
	}

	/* 提示小弹窗 */
	.prompt-layer {
		margin-bottom: 260rpx;
		border-radius: 24rpx;
		background: rgba($color: #000000, $alpha: .8);
		padding: 40rpx 32rpx;
		box-sizing: border-box;
	}

	.prompt-layer .span {
		font-size: 26rpx;
		color: #fff;
	}

	.prompt-loader .em {}

	/* 语音音阶------------- */
	.prompt-loader {
		width: 96px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 6px;
	}

	.prompt-loader .em {
		display: block;
		background: #ffffff;
		width: 1px;
		height: 10%;
		margin-right: 2.5px;
		float: left;
	}

	.prompt-loader .em:last-child {
		margin-right: 0px;
	}

	.prompt-loader .em:nth-child(1) {
		animation: load 2.5s 1.4s infinite linear;
	}

	.prompt-loader .em:nth-child(2) {
		animation: load 2.5s 1.2s infinite linear;
	}

	.prompt-loader .em:nth-child(3) {
		animation: load 2.5s 1s infinite linear;
	}

	.prompt-loader .em:nth-child(4) {
		animation: load 2.5s 0.8s infinite linear;
	}

	.prompt-loader .em:nth-child(5) {
		animation: load 2.5s 0.6s infinite linear;
	}

	.prompt-loader .em:nth-child(6) {
		animation: load 2.5s 0.4s infinite linear;
	}

	.prompt-loader .em:nth-child(7) {
		animation: load 2.5s 0.2s infinite linear;
	}

	.prompt-loader .em:nth-child(8) {
		animation: load 2.5s 0s infinite linear;
	}

	.prompt-loader .em:nth-child(9) {
		animation: load 2.5s 0.2s infinite linear;
	}

	.prompt-loader .em:nth-child(10) {
		animation: load 2.5s 0.4s infinite linear;
	}

	.prompt-loader .em:nth-child(11) {
		animation: load 2.5s 0.6s infinite linear;
	}

	.prompt-loader .em:nth-child(12) {
		animation: load 2.5s 0.8s infinite linear;
	}

	.prompt-loader .em:nth-child(13) {
		animation: load 2.5s 1s infinite linear;
	}

	.prompt-loader .em:nth-child(14) {
		animation: load 2.5s 1.2s infinite linear;
	}

	.prompt-loader .em:nth-child(15) {
		animation: load 2.5s 1.4s infinite linear;
	}

	@keyframes load {
		0% {
			height: 10%;
		}

		50% {
			height: 100%;
		}

		100% {
			height: 10%;
		}
	}

	/* 语音音阶-------------------- */
	.prompt-layer-2 {
		top: -40px;
	}

	.prompt-layer-2 .text {
		color: rgba(0, 0, 0, 1);
		font-size: 12px;
	}

	/* 语音录制结束---------------------------------------------------------------- */

	/**
	 * 文字
	 */
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		background: rgba(0, 0, 0, 0.51);
		backdrop-filter: blur(4rpx);


		&-header {

			padding: 28rpx 30rpx 28rpx 24rpx;

			.left {
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
			}

			.right {
				width: 120rpx;
				height: 52rpx;
				background: #2C3AFF;
				border-radius: 26rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #FFFFFF;
			}
		}

		&-content {
			padding: 0 30rpx 28rpx 24rpx;

			textarea {
				font-size: 32rpx;
				color: #ffffff;
			}
		}

		&-footer {
			position: fixed;
			left: 40rpx;
			right: 40rpx;
			bottom: 0;
			padding: 28rpx 0 20rpx 0;
			padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
			padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		}
	}
</style>
