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
					<view class="right" @tap="share">
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
		
		<uni-popup ref="popup" type="bottom" :maskClick="false">
			<view class="pop-content">
				<view class="head">
					请选择分享平台
				</view>
				<view class="pop-content-view">
					<scroll-view scroll-x="true" style="white-space: nowrap; vertical-align: middle;" show-scrollbar="true">
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
				shareData:[
					{
						title:'微信',
						icon:'../../static/public/wexin.png',
					},
					{
						title:'朋友圈',
						icon:'../../static/public/pengyouquan.png'
					},
					{
						title:'微博',
						icon:'../../static/public/weibo.png'
					},
					{
						title:'QQ',
						icon:'../../static/public/qq.png'
					},
					{
						title:'QQ空间',
						icon:'../../static/public/kongjian.png'
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
			
			share(){
				this.$refs.popup.open();
			},
		
			previewImage(imageList, image_index) {
				var current = imageList[image_index];
				uni.previewImage({
					current: current,
					urls: imageList
				});
			},
			

			
			cancelShare() {
				this.$refs.popup.close();
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
						image{
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
					image{
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
			
			.my-gallery{
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
					image{
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
				.tool-item {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					image{
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
		.pop-content-view{
			display: flex;
			align-items: center;
			justify-content: space-around;
			padding: 12rpx 0 34rpx 0;
	
			.pop-content-item{
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;
				width: 150rpx;
				display: inline-block;
				margin-right: 24rpx;
				.item-img{
					text-align: center;
					width: 98rpx;
					height: 98rpx;
					margin-left: 26rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
				
				.item-title{
					margin-top: 20rpx;
					font-size: 28rpx;
					font-family: PingFang SC Regular, PingFang SC Regular-Regular;
					font-weight: 400;
					color: #333333;
					text-align: center;
				}
			}
			
		}
		
		.bottom-button{
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
