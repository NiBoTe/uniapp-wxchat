<template>
	<view class="container">
		<tab-bar :selected="1"></tab-bar>

		<view class="navbar">
			<u-navbar :is-back="false" :title="!hasLogin ? '广场' : ' '" :border-bottom="hasLogin">
				<view class="navbar-tabs" v-if="hasLogin">
					<view class="navbar-tab" :class="tabCurrent === 0 ? 'active' : ''" @click="tabChange(0)">
						<text>广场</text>
						<view class="line"></view>
					</view>
					<view class="navbar-tab" :class="tabCurrent === 1 ? 'active' : ''" @click="tabChange(1)">
						<text>关注</text>
						<view class="line"></view>
					</view>
				</view>
			</u-navbar>
		</view>
		<view class="list-view">
			<view class="item" v-for="(item,index) in list" :key="index" @click="goDetail(item, index)">
				<view class="item-top">
					<view class="userInfo">
						<view class="logo">
							<u-avatar size="80" :src="item.user.headUrl"></u-avatar>
						</view>
						<view class="name">
							{{item.user.fullName || ''}}
						</view>

					</view>
					<view class="right" @click.stop="handleTap(index, $event)">
						<image src="/static/public/dynamic_menu.png"></image>
					</view>
				</view>
				<view class="paragraph">
					<expandable-text :line="3" expandText="全文" foldText="收起">
						{{item.content}}
					</expandable-text>
				</view>
				<!-- 照片 -->
				<view class="thumbnails">
					<view :class="item.snsImgs.length === 1?'my-gallery':'thumbnail'"
						v-for="(image, index_images) in item.snsImgs" :key="index_images">
						<image class="gallery_img" lazy-load mode="aspectFill" :src="image.thumbImg"
							:data-src="image.thumbImg" @click.stop="previewImage(item.snsImgs,index_images)"></image>
					</view>
				</view>
				<!-- 点赞、收藏 分享 -->
				<view class="toolbar">
					<view class="left">
						<view class="tool-item" @click.stop="favoriteTap(item, index)">
							<image v-if="item.isFavorite" src="/static/public/dynamic_star.png"></image>
							<image v-else src="/static/public/dynamic_star_fill.png"></image>
							<view class="num">
								{{item.favoriteCount}}
							</view>
						</view>
						<view class="tool-item" v-if="!item.noComment" @click.stop="commentTap(index)">
							<image src="/static/public/dynamic_comment.png"></image>
							<view class="num">
								{{item.commentCount}}
							</view>
						</view>
						<view class="tool-item" @click.stop="likeTap(item, index)">
							<image v-if="item.isLike" src="/static/public/dynamic_praise.png"></image>
							<image v-else src="/static/public/dynamic_praise_fill.png"></image>
							<view class="num">
								{{item.likeCount}}
							</view>
						</view>
					</view>
					<button open-type="share" class="right" @tap="share(item)">
						<view class="tool-item">
							<image src="/static/public/dynamic_share.png"></image>
							<view class="num">
								分享
							</view>
						</view>
					</button>

				</view>

				<view class="comment u-flex u-row-between" v-if="!item.noComment" @click.stop="commentTap(index)">
					<view class="left">
						<text v-if="commentIndex !== index">说一下你的想法...</text>
						<input v-else type="text" :cursor-spacing="20" v-model="content" placeholder="说一下你的想法..." focus
							@confirm="confirmTap(item, index)" />
					</view>
					<view class="right u-flex">
						<image src="/static/public/applause.png" @click="sendExpression(index,0)"></image>
						<image src="/static/public/laugh.png" @click="sendExpression(index,1)"></image>
						<image src="/static/public/cool.png" @click="sendExpression(index,2)"></image>
					</view>
				</view>
			</view>

			<u-loadmore margin-top="30" margin-bottom="30" :status="loadStatus" @loadmore="addData"></u-loadmore>
		</view>

		<bubblePopups ref="bubblePopups" v-model="popShow" :popData="popData" :isTwoline="true" @tapPopup="tapPopup"
			:x="344" :y="positionY" placement="top-end">
		</bubblePopups>

		<bubblePopups ref="bubblePopups2" v-model="popShow2" :dynamic="true" :popData="popData2" :isTwoline="true"
			@tapPopup="tapPopup2" :x="224" :y="positionY" placement="top-end">
		</bubblePopups>

		<uni-popup ref="popup" type="bottom" :maskClick="false">
			<view class="pop-content">
				<view class="head">
					请选择分享平台
				</view>
				<view class="pop-content-view">
					<scroll-view scroll-x="true" style="white-space: nowrap; vertical-align: middle;"
						show-scrollbar="true">
						<view class="pop-content-item" v-for="(items, indexs) in shareData" :key="indexs">
							<view class="item-img">
								<image :src="items.icon"></image>
							</view>
							<view class="item-title">
								{{items.title}}
							</view>
						</view>
					</scroll-view>

				</view>

				<view class="bottom-button" @tap="cancelShare">
					取消分享
				</view>


			</view>
		</uni-popup>
	</view>
