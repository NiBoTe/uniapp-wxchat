<template>
	<view class="evaluate">
		<view class="content">

			<view class="card">
				<view class="header">
					<view class="label">请为学生评分</view>
					<view class="header-box u-flex u-row-between">
						<view class="left">总评分</view>
						<view class="right">
							<input type="number" v-model="score" placeholder="请输入总评分" maxlength="3" />
						</view>
					</view>
				</view>

				<view class="subheader">
					<view class="label">纬度评级</view>
					<view class="item" v-for="(item, index) in selectList" :key="index">
						<u-swipe-action :vibrate-short="true" :show="item.show" :index="index" @click="click"
							@open="open" :options="options" btn-width="200">

							<view class="item-header u-flex u-row-between">
								<view class="left">{{item.name}}</view>
								<view class="right">
									<u-rate :count="5" v-model="item.stars" inactive-icon="star-fill"
										active-color="#35CE96" inactive-color="#E3E3E3" gutter="16" size="32"></u-rate>
								</view>
							</view>

							<view class="item-subheader">
								<textarea style="text-align: left;" v-model="item.content" auto-height type="text"
									placeholder="请输入纬度分析" maxlength="200" />
							</view>

						</u-swipe-action>
					</view>
					<view class="subheader-add u-flex u-row-center" @click="popShow =true">
						<u-icon name="plus" :color="themeColor" size="28"></u-icon>
						<text>添加维度</text>
					</view>
				</view>
			</view>
			<u-gap height="16" margin-top="40" bg-color="#F7F7F7"></u-gap>
			<view class="card">

				<view class="header">
					<view class="label">文字评语</view>
					<view class="header-box u-flex u-row-between">
						<view class="right">
							<textarea style="text-align: left;" v-model="textComment" auto-height type="text" placeholder="请输入总评语"
								maxlength="200" />
						</view>
					</view>
				</view>
				<view class="audio">
					<view class="label">语音评语</view>
					<view class="audio-main" v-if="tempFilePath === ''">
						<view class="audio-btn u-flex u-row-center" @longpress="longpressBtn()"
							@touchend="touchendBtn()">
							<image :src="setSrc('painting/voice_start.png')"></image>
							<text>长按添加总评语</text>
						</view>
						<view class="audio-text">按住上方语音按钮，可添加语音评语</view>
					</view>

					<view class="audio-voice u-flex" v-else>
						<view class="left u-flex u-row-between">
							<view class="left-length u-flex u-row-center">
								<image src="/static/public/voice_blue.png"></image>
								<text>{{$mHelper.formatSeconds(audioLength / 1000, 'seconds')}}</text>
							</view>

							<view class="left-play u-flex u-row-center" @click="playBtn()">
								<u-icon v-if="!playStatus" name="play-right-fill" color="#fff" size="28"></u-icon>
								<u-icon v-else name="pause" color="#fff" size="28"></u-icon>
							</view>
						</view>

						<view class="right u-flex u-row-center" @click="delBtn()">
							<image src="/static/public/audio_remove.png"></image>
						</view>
					</view>
				</view>
			</view>


			<u-popup v-model="audioShow" mode="center">
				<view class="prompt-layer">
					<view class="prompt-loader">
						<view class="em" v-for="(item,index) in 15" :key="index"></view>
					</view>
					<text class="span">松手结束录音</text>
				</view>
			</u-popup>

		</view>

		<view class="footer">
			<view class="footer-btn" @click="submitTap">保存</view>
		</view>

		<u-popup v-model="popShow" mode="center" border-radius="32">

			<view style="background-color: #fff;">
				<view class="pop-header">
					<image :src="setSrc('top_pop_bg.png')"></image>
					<view class="pop-header-box u-flex">
						<text>添加纬度</text>
					</view>
				</view>

				<view class="pop-content">
					<view class="pop-list">
						<view class="pop-item u-flex u-row-center" :class="item.selected ? 'active' : ''"
							v-for="(item, index) in latitudeList" :key="index" @click="selectTap(index)">
							{{item.text}}
						</view>
					</view>
				</view>

				<view class="pop-btn u-flex">
					<view class="pop-esc" @click="popShow = false">
						<text>取消</text>
					</view>
					<view class="pop-footer" @click="confirmTap">
						<text>确定</text>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	const recorderManager = uni.getRecorderManager()
	const innerAudioContext = uni.createInnerAudioContext()
	var init // 录制时长计时器
	var timer // 播放 录制倒计时
	import {
		generatePostPolicy
	} from '@/api/basic.js'
	
	import { paintEvaluate } from '@/api/paint_evaluate_v2_teacher.js'
	export default {
		data() {
			return {
				popShow: false,
				themeColor: this.$mConstDataConfig.themeColor,
				audioShow: false,
				count: null, // 录制倒计时
				time: 0, //录音时长
				duration: 600000, //录音最大值ms 60000/1分钟
				tempFilePath: '', //音频路径
				audioLength: 0,
				playStatus: 0, //录音播放状态 0:未播放 1:正在播放
				latitudeList: [{
					text: '构图造型',
					selected: false,
				}, {
					text: '造型设计',
					selected: false
				}, {
					text: '结构',
					selected: false
				}, {
					text: '体积',
					selected: false,
				}, {
					text: '质感',
					selected: false,
				}, {
					text: '色调',
					selected: false,
				}, {
					text: '构图',
					selected: false,
				}, {
					text: '塑造',
					selected: false,
				}, {
					text: '空间',
					selected: false,
				}, {
					text: '局部细节',
					selected: false,
				}, {
					text: '画面层次',
					selected: false,
				}],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d',
						fontSize: '24rpx',
						fontWeight: 'bold'
					}
				}],
				selectList: [],
				score: '',
				textComment: '',
				voiceComment: ''
			};
		},
		
		onLoad(options) {
			if(options.id) {
				this.id = options.id;
				this.evaluateUrl = options.evaluateUrl;
			}
		},
		methods: {
			async submitTap() {
				await this.handleUploadFile();
				this.$http.post(paintEvaluate, {
					dimensions: this.selectList,
					evaluateUrl: this.evaluateUrl,
					id: this.id,
					score: this.score,
					textComment: this.textComment,
					voiceComment: this.voiceComment,
					voiceCommentDuration: parseInt(this.audioLength / 1000)
				}).then(res => {
					uni.navigateTo({
						url: `/pages/centers/paintingEvaluation/tDetail?id=${this.id}`
					})
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			},
			confirmTap() {
				let arr = [];
				this.latitudeList.map(item => {
					if (item.selected) arr.push({
						name: item.text,
						stars: 0,
						content: '',
						show: false
					})
				})
				this.selectList = arr;
				this.popShow = false;
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
				})
				this.recordingTimer(this.time)
				recorderManager.stop()
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
			// 播放
			playBtn() {
				innerAudioContext.src = this.tempFilePath
				//在ios下静音时播放没有声音，默认为true，改为false就好了。
				// innerAudioContext.obeyMuteSwitch = false
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
			// 删除录音
			delBtn() {
				this.time = 0
				this.tempFilePath = ''
				this.playStatus = 0
				innerAudioContext.stop()
			},
			// 添加纬度
			selectTap(index) {
				this.$set(this.latitudeList[index], 'selected', !this.latitudeList[index].selected)
			},
			click(index, index1) {
				this.selectList[index].show = false;
				this.selectList.splice(index, 1)
			},
			open(index) {
				this.selectList[index].show = true;
				this.selectList.map((val, idx) => {
					if (index != idx) this.selectList[idx].show = false;
				})
			},
			// 上传语音
			async handleUploadFile() {
				const _this = this;
				const filePath = this.tempFilePath;
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
							_this.voiceComment = r;
						});
				}).catch(err => {
					console.log(err)
				})
			},
		}

	}
