<template>
	<view class="tab-bar">
		<view v-for="(item,index) in list" :key="index" class="tab-bar-item" @click="switchTab(item, index)">
			<image class="tab-center" v-if="index === 2" src="/static/public/center.png"></image>
			<view class="tab_text" v-else :style="{color: selected === index ? selectedColor : color}">{{item.text}}</view>
		</view>
	</view>

</template>



<script>
	export default {
		props: {
			selected: { // 当前选中的tab index
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				color: "#9C9C9C",
				selectedColor: this.$mConstDataConfig.themeColor,
				list: [{
						"pagePath": "/pages/index/index",
						"text": "首页"
					},
					{
						"pagePath": "/pages/circle/index",
						"text": "圈子"
					},
					{
						"pagePath": "/pages/center/index",
						"text": "中心"
					},
					{
						"pagePath": "/pages/teacher/index",
						"text": "名师"
					},
					{
						"pagePath": "/pages/profile/profile",
						"text": "我的"
					}
				]
			}
		},
		methods: {
			switchTab(item, index) {
				console.log("item", item)
				console.log("index", index)
				let url = item.pagePath;
				
				uni.switchTab({
					url
				})

			}
		}
	}
</script>

<style lang="scss">
	.tab-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;
		height: 164rpx;
		background: white;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		.tab-bar-item {
			flex: 1;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			.tab-center {
				width: 82rpx;
				height: 70rpx;
			}

			.tab_text {
				font-size: 34rpx;
				font-weight: 500;
			}
		}
	}
</style>
