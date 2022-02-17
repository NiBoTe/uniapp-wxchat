<template>
	<scroll-view scroll-y="true" class="high-score">
		<view class="top">
		 <scroll-view class="h-tabs" scroll-x="true">
			<view class="tabs-content">
				 <view class="item" v-for="(item,index) in list" :class="tabActive === index ? 'active':''" @click="handelTabs(index)" :key="index">
					 {{ item.name }}
				 </view>
			</view>
		 </scroll-view>
		 <drawingColumn ref="DrawingColumn" @change="tabChange"></drawingColumn>
		 <view class="line">
			
		 </view>
		 <view class="p-v">
			<view class="l">
				色彩作品
			</view>
			<view class="r">
				<view class="p-v-tabs">
					<view class="p-item active">
						图片
					</view>
					<view class="p-item">
						视频
					</view>
				</view>
			</view>
		 </view>
	 </view>
	 
	 <view class="masonry">
	 	<view class="item" v-for="item in 10" :key="item">
	         <view class="item-content">
	 			<view class="img-top">
	 				<image src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.huabanimg.com%2Fece15ac7ba2b1ef636fafa442d52094b50b380ed10fc4-qTLBgA_fw658&refer=http%3A%2F%2Fhbimg.huabanimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647232123&t=a787c7d892951e030ca1040e4efacaed" mode="widthFix"></image>
					<view class="tags">
						¥299
					</view>
				</view>
				<view class="user-info">
					<view class="head">
						<view class="head-out">
							<image src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2Fd8%2Fb7%2F36%2Fd8b736f5168f2a98667bce3d7ad3e5ed.jpeg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647235323&t=05386371b5770201011c3b0dd5711f55" mode="widthFix"></image>
						</view>
					</view>
					<view class="name">
						刘泉海·LQH
					</view>
				</view>
				<view class="hot">
					<view class="h-l">
						热度值
					</view>
					<view class="h-r">
						<image src="../../../static/public/hot.png" mode=""></image>
						809w
					</view>
				</view>
	         </view>
	     </view>
	 </view>
	</scroll-view>
</template>

<script>
	import drawingColumn from '@/components/drawingColumn/drawingColumn.vue'
	export default {
		components:{
			drawingColumn
		},
		data() {
			return {
				list: [{
						name: '色彩'
					}, {
						name: '素描'
					}, {
						name: '速写'
					},
					{
						name: '设计'
					},
					{
						name: '创意'
					},
					{
						name: '国画'
					}],
					current: 0,
					tabActive: 0
			};
		},
		created() {


		},
		mounted() {
				this.$refs.DrawingColumn.timeShow(['静物色彩','人物色彩'])		
		},
		methods: {
			handelTabs(a){
				console.log(a)
				this.tabActive = a
			},
			tabChange(){
				
			}
		}
	}
</script>

<style lang="scss">
	.high-score{
		height: 100vh;
		background: #F3F3F3;
		.top{
			background: #FFFFFF;
		}
	}
	.h-tabs{
		width: 100vw;
		padding-left: 34rpx;
		margin-bottom: 42rpx;
		.tabs-content{
			width: 100%;
			 white-space:nowrap;
			.item{
				white-space:nowrap;
				display: inline-block;
				margin-right: 68rpx;
				position: relative;
				padding-top: 12rpx;
				padding-bottom: 12rpx;
				font-size: 34rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #9E9E9E;
			}
			.active{
				font-size: 34rpx;
				font-family: PingFang-SC-Bold, PingFang-SC;
				font-weight: bold;
				color: #1B1B1B;
				&::after{
					content: '';
					position: absolute;
					width: 100%;
					height: 6rpx;
					background-color: #2C3AFF;
					bottom: 0rpx;
					left: 0;
				}
			}
		}
	}
	.line{
		width: 100%;
		height: 2px;
		background-color: #E9E9E9;
		margin: 38rpx 0;
	}
	.p-v{
		display: flex;
		.l{
			flex: 1;
			line-height: 1;
			font-size: 34rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #3A3D71;
			padding-left: 32rpx;
			padding-bottom: 38rpx;
		}
		.r{
			flex: 1;
			.p-v-tabs{
				margin-top: -13rpx;
				width: 204rpx;
				height: 56rpx;
				background: #F3F3F3;
				border-radius: 28rpx;
				float: right;
				margin-right: 32rpx;
				display: flex;
				.p-item{
					text-align: center;
					flex: 1;
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #9E9E9E;
					line-height: 54rpx;
				}
				.active{
					width: 98rpx;
					height: 48rpx;
					background: #FFFFFF;
					border-radius: 24rpx;
					margin-top: 4rpx;
					margin-left: 4rpx;
					line-height: 50rpx;
					font-size: 28rpx;
					font-family: PingFang-SC-Heavy, PingFang-SC;
					font-weight: 800;
					color: #3A3D71;
				}
			}
		}
	}
.masonry {
    column-count: 2;
    column-gap: 0;
	padding: 30rpx 29rpx;
	
	.item {
		background: #FFFFFF;
		border-radius: 16rpx;
	    break-inside: avoid;
	    box-sizing: border-box;
	    padding: 0 5rpx;
		margin-bottom: 10rpx;
		overflow: hidden;
		.item-content{
			width: 100%;
			.img-top{
				width: 100%;
				position: relative;
				border-bottom: 1rpx solid red;
				image{
					width: 100%;
				}
				.tags{
					// width: 88rpx;
					height: 40rpx;
					background: rgba(0, 0, 0, 0.5);
					border-radius: 16rpx 0rpx 0rpx 0rpx;
					position: absolute;
					bottom: 0;
					right: 0;
					font-size: 26rpx;
					font-family: PingFang-SC-Heavy, PingFang-SC;
					font-weight: 800;
					color: #FFFFFF;
					line-height: 40rpx;
					text-align: center;
					padding: 0 10rpx;
				}
			}
			.user-info{
				position: relative;
				z-index: 1;
				margin-top: -16rpx;
				display: flex;
				.head{
					flex: 0 0 108rpx;
					.head-out{
						width: 74rpx;
						height: 74rpx;
						background: #FFFFFF;
						margin: 0 auto;
						border-radius: 50%;
						padding: 4rpx;
						overflow: hidden;
						image{
							width: 100%;
							border-radius: 50%;
						}
					}
				}
				.name{
					z-index: 10;
					flex: 1;
					font-size: 24rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #3A3D71;
					padding-top: 16rpx;
				}
			}
			.hot{
				
				margin-top: 20rpx;
				padding-bottom: 25rpx;
				display: flex;
				.h-l{
					flex: 0 0 108rpx;
					text-align: center;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #9E9E9E;
				}
				.h-r{
					text-align: right;
					padding-right: 20rpx;
					flex: 1;
					image{
						width: 24rpx;
						height: 30rpx;
						vertical-align: sub;
						margin-right: 8rpx;
						margin-left: 8rpx;
					}
					height: 24rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #3A3D71;
				}
			}
		}
		
	}
}
</style>
