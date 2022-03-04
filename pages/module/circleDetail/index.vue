<template>
	<view class="detail">
		<view class="list-view">
			<view class="item">
				<view class="item-top">
					<view class="userInfo">
						<view class="logo">
							<image v-if="detail.user" :src="detail.user.headUrl"></image>
						</view>
						<view class="name">
							{{detail.user.fullName || ''}}
						</view>

					</view>
					<view class="right u-flex" @click.stop="handleTap($event)">
						<image src="/static/public/dynamic_menu.png"></image>
					</view>
				</view>
				<view class="paragraph">{{detail.content}}</view>
				<!-- 照片 -->
				<view class="thumbnails">
					<view :class="detail.snsImgs.length === 1?'my-gallery':'thumbnail'"
						v-for="(image, index_images) in detail.snsImgs" :key="index_images">
						<image class="gallery_img" lazy-load mode="aspectFill" :src="image.thumbImg"
							:data-src="image.thumbImg" @tap="previewImage(detail.snsImgs,index_images)"></image>
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
						{{item.user.fullName}}
					</view>
					<view class="text">{{item.content}}</view>
					<view class="time">
						{{(moment(item.createTime).format('MM-DD'))}} <text @click="replyTap(item, index)">回复</text>
					</view>

					<view class="child" v-for="(itemc, indexc) in item.replyList" :key="indexc">
						<view class="c-l">
							<u-avatar size="80" :src="itemc.user.headUrl"></u-avatar>
						</view>
						<view class="c-r">
							<view class="name">
								{{itemc.user.fullName}}
							</view>
							<view class="text">
								{{itemc.content}}
							</view>
							<view class="time">
								{{(moment(itemc.createTime).format('MM-DD'))}}
							</view>
						</view>
					</view>

					<view class="child">
						<view class="c-l">
							<image
								src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fexp-picture.cdn.bcebos.com%2F4e168d5653bbf820b3d559b8ba21056105a36e86.jpg%3Fx-bce-process%3Dimage%2Fresize%2Cm_lfit%2Cw_500%2Climit_1&refer=http%3A%2F%2Fexp-picture.cdn.bcebos.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648823704&t=fe16818e6a56567aadbde4a73fd7c50e"
								mode=""></image>
						</view>
						<view class="c-r">
							<view class="name">
								程超老师
							</view>
							<view class="text">
								跟大神你比我还是差远了😂
							</view>
							<view class="time">
								12-20
							</view>
						</view>
					</view>

				</view>
			</view>
		</view>

		<view class="footer">
			<view class="footer-box u-flex u-row-between">
				<view class="left u-flex" v-if="!isFocus" @click="isFocus = true">
					<text>写评论…</text>
				</view>
				<view class="left u-flex" v-else>
					<input v-else type="text" :cursor-spacing="20" v-model="content" placeholder="写评论…" focus
						@confirm="confirmTap()" @blur="isFocus = false" />
				</view>

				<view class="right u-flex">
					<view @click.stop="favoriteTap()">
						<image v-if="detail.isFavorite" src="/static/public/dynamic_star.png"></image>
						<image v-else src="/static/public/dynamic_star_fill.png"></image>
					</view>

					<view style="margin-top: 12rpx;" @click.stop="commentTap()">
						<image src="/static/public/dynamic_comment.png"></image>
					</view>

					<view @click.stop="likeTap()">
						<image v-if="detail.isLike" src="/static/public/dynamic_praise.png"></image>
						<image v-else src="/static/public/dynamic_praise_fill.png"></image>
					</view>

					<button open-type="share" class="right" @tap="share()">
						<image src="/static/public/dynamic_share.png"></image>
					</button>

				</view>
			</view>
		</view>
		<u-loadmore margin-top="30" margin-bottom="30" :status="loadStatus" @loadmore="addData"></u-loadmore>

		<bubblePopups ref="bubblePopups" v-model="popShow" :popData="popData" :isTwoline="true" @tapPopup="tapPopup"
			:x="344" :y="positionY" placement="top-end">
		</bubblePopups>

		<bubblePopups ref="bubblePopups2" v-model="popShow2" :dynamic="true" :popData="popData2" :isTwoline="true"
			@tapPopup="tapPopup2" :x="224" :y="positionY" placement="top-end">
		</bubblePopups>

	</view>
</template>

