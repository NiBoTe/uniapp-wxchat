<template>
	<view class="container">
		<view class="header">首次使用，您的角色</view>
		
		<view class="list">
			<view class="item">
				<image :src="setSrc('role_teacher.png')"></image>
				<view class="item-box">
					<view class="item-header">我是教师</view>
					<view class="item-subheader">开启线上第二职场</view>
				</view>
			</view>
			<view class="item">
				<image :src="setSrc('role_student.png')"></image>
				<view class="item-box">
					<view class="item-header">我是学生</view>
					<view class="item-subheader">开启我的艺术之旅</view>
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

.container{
	.header{
		margin: 40rpx 0;
		text-align: center;
		font-size: 26rpx;
		color: #3A3D71;
	}
	
	.list{
		padding: 0 40rpx;
		.item{
			margin-bottom: 38rpx;
			width: 100%;
			height: 248rpx;
			position: relative;
			image{
				width: 100%;
				height: 248rpx;
			}
			
			
			&-box{
				position: absolute;
				top: 62rpx;
				left: 60rpx;
				
				.item-header{
					margin-left: 18rpx;
					font-size: 48rpx;
					font-weight: 500;
					color: #FFFFFF;
				}
				
				.item-subheader{
					margin-top: 18rpx;
					padding: 0 20rpx;
					height: 48rpx;
					line-height: 48rpx;
					border-radius: 32px;
					border: 2rpx solid #FFFFFF;
					font-size: 24rpx;
					font-weight: 500;
					color: #FFFFFF;
				}
			}
		}
	}
}
</style>
