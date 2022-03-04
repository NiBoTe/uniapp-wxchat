<template>
	<view>
		<view class="top">
			<view class="navbar">
				<u-navbar :title="title" title-bold back-icon-color="#1b1b1b" :background="background"
					:border-bottom="false" title-color="#1b1b1b">
				</u-navbar>
			</view>
			<view class="tabs">
				<u-tabs ref="tabs" :is-scroll="false" :list="tabList" :current="current" bar-width="70" height="120"
					bar-height="8" gutter="40" active-color="#2C3AFF" inactive-color="#9E9E9E" font-size="30"
					:active-item-style="activeItemStyle" @change="tabChange">
				</u-tabs>
			</view>
			<view class="line"></view>

			<view>
				<focus-list v-show="current == 0"></focus-list>
				<fans-list v-show="current == 1"></fans-list>
			</view>
		</view>

	</view>
</template>

<script>
	import FocusList from './components/focus-list.vue'
	import FansList from './components/fans-list.vue'
	export default {
		data() {
			return {
				// 标题
				title: '程超老师',
				// 背景配置
				background: {},
				tabList: [{
						name: '关注'
					},
					{
						name: '粉丝'
					},
				],
				tabListData: [{
						count: '652'
					},
					{
						count: '865w'
					}
				],
				current: 0,
				activeItemStyle: {
					color: '#1B1B1B'
				},
				userInfo: this.$mStore.state.userInfo

			};
		},
		onLoad(options) {
			this.current = options.type;
		},
		onShow() {
			this.tabList.forEach((i, index) => {

				if (index === 0) {
					i.name += this.userInfo.followCount
				} else {
					i.name += this.userInfo.fansCount
				}
			})
		},
		components: {
			FocusList,
			FansList
		},
		methods: {
			tabChange(index) {
				this.current = index
			},
			fetchNum() {
				let focusNum = '652';
				let fansNum = '865w';
			}
		}
	}
</script>

<style lang="scss">
	.top {
		height: calc(100vh);
		overflow: hidden;
		background-color: #fff;
	}

	.line {
		margin-top: -10rpx;
		height: 2rpx;
		border: 2rpx solid #E9E9E9;
	}
</style>