<script>
	import {
		snsDetail,
		commentList,
		addFavorite,
		addLike,
		snsBlackSave,
		snsReportSave,
		addComment
	} from '@/api/sns.js'
	import moment from '@/common/moment.js'
	import bubblePopups from "@/components/bubblePopups/bubblePopups";
	export default {
		components: {
			bubblePopups
		},
		data() {
			return {
				moment,
				loadStatus: 'loadmore',
				id: null,
				detail: {},
				total: 0,
				current: 1,
				size: 10,
				list: [], // 考试列表
				popData: [{
						title: '举报',
						subTitle: '标题夸张，内容质量差、图片包含不良色情…',
						icon: '../../static/public/gantanhao.png',
					},
					{
						title: '不看：大超导师',
						icon: '../../static/public/jinzhi.png'
					}
				],
				popData2: [{
						title: '标题夸张',
					},
					{
						title: '旧闻重复',
					},
					{
						title: '封面反感',
					},
					{
						title: '内容质量差',
					},
					{
						title: '其他',
					}
				],
				positionY: 40,
				popShow: false,
				popShow2: false,
				itemIndex: 0,
				isFocus: false,
				content: ''
			};
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id
				this.initData();
			}
			this.getComment();
		},
		methods: {
			initData() {
				this.$http.post(snsDetail, null, {
					params: {
						id: this.id
					}
				}).then(res => {
					console.log(res)
					this.detail = res.data;
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
					if (this.current === 1) {
						this.list = res.data.records;
					} else {
						this.list = this.list.concat(res.data.records);
					}
					if (res.data.records.length <= 0) {
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
			previewImage(imageList, current) {
				let list = []
				imageList.map(item => {
					list.push(item.hdImg)
				})
				uni.previewImage({
					current,
					urls: list
				});
			},
			// 收藏
			favoriteTap() {
				this.$http.post(addFavorite, null, {
					params: {
						snsId: this.detail.id,
						isFavorite: !this.detail.isFavorite
					}
				}).then(res => {
					this.detail.isFavorite = !this.detail.isFavorite
					this.$mHelper.toast(this.detail.isFavorite ? '收藏成功' : '取消收藏成功');
				})
			},
			// 点赞
			likeTap() {
				this.$http.post(addLike, null, {
					params: {
						snsId: this.detail.id,
						isLike: !this.detail.isLike
					}
				}).then(res => {
					this.detail.isLike = !this.detail.isLike
					this.$mHelper.toast(this.detail.isLike ? '点赞成功' : '取消点赞成功');
				})
			},
			
			// 操作面板
			handleTap(e) {
				this.$set(this.popData[1], 'title', `不看：${this.detail.user ? this.detail.user['fullName'] : ''}`)
				this.popShow = true;
			},
			tapPopup(e) {
				if (e.index === 0) {
					this.popShow = false;
					this.$nextTick(() => {
						this.popShow2 = true;
					})
				} else {
					this.$http.post(snsBlackSave, {
						isLike: true,
						targetUserId: this.detail.user.id,
					}).then(res => {
						this.$mHelper.toast('操作成功')
					}).catch(err => {
						this.$mHelper.toast(err.msg)
					})
				}
			},
			tapPopup2(e) {
				this.$http.post(snsReportSave, {
					snsId: this.id,
					content: e.item.title
				}).then(res => {
					this.popShow2 = false;
					this.$mHelper.toast('举报成功')
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			},
			// 回复
			replyTap() {

			}
		},
		onReachBottom() {
			this.loadStatus = 'loading';
			this.addData();
		},
		onShareAppMessage(e) {

		},
		onShareTimeline(e) {

		}
	}
</script>

<style lang="scss" scoped>
	.detail {
		padding-bottom: 160rpx;
	}

	.list-view {
		margin-bottom: 24rpx;
		position: relative;

		.item {
			background-color: #fff;
			display: flex;
			align-items: center;
			flex-direction: column;
			padding: 24rpx 32rpx;
			border-bottom: 16rpx solid #F5F5F5;

			.item-top {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.userInfo {
					display: flex;
					justify-content: flex-start;
					align-items: center;

					.logo {
						width: 80rpx;
						height: 80rpx;
						border-radius: 80rpx;

						image {
							width: 100%;
							height: 100%;
							border-radius: 80rpx;
						}
					}

					.name {
						font-size: 32rpx;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #1B1B1B;
						margin-left: 12px;
					}
				}

				.right {
					width: 40rpx;
					height: 45rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

			}

			.paragraph {
				width: 100%;
				margin-top: 12rpx;
				font-size: 26rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #3A3D71;
				line-height: 23px;
			}


			.thumbnails {
				width: 100%;
				display: flex;
				flex-wrap: wrap;

				.gallery_img {
					width: 100%;
					height: 100%
				}
			}

			.thumbnails .thumbnail {
				width: 220rpx;
				height: 220rpx;
				margin: 4rpx;
				background: #757575;
				overflow: hidden;
			}

			.my-gallery {
				width: 380rpx;
				height: 554rpx;
				margin: 4rpx;
				background: #757575;
				overflow: hidden
			}

		}
	}


	.comment {
		padding-top: 38rpx;

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
							font-family: PingFang-SC-Bold, PingFang-SC;
							font-weight: bold;
							color: #3A3D71;
							line-height: 60rpx;
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


		&-box {
			height: 88rpx;

			.left {
				padding-left: 30rpx;
				flex: 1;
				height: 64rpx;
				background: #F0F1F2;
				border-radius: 32rpx;
				font-size: 26rpx;
				font-weight: 500;
				color: #959595;
			}

			.right {
				flex: 1;

				&>view {
					display: flex;
					justify-content: center;
					align-items: center;
				}

				image {
					margin-left: 44rpx;
					width: 35rpx;
					height: 35rpx;
				}

				button {
					padding: 0;
					width: 35rpx;
					height: 35rpx;
					line-height: 1;
					background-color: transparent;

					&::after {
						border: none;
					}
				}
			}
		}

	}
</style>
