<template>
	<view class="detail">
		<view class="navbar">
			<u-navbar title=" " immersive back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>

			<video id="myVideo" :direction="90" :controls="controls" @fullscreenchange="fullScreenChange" :custom-cache="false" :src="videoUrl"
				@loadedmetadata="videoLoadedmetadata" @error="videoErrorCallback" @timeupdate='videoUpdate'
				@ended="videoEnded" @play="palyFlag = true" object-fit="contain" enable-play-gesture>
			</video>

			<view v-if="userInfo.id !== detail.teacherId && detail.price > 0">
				<view class="try u-flex u-row-center" v-if="!detail.isPayed && !isTrialEnd" @click="submitTap">
					<text>{{palyFlag ? '正在试看，购买后观看完整视频' : '内容可试看'}}</text>
					<view v-if="palyFlag" class="try-btn">购买</view>
				</view>

				<view class="trial u-flex u-row-center" v-if="!detail.isPayed && isTrialEnd">
					<view class="trial-btn u-flex u-row-center" @click="submitTap">购买</view>
					<text>本内容需要购买后才能观看</text>
				</view>
			</view>


			<view class="panel u-flex" v-if="!controls">
				<view class="video-play" @click='videoOpreation'>
					<u-icon v-if="!palyFlag" name="play-right-fill" color="#fff" size="28"></u-icon>
					<u-icon v-else name="pause" color="#fff" size="28"></u-icon>
				</view>
				<view class="controls">
					<text>{{currtime}}</text>
					<view class="controls-slider">
						<u-slider v-model="sliderValue" :max="sliderMax" inactive-color="#A5A5A4" active-color="#35CE96"
							:use-slot="true" @moving="sliderChange">
							<view class="block u-flex u-row-center">
								<view class="block-box"></view>
							</view>
						</u-slider>
					</view>
					<text>{{druationTime}}</text>
				</view>

				<view class="video-screen u-flex" @click='videoAllscreen'>
					<image src="/static/public/screen.png"></image>
				</view>
			</view>
		</view>



		<view class="main">
			<view class="head">
				<view class="img">
					<u-avatar size="132" :src="detail.cover">
					</u-avatar>
				</view>
				<text class="name">{{detail.teacherFullName || ''}}</text>
				<image class="like" src="/static/public/dynamic_star_fill.png" v-if="!detail.isFavorite"
					@click="favoriteTap">
					<image class="like" src="/static/public/dynamic_star.png" v-else @click="favoriteTap">
			</view>
			<view class="parameter">
				<view class="com hot">
					<image class="icon" src="../../../static/public/highScore/hot.png" mode=""></image>
					<view class="com-in">
						<text class="name">
							热度值
						</text>
						<text class="content">
							{{detail.hotValue || 0}}
						</text>
					</view>


				</view>
				<view class="com num">
					<image class="icon" src="../../../static/public/highScore/shopCat.png" mode=""></image>
					<view class="com-in">
						<text class="name">
							购买量
						</text>
						<text class="content">
							{{detail.buyCount || 0}}次
						</text>
					</view>
				</view>

				<view class="price"><text>¥</text>{{detail.price || 0}}</view>
			</view>
			<view class="line"></view>
			<view class="tro">
				<view class="title">{{detail.title || ''}}</view>
				
			</view>


			<view class="line"></view>

			<view class="description">
				<view class="title">
					<image src="../../../static/public/examinationPaper_icon.png" mode=""></image>作品描述
				</view>
				<view class="d-c">{{detail.description}}</view>
			</view>


			<view class="line" v-if="detail.isNeedExpress"></view>

			<view class="delivery-content" v-if="detail.isNeedExpress">
				<view class="left">
					<image src="../../../static/public/highScore/deliveryContent.png" mode=""></image>发货内容
				</view>
				<view class="right">{{detail.expressContent}}</view>
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
							<!-- 			<expandable-text :line="3" expandText="全文" foldText="收起">
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
		</view>

		<view class="commit u-flex" v-if="isFocus">
			<view class="left u-flex">
				<textarea :fixed="true" auto-height :cursor-spacing="30" v-model="content" :placeholder="placeholder"
					focus @confirm="confirmTap()" @blur="isFocus = false" />
			</view>
			<view class="commit-btn u-flex" @click.stop="confirmTap()">
				<image src="/static/public/commit.png"></image>
			</view>
		</view>

		<view v-if="!isFocus && type === 'default'">
			<view class="footer" v-if="!detail.isPayed">
				<view class="footer-btn" @click="submitTap">立即购买</view>
			</view>
			<view class="footer" v-else-if="detail.notCommentOrderIds.length > 0">
				<view class="footer-btn" @click="submitTap">我要评价</view>
			</view>
		</view>
		<view v-if="!isFocus && type === 'user'">
			<view class="footer u-flex">
				<view v-if="detail.state === 'on_sale'" class="footer-btn" style="margin-right: 24rpx;" @click="offTap">
					下架作品</view>
				<view v-if="detail.state === 'auditing' || detail.state === 'rejected' || detail.state === 'stop_sale'"
					class="footer-btn" style="margin-right: 24rpx;" @click="updateTap">编辑作品</view>
				<view class="footer-btn" @click="removeTap">删除作品</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getDetail,
		addFavorite,
		commentList,
		addComment,
		myDetail,
		myDeleteTeachingMaterial,
		myUpdateSaleState
	} from '@/api/teaching_material.js'
	import moment from '@/common/moment.js'
	export default {
		data() {
			return {
				moment,
				hasLogin: false,
				activeIndex: 0,
				detail: {},
				isFocus: false,
				content: '',
				replyId: 0,
				total: 0,
				current: 1,
				size: 10,
				list: [], // 考试列表

				videoUrl: '',
				videoContext: null,
				fullScreenFlag: false,
				duration: 0,
				sliderMax: 100,
				currtime: '00:00', //当前播放时间 字符串 计算后
				druationTime: '00:00', //总时间 字符串 计算后
				sliderValue: 0, //控制进度条slider的值，
				updateState: false, //防止视频播放过程中导致的拖拽失效
				palyFlag: false,
				isTrialEnd: false,
				placeholder: '',
				type: 'default',
				userInfo: {},
				controls: false
			};
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id
				this.type = options.type || 'default'
				this.initData()
				this.getComment();
			}
		},

		onShow() {
			this.hasLogin = this.$mStore.getters.hasLogin;
			this.userInfo = this.$mStore.state.userInfo;
			uni.$on('detailRefresh', () => {
				this.initData()
			})
		},
		onReady: function(res) {
			this.videoContext = uni.createVideoContext('myVideo')
		},
		methods: {
			initData() {
				this.$http.get(this.type === 'default' ? getDetail : myDetail, {
					id: this.id
				}).then(res => {
					this.detail = res.data
					console.log(this.detail.notCommentOrderIds)

					this.detail.videoTrialDuration = this.detail.videoTrialDuration ? this.detail
						.videoTrialDuration * 60 : 0
					this.videoUrl = this.detail.items[0].hdImg
				}).catch(err => {
					this.$mHelper.toast(err.msg)
					setTimeout(() => {
						this.$mRouter.back();
					}, 1500)
				})
			},

			// 收藏
			favoriteTap() {
				this.$http.post(addFavorite, null, {
					params: {
						examPaperImgId: this.id,
						addFavorite: !this.detail.isFavorite
					}
				}).then(res => {
					this.$set(this.detail, 'isFavorite', !this.detail.isFavorite)
					this.$mHelper.toast(this.detail.isFavorite ? '收藏成功' : '取消收藏成功')
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			},
			getComment() {
				this.loadStatus = 'loading';
				this.$http.post(commentList, {
					current: this.current,
					size: this.size,
					targetId: this.id
				}).then(res => {
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
			// 评论
			commentTap() {
				this.isFocus = true
				this.replyId = 0;
			},
			// 回复
			replyTap(item, index) {
				console.log(item)
				this.placeholder = `回复${item.user.fullName}`
				// if(item.appUserId === this.detail.user.id) {
				// 	return this.$mHelper.toast('不能自己回复自己哦！')
				// }
				this.isFocus = true;
				this.replyId = item.id
			},
			confirmTap() {
				if (this.content.replace(/ /g, '') === '') {
					return this.$mHelper.toast('请输入评论内容')
				}
				this.$http.post(addComment, {
					replyId: this.replyId,
					content: this.content,
					targetId: this.id
				}).then(res => {
					let data = res.data;
					if (data.auditStatus === 1) {
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
			// 立即购买
			submitTap() {
				if (this.userInfo.id === this.detail.teacherId) {
					return this.$mHelper.toast('不允许购买自己发布的商品')
				}
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/public/logintype'
					})
					return
				}

				if (!this.detail.isPayed) {
					uni.navigateTo({
						url: `/pages/public/highScore/sureOrder?id=${this.id}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/public/highScore/evaluate?id=${this.id}&index=${this.activeIndex}&orderId=${this.detail.notCommentOrderIds.length ? this.detail.notCommentOrderIds[0] : '' }`
					})
				}

			},

			// 下架作品
			offTap() {
				uni.showModal({
					title: '提示',
					confirmText: '确认',
					content: '下架后对应高分教材前台将不可见，是否确认下架？',
					success: (res) => {
						if (res.confirm) {
							uni.$emit('removeHighScore', true)
							this.$http.post(myUpdateSaleState, {
								id: this.id,
								isSale: this.detail.auditStatus === 1 ? false : true
							}).then(res => {
								this.$mHelper.toast('下架成功')
								uni.$emit('offHighScore', true)

								this.initData()
								// setTimeout(() => {
								// 	uni.navigateBack({
								// 		delta: 1
								// 	})
								// }, 1500)
							}).catch(err => {
								console.log(err)
							})
						}
					}
				});
			},
			// 编辑作品
			updateTap() {
				uni.$on('updateHighScore', () => {
					this.initData()
				})
				uni.navigateTo({
					url: `/pages/centers/highScoreRelease?id=${this.detail.id}`
				})
			},
			// 删除作品
			removeTap() {
				uni.showModal({
					title: '提示',
					confirmText: '确认',
					content: '删除后不可恢复，是否确认删除？',
					success: (res) => {
						if (res.confirm) {
							uni.$emit('removeHighScore', true)
							this.$http.post(myDeleteTeachingMaterial, null, {
								params: {
									id: this.id
								}
							}).then(res => {
								this.$mHelper.toast('删除成功')
								uni.$emit('removeHighScore', true)
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									})
								}, 1500)
							}).catch(err => {
								console.log(err)
							})
						}
					}
				});
			},
			// 全屏+退出全屏
			videoAllscreen(e) {
				if (!this.fullScreenFlag) {
					this.videoContext.exitFullScreen()
					this.controls = false;
				} else {
					this.controls = true;
					this.videoContext.requestFullScreen()
				}
				this.fullScreenFlag = !this.fullScreenFlag;
			},
			// 监听全屏
			fullScreenChange(e){
				this.controls = e.detail.fullScreen
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
				let duration = e.detail.duration
				let sliderValue = (e.detail.currentTime / duration) * 100;

				if (this.userInfo.id !== this.detail.teacherId && this.detail.price > 0) {
					if (sliderValue >= this.sliderMax) {
						// this.videoContext.seek(0)
						this.videoContext.pause()

						this.isTrialEnd = true;
					}
				}
				if (this.updateState) { //判断拖拽完成后才触发更新，避免拖拽失效
					this.sliderValue = sliderValue;
				} else {
					this.sliderValue = sliderValue
				}
				this.currtime = this.formatSeconds(e.detail.currentTime);
			},
			// 拖动slider完成后触发
			sliderChange(e) {
				var duration = this.duration;
				var second = this.sliderValue / 100 * duration;
				if (duration) { //完成拖动后，计算对应时间并跳转到指定位置
					this.videoContext.seek(second);
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
			// 结束
			videoEnded(e) {
				console.log(e)
			},
			videoLoadedmetadata(e) {
				this.duration = e.detail.duration.toFixed(0)
				this.druationTime = this.formatSeconds(this.duration);

				if (!this.detail.isPayed && this.userInfo.id !== this.detail.teacherId && this.detail.price > 0) {
					this.sliderMax = ((this.detail.videoTrialDuration / this.duration) * 100).toFixed(2);
				}
			}
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

			.try {
				padding: 0 20rpx;
				position: absolute;
				bottom: 100rpx;
				left: 34rpx;
				height: 68rpx;
				background: rgba(0, 0, 0, 0.7);
				border-radius: 16rpx;

				&>text {
					font-size: 24rpx;
					color: #FFFFFF;
				}

				&-btn {
					margin-left: 24rpx;
					font-size: 24rpx;
					font-weight: 800;
					color: #35CE96;
				}
			}

			.trial {
				flex-direction: column;
				position: absolute;
				z-index: 2;
				top: 0;
				right: 0;
				left: 0;
				bottom: 0;

				&-btn {
					margin-bottom: 24rpx;
					width: 178rpx;
					height: 74rpx;
					background: #35CE96;
					border-radius: 37rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #FFFFFF;
				}

				text {
					font-size: 24rpx;
					color: #FFFFFF;
				}
			}
		}

		//  视频操作面板
		.panel {
			position: absolute;
			bottom: 46rpx;
			left: 54rpx;
			right: 54rpx;

			.controls {
				margin: 0 28rpx 0 34rpx;
				flex: 1;
				display: flex;
				align-items: center;

				&-slider {
					flex: 1;
					margin: 0 18rpx 0 36rpx;

					.block {
						width: 28rpx;
						height: 28rpx;
						border-radius: 50%;
						background: rgba($color: #35CE96, $alpha: .49);

						&-box {
							width: 16rpx;
							height: 16rpx;
							border-radius: 50%;
							background: #35CE96;
						}
					}
				}

				&>text {
					font-size: 24rpx;
					font-weight: 500;
					color: #FFFFFF;
				}
			}

			.video-screen {
				image {
					width: 34rpx;
					height: 34rpx;
				}
			}
		}




		// 内容

		.parameter {
			position: relative;
			margin-top: 32rpx;

			.com {
				display: inline-block;

				.icon {
					width: 80rpx;
					height: 74rpx;
					display: inline-block;
					vertical-align: sub;
				}

				.com-in {
					display: inline-block;

					text {
						display: block;
					}

					.name {
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #9E9E9E;
						line-height: 28rpx;
					}

					.content {
						margin-top: 6rpx;

						font-size: 28rpx;
						font-family: Helvetica;
						color: #3A3D71;
						line-height: 28rpx;
					}
				}
			}

			.hot {
				margin-left: 34rpx;
			}

			.num {
				margin-left: 40rpx;
			}

			.price {
				position: absolute;
				right: 32rpx;
				bottom: 0;
				font-size: 52rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				color: #EF2E3B;

				text {
					font-size: 34rpx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: #EF2E3B;
				}
			}
		}

		.line {
			width: calc(100% - 68rpx);
			height: 2rpx;
			background: #E9E9E9;
			margin: 34rpx auto 22rpx;
		}

		.main {
			margin-top: 40rpx;
			flex: 1;
			overflow: auto;

			.head {
				position: relative;

				.img {
					margin: 0 32rpx;
					display: inline-block;
					vertical-align: middle;

					image {
						border-radius: 50%;
						width: 132rpx;
						height: 132rpx;
					}
				}

				.name {
					font-size: 36rpx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: #1B1B1B;
				}

				.like {
					position: absolute;
					right: 34rpx;
					top: 46rpx;
					width: 44rpx;
					height: 44rpx;
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



		// 评论输入
		.commit {
			width: 100%;
			position: fixed;
			bottom: 0;
			background: #FFFFFF;
			min-height: 128rpx;
			padding: 24rpx 34rpx;
			box-sizing: border-box;

			.left {
				width: 0;
				padding: 20rpx 28rpx;
				flex: 1;
				min-height: 80rpx;
				background: #F7F7F7;
				border-radius: 16rpx;

				textarea {
					font-size: 26rpx;
					color: #3A3D71;
				}
			}

			&-btn {
				margin-left: 22rpx;

				image {
					width: 60rpx;
					height: 60rpx;
				}
			}
		}

		.tro {
			padding: 0 34rpx;

			.title {
				font-size: 28rpx;
				font-family: Helvetica;
				color: #3A3D71;
			}

			.pre {
				font-size: 26rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #3A3D71;
				line-height: 36rpx;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}


		.description {
			padding: 0 34rpx;

			.title {
				image {
					width: 48rpx;
					height: 48rpx;
					vertical-align: bottom;
					margin-right: 20rpx;
				}

				font-size: 32rpx;
				font-family: Helvetica;
				color: #3A3D71;
				margin-bottom: 28rpx;
			}

			.d-c {
				font-size: 26rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #3A3D71;
				line-height: 36rpx;
				word-break: break-all;
			}
		}

		.delivery-content {
			padding: 0 34rpx;
			display: flex;

			.left {
				image {
					width: 48rpx;
					height: 48rpx;
					vertical-align: bottom;
					margin-right: 20rpx;
				}

				font-size: 32rpx;
				font-family: Helvetica;
				color: #3A3D71;
				margin-bottom: 28rpx;
			}

			.right {
				margin-left: 46rpx;
				flex: 1;
				text-align: right;
				color: $u-type-primary;
			}
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
	}
</style>
