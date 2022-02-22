<template>
	<view>
		<tab-bar :selected="1"></tab-bar>
		<view class="list-view">
			<view class="item" v-for="(item,index) in list" :key="index" @tap="goDetail">
				<view class="item-top">
					<view class="userInfo">
						<view class="logo">
							<image :src="item.user.headUrl"></image>
						</view>
						<view class="name">
							{{item.user.fullName}}
						</view>

					</view>
					<view class="right" @click="handleTap">
						<image src="/static/public/dynamic_menu.png"></image>
					</view>
				</view>
				<view class="paragraph">{{item.content}}</view>
				<!-- 照片 -->
				<view class="thumbnails">
					<view :class="item.snsImgs.length === 1?'my-gallery':'thumbnail'"
						v-for="(image, index_images) in item.snsImgs" :key="index_images">
						<image class="gallery_img" lazy-load mode="aspectFill" :src="image.thumbImg" :data-src="image.thumbImg"
							@tap="previewImage(item.snsImgs,index_images)"></image>
					</view>
				</view>
				<!-- 点赞、收藏 分享 -->
				<view class="toolbar">
					<view class="left">
						<view class="tool-item">
							<image src="/static/public/dynamic_star.png"></image>
							<view class="num">
								{{item.favoriteCount}}
							</view>
						</view>
						<view class="tool-item" v-if="!item.noComment">
							<image src="/static/public/dynamic_comment.png"></image>
							<view class="num">
								{{item.commentCount}}
							</view>
						</view>
						<view class="tool-item">
							<image src="/static/public/dynamic_praise.png"></image>
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

		<bubblePopups v-model="popShow" :popData="popData" :isTwoline="true" @tapPopup="tapPopup" :x="344" :y="positionY"
			placement="top-end">
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
		snsList
	} from '@/api/sns.js'
	export default {
		components: {
			tabBar,
			bubblePopups
		},
		data() {
			return {
				posts: [],
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
				current: 1,
				size: 10,
				list: [], // 考试列表

			};
		},
		onLoad() {
			this.getList();
		},
		mounted() {

			uni.getStorage({
				key: 'posts',
				success: function(res) {
					console.log(res.data);
					this.posts = res.data;
				}
			});

		},

		methods: {
			getList() {
				this.loadStatus = 'loading';
				this.$http.post(snsList, {
					examDate: this.examDate,
					examStatus: this.examStatus,
					// firstMenuId: this.firstMenuId
					province: this.province,
					// secondMenuId: this.secondMenuId,
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
			handleTap(e){
				this.positionY = e.detail.y - this.scrollTop
				this.popShow = true;
			},
			goDetail:function() {
				uni.navigateTo({
					url: "/pages/module/circleDetail/index"
				})
			},

		},
		
		onPageScroll(e) {
			console.log(e)
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
					height: 30rpx;

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

			.toolbar {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 24rpx 0;

			}

			.toolbar .left {
				width: 400rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

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

			.toolbar .right {
				display: flex;
				justify-content: space-between;
				align-items: center;
				background-color: transparent;
				border: none;
				
				&::after{
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
</style>
