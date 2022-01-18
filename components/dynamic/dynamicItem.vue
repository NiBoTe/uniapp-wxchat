<template>
	<view class="container">

		<view class="item">
			<view class="header u-flex u-row-between">
				<view class="left u-flex">
					<u-avatar size="80" :src="item.image"></u-avatar>
					<text>程超老师</text>
				</view>

				<view class="right">
					<image src="/static/public/dynamic_menu.png"></image>
				</view>
			</view>


			<view class="item-text u-line-3">
				文艺复兴是指13世纪末在意大利各城市兴起，以后扩展到西欧各国，于16世纪在欧洲盛行的一场思想文化运动，带来一段科学与艺术革命以后扩绘画领域来艺术革命以后扩…
				<view class="fold" bindtap="fold" :data-text="foldText" :data-etc="textEtc"></view>
			</view>


			<view class="item-images">
				<u-row gutter="16">
					<u-col span="4">
						<!-- <u-image src="https://cdn.uviewui.com/uview/example/fade.jpg"></u-image> -->
						<image :src="item.image" mode="aspectFill"></image>
					</u-col>
					<u-col span="4">
						<!-- <image :src="item.image"></image> -->
						<image :src="item.image" mode="aspectFill"></image>
					</u-col>
					<u-col span="4">
						<!-- <image :src="item.image"></image> -->
						<image :src="item.image" mode="aspectFill"></image>
					</u-col>
					<u-col span="4">
						<!-- <image :src="item.image"></image> -->
						<image :src="item.image" mode="aspectFill"></image>
					</u-col>
					<u-col span="4">
						<!-- <image :src="item.image"></image> -->
						<image :src="item.image" mode="aspectFill"></image>
					</u-col>
				</u-row>
			</view>
			
			
			<view class="item-handle u-flex u-row-between">
				<view class="left u-flex">
					<view class="left-item u-flex">
						<image src="/static/public/dynamic_star.png" style="width: 36rpx;height: 36rpx;"></image>
						<text>259</text>
					</view>
					
					<view class="left-item u-flex">
						<image src="/static/public/dynamic_comment.png" style="width: 40rpx;height: 34rpx;"></image>
						<text>259</text>
					</view>
					<view class="left-item u-flex">
						<image src="/static/public/dynamic_praise.png" style="width: 34rpx;height: 34rpx;"></image>
						<text>259</text>
					</view>
				</view>
				
				<view class="right u-flex">
					<image src="/static/public/dynamic_share.png"></image>
					<text>分享</text>
				</view>
				
			</view>
			
			<view class="item-footer u-flex u-row-between">
				<view class="left">
					<text>说一下你的想法...</text>
				</view>
				
				<view class="right u-flex">
					<view class="right-item u-flex">
						<image src="/static/public/applause.png"></image>
					</view>
					<view class="right-item u-flex">
						<image src="/static/public/laugh.png"></image>
					</view>
					<view class="right-item u-flex">
						<image src="/static/public/cool.png"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "DynamicItem",
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
				foldText: '全文',
				textEtc: '...'
			};
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.item {
			margin-bottom: 16rpx;
			padding: 28rpx 34rpx;
			background-color: #fff;

			.header {

				.left {

					text {
						margin-left: 16rpx;
						font-size: 32rpx;
						font-weight: 600;
						color: #1B1B1B;
					}
				}

				.right {
					image {
						width: 32rpx;
						height: 32rpx;
					}
				}
			}


			&-text {
				margin-top: 14rpx;
				position: relative;
				line-height: 46rpx;
				font-size: 26rpx;
				color: #3A3D71;

				.fold::before {
					//设置在文本下面的展开按钮那一部分，此部分的前面设置——...省略号，并通过绝对定位设置在超出部分的后面
					content: attr(data-etc);
					position: absolute;
					left: 0;
					transform: translateX(4rpx);

				}

				.fold::after {
					//设置文本下面的展开按钮的那一部分，此部分的后面设置——展开  展开按钮，并通过绝对定位设置在省略号的后面
					content: attr(data-text);
					position: absolute;
					right: 0;
					color: $u-type-primary;
				}

				.fold {
					//展开按钮的那一部分，同样设置绝对定位，并设置宽高，将通过样式实现的省略号遮住，同时将::before和::after展开的内容设置在里面
					width: 110rpx;
					height: 45rpx;
					position: absolute;
					right: 0;
					bottom: 0;
					background-color: #fff;
				}

				.foldIntroduct {
					//出现此样式名时，设置不出现省略号和展开按钮
					-webkit-line-clamp: inherit !important;
				}
			}
			
			&-images{
				margin-top: 24rpx;
				image{
					width: 100%;
					height: 222rpx;
					border-radius: 12rpx;
				}
			}
			
			&-handle{
				margin-top: 26rpx;
				text{
					margin-left: 12rpx;
					font-size: 26rpx;
					font-weight: 500;
					color: #3A3D71;
				}
				.left{
					&-item{
						margin-right: 60rpx;
						
					}
				}
				
				.right{
					image{
						width: 40rpx;
						height: 34rpx;
					}
				}
			}
			
			&-footer{
				margin: 22rpx 0;
				height: 80rpx;
				padding-left: 26rpx;
				background: #F7F7F7;
				border-radius: 16rpx;
				.left{
					font-size: 24rpx;
					font-weight: 500;
					color: #959595;
				}
				
				.right{
					margin-right: 24rpx;
					&-item{
						margin-left: 30rpx;
						image{
							width: 42rpx;
							height: 42rpx;
						}
					}
				}
			}
		}
	}
</style>
