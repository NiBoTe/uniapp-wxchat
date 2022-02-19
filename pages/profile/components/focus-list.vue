<template>
	<view class="fans-container">
		<view class="item-list" v-for="(item,index) in list" :key="index">
				<view class="pic">
					<view class="pic-inner">
						<image class="u-row-between" :src="item.imgSrc" mode=""></image>
						<image v-if="item.isMember" class="v-logo" src="../../../static/public/auth.png" mode=""></image>
					</view>
				</view>
				<view class="desc u-row-between u-flex">
					<view class="name">刘海泉</view>
					<view class="btn" v-if="item.isFocus">
						<text>取消关注</text>
					</view>
					<view class="btn" v-else>
						<text>关注</text>
					</view>
				</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{
						isFocus:1,
						isMember:1,
						imgSrc:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2F2021%2Fedpic%2Fc4%2F9f%2F09%2Fc49f090757360f843141fe2bab2cfc8f_1.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647793980&t=e85a67d946fa91e04f741b20f0571354"
					},
					{
						isFocus:1,
						isMember:0,
						imgSrc:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2Fa2%2F20%2F77%2Fa22077cf0c937330544a02ea28c75fa3.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647793980&t=9bb3c0f2f827a734e7cbd98929430fd4"
					},
					{
						isFocus:1,
						isMember:1,
						imgSrc:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2F54%2F45%2Ffe%2F5445fee00862d5d3bc93488d42da0c22.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647793980&t=dd9ebc7b0f9343b4943703c59a01b9e5"
					},
					{
						isFocus:1,
						isMember:0,
						imgSrc:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2F07%2F57%2F16%2F075716aa6b6789a525601109f1c4e0d1.jpeg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647793980&t=5ca7cba30a0e2a41bcc698f6a42fc716"
					},{
						isFocus:1,
						isMember:1,
						imgSrc:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic_source%2F84%2F69%2Fa9%2F8469a992634242df4291b3265f9f2a38.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647793980&t=69245dbb2947b65a8d313c827b888599"
					},
					{
						isFocus:1,
						isMember:1,
						imgSrc:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2F2021%2Fedpic_source%2F98%2Fa1%2Ff2%2F98a1f2c0fd0b7005d32ddeae98bde8c4_16.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647793980&t=a4dee8f18e128221fdf35e23c7c26d13"
					},{
						isFocus:1,
						isMember:1,
						imgSrc:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2F2021%2Fedpic%2Fc4%2F9f%2F09%2Fc49f090757360f843141fe2bab2cfc8f_1.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647793980&t=e85a67d946fa91e04f741b20f0571354"
					},
					{
						isFocus:1,
						isMember:1,
						imgSrc:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2F2021%2Fedpic%2Fc4%2F9f%2F09%2Fc49f090757360f843141fe2bab2cfc8f_1.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647793980&t=e85a67d946fa91e04f741b20f0571354"
					},
					{
						isFocus:1,
						isMember:1,
						imgSrc:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2F2021%2Fedpic%2Fc4%2F9f%2F09%2Fc49f090757360f843141fe2bab2cfc8f_1.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647793980&t=e85a67d946fa91e04f741b20f0571354"
					},
					{
						isFocus:1,
						isMember:1,
						imgSrc:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2F2021%2Fedpic%2Fc4%2F9f%2F09%2Fc49f090757360f843141fe2bab2cfc8f_1.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647793980&t=e85a67d946fa91e04f741b20f0571354"
					}
				]
			};
		}
	}
</script>

<style lang="scss">
		
	.fans-container{
		.item-list{
			height: 165rpx;
			display: flex;
			.pic{
				width: 170rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				.pic-inner{
					position: relative;
					image{
						border-radius: 50%;
						width: 116rpx;
						height: 116rpx;
					}
					.v-logo{
						position: absolute;
						right:0;
						bottom: 0;
						width:42rpx;
						height: 42rpx;
					}
				}
			}
			.desc{
				flex:1;
				border-bottom: 2rpx solid #E9E9E9;
				padding-right: 40rpx;
				.name {
					font-size: 14rpx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: #3A3D71;
				}
				.btn {
					width: 134rpx;
					height: 58rpx;
					background: #FFFFFF;
					border-radius: 30rpx;
					border: 2rpx solid #C8C8C8;
					text-align: center;
					line-height: 50rpx;
					text{
						font-size: 12rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #9C9C9C;
					}
				}
			}
		}
	}
	
</style>
