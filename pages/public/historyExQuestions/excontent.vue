<template>
	<view class="exdetail">
		<scroll-view class="top" scroll-y="true" >
		
			<view class="name">
				考试名称
			</view>
			<view class="subjects">
				科目
			</view>
			<view class="list">
				<view class="left">
					考试题目：
				</view>
				<view class="right">
					素描临摹
				</view>
			</view>
			<view class="list">
				<view class="left">
					考试要求：
				</view>
				<view class="right">
					人物半身像随意创作性别年龄大小种族不限，西方人物室外风景色彩赏析，试题内容人物半身像随意创作性别年龄大小种族不限，西方人物室外风景色彩赏析，试题内容人物半身像随意创作性别年龄大小种族不限，西方人物室外风景色彩赏析，试题内容人物半身像随意创作性别年龄大小种族不限，西方人物室外风景色彩赏析。
				</view>
			</view>
			
			<view class="list">
				<view class="left">
					考试图片：
				</view>
				<view class="right img-list">
					<view class="img-item" v-for="item in 8">
						<image src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic_source%2Fc7%2F8a%2F03%2Fc78a030abf9940543004b4fea7ef3902.jpeg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645421794&t=40425aa1ca0f932e47437f6f0aab5c84"></image>
					</view>
					   <!-- <view class="placeholder"></view> -->
				</view>
			</view>
			
			<view class="list">
				<view class="left">
					备注：
				</view>
				<view class="right">
					人物半身像随意创作性别年龄大小种族不限，
				</view>
			</view>
			

		</scroll-view>
		<view class="bottom">
			<view class="button">
				高分试卷
			</view>
		</view>
		
	</view>
</template>
<script>
	export default {
		components:{
			
		},
		data() {}
		}
</script>
<style lang="scss">
	.exdetail{
		height: 100vh;
			
		.top{
			height: calc(100vh - 170rpx);
		}
		.bottom{
			position: relative;
			height: 170rpx;
			border-top: 1px solid #EDEDED;;
		}
	}
	.name{
		text-align: center;
		font-size: 30rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #3A3D71;
		line-height: 30rpx;
		margin-top: 30rpx;
	}
	.subjects{
		text-align: center;
		font-size: 34rpx;
		font-family: PingFang-SC-Bold, PingFang-SC;
		font-weight: bold;
		color: #3A3D71;
		line-height: 34rpx;
		margin-top: 20rpx;
	}
	.list{
		margin-top: 30rpx;
		display: flex;
		.left{
			font-size: 26rpx;
			font-family: PingFang-SC-Bold, PingFang-SC;
			font-weight: bold;
			color: #3A3D71;
			line-height: 30rpx;
			flex:0 0 160rpx;
			padding-left: 28rpx;
		}
		.right{
			flex: 1;
			font-size: 26rpx;
			font-family: PingFang-SC-Regular, PingFang-SC;
			font-weight: 400;
			color: #3A3D71;
			line-height: 36rpx;
			padding-right: 10rpx;
		}
		.img-list{
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
			justify-content: space-between;
			&:after {
			    display:block;
			    content:"";
			    width: 31%;
			    height:0px;
			}
			.img-item{
				// margin-right: 12rpx;
				width: 31%;
				image{
					width: 176rpx;
					height: 176rpx;
					
				}
			}
		}
	}
	.button{
		width: 682rpx;
		height: 88rpx;
		background: #2C3AFF;
		box-shadow: 0px 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
		border-radius: 44rpx;
		margin: 0 auto;
		position: absolute;
		top: 14rpx;
		left: 50%;
		transform: translateX(-50%);
		font-size: 32rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 88rpx;
		text-align: center;
	}
</style>