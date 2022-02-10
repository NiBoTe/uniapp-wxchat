<template>
	<view>
		<tab-bar :selected="1"></tab-bar>
		
		<u-navbar title="广场" :background="background" :border-bottom="false"
			title-color="#333" :is-back="false">
		</u-navbar>
		<view class="list-view">
			<view class="item" v-for="(item,index) in posts" :key="index">
				<view class="item-top">
					<view class="userInfo">
						<view class="logo">
							<image :src="item.header_image" mode=""></image>
						</view>
						<view class="name">
							{{item.username}}
						</view>
						
					</view>
					<view class="right" @tap="popShow =! popShow">
						<image src="../../static/public/dynamic_menu.png" mode=""></image> 
					</view>
				</view>
				<view class="paragraph">{{item.content.text}}</view>
				<!-- 照片 -->
				<view class="thumbnails">
					<view :class="item.content.images.length === 1?'my-gallery':'thumbnail'" v-for="(image, index_images) in item.content.images" :key="index_images">
						<image class="gallery_img" lazy-load mode="aspectFill" :src="image" :data-src="image" @tap="previewImage(item.content.images,index_images)"></image>
					</view>
				</view>
				<!-- 点赞、收藏 分享 -->
				<view class="toolbar">
					<view class="left">
						<view class="tool-item">
							<image src="../../static/public/dynamic_praise.png" mode=""></image>
							<view class="num">
								333
							</view>
						</view>
						<view class="tool-item">
							<image src="../../static/public/dynamic_praise.png" mode=""></image>
							<view class="num">
								333
							</view>
						</view>
						<view class="tool-item">
							<image src="../../static/public/dynamic_praise.png" mode=""></image>
							<view class="num">
								333
							</view>
						</view>
					</view>
					<view class="right">
						<view class="tool-item">
							<image src="../../static/public/dynamic_praise.png" mode=""></image>
							<view class="num">
								分享
							</view>
						</view>
					</view>

				</view>
				
		
			</view>

		</view>
		
		<bubblePopups v-model="popShow" :popData="popData" :isTwoline="true" @tapPopup="tapPopup" :x="344" :y="20" placement="top-end">
			
		</bubblePopups>
	</view>
</template>

<script>
	import tabBar from '@/components/tabbar/tabbar.vue'
	import postData from '../../common/data.js';
	import bubblePopups from "@/components/bubblePopups/bubblePopups";
	export default {
		components:{
			tabBar,
			bubblePopups
		},
		data() {
			return {
				background: {
					background: "#fff",
				},
				posts: postData,
				popData:[
					{
						title:'举报',
						subTitle: '标题夸张，内容质量差、图片包含不良色情…',
						icon:'../../static/public/gantanhao.png',
					},
					{
						title:'不看：大超导师',
						icon:'../../static/public/jinzhi.png'
					}
				],
				popShow:false,
				
			};
		},
		mounted() {
			
			uni.getStorage({
				key: 'posts',
				success: function (res) {
					console.log(res.data);
					this.posts = res.data;
				}
			});
		
		},
		
		methods: {
		
			previewImage(imageList, image_index) {
				var current = imageList[image_index];
				uni.previewImage({
					current: current,
					urls: imageList
				});
			},
	
		}
	}
</script>

<style lang="scss" scoped>
	
	.list-view{
		margin-bottom: 24rpx;
		position: relative;
		.item{
			background-color: #fff;
			display: flex;
			align-items: center;
			flex-direction: column;
			padding: 24rpx 16rpx;
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
						width: 40px;
						height: 40px;
						border-radius: 40px;
						image{
							width: 100%;
							height: 100%;
							border-radius: 40px;
						}
					}
					.name {
						font-size: 16rpx;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #1B1B1B;
						margin-left: 12px;
					}
				}
				
				.right {
					width: 40rpx;
					height: 30rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
				
			}
			
			.paragraph {
				width: 100%;
				margin-top: 12rpx;
				font-size: 13rpx;
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
				width: 30%;
				height: 180upx;
				margin: 4upx;
				background: #757575;
				overflow: hidden;
			}
			
			.my-gallery{
				width: 250upx;
				height: 400upx;
				margin: 4upx;
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
					image{
						width: 35rpx;
						height: 35rpx;
					}
					.num {
						font-size: 13rpx;
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
				.tool-item {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					image{
						width: 35rpx;
						height: 35rpx;
					}
					.num {
						font-size: 13rpx;
						font-family: PingFang-SC-Medium, PingFang-SC;
						font-weight: 500;
						color: #3A3D71;
						margin-left: 6px;
					}
				}
			}
			
			
			

			
			
			
			
			
			
			
			
	
		}
	}

</style>
