<template>
	<view>
		<tab-bar :selected="1"></tab-bar>
		<view class="list-view">
			<view class="item">
				<view class="item-top">
					<view class="userInfo">
						<view class="logo">
							<image src="../../../static/public/home_tab01.png"></image>
						</view>
						<view class="name">
							双色球
						</view>

					</view>
					<view class="right" @click="handleTap">
						<image src="/static/public/dynamic_menu.png"></image>
					</view>
				</view>
				<view class="paragraph">i精华粉底i if hi额IE挂号费i返回个i合肥i额接口设备不好不喝酒不急不急不急不急不急不急急不急不</view>
				<!-- 照片 -->
				<view class="thumbnails">
					<view :class="snsImgs.length === 1?'my-gallery':'thumbnail'"
						v-for="(image, index_images) in snsImgs" :key="index_images">
						<image class="gallery_img" lazy-load mode="aspectFill" :src="image.thumbImg" :data-src="image.thumbImg"
							@tap="previewImage(snsImgs,index_images)"></image>
					</view>
				</view>

			</view>


		</view>
		
		<hb-comment ref="hbComment" @add="add" @del="del" @like="like" @focusOn="focusOn" :deleteTip="'确认删除？'"
		    :cmData="commentData" v-if="commentData"></hb-comment>

	</view>
</template>

<script>
	import tabBar from '@/components/tabbar/tabbar.vue'
	import {
		snsList
	} from '@/api/sns.js'
	
	export default {
		components: {
			tabBar
		},
		data() {
			return {
				posts: [],
				snsImgs: [
					{
						thumbImg: 'https://top-face-detect.oss-cn-shanghai.aliyuncs.com/19720734.jpg'
					}
				],
				// data: postData,//模拟数据
				commentData: {}


			};
		},
		onLoad() {
			this.getComment();
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
			
			getComment() {
				let res = {
					"readNumer": 193,
					"commentList": [{
							"id": 1,
							"owner": false,
							"hasLike": false,
							"likeNum": 2,
							"avatarUrl": "https://inews.gtimg.com/newsapp_ls/0/13797755537/0",
							"nickName": "超长昵称超长...",
							"content": "啦啦啦啦",
							"parentId": null,
							"createTime": "2021-07-02 16:32:07"
						},
						{
							"id": 2,
							"owner": false,
							"hasLike": false,
							"likeNum": 2,
							"avatarUrl": "https://inews.gtimg.com/newsapp_ls/0/13797761970/0",
							"nickName": "寂寞无敌",
							"content": "我是评论的评论我是评论的评论我是评论的评论我是评论的评论我是评论的评论我是评论的评论我是评论的评论我是评论的评论我是评论的评论我是评论的评论我是评论的评论我是评论的评论我是评论的评论我是评论的评论我是评论的评论我是评论的评论我是评论的评论我是评论的评论",
							"parentId": 1,
							"createTime": "2021-07-02 17:05:50"
						},
						{
							"id": 4,
							"owner": true,
							"hasLike": true,
							"likeNum": 1,
							"avatarUrl": "https://inews.gtimg.com/newsapp_ls/0/13797763270/0",
							"nickName": "name111",
							"content": "评论啦啦啦啦啦啦啦啦啦啦",
							"parentId": null,
							"createTime": "2021-07-13 09:37:50"
						},
						{
							"id": 5,
							"owner": false,
							"hasLike": false,
							"likeNum": 0,
							"avatarUrl": "https://inews.gtimg.com/newsapp_ls/0/13797755537/0",
							"nickName": "超长昵称超长...",
							"content": "超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论",
							"parentId": null,
							"createTime": "2021-07-13 16:04:35"
						},
						{
							"id": 13,
							"owner": false,
							"hasLike": false,
							"likeNum": 0,
							"avatarUrl": "https://inews.gtimg.com/newsapp_ls/0/13797755537/0",
							"nickName": "超长昵称超长...",
							"content": "@寂寞无敌 你怕不是个大聪明",
							"parentId": 1,
							"createTime": "2021-07-14 11:01:23"
						}
					]
				};
				this.commentData = {
					"readNumer": res.readNumer,
					"commentSize": res.commentList.length,
					"comment": this.getTree(res.commentList)
				};
			},
			
			getTree(data) {
				let result = [];
				let map = {};
				data.forEach(item => {
					map[item.id] = item;
				});
				data.forEach(item => {
					let parent = map[item.parentId];
					if (parent) {
						(parent.children || (parent.children = [])).push(item);
					} else {
						result.push(item);
					}
				});
				return result;
			}
			

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

			

		}
	}


	
</style>
