<template>
	<view class="teaching-material-detail">
		<scroll-view scroll-y class="content">
		<view class="head">
			<view class="img">
				<image src="https://img1.baidu.com/it/u=137044454,4224140026&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" mode=""></image>
			</view>
			<text class="name">刘泉海·LHQ</text>
			<image class="like" src="../../../static/public/like_start.png" alt="">
		</view>
		<view class="parameter">
			<view class="com hot">
				<image class="icon" src="../../../static/public/highScore/hot.png" mode=""></image>
				<view class="com-in">
					<text class="name">
						热度值
					</text>
					<text class="content">
						809万
					</text>
				</view>
				
			
			</view>
			<view class="com num">
				<image class="icon" src="../../../static/public/highScore/shopCat.png" mode=""></image>
				<view class="com-in">
					<text class="name">
						热度值
					</text>
					<text class="content">
						809万
					</text>
				</view>
			</view>
			
			<view class="price"><text>¥</text>299</view>
		</view>
		<view class="line"></view>
		<view class="tro">
			<view class="title">西方人物色彩赏析</view>
			<text class="pre">西方人物/室外风景色彩赏析，展示了古西方西方人物/室外风景色彩赏析，展示了古西方西方人物/室外风景色彩赏析，展示了古西方</text>
		</view>
		<view class="swiper">
			<view class="swiper-item" :class="{'active':activeIndex === index}" v-for="(item, index) in 10" @click="handleClick(index)">
				<image src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F4k%2Fs%2F02%2F2109242332225H9-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648733409&t=90c4ab51cbe0340472155652f1dc5b26" mode=""></image>
			</view>
		</view>
		
		
		<view class="works">
			<image src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F4k%2Fs%2F02%2F2109242332225H9-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648733409&t=90c4ab51cbe0340472155652f1dc5b26" mode=""></image>
		</view>
		
		<view class="tabs">
			特效可编辑画面效果 
			<view class="tabs-in">
				<view class="left coms tabs-active">
					原图
				</view>
				<view class="right coms">
					特效
				</view>
			</view>
		</view>
		
		<view class="line"></view>
		
		<view class="description">
			<view class="title">
				<image src="../../../static/public/examinationPaper_icon.png" mode=""></image>作品描述
			</view>
			<view class="d-c">
				西方人物/室外风景色彩赏析，展示了古西方西方人物/室外风景色彩赏析，展示了古西方西方人物/室外风景色彩赏析，展示了古西方西方人物/室外风景色彩赏析，展示了古西方
			</view>
		</view>
		
		
		<view class="line"></view>
		
		<view class="delivery-content">
			<view class="left">
				<image src="../../../static/public/highScore/deliveryContent.png" mode=""></image>发货内容
			</view>
			<view class="right">
				教材一本
			</view>
		</view>
		
		</scroll-view >
		<view class="footer">
			<view class="footer-btn">立即购买</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex: 0 
			};
		},
		methods:{
			handleClick(index){
				this.activeIndex = index
			}
		}
	}
</script>

<style lang="scss">
	.teaching-material-detail{
		display: flex;
		flex-direction: column;
		height: 100vh;
		.parameter{
			position: relative;
			margin-top: 32rpx;
			.com{
				display: inline-block;
				.icon{
					width:80rpx;
					height: 74rpx;
					display: inline-block;
					vertical-align: sub;
				}
				.com-in{
					display: inline-block;
					text{
						display: block;
					}
					.name{
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #9E9E9E;
						line-height: 28rpx;
					}
					.content{
						margin-top: 6rpx;
						font-size: 28rpx;
						font-family: Helvetica;
						color: #3A3D71;
						line-height: 28rpx;
					}
				}
			}
			.hot{
				margin-left: 34rpx;
			}
			.num{
				margin-left: 40rpx;
			}
			.price{
				position: absolute;
				right: 32rpx;
				bottom: 0;
				font-size: 52rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				color: #EF2E3B;
				text{
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
		.content{
			flex: 1;
			overflow: auto;
			.head{
				position: relative;
				.img{
					margin: 0 32rpx;
					display: inline-block;
					vertical-align: middle;
					image{
						border-radius: 50%;
						width: 132rpx;
						height: 132rpx;
					}
				}
				.name{
					font-size: 36rpx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: #1B1B1B;
				}
				.like{
					position: absolute;
					right: 34rpx;
					top: 46rpx;
					width: 44rpx;
					height: 44rpx;
				}
			}
		}
		.footer{
			flex: 0 0 240rpx;
			border-top: 1rpx solid #EDEDED;
			.footer-btn{
				width: 682rpx;
				height: 88rpx;
				background: #2C3AFF;
				box-shadow: 0px 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
				border-radius: 44rpx;
				text-align: center;
				margin: 24rpx auto 0;
				font-size: 32rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 88rpx;
			}
		}
		.tro{
			padding: 0 34rpx;
			.title{
				font-size: 28rpx;
				font-family: Helvetica;
				color: #3A3D71;
			}
			.pre{
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
		.swiper{
			margin-top: 10rpx;
			width: 100vw;
			padding: 40rpx 34rpx;
			overflow-x: scroll;
			white-space:nowrap;
	
			.swiper-item{
				margin-right: 26rpx;
				display: inline-block;
				image{
					width: 134rpx;
					height: 158rpx;
					border-radius: 5px;
				}
			}
			.active{
				image{
					transform:scale(1.2)
				}
			}
		}
		.works{
			padding: 0 34rpx;
			image{
				width: 100%;
			}
		}
		.tabs{
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
			.tabs-in{
				width: 216rpx;
				height: 76rpx;
				background: #F3F3F3;
				border-radius: 46rpx;
				position: absolute;
				right: 34rpx;
				top: 0;
				display: flex;
				padding: 8rpx;
				.left{
				  flex: 1;
				}
				.right{
					flex: 1;
					
				}
				.coms{
					width: 100rpx;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
				}
				.tabs-active{
					background: #FFFFFF;
					border-radius: 36rpx;
				}
			}
		}
		.description{
			padding: 0 34rpx;
			.title{
				image{
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
			.d-c{
				font-size: 26rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #3A3D71;
				line-height: 36rpx;
			}
		}
		.delivery-content{
			padding: 0 34rpx;
			display: flex;
			.left{
				flex: 1;
				image{
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
			.right{
					flex: 1;
					text-align: right;
			}
		}
	}
</style>