</template>

<script>
	import tabBar from '@/components/tabbar/tabbar.vue'
	import bubblePopups from "@/components/bubblePopups/bubblePopups";

	import {
		snsList,
		addFavorite,
		addLike,
		snsBlackSave,
		snsReportSave,
		addComment,
		followSnsList
	} from '@/api/sns.js'
	export default {
		components: {
			tabBar,
			bubblePopups
		},
		data() {
			return {
				hasLogin: false,
				loadStatus: 'loadmore',
				tabList: [{
					name: '广场'
				}, {
					name: '关注'
				}],
				tabCurrent: 0,
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
				shareData: [{
						title: '微信',
						icon: '../../static/public/wexin.png',
					},
					{
						title: '朋友圈',
						icon: '../../static/public/pengyouquan.png'
					},
					{
						title: '微博',
						icon: '../../static/public/weibo.png'
					},
					{
						title: 'QQ',
						icon: '../../static/public/qq.png'
					},
					{
						title: 'QQ空间',
						icon: '../../static/public/kongjian.png'
					}
				],
				scrollTop: 0,
				positionY: 20,
				popShow: false,
				popShow2: false,
				current: 1,
				size: 10,
				list: [], // 考试列表
				itemIndex: 0,
				reportIndex: 0,
				commentIndex: -1,
				content: '',

			};
		},
		onLoad() {},
		onShow() {
			this.hasLogin = this.$mStore.getters.hasLogin
			this.current = 1;
			this.getList();
		},
		methods: {
			// tab
			tabChange(e) {
				this.tabCurrent = e;
				this.current = 1;
				this.getList()
			},
			// 收藏
			favoriteTap(item, index) {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/public/logintype'
					})
					return
				}
				this.$http.post(addFavorite, null, {
					params: {
						snsId: item.id,
						isFavorite: !item.isFavorite
					}
				}).then(res => {
					this.$set(this.list[index], 'isFavorite', !item.isFavorite)
					this.$set(this.list[index], 'favoriteCount', item.isFavorite ? Number(item.favoriteCount) + 1 :
						item.favoriteCount - 1)

					this.$mHelper.toast(item.isFavorite ? '收藏成功' : '取消收藏成功');
				})
			},
			// 点赞
			likeTap(item, index) {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/public/logintype'
					})
					return
				}
				this.$http.post(addLike, null, {
					params: {
						snsId: item.id,
						isLike: !item.isLike
					}
				}).then(res => {
					this.$set(this.list[index], 'isLike', !item.isLike)
					this.$set(this.list[index], 'likeCount', item.isLike ? Number(item.likeCount) + 1 :
						item.likeCount - 1)

					this.$mHelper.toast(item.isLike ? '点赞成功' : '取消点赞成功');
				})
			},
			// 获取列表

			getList() {
				this.loadStatus = 'loading';
				this.$http.post(this.tabCurrent === 0 ? snsList : followSnsList, {
					examDate: this.examDate,
					examStatus: this.examStatus,
					province: this.province,
					size: this.size,
					current: this.current,
				}).then(res => {
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
				})

			},
			addData() {
				this.current++;
				this.getList();
			},
			share(e) {
				console.log(e)
				// this.$refs.popup.open();
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
			cancelShare() {
				this.$refs.popup.close();
			},
			// 操作面板
			handleTap(index, e) {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/public/logintype'
					})
					return
				}
				this.itemIndex = index
				this.positionY = e.detail.y - this.scrollTop
				this.$set(this.popData[1], 'title', `不看：${this.list[index].user['fullName']}`)
				this.popShow = true;
			},
			goDetail(item, index) {

				uni.navigateTo({
					url: `/pages/module/circleDetail/index?id=${item.id}`
				})
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
						targetUserId: this.list[this.itemIndex].user.id,
					}).then(res => {
						if (res.data) {
							this.current = 1;
							this.getList()
						} else {
							this.$mHelper.toast('拉黑失败')
						}
					}).catch(err => {
						this.$mHelper.toast(err.msg)
					})
				}
			},
			tapPopup2(e) {
				this.$http.post(snsReportSave, {
					snsId: this.list[this.itemIndex].id,
					content: e.item.title
				}).then(res => {
					this.popShow2 = false;
					this.$mHelper.toast('举报成功')
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			},
			// 评论
			commentTap(index) {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/public/logintype'
					})
					return
				}
				this.commentIndex = index
			},
			confirmTap(item, index) {
				if (this.content.replace(/ /g, '') === '') {
					return this.$mHelper.toast('请输入评论内容')
				}
				this.$http.post(addComment, {
					replyId: 0,
					content: this.content,
					targetId: item.id
				}).then(res => {
					this.$mHelper.toast('评论成功')
					this.commentIndex = -1;
					this.$set(this.list[index], 'commentCount', Number(item.commentCount) + 1)
					this.content = ''
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			},

			// 发送表情
			sendExpression(index, type) {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/public/logintype'
					})
					return
				}
				if(this.commentIndex !== index) {
					this.content = ''
				}
				
				this.commentIndex = index
				switch (type) {
					case 0:
						this.content += '👏'
						break;
					case 1:
						this.content += '😁'
						break;
					case 2:
						this.content += '😎'
						break;
				}
			}

		},

		onPageScroll(e) {
			this.scrollTop = e.scrollTop
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
	.container {
		width: 100vw;
		overflow-x: hidden;
	}

	.list-view {
		padding-bottom: 160rpx;
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
				margin-bottom: 24rpx;
				font-size: 26rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #3A3D71;
				line-height: 23px;
				word-break: break-all;
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

			.toolbar {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 24rpx 0;

			}

			.toolbar .left {
				flex: 1;
				display: flex;
				align-items: center;

				.tool-item {
					flex: 0 0 33%;
					display: flex;
					justify-content: flex-start;
					align-items: center;

					image {
						width: 35rpx;
						height: 35rpx;
					}

					.num {
						font-size: 26rpx;
						font-family: PingFang-SC-Medium, PingFang-SC;
						font-weight: 500;
						color: #3A3D71;
						margin-left: 6px;
					}
				}
			}

			.toolbar .right {
				display: flex;
				justify-content: space-between;
				align-items: center;
				background-color: transparent;
				border: none;

				&::after {
					border: none;
				}

				.tool-item {
					display: flex;
					justify-content: flex-start;
					align-items: center;

					image {
						width: 35rpx;
						height: 35rpx;
					}

					.num {
						font-size: 26rpx;
						font-family: PingFang-SC-Medium, PingFang-SC;
						font-weight: 500;
						color: #3A3D71;
						margin-left: 6px;
					}
				}

			}



			.comment {
				padding: 0 24rpx 0 26rpx;
				width: 100%;
				height: 80rpx;
				background: #F7F7F7;
				border-radius: 16rpx;

				.left {
					font-size: 24rpx;
					font-weight: 500;
					color: #959595;

					input {
						font-size: 24rpx;
						font-weight: 500;
						color: #3A3D71;
					}
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
	}


	.pop-content {
		width: 100%;
		padding: 0 0 82px 0;
		background-color: #fff;
		z-index: 999999;
		background: #F0F4F6;
		border-radius: 20rpx 20rpx 0px 0px;

		.head {
			font-size: 16px;
			font-family: PingFang-SC-Bold, PingFang-SC;
			font-weight: bold;
			color: #3A3D71;
			text-align: center;
			padding: 24rpx 0;
		}

		.pop-content-view {
			display: flex;
			align-items: center;
			justify-content: space-around;
			padding: 12rpx 0 34rpx 0;

			.pop-content-item {
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;
				width: 150rpx;
				display: inline-block;
				margin-right: 24rpx;

				.item-img {
					text-align: center;
					width: 98rpx;
					height: 98rpx;
					margin-left: 26rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.item-title {
					margin-top: 20rpx;
					font-size: 28rpx;
					font-family: PingFang SC Regular, PingFang SC Regular-Regular;
					font-weight: 400;
					color: #333333;
					text-align: center;
				}
			}

		}

		.bottom-button {
			width: 100%;
			padding: 12rpx 0;
			border-top: #CCCCCC solid 1rpx;
			text-align: center;
			background: #fff;

			font-size: 15px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #3A3D71;
		}
	}

	.navbar-tabs {
		position: relative;
		top: 0rpx;
		z-index: 999;
		padding-left: 176rpx;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		.navbar-tab {
			margin: 0 50rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			text {
				font-size: 34rpx;
				color: #9E9E9E;
			}

			.line {
				margin-top: 20rpx;
				width: 66rpx;
				height: 6rpx;
				background-color: transparent;
				border-radius: 6rpx;
			}

			&.active {
				text {
					font-weight: bold;
					color: #1B1B1B;
				}

				.line {
					background-color: $u-type-primary;
					border-radius: 6rpx;
				}
			}
		}
	}
</style>
