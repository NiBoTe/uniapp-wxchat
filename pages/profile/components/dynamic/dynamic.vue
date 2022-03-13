<template>
	<view class="container">
		<scroll-view class="list-view" :scroll-y="isFixed" @scrolltolower="lower">
			<view class="item-main" v-for="(item,index) in list" :key="index" @click="goDetail(item, index)">
				<view class="year" v-if="isHide(item, index)">
					<u-gap height="16" bg-color="#F0F0F1"></u-gap>
					<text>{{moment(item.createTime).format('YYYY')}}年</text>
				</view>
				<view class="item-box u-flex">
					<view class="time">
						<view class="time-day">{{moment(item.createTime).format('DD')}}</view>
						<view class="time-month">{{moment(item.createTime).format('M')}}月</view>
					</view>
					<view class="item">
						<view class="paragraph">{{item.content}}</view>
						<!-- 照片 -->
						<view class="thumbnails">
							<view :class="item.snsImgs.length === 1?'my-gallery':'thumbnail'"
								v-for="(image, index_images) in item.snsImgs" :key="index_images">
								<image class="gallery_img" lazy-load mode="aspectFill" :src="image.thumbImg"
									:data-src="image.thumbImg" @click.stop="previewImage(item.snsImgs,index_images)">
								</image>
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
					</view>
				</view>
			</view>

			<u-loadmore margin-top="30" margin-bottom="30" :status="loadStatus" @loadmore="addData"></u-loadmore>
		</scroll-view>


	</view>
</template>

<script>
	import {
		addFavorite,
		addLike,
		snsBlackSave,
		snsReportSave,
		addComment,
		followSnsList,
		mySnsList
	} from '@/api/sns.js'
	import moment from '@/common/moment.js'
	export default {
		props: {
			teacherId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				moment,
				isFixed: false,
				hasLogin: false,
				loadStatus: 'loadmore',
				current: 1,
				size: 10,
				list: [], // 考试列表
				itemIndex: 0,
				reportIndex: 0,
				commentIndex: -1,
				content: '',

			};
		},
		created() {
			this.getList();
		},
		methods: {
			// 收藏
			favoriteTap(item, index) {
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
				this.$http.post(mySnsList, {
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
			goDetail(item, index) {

				uni.navigateTo({
					url: `/pages/module/circleDetail/index?id=${item.id}`
				})
			},

			// 评论
			commentTap(index) {
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
			lower() {
				this.loadStatus = 'loading';
				this.addData();
			},
			isHide(item, index) {
				if (index > 0) {
					return moment(item.createTime).format('YYYY') !== moment().format('YYYY') && moment(item.createTime)
						.format('YYYY') !== moment(this.list[index - 1].createTime).format('YYYY')
				} else {
					return false
				}
			},
			noScroll(bool) {
				this.isFixed = bool
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100vw;
		overflow-x: hidden;
		background-color: #fff;
	}

	.list-view {
		padding-bottom: 160rpx;
		position: relative;


		.item-main {
			.year {

				text {
					display: inline-block;
					padding: 30rpx 0 0 36rpx;
					font-size: 40rpx;
					font-weight: 600;
					color: #3A3D71;
				}
			}

			.item-box {
				align-items: flex-start;

				.time {
					margin: 16rpx 44rpx 0 34rpx;
					padding-top: 20rpx;
					&-day {
						font-size: 48rpx;
						font-weight: 600;
						color: $u-type-primary;
					}

					&-month {
						font-size: 28rpx;
						font-weight: 600;
						color: #3A3D71;
					}
				}
			}
		}

		.item {
			display: flex;
			align-items: center;
			flex-direction: column;
			padding: 24rpx 32rpx;

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
				margin-bottom: 18rpx;
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
