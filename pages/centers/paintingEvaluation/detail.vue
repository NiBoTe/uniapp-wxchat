<template>
	<view class="detail">
		<view class="swiper-wrapper">
			<view class="swiper">
				
				<view class="swiper-item">
					<image :src="detail.evaluateUrl || detail.url" mode="widthFix"></image>
					<view class="evaluateParams" v-for="(item, index) in evaluateParams" :key="index" :style="{top: (item.y / (upx2px(100) /100) - 20) + 'rpx', left:(item.x / (upx2px(100) / 100) - 48) + 'rpx'}">
						<view class="evaluateParams-box">
							<voicePlayback :item="item"></voicePlayback>
						</view>
					</view>
				</view>
				<!-- <swiper @change="swiperChange">
					<swiper-item>
						<view class="swiper-item">
							<image :src="detail.evaluateUrl || detail.url" mode="widthFix"></image>
							<view class="evaluateParams" v-for="(item, index) in evaluateParams" :key="index" :style="{top: item.y / (upx2px(100) /
								100) + 'px', left:(item.x / (upx2px(100) / 100)) + 'px'}">
								<view class="evaluateParams-box">
									<voicePlayback :item="item"></voicePlayback>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper> -->
				<!-- <view class="dots u-flex u-row-center">{{currentIndex}}/3</view> -->
				<view class="score u-flex u-row-center" v-if="detail.score >= 0 && detail.state !== 'wait_evaluate'">
					<text>{{detail.score || 0}}</text>
					<text class="unit">分</text>
				</view>
			</view>
			<view class="title">{{detail.title}}</view>

			<view class="label u-flex" v-if="detail.dimensions">
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
						<text>{{item.content || ''}}</text>
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

			<view class="card-subtitle" :class="state === 'wait_evaluate' ? 'disabled' : ''">
				<text v-if="detail.state === 'wait_evaluate'">系统已为您提醒该老师进行评画，如长时间未有评画请点击提醒点评按钮让TA为您评画哦！</text>
				<text v-else>{{detail.textComment || ''}}</text>
			</view>

			<view class="tips u-flex u-row-between" v-if="detail.state === 'wait_evaluate'">
				<view class="left">提醒TA来评画吧！</view>
				<view class="right" @click="tipsTap">提醒点评</view>
			</view>
			<view class="card-footer u-flex" v-else>
				<view class="left">总评语</view>
				<view class="right u-flex u-row-between">
					<view class="right-vol u-flex">
						<image src="/static/public/voice_blue.png"></image>
						<text>{{$mHelper.formatMinutes(detail.voiceCommentDuration || 0)}}</text>
					</view>
					<view class="right-btn u-flex u-row-center" @click="playBtn()">
						<u-icon v-if="!playStatus" name="play-right-fill" color="#fff" size="28"></u-icon>
						<u-icon v-else name="pause" color="#fff" size="28"></u-icon>
					</view>
				</view>
			</view>
		</view>

		<!-- 查看评论 -->
		<view class="comment">
			<view class="title">
				{{total}}条评论
			</view>
			<view class="list" v-for="(item, index) in list" :key="index">
				<view class="left">
					<u-avatar size="80" :src="item.user.headUrl"></u-avatar>
				</view>
				<view class="right">
					<view class="name">
						<text>{{item.user.fullName}}</text>
					</view>
					<view class="text">
						<rich-text :nodes="$mHelper.messageemoj(item.content)"></rich-text>
						<!-- <expandable-text :line="3" expandText="全文" foldText="收起">
						  {{item.content}}
						</expandable-text> -->
					</view>
					<view class="time">
						{{(moment(item.createTime).format('MM-DD'))}} <text @click="replyTap(item, index)">回复</text>
					</view>

					<view class="child" v-for="(itemc, indexc) in item.moreList" :key="indexc">
						<view class="c-l">
							<u-avatar size="80" :src="itemc.user.headUrl"></u-avatar>
						</view>
						<view class="c-r">
							<view class="name">
								<text>{{itemc.user.fullName}}</text>
								<view class="author" v-if="itemc.appUserId === detail.user.id">作品作者</view>
								<view class="to" v-if="itemc.replyUser">
									<u-icon name="play-right-fill" color="#9E9E9E" size="26"></u-icon>
								</view>
								<view class="form" v-if="itemc.replyUser">{{itemc.replyUser.fullName}}</view>
							</view>
							<view class="text">
								{{itemc.content}}
							</view>
							<view class="time">
								{{(moment(itemc.createTime).format('MM-DD'))}} <text
									@click="replyTap(itemc, indexc)">回复</text>
							</view>
						</view>
					</view>

					<view class="more u-flex u-row-between" v-if="item.replyList.length">
						<view class="left" @click="moreTap(item, index, true)">
							<text v-if="!item.isMore">展开{{item.replyList.length}}条回复</text>
							<!-- <text v-else>查看更多回复</text> -->
							<!-- <image src="/static/public/arrow_down_text.png"></image> -->
						</view>

						<view class="right" v-if="item.isMore" @click="moreTap(item, index)">
							<text>收起</text>
							<image src="/static/public/arrow_down_text.png"></image>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="footer" v-if="detail.state === 'completed'" :style="{paddingBottom: safeAreaHeight + 7 + 'px'}">
			<view class="footer-box u-flex u-row-between">
				<view class="left u-flex" v-if="!isFocus" @click="commentTap">
					<text>说一下你的想法…</text>
				</view>
				<view class="left u-flex" v-else>
					<input type="text" :cursor-spacing="20" v-model="content" placeholder="说一下你的想法…" focus
						@confirm="confirmCommentTap()" :hold-keyboard="holdKeyboard" @blur="isFocus = false"  confirm-type="done" @keyboardheightchange="keyboardheightChange" />
				</view>

				<view class="right u-flex">
					<image src="/static/public/applause.png" @click="sendExpression(0)"></image>
					<image src="/static/public/laugh.png" @click="sendExpression(1)"></image>
					<image src="/static/public/cool.png" @click="sendExpression(2)"></image>
				</view>
			</view>
		</view>

		<view class="footer" v-else-if="detail.state === 'wait_confirm'">
			<view class="footer-btn" @click="submitTap">
				<text>确认评画</text>
			</view>
		</view>


		<u-modal v-model="modalShow" :mask-close-able="true" show-cancel-button :confirm-color="themeColor"
			cancel-color="#8F9091" border-radius="24" :title-style="titleStyle" @confirm="confirmTap">
			<view class="modal-content">确认后评画费用会打入到评画老师账户中，是否确认提交？</view>
		</u-modal>
	</view>
