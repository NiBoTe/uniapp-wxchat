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
					<view class="btn btn-default" v-if="item.isFocus">
						<text>互相关注</text>
					</view>
					<view class="btn btn-focus" v-else>
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
						imgSrc:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2F2021%2Fedpic%2F13%2Fbe%2F6b%2F13be6bb93836e5e9325fe74f3130ac83_1.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647793980&t=8c06641a81b47a9e3910e60c3f18f1f5"
					},
					{
						isFocus:1,
						isMember:0,
						imgSrc:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic_source%2F96%2Ff8%2F13%2F96f8130862e21c41f22750a8d018415e.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647793980&t=45701bf9383fa0c0e7c1931c6b391f66"
					},
					{
						isFocus:0,
						isMember:1,
						imgSrc:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2F2a%2F69%2F8a%2F2a698a0186d70cd9a56ebd6fe1402f35.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647793980&t=7c1894798e8871a31103dc1354322204"
					},
					{
						isFocus:1,
						isMember:1,
						imgSrc:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2Ffa%2Fae%2F5f%2Ffaae5fe743248d37ef44201105100649.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647793980&t=c8ab54554aeea358b9a81d44497cedfe"
					},{
						isFocus:0,
						isMember:1,
						imgSrc:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic_source%2F84%2F69%2Fa9%2F8469a992634242df4291b3265f9f2a38.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647793980&t=69245dbb2947b65a8d313c827b888599"
					},
					{
						isFocus:1,
						isMember:0,
						imgSrc:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2F2021%2Fedpic_source%2F98%2Fa1%2Ff2%2F98a1f2c0fd0b7005d32ddeae98bde8c4_16.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647793980&t=a4dee8f18e128221fdf35e23c7c26d13"
					},{
						isFocus:0,
						isMember:1,
						imgSrc:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2Fe1%2F52%2F2f%2Fe1522faa11e66add399f0613b0b26c84.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647793980&t=068582c4d59bb2d982c6c6f212df6784"
					},
					{
						isFocus:1,
						isMember:1,
						imgSrc:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2F2021%2Fedpic%2Fc4%2F9f%2F09%2Fc49f090757360f843141fe2bab2cfc8f_1.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647793980&t=e85a67d946fa91e04f741b20f0571354"
					},
					{
						isFocus:1,
						isMember:0,
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
					border-radius: 30rpx;
					text-align: center;
					line-height: 50rpx;
					text{
						font-size: 12rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
					}
				}
				.btn-default{
					background: #FFFFFF;
					border: 2rpx solid #C8C8C8;
					font-weight: 400;
					color: #9C9C9C;
				}
				.btn-focus{
					background: #EFF2FF;
					color: #2C3AFF;
				}
			}
		}
	}
	
</style>
