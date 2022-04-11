<template>
	<view class="teaching-material-detail">
		<view class="tips" v-if="type === 'user' && detail.state === 'rejected'">
			<view class="tips-title">温馨提示</view>
			<view class="tips-subtitle">{{detail.auditReason}}</view>
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
			<view class="swiper">
				<view class="swiper-item" :class="{'active':activeIndex === index}"
					v-for="(item, index) in detail.items" :key="index" @click="handleClick(index)">
					<image :src="item.thumbImg" mode="aspectFit"></image>
				</view>
			</view>


			<view class="works" v-if="type === 'default'">
				<view class="works-img" v-if="detail.isPayed || activeIndex < detail.hdImgViewCount" @click="prevImageTap(detail.items[activeIndex].hdImg)">
					<image :src="detail.items[activeIndex].hdImg" mode="widthFix"></image>
				</view>
				<view v-else class="works-img filter">
					<image :src="detail.items[activeIndex].thumbImg" mode="widthFix"></image>
				</view>

				<view v-if="detail.isPayed || activeIndex < detail.hdImgViewCount"></view>
				<view v-else class="mask u-flex u-row-center">
					<image :src="setSrc('highScore/highScore_mask.png')"></image>
				</view>
			</view>

			<view class="works" v-else>
				<view class="works-img">
					<image :src="detail.items[activeIndex].url" mode="widthFix"></image>
				</view>
				<view class="mask mask1 u-flex u-row-center" v-if="!detail.state === 'stop_sale'">
					<image :src="setSrc('highScore/stop_sale.png')" style="width: 280rpx;height: 280rpx;"></image>
				</view>
			</view>

			<view class="tabs">
				特效可编辑画面效果
				<view class="tabs-in">
					<view class="left coms tabs-active" @click="switchTap(0)">
						原图
					</view>
					<view class="right coms" @click="switchTap(1)">
						特效
					</view>
				</view>
			</view>

			<view class="line"></view>

			<view class="description">
				<view class="title">
					<image src="/static/public/examinationPaper_icon.png" mode=""></image>作品描述
				</view>
				<view class="d-c">{{detail.description}}</view>
				<!-- <view class="d-c">{{detail.items[activeIndex].description}}</view> -->
			</view>

			<view class="line" v-if="detail.isNeedExpress"></view>

			<view class="delivery-content" v-if="detail.isNeedExpress">
				<view class="left">
					<image src="/static/public/highScore/deliveryContent.png" mode=""></image>发货内容
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
						<!-- 	<expandable-text :line="3" expandText="全文" foldText="收起">
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
	import moment from '@/common/moment.js'
	import {
		getDetail,
		addFavorite,
		commentList,
		addComment,
		myDetail,
		myDeleteTeachingMaterial,
		myUpdateSaleState
	} from '@/api/teaching_material.js'
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
				placeholder: '',
				type: 'default',
				userInfo: {}
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
		methods: {
			initData() {
				this.$http.get(this.type === 'default' ? getDetail : myDetail, {
					id: this.id
				}).then(res => {
					this.detail = res.data
				}).catch(err => {
					this.$mHelper.toast(err.msg)
					setTimeout(() => {
						this.$mRouter.back();
					}, 1500)
				})
			},
			handleClick(index) {
				this.activeIndex = index
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
					console.log(err)
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
			// 立即购买
			submitTap() {

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
			switchTap(type) {
				switch (type) {
					case 1:
						if(this.userInfo.id !== this.detail.teacherId){
							if ((this.activeIndex + 1) <= this.detail.hdImgViewCount || this.detail.isPayed) {
								uni.navigateTo({
									url: `/pages/public/highScore/imageFilter?url=${this.detail.items[this.activeIndex].hdImg}`
								})
							} else {
								this.$mHelper.toast('请先购买该教材')
							}
						} else {
							console.log(this.detail.items)
							uni.navigateTo({
								url: `/pages/public/highScore/imageFilter?url=${this.detail.items[this.activeIndex].url || this.detail.items[this.activeIndex].hdImg}`
							})
						}
						

						break;
				}
			},
			// 预览图片
			prevImageTap(image){
				
				if(this.detail.isPayed || this.activeIndex < this.detail.hdImgViewCount){
					uni.previewImage({
						current: 0,
						urls: [image]
					})
				}
				
			}
		},
		onReachBottom() {
			this.loadStatus = 'loading';
			this.addData();
		},
	}
</script>

<style lang="scss">
	.teaching-material-detail {
		min-height: 100vh;
		background-color: #fff;

		.tips {
			margin: 28rpx 34rpx;
			padding: 24rpx 20rpx 20rpx;
			background: #FFF3EA;
			border-radius: 16rpx;

			&-title {
				font-size: 28rpx;
				font-weight: 800;
				color: #FF8827;
			}

			&-subtitle {
				font-size: 26rpx;
				color: #FF8827;
			}
		}

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
			padding-bottom: 160rpx;
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

		.swiper {
			margin-top: 10rpx;
			width: 100vw;
			padding: 40rpx 34rpx;
			overflow-x: scroll;
			white-space: nowrap;

			.swiper-item {
				margin-right: 26rpx;
				display: inline-block;

				image {
					width: 134rpx;
					height: 158rpx;
					border-radius: 5px;
				}
			}

			.active {
				image {
					transform: scale(1.2)
				}
			}
		}

		.works {
			margin: 0 34rpx;
			border-radius: 24rpx;
			position: relative;

			&-img {
				border-radius: 24rpx;

				&.filter {
					background: rgba($color: #D8D8D8, $alpha: .6);
					filter: blur(2rpx);
				}

				image {
					width: 100%;
					border-radius: 24rpx;
				}
			}

			.mask {
				position: absolute;
				top: 0;
				right: 0;
				left: 0;
				bottom: 0;
				overflow: hidden;
				border-radius: 24rpx;

				&.mask1 {
					background: rgba($color: #000000, $alpha: .5);
				}

				image {
					width: 478rpx;
					height: 268rpx;

				}
			}
		}

		.tabs {
			padding: 0 34rpx;
			width: 100%;
			height: 76rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #9E9E9E;
			line-height: 76rpx;
			position: relative;
			margin: 28rpx 0;

			.tabs-in {
				width: 216rpx;
				height: 76rpx;
				background: #F3F3F3;
				border-radius: 46rpx;
				position: absolute;
				right: 34rpx;
				top: 0;
				display: flex;
				padding: 8rpx;

				.left {
					flex: 1;
				}

				.right {
					flex: 1;

				}

				.coms {
					width: 100rpx;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
				}

				.tabs-active {
					background: #FFFFFF;
					border-radius: 36rpx;
					color: #3A3D71;
				}
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
