<template>
	<view class="detail">
		<view class="navbar">
			<u-navbar title=" " immersive back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>

			<video id="myVideo"
				src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4"
				@error="videoErrorCallback" @timeupdate='videoUpdate' @ended="videoEnded" :controls="false"
				object-fit="contain" enable-play-gesture></video>


			<view class="try">
				<text>正在试看，购买后观看完整视频</text>
				<view class="try-btn">试看</view>
			</view>


			<view class="panel u-flex">
				<view class="video-play" @click='videoOpreation'>
					<u-icon v-if="!palyFlag" name="play-right-fill" color="#fff" size="28"></u-icon>
					<u-icon v-else name="pause" color="#fff" size="28"></u-icon>
				</view>
				<view class="controls">
					<text>{{currtime}}</text>
					<view class="controls-slider">
						<u-slider v-model="sliderValue" max="80"></u-slider>
					</view>
					<text>{{druationTime}}</text>
				</view>

				<view class="video-screen" @click='videoAllscreen'>
					<image src="/static/public/screen.png"></image>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				videoContext: null,
				fullScreenFlag: false,
				currtime: '00:00:00', //当前播放时间 字符串 计算后
				druationTime: '00:00:00', //总时间 字符串 计算后
				bool: false,
				sliderValue: 0, //控制进度条slider的值，
				updateState: false, //防止视频播放过程中导致的拖拽失效
				palyFlag: false,
			};
		},
		onReady: function(res) {
			this.videoContext = uni.createVideoContext('myVideo')
		},
		methods: {
			// 全屏+退出全屏
			videoAllscreen(e) {
				!this.fullScreenFlag ? this.videoContext.exitFullScreen() : this.videoContext.requestFullScreen();
				// this.fullScreenFlag ? this.bool=true : this.bool=false;
				this.fullScreenFlag = !this.fullScreenFlag;
			},
			// 根据秒获取时间
			formatSeconds(a) {
				var hh = parseInt(a / 3600);
				var mm = parseInt((a - hh * 3600) / 60);
				if (mm < 10) mm = "0" + mm;
				var ss = parseInt((a - hh * 3600) % 60);
				if (ss < 10) ss = "0" + ss;
				if (hh < 10) hh = hh == 0 ? '' : `0${hh}:`;
				var length = hh + mm + ":" + ss;
				if (a >= 0) {
					return length;
				} else {
					return "00:00";
				}
			},
			//开始+暂停
			videoOpreation() {
				!this.palyFlag ? this.videoContext.play() : this.videoContext.pause();
				this.palyFlag = !this.palyFlag;
			},
			// 播放进度变化时触发，event.detail = {currentTime, duration} 。触发频率 250ms 一次
			videoUpdate(e) {
				let duration = this.live.liveRoomRecordList[0].duration;
				let sliderValue = e.detail.currentTime / duration * 100;
				let second = sliderValue / 100 * duration;
				if (this.updateState) { //判断拖拽完成后才触发更新，避免拖拽失效
					this.sliderValue = sliderValue;
				} else {

				}
				this.druationTime = this.formatSeconds(duration);
				this.currtime = this.formatSeconds(second);
			},
			//拖动过程中触发的事件
			sliderChanging(e) {
				//拖拽过程中，不允许更新进度条
				this.updateState = false;
			},
			// 拖动slider完成后触发
			sliderChange(e) {
				var duration = this.live.liveRoomRecordList[0].duration;
				var second = e.detail.value / 100 * duration;
				if (duration) { //完成拖动后，计算对应时间并跳转到指定位置
					this.videoContext.seek(second);
					this.sliderValue = e.detail.value,
						this.updateState = true //完成拖动后允许更新滚动条
					this.druationTime = this.formatSeconds(duration);
					this.currtime = this.formatSeconds(second);
				} else {}
			},
			// 开始
			contrPlay() {
				this.videoContext.play();
				this.palyFlag = false;
			},
			// 暂停
			pause() {
				this.videoContext.pause(); //站厅播放
				this.palyFlag = true;
			},

			videoErrorCallback: function(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.detail {
		width: 100%;


		.navbar {
			height: 548rpx;
			position: relative;

			#myVideo {
				width: 100%;
				height: 548rpx;
			}
		}

		//  视频操作面板
		.panel {
			width: 100%;
			position: absolute;
			bottom: 0;

			.controls {
				flex: 1;
				display: flex;
				align-items: ceneter;

				&-slider {
					flex: 1;
				}
			}

			.video-screen {
				image {
					width: 34rpx;
					height: 34rpx;
				}
			}
		}
	}
</style>
