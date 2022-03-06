<template>
	<view class="u-wrap">
		<view class="u-menu-wrap">
			<scroll-view scroll-y class="u-tab-view menu-scroll-view">
				<view v-for="(item,index) in tabbar" :key="index" class="u-tab-item"
					:class="[current == index ? 'u-tab-item-active' : '']" @tap.stop="swichMenu(item, index)">
					<text class="u-line-1">{{item.name}}</text>
				</view>
			</scroll-view>
			<scroll-view :scroll-top="scrollRightTop" :scroll-y="true" class="right-box" @scroll="scroll">
				<view class="page-view">
					 <!-- :id="'item' + index" -->
					<view class="class-item" v-for="(item , index) in list" :key="index" @click="detailTap(item)">
						<view class="item-container">
							<view class="thumb-box u-flex u-row-between">
								<view class="left u-flex">
									<image class="item-menu-image" :src="item.logo"></image>
								</view>
								<view class="right">
									<view class="item-menu-name">{{item.name}}</view>
									<view class="item-menu-dec u-line-2">{{item.description}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>
<script>
	
	import { classify, schoolList } from '@/api/school.js';
	export default {
		data() {
			return {
				current: 0, // 预设当前项的值
				tabbar: [],
				list: [],
				classifyId: '',
				provinceId: '',
				scrollRightTop: 0, // 右边栏目scroll-view的滚动条高度
				timer: null, // 定时器

			}
		},
		onLoad() {
			this.initData()
		},
		methods: {
			initData(){
				this.$http.get(classify).then(res => {
					this.tabbar = res.data
					if(this.tabbar.length){
						this.classifyId = this.tabbar[0].classify_id;
						this.provinceId = this.tabbar[0].province_id;
						this.getSchoolList()
					}
				})
			},
			getSchoolList(){
				this.$http.post(schoolList, {
					classifyId: this.classifyId,
					provinceId: this.provinceId,
					size: 100
				}).then(res => {
					this.list = res.data.records
					this.$nextTick(() => {
						this.scrollRightTop = Math.random();
					})
				})
			},
			detailTap(item){
				this.$mRouter.push({
					route: `/pages/public/school/detail?universityId=${item.id}`
				})
			},
			// 点击左边的栏目切换
			async swichMenu(item, index) {
				this.current = index;
				this.classifyId = item.classify_id;
				this.getSchoolList();
			},
			scroll(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-wrap {
		height: calc(100vh);
		display: flex;
		flex-direction: column;
	}


	.u-menu-wrap {
		border-top: 2rpx solid #E9E9E9;
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.u-search-inner {
		background-color: rgb(234, 234, 234);
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		padding: 10rpx 16rpx;
	}

	.u-search-text {
		font-size: 26rpx;
		color: $u-tips-color;
		margin-left: 10rpx;
	}

	.u-tab-view {
		width: 166rpx;
		height: 100%;
		background-color: #F2F2F2;
	}

	.u-tab-item {
		height: 116rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #9E9E9E;
	}

	.u-tab-item-active {
		position: relative;
		font-size: 28rpx;
		font-weight: bold;
		color: $u-type-primary;
		background: #fff;
		border-radius: 24rpx 0px 0px 24rpx;
	}

	.u-tab-item-active::before {
		content: "";
		position: absolute;
		background-color: $u-type-primary;
		width: 10rpx;
		height: 44rpx;
		border-radius: 0px 6rpx 6rpx 0px;
		left: 0;
		top: 39rpx;
	}

	.u-tab-view {
		height: 100%;
	}

	.right-box {
		background-color: rgb(250, 250, 250);
	}

	.page-view {
		// padding: 16rpx;
	}

	.class-item {
		background-color: #fff;
		padding-left: 30rpx;
		border-radius: 8rpx;
	}

	.class-item:last-child {
		min-height: 100vh;
	}

	.item-title {
		font-size: 26rpx;
		color: $u-main-color;
		font-weight: bold;
	}


	.item-container {
		// display: flex;
	}

	.thumb-box {
		padding-top: 28rpx;
	}


	.left {
		width: 120rpx;
		height: 120rpx;
		margin-bottom: 30rpx;
		border-radius: 16rpx;
		border: 2rpx solid #E9E9E9;

		.item-menu-image {
			width: 110rpx;
			height: 110rpx;
		}
	}

	.right {
		flex: 1;
		margin: 0 34rpx 0 28rpx;
		padding-bottom: 30rpx;
		border-bottom: 2rpx solid #E9E9E9;

		.item-menu-name {
			font-size: 28rpx;
			font-weight: bold;
			color: #3A3D71;
		}

		.item-menu-dec {
			font-size: 26rpx;
			color: #3A3D71;
		}

	}
</style>
