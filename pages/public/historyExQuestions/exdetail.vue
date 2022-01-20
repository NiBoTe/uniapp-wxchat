<template>
	<view>
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
		
		<view class="button">
			高分试卷
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
	}
	.button{
		width: 682rpx;
		height: 88rpx;
		background: #2C3AFF;
		box-shadow: 0px 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
		border-radius: 44rpx;
		margin: 0 auto;
		position: absolute;
		bottom: 68rpx;
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