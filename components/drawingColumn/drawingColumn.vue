<template>
	<view class="container">
		<scroll-view class="tabs" :scroll-x="true">
			<view class="tab">
				<text>素描</text>
				<view class="tab-border">
					<image src="/static/public/home_scroll_style.png"></image>
				</view>
			</view>
			<view class="tab">
				<text>素描</text>
				<view class="tab-border">
					<image src="/static/public/home_scroll_style.png"></image>
				</view>
			</view>
			<view class="tab">
				<text>素描</text>
				<view class="tab-border">
					<image src="/static/public/home_scroll_style.png"></image>
				</view>
			</view>
			<view class="tab">
				<text>素描</text>
				<view class="tab-border">
					<image src="/static/public/home_scroll_style.png"></image>
				</view>
			</view>
			<view class="tab">
				<text>素描</text>
				<view class="tab-border">
					<image src="/static/public/home_scroll_style.png"></image>
				</view>
			</view>
			<view class="tab">
				<text>素描</text>
				<view class="tab-border">
					<image src="/static/public/home_scroll_style.png"></image>
				</view>
			</view>
			<view class="tab">
				<text>素描</text>
				<view class="tab-border">
					<image src="/static/public/home_scroll_style.png"></image>
				</view>
			</view>
			<view class="tab">
				<text>素描</text>
				<view class="tab-border">
					<image src="/static/public/home_scroll_style.png"></image>
				</view>
			</view>
			<view class="tab">
				<text>素描</text>
				<view class="tab-border">
					<image src="/static/public/home_scroll_style.png"></image>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name:"drawingColumn",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
	// tabs
	.tabs {
		height: 54rpx;
		white-space: nowrap;
	
		.tab {
			height: 52rpx;
			margin-right: 34rpx;
			display: inline-block;
			position: relative;
			padding: 0 28rpx;
			background: #F3F3F3;
			border-radius: 36rpx;
			border: 4rpx solid transparent;
	
			&:first-of-type {
				margin-left: 32rpx;
			}
	
			&.active {
				background: #EFF2FF;
	
				text {
					color: $u-type-primary;
				}
			}
	
			text {
				font-size: 24rpx;
				color: #3A3D71;
			}
	
			&-border {
				position: absolute;
				right: -8rpx;
				bottom: -8rpx;
	
				image {
					display: block;
					width: 36rpx;
					height: 36rpx;
				}
			}
		}
	}
</style>