</template>

<script>
	const innerAudioContext = uni.createInnerAudioContext()
	import {
		orderItemPaintEvaluateDetail,
		notifyTeacherPaintEvaluate,
		commentList,
		addComment,
		publicOrderItemPaintEvaluateDetail
	} from '@/api/paint_evaluate_v2.js'

import { orderItemPaintEvaluateTeacherDetail } from '@/api/paint_evaluate_v2_teacher.js'
	import moment from '@/common/moment.js'
	
	import VoicePlayback from '@/components/voicePlayback/voicePlayback.vue'
	export default {
		components:{
			VoicePlayback
		},
		data() {
			return {
				moment,
				hasLogin: false,
				currentIndex: 0,
				id: null,
				detail: {},
				modalShow: false,
				themeColor: this.$mConstDataConfig.themeColor,
				titleStyle: {
					fontSize: '36rpx',
					color: '#1B1B1B'
				},
				playStatus: 0,
				loadStatus: 'loadmore',
				isFocus: false,
				content: '',
				holdKeyboard: false,
				replyId: 0,
				total: 0,
				current: 1,
				size: 10,
				list: [], // 考试列表
				type: 'default',
				source: "list",
				evaluateParams: [],
				safeAreaHeight: 0,
			};
		},
		onLoad(options) {
			try {
			  const res = wx.getSystemInfoSync()
			  console.log(res)
			  this.safeAreaHeight = res.screenHeight - res.safeArea.bottom
			} catch (e) {
			  // Do something when catch error
			}
			if (options.id) {
				this.id = options.id
				this.source = options.source
				this.type = options.type
			}
		},
		
		onShow(){
			if(this.source !== 'home'){
				this.hasLogin = this.$mStore.getters.hasLogin
				if(this.hasLogin) {
					this.initData()
				} else {
					uni.navigateTo({
						url: '/pages/public/logintype'
					})
				}
			} else {
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
				
				if(this.type !== 'teacherInfo') {
					this.$http.get(this.source === 'home' ? publicOrderItemPaintEvaluateDetail : orderItemPaintEvaluateDetail, {
						id: this.id
					}).then(res => {
						this.detail = res.data
						this.evaluateParams = this.detail.evaluateParams ? JSON.parse(this.detail.evaluateParams) : []
						this.getComment();
					}).catch(err => {
						console.log(err)
						this.$mHelper.toast(err.msg)
						// setTimeout(() => {
						// 	this.$mRouter.back()
						// }, 1500)
					})
				} else {
					this.$http.get(this.source === 'home' ? publicOrderItemPaintEvaluateDetail : orderItemPaintEvaluateTeacherDetail, {
						id: this.id
					}).then(res => {
						this.detail = res.data
						this.evaluateParams = this.detail.evaluateParams ? JSON.parse(this.detail.evaluateParams) : [],
						
						this.getComment();
					}).catch(err => {
						console.log(err)
						this.$mHelper.toast(err.msg)
						// setTimeout(() => {
						// 	this.$mRouter.back()
						// }, 1500)
					})
				}
				
			},
			swiperChange(e) {
				this.currentIndex = e.detail.current;
			},
			submitTap() {
				this.modalShow = true;
			},
			// 提醒点评
			tipsTap() {
				this.$http.post(notifyTeacherPaintEvaluate, null, {
					params: {
						id: this.id
					}
				}).then(res => {
					this.$mHelper.toast('提醒成功！')
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
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
			getComment() {
				this.loadStatus = 'loading';
				this.$http.post(commentList, {
					current: this.current,
					size: this.size,
					targetId: this.id
				}).then(res => {
					console.log(res)
					this.total = res.data.total
					let data = res.data.records
					data.map(item => {
						item['isMore'] = false;
						item['moreList'] = []
					})
					if (this.current === 1) {
						this.list = data;
					} else {
						this.list = this.list.concat(data);
					}
					if (data.length <= 0) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}


				}).catch(err => {
					console.log(err)
				})
			},
			addData() {
				this.current++;
				this.getComment();
			},

			// 更多
			moreTap(item, index, type) {
				if (item.isMore && type) {

				} else {
					if (!item.isMore) {
						item.moreList = item.replyList
					} else {
						item.moreList = []
					}

					item.isMore = !item.isMore
				}

			},
			// 发送表情
			sendExpression(type) {
				this.isFocus = true
				switch (type) {
					case 0:
						this.content += '[鼓掌]'
						break;
					case 1:
						this.content += '[高兴]'
						break;
					case 2:
						this.content += '[得意]'
						break;
				}
			},
			// 评论
			commentTap() {
				this.holdKeyboard = true;
				this.isFocus = true
				this.replyId = 0;
			},
			// 回复
			replyTap(item, index) {
				console.log(item)
				// if(item.appUserId === this.detail.user.id) {
				// 	return this.$mHelper.toast('不能自己回复自己哦！')
				// }
				this.isFocus = true;
				this.replyId = item.id
			},
			confirmCommentTap() {
				if (this.content.replace(/ /g, '') === '') {
					return this.$mHelper.toast('请输入评论内容')
				}
				this.$http.post(addComment, {
					replyId: this.replyId,
					content: this.content,
					targetId: this.id
				}).then(res => {
					this.holdKeyboard = false;
					let data = res.data;
					if(data.auditStatus === 1) {
						this.$mHelper.toast('评论成功')
					} else {
						this.$mHelper.toast('提交成功，请等待审核，审核通过后显示')
					}
					this.content = ''
					this.isFocus = false
					this.current = 1;
					this.getComment();
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})

			},
			keyboardheightChange(e){
				console.log(e)
			}
		},
		onReachBottom() {
			this.loadStatus = 'loading';
			this.addData();
		},
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
			height: auto;


			&>swiper {
				height: 100%;
			}

			.swiper-item {
				position: relative;
				height: 100%;

				&>image {
					width: 100%;
					height: 100%;
					border-radius: 24rpx;
				}
				
				
				.evaluateParams{
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

		&-box {
			padding: 0 24rpx 0 26rpx;
			width: 100%;
			height: 80rpx;
			background: #F7F7F7;
			border-radius: 16rpx;

			.left {
				padding-left: 30rpx;
				flex: 1;
				height: 64rpx;
				font-size: 26rpx;
				font-weight: 500;
				color: #959595;
			}

			.right {
				image {
					margin-left: 30rpx;
					width: 32rpx;
					height: 32rpx;
				}

			}
		}
	}

	.modal-content {
		padding: 40rpx 40rpx 70rpx;
		font-size: 28rpx;
		color: #1B1B1B;
		line-height: 40rpx;
	}

	.comment {
		padding: 38rpx 0;
		background-color: #fff;

		.title {
			text-align: center;
			font-size: 32rpx;
			font-weight: 600;
			color: #3A3D71;
			line-height: 56rpx;
			margin-bottom: 20rpx;
		}

		.list {
			margin-top: 40rpx;
			display: flex;

			.left {
				flex: 0 0 126rpx;
				padding-left: 46rpx;

				image {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}
			}

			.right {
				padding-left: 18rpx;
				padding-right: 20rpx;
				width: 0;
				flex: 1;

				.name {
					font-size: 28rpx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: #3A3D71;
					line-height: 28rpx;
				}

				.text {
					font-size: 28rpx;
					font-family: PingFangSC-Light, PingFang SC;
					font-weight: 300;
					color: #3A3D71;
					line-height: 40rpx;
					margin-top: 16rpx;
					word-break: break-all;
				}

				.time {
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #9E9E9E;
					line-height: 26rpx;
					margin-top: 14rpx;

					text {
						margin-left: 24rpx;
					}
				}

				.child {
					padding-top: 20rpx;
					display: flex;

					.c-l {
						image {
							width: 60rpx;
							height: 60rpx;
							border-radius: 50%;
						}
					}

					.c-r {
						padding-left: 18rpx;

						.name {
							font-size: 28rpx;
							font-weight: bold;
							color: #3A3D71;
							display: flex;
							align-items: center;

							.author {
								margin-left: 12rpx;
								padding: 0 10rpx;
								height: 32rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								background: #EFF2FF;
								border-radius: 16rpx;
								font-size: 22rpx;
								color: #8D90B8;
							}

							.to {
								margin: 0 16rpx 0 14rpx;
							}

							.form {
								font-size: 28rpx;
								font-weight: bold;
								color: #9E9E9E;
							}
						}

						.text {
							font-size: 28rpx;
							font-family: PingFangSC-Light, PingFang SC;
							font-weight: 300;
							color: #3A3D71;
							margin-top: 2rpx;
							// line-height: 40rpx;
						}

						.time {
							ont-size: 26rpx;
							color: #9E9E9E;
							line-height: 26rpx;
						}
					}
				}

				.more {
					margin-top: 40rpx;

					.left {
						padding-left: 0;
						flex: 1;
						display: flex;
						align-items: center;
						font-size: 28rpx;
						color: #3A3D71;

						image {
							margin-left: 12rpx;
							width: 24rpx;
							height: 14rpx;
						}
					}

					.right {
						display: flex;
						justify-content: flex-end;
						align-items: center;
						font-size: 28rpx;
						color: #3A3D71;

						image {
							transform: rotate(180deg);
							margin-left: 14rpx;
							width: 24rpx;
							height: 14rpx;
						}
					}
				}
			}
		}
	}
</style>
