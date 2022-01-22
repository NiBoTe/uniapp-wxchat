<template>
	<view class="top-score-list">
		<view class="list">
			<view class="item" v-for="item in 5">
				<view class="img">
					<image src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.jj20.com%2Fup%2Fallimg%2Fmn02%2F091920214K9%2F200919214K9-0.jpg&refer=http%3A%2F%2Fpic.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645428610&t=56d0c75b078ec6256e1adda5e2e56c06"></image>
				</view>
				<view class="bottom">
					<view class="text">
						杭州白塔岭富阳校区
					</view>
					<view class="operation">
						<u-icon name="eye" color="#3A3D71" size="30"></u-icon><view class="num">8.5万次</view>
						<view class="start">
							<image class="start-img" src="../../../static/public/dynamic_star.png" mode=""></image>
						</view>
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		components:{
			
		},
		data() {
			
			}
		}
</script>
<style lang="scss">
	.top-score-list{
		background: #F3F3F3;
		.list{
			padding: 28rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			.item{
				margin-bottom: 28rpx;
				width: 49%;
				height: 560rpx;
				background: #FFFFFF;
				border-radius: 16rpx;
				overflow: hidden;
				.img{
					width: 100%;
					height: 440rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.bottom{
					padding-left: 26rpx;
					.text{
						margin-top: 16rpx;
						font-size: 24rpx;
						font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;
						color: #888C90;
						line-height: 24rpx;
					}
					.operation{
						margin-top: 22rpx;
						position: relative;
						.start{
							position: absolute;
							right: 24rpx;
							top: 4rpx;
							width: 34rpx;
							height: 34rpx;
							.start-img{
								width: 100%;
								height: 100%;
							}
						}
						.num{
							display: inline-block;
							font-size: 24rpx;
							font-family: PingFang-SC-Medium, PingFang-SC;
							font-weight: 500;
							color: #3A3D71;
							margin-left: 16rpx;
						}
					}
				}
			}
		}
	}
</style>