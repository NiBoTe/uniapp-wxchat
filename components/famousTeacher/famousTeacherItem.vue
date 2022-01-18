<template>
	<view class="container">
		
		<view class="item u-flex">
			<view class="left">
				<u-avatar size="128" :src="item.image"></u-avatar>
				<view class="left-badge">
					<image src="/static/public/auth.png"></image>
				</view>
			</view>
			
			<view class="right">
				<view class="title u-flex u-row-between">
					<text>刘泉海</text>
					<view class="title-btn u-flex u-row-center">关注</view>
				</view>
				
				<view class="subtitle u-line-2">中国美术学院雕塑系研究生全国第一中国美术学院雕塑系美术教学经验10年以上丰富…</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"FamousTeacherItem",
		props: {
			item: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		
		.item{
			margin: 28rpx 30rpx 0 32rpx;
			padding: 20rpx;
			background: #FFFFFF;
			box-shadow: 0px 6rpx 16rpx 6rpx rgba(230, 230, 230, 0.5);
			border-radius: 24rpx;
			
			.left{
				position: relative;
				&-badge{
					position: absolute;
					right: 0;
					bottom: 0;
					image{
						width: 44rpx;
						height: 44rpx;
					}
				}
			}
			
			.right{
				flex: 1;
				margin-left: 20rpx;
				.title{
					text{
						font-size: 28rpx;
						font-weight: bold;
						color: #3A3D71;
					}
					
					&-btn{
						width: 100rpx;
						height: 42rpx;
						left-height: 42rpx;
						background: #EFF2FF;
						border-radius: 26rpx;
						font-size: 24rpx;
						font-weight: bold;
						color: $u-type-primary;
						
						&.disabled{
							background: #F2F2F2;
							color: #9E9E9E;
						}
					}
				}
				
				.subtitle{
					margin-top: 16rpx;
					font-size: 26rpx;
					color: #3A3D71;
				}
			}
			
		}
	}

</style>
