<template>
	<view class="studentDetail">
		<view class="navbar">
			<u-navbar title="个人信息" back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>
		
		<view class="header u-flex">
			<view class="header-img">
				<view class="default u-flex u-row-center">
					<image :src="setSrc('myApplication/user.png')"></image>
				</view>
				<!-- <image src="https://img0.baidu.com/it/u=1721391133,702358773&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=625"></image> -->
			</view>
			
			<view class="header-main">
				<view class="name u-flex u-row-between">
					<text>王梦琦</text>
					<view class="update u-flex u-row-center" @click="updateTap">
						<image :src="setSrc('myApplication/update.png')"></image>
						<text>修改信息</text>
					</view>
				</view>
				
				<view class="text u-flex">
					<text>性别</text>
					<image :src="setSrc('myApplication/woman.png')"></image>
					<text>女</text>
				</view>
				
				<view class="text u-flex">
					<text>手机号：18561945135</text>
				</view>
				
				<view class="text u-flex">
					<text>身份证号：331045199608260</text>
				</view>
			</view>
		</view>
		<u-gap height="16" bg-color="#F7F7F7"></u-gap>
		
		<view class="list">
			<view class="item u-flex u-row-between">
				<view class="left">报名状态</view>
				<view class="right">
					<text class="nopay">未支付</text>
				</view>
			</view>
			<view class="item u-flex u-row-between">
				<view class="left">考生来源</view>
				<view class="right">
					<text>浙江省杭州市</text>
				</view>
			</view>
			<view class="item u-flex u-row-between">
				<view class="left">报名时间</view>
				<view class="right">
					<text>2021.08.28</text>
				</view>
			</view>
			
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			updateTap(){
				uni.navigateTo({
					url: '/pages/centers/achievement/updateStudent'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.studentDetail{
		.navbar {
			background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png');
			background-size: cover;
		}
		
		.header{
			
			margin: 40rpx 32rpx 40rpx 28rpx;
			&-img{
				width: 150rpx;
				height: 210rpx;
				border-radius: 12rpx;
				overflow: hidden;
				& > image{
					width: 100%;
					height: 100%;
				}
				
				.default{
					width: 100%;
					height: 100%;
					background: #F3F3F3;
					
					image{
						width: 104rpx;
						height: 114rpx;
					}
				}
			}
			
			&-main{
				margin-left: 38rpx;
				flex: 1;
				
				.name{
					& > text{
						font-size: 36rpx;
						font-weight: bold;
						color: #3A3D71;
					}
					
					.update{
						width: 190rpx;
						height: 68rpx;
						background: #F3F3F3;
						border-radius: 34px;
						image{
							width: 24rpx;
							height: 24rpx;
						}
						text{
							margin-left: 10rpx;
							font-size: 24rpx;
							color: #1B1B1B;
						}
					}
				}
				
				.text{
					
					text{
						font-size: 26rpx;
						color: #3A3D71;
					}
					
					image{
						margin: 0 8rpx 0 2rpx;
						width: 40rpx;
						height: 40rpx;
					}
				}
			}
		}
	
	
	
		
		.list{
			.item{
				
				margin: 0 34rpx 0 28rpx;
				padding: 28rpx 0;
				border-bottom: 2rpx solid #E9E9E9;
				.left{
					font-size: 26rpx;
					color: #3A3D71;
				}
				
				.right{
					
					
					text{
						font-size: 26rpx;
						color: #3A3D71;
						
						&.nopay{
							color: $u-type-primary;
						}
						
						&.success{
							color: #35CE96;
						}
					}
				}
				
				&:last-of-type{
					border-bottom: none;
				}
			}
		}
	
	}

</style>