</script>

<style lang="scss" scoped>
	.evaluate {
		.content {


			.card {
				padding: 0 32rpx;
			}

			.label {
				margin: 38rpx 0 28rpx 0;
				font-size: 30rpx;
				font-weight: 600;
				color: #1B1B1B;
			}

			.header {
				&-box {
					padding-bottom: 28rpx;
					border-bottom: 2rpx solid #E9E9E9;

					.left {
						font-size: 26rpx;
						font-weight: 500;
						color: #3A3D71;
					}

					.right {
						flex: 1;

						input,
						textarea {
							text-align: right;
							font-size: 26rpx;
							color: #3A3D71;
						}
					}
				}
			}


			.subheader {

				&-add {
					height: 108rpx;
					background: #EFF2FF;
					border-radius: 16rpx;

					text {
						margin-left: 15rpx;
						font-size: 26rpx;
						font-weight: 500;
						color: $u-type-primary;
					}
				}
			}

			.audio {

				&-main {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					height: 214rpx;
					background: #F9F9F9;
					border-radius: 16px;
					text-align: center;

					.audio-btn {
						width: 324rpx;
						height: 80rpx;
						background: $u-type-primary;
						border-radius: 44rpx;

						image {
							width: 52rpx;
							height: 38rpx;
						}

						text {
							margin-left: 10rpx;
							font-size: 28rpx;
							font-weight: 500;
							color: #FFFFFF;
						}
					}

					.audio-text {
						margin-top: 28rpx;
						font-size: 26rpx;
						color: #9E9E9E;
					}
				}


				&-voice {
					.left {
						flex: 1;
						padding: 0 10rpx 0 26rpx;
						height: 80rpx;
						border-radius: 40rpx;
						background: #EFF2FF;

						image {
							width: 24rpx;
							height: 36rpx;
						}

						text {
							margin-left: 14rpx;
							font-size: 24rpx;
							font-weight: 500;
							color: #3A3D71;
						}


						&-play {
							width: 60rpx;
							height: 60rpx;
							border-radius: 50%;
							background-color: $u-type-primary;
						}
					}

					.right {
						margin-left: 40rpx;
						padding: 22rpx 32rpx;
						background: #F3F3F3;
						border-radius: 40rpx;

						image {
							width: 36rpx;
							height: 36rpx;
						}
					}
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



	.pop-header {
		position: relative;

		&>image {
			width: 544rpx;
			height: 118rpx;
		}

		&-box {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;

			justify-content: center;
			align-items: center;

			image {
				width: 38rpx;
				height: 44rpx;
			}

			text {
				margin-left: 10rpx;
				font-size: 36rpx;
				font-weight: bold;
				color: #FFFFFF;
			}
		}
	}

	.pop-content {
		width: 544rpx;
		padding: 34rpx 34rpx 32rpx 28rpx;

		.pop-list {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.pop-item {
				margin-bottom: 30rpx;
				width: 152rpx;
				height: 58rpx;
				background: #F3F3F3;
				border-radius: 30rpx;
				border: 2rpx solid transparent;
				font-size: 26rpx;
				color: #3A3D71;

				&.active {
					background: #EFF2FF;
					border-color: $u-type-primary;
					color: $u-type-primary;
				}
			}
		}
	}

	.pop-btn {
		border-top: 1px solid #D8D8D8;

		.pop-esc {
			flex: 1;
			text-align: center;
			font-size: 36rpx;
			color: #9E9E9E;
			border-right: 1px solid #D8D8D8;
			padding: 28rpx 0;
		}

		.pop-footer {
			flex: 1;
			text-align: center;


			font-size: 36rpx;
			color: $u-type-primary;
		}
	}


	.item {
		margin-bottom: 28rpx;

		&-header {

			.left {
				font-size: 28rpx;
				font-weight: 500;
				color: #3A3D71;
			}
		}

		&-subheader {
			padding: 24rpx 0;
			border-bottom: 2rpx solid #E9E9E9;

			textarea {
				font-size: 26rpx;
				color: #3A3D71;
			}
		}
	}
</style>
