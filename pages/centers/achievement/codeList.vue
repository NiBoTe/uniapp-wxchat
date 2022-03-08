<template>
	<view class="codeList">
		<view class="navbar">
			<u-navbar title="二维码信息" back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>
		
		
		<view class="content">
			<view class="list">
				<view class="item u-flex">
					<view class="item-code">
						<image src="https://img2.baidu.com/it/u=1814268193,3619863984&fm=253&fmt=auto&app=138&f=JPEG?w=632&h=500"></image>
					</view>
					
					<view class="item-main">
						<view class="item-text">准考证号：E0000026779</view>
						<view class="item-text">考试地址：杭州白塔岭</view>
						<view class="item-text">姓名：朱明一</view>
						<view class="item-text">科目：色彩</view>
						<view class="item-text">考场：29</view>
					</view>
				</view>
				
				<view class="item u-flex">
					<view class="item-code">
						<image src="https://img2.baidu.com/it/u=1814268193,3619863984&fm=253&fmt=auto&app=138&f=JPEG?w=632&h=500"></image>
					</view>
					
					<view class="item-main">
						<view class="item-text">准考证号：E0000026779</view>
						<view class="item-text">考试地址：杭州白塔岭</view>
						<view class="item-text">姓名：朱明一</view>
						<view class="item-text">科目：色彩</view>
						<view class="item-text">考场：29</view>
					</view>
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
		}
	}
</script>

<style lang="scss" scoped>
	.codeList{
		
		min-height: 100vh;
		background-color: #F3F3F3;
		.navbar {
			background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png');
			background-size: cover;
		}
		
		
		.content{
			.list{
				.item{
					margin: 28rpx 36rpx 0 34rpx;
					padding: 28rpx 34rpx 30rpx 32rpx;
					background: #FFFFFF;
					border-radius: 24rpx;
					&-code{
						margin-right: 24rpx;
						image{
							width: 206rpx;
							height: 206rpx;
						}
					}
					
					&-main{
						.item-text{
							margin-top: 8rpx;
							font-size: 24rpx;
							color: #3A3D71;
							
							&:first-of-type{
								margin-top: 0;
							}
						}
					}
				}
			}
		}
		
	}

</style>
