<template>
	<view class="top">
		<view class="navbar">
			<u-navbar title="考试内容" back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>
		<scroll-view scroll-y class="content" v-if="!isBegin">
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
		</scroll-view>

		<view class="footer u-flex u-row-center" v-if="type !== 2">
			<view class="u-flex u-row-center" style="flex: 1;" v-if="!isHours">
				<view class="footer-btn disabled" v-if="isBegin">考试时间未到</view>
				<view class="footer-btn" v-if="!isBegin && examDetail.isRecordVideo && recordVideoCount <= 0"
					style="margin-right: 24rpx;" @click="submitTap">录制作画步骤</view>
				<view class="footer-btn" v-if="!isBegin" :class="!isUpload ? 'disabled' : '' " @click="uploadTap">
					{{!examDetail.isRecordVideo ? '请点击上传试卷图片' : '上传试卷图片'}}
				</view>
			</view>
			<view class="u-flex u-row-center" style="flex: 1;" v-else>
				<view class="footer-btn" :class="isHours ? 'disabled' : '' ">该科目考试已经结束</view>
			</view>
		</view>

		<view class="nodata" v-if="isBegin">
			<image :src="setSrc('testContent_nodata.png')"></image>
			<text class="nodata-title">{{examSubjectItem.subjectName}}</text>
			<text class="nodata-subtitle">未开始考试，请在考前{{examSubjectItem.seenQuestionBeforeMinute}}分钟打开此页面考试</text>
		</view>

		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
	import {
		examDetail,
		examQuestionDetail
	} from '@/api/exam.js'

	import moment from '@/common/moment.js'
	export default {
		data() {
			return {
				loading: true,
				background: {
					backgroundImage: "url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png')",
					backgroundSize: 'cover',
				},
				course: '',
				examId: null,
				examName: '',
				examQuestion: {},
				type: 0,
				isBegin: false,
				examDetail: {},
				examSubjectItem: {},
				timer: null,
				isHours: false,
				isStart: false,
				isUpload: false,
				recordVideoCount: 0
			};
		},
		onLoad(options) {
			if (options.examId) {
				this.examSubjectItem = JSON.parse(options.examSubjectItem);
				this.examId = options.examId;
				this.type = Number(options.type) || 0;
				this.isHours = this.diffHours();
				this.isStart = this.isStartExam();
				this.isUpload = this.diffUpload();
				this.getData()
			} else {
				this.loading = false;
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
					this.recordVideoCount = res.data.recordVideoCount;
					this.loading = false;
				}).catch(err => {
					console.log(err)
				})
			},
			getData() {
				this.$http.post(examDetail, {
					id: this.examId
				}).then(res => {
					this.examDetail = res.data
					this.loading = false;

					if (moment(`${this.examDetail.examStartTime} ${this.examSubjectItem.subjectStarttime}`).diff(
							moment().add(this.examSubjectItem.seenQuestionBeforeMinute, "minutes"), 'seconds'
						) > 0) {
						this.isBegin = true;
						this.setTimer();
					} else {
						this.initData();
					}

				}).catch(err => {
					console.log(err)
				})
			},

			setTimer() {
				this.timer = setInterval(() => {
					if (moment(`${this.examDetail.examStartTime} ${this.examSubjectItem.subjectStarttime}`).diff(
							moment().add(this.examSubjectItem.seenQuestionBeforeMinute, "minutes"), 'seconds'
						) > 0) {
						this.isBegin = true;
					} else {
						this.isBegin = false;
						this.isHours = this.diffHours();
						clearInterval(this.timer);
						this.initData();
					}
				}, 1000)
			},

			// 是否可以开始考试
			isStartExam() {
				let start = moment(`${this.examSubjectItem.subjectDate} ${this.examSubjectItem.subjectStarttime}`)
					.subtract(this.examSubjectItem.seenQuestionBeforeMinute, 'm').format('YYYY-MM-DD HH:mm:ss')
				// let end = `${this.examSubjectItem.subjectDate} ${this.examSubjectItem.subjectEndtime}`
				let end = moment().format('YYYY-MM-DD HH:mm:ss')
				return moment().diff(moment(start)) > 0
			},
			// 是否可以上传试卷
			diffUpload() {
				return this.$mHelper.timeInByDate(this.examSubjectItem.uploadPaperStarttime, this.examSubjectItem
					.uploadPaperEndtime) > 0
			},
			// 录制视频
			submitTap() {
				uni.redirectTo({
					url: `/pages/public/top/testRecording?examId=${this.examId}&examSubjectItem=${JSON.stringify(this.examSubjectItem)}&type=${this.type}`
				})
			},
			// 上传试卷图片
			uploadTap() {
				if (this.isUpload) {
					uni.navigateTo({
						url: `/pages/public/top/testUpload?id=${this.examId}&examSubjectItem=${JSON.stringify(this.examSubjectItem)}&type=${this.type}`
					})
				}
			},
			// 一个小时后
			diffHours() {
				if (moment(`${this.examSubjectItem.subjectDate} ${this.examSubjectItem.subjectEndtime}`).add(1, "hours")
					.diff(moment(), 'seconds') > 0) {
					return false
				}
				return true
			}
		},
		onUnload() {
			if (this.timer) clearInterval(this.timer)
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		.content {
			padding: 36rpx 36rpx 0 28rpx;
			height: calc(100vh - 146rpx);
			overflow: auto;
			padding-bottom: calc(134rpx + constant(safe-area-inset-bottom));
			padding-bottom: calc(134rpx + env(safe-area-inset-bottom));

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

		.nodata {

			margin-top: 300rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			image {
				width: 396rpx;
				height: 314rpx;
			}

			&-title {
				margin-top: 38rpx;
				font-size: 30rpx;
				font-weight: bold;
				color: #3A3D71;
			}

			&-subtitle {
				width: 424rpx;
				text-align: center;
				margin-top: 16rpx;
				font-size: 24rpx;
				color: #B4B4B4;
			}
		}

		.footer {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 14rpx 34rpx;
			padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
			padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
			background-color: #fff;

			&-btn {
				flex: 1;
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
	}
</style>
