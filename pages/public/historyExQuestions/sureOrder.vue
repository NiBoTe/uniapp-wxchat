<template>
	<view class="sureOrder">
		<scroll-view class="top" scroll-y="true">
			<view class="top-t">
				<view class="operation">
					<view class="left">
						收货地址
					</view>
					<view class="right">
						<text>修改</text><u-icon name="arrow-right" color="#8A8A8A" size="28"></u-icon>
					</view>
				</view>
				<view class="user">
					<view class="tag">
						家
					</view>
					<view class="user-name">
						李培新
					</view>
					<view class="user-iphone">
						18566708963
					</view>
				</view>
				<view class="address">
					浙江省 杭州市 西湖区 转塘街道象山路贝
				</view>
				<view class="line">
					
				</view>
				
				<view class="parameter-list">
					商品名称 ：高分试卷
				</view>
				<view class="parameter-list">
					商品数量 ：1张
					<view class="price">
						¥<text>12.99</text>
					</view>
				</view>
			</view>
			<view class="block">
				
			</view>
		
			<view class="content">
				<u-checkbox-group>
					<u-checkbox v-model="checked" shape="circle">我已阅读并同意 <text class="agreement">《付费内容使用协议》</text> </u-checkbox>
				</u-checkbox-group>
			</view>

		</scroll-view>

		<view class="bottom">
			<button type="default" class="button">立即支付</button>
		</view>
	</view>
</template>
<script>
	export default {
		components:{

		},
		data() {
				checked: true
			}
		}
</script>
<style lang="scss">
	view{
		line-height: 1;
	}
	.sureOrder{
		height: 100vh;
		width: 100%;
		.top{
			height: calc(100vh - 204rpx);
			width: 100%;
			.top-t{
				padding: 28rpx 34rpx;
				.operation{
					display: flex;
					.left{
						flex: 1;
						font-size: 26rpx;
						font-family: Helvetica;
						color: #3A3D71;
					}
					.right{
						text-align: right;
						flex: 1;
						font-size: 26rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #9E9E9E;
					}
					margin-bottom: 28rpx;
				}
				
				.user{
					view{
						display: inline-block;
					}
					.tag{
						background: #EFF2FF;
						border-radius: 23rpx;
						padding: 10rpx 34rpx;
						font-size: 24rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #2C3AFF;
					}
					.user-name{
						margin-left: 24rpx;
						font-size: 28rpx;
						font-family: Helvetica;
						color: #3A3D71;
						line-height: 46rpx;
					}
					.user-iphone{
						margin-left: 26rpx;
						font-size: 26rpx;
						font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;
						color: #8F9091;
					}
				}
				.address{
					font-size: 26rpx;
					font-family: PingFang-SC-Regular, PingFang-SC;
					font-weight: 400;
					color: #3A3D71;
					margin-top: 22rpx;
				}
				.line{
					width: 100%;
					height: 2rpx;
					background: #E9E9E9;
					margin-top: 26rpx;
				}
				.parameter-list{
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #3A3D71;
					margin-top: 28rpx;
					position: relative;
					.price{
						position: absolute;
						right: 0rpx;
						top: 0rpx;
						text-align: right;
						font-size: 28rpx;
						font-family: PingFang-SC-Bold, PingFang-SC;
						color: #3A3D71;
						text{
							font-size: 40rpx;
							font-family: PingFang-SC-Heavy, PingFang-SC;
							font-weight: 800;
						}
					}
				}
			
			}
			.block{
				width: 100%;
				height: 16rpx;
				background: #F7F7F7
			}
			
			.content{
			padding: 28rpx 34rpx;
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #1B1B1B;
			.agreement{
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #2C3AFF;
			}
			}

		}
		.bottom{
			border-top: 1px solid #EDEDED;
			height: 204rpx;
			.button{
				margin: 0 auto;
				margin-top: 26rpx;
				width: 682rpx;
				height: 88rpx;
				background: #2C3AFF;
				box-shadow: 0rpx 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
				border-radius: 44rpx;
				font-size: 32rpx;
				line-height: 88rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
			}
		}
	}
</style>
