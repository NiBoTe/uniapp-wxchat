<template>
	<view class="high-score">
		<view class="top">

			<u-navbar title=" " :border-bottom="false">
				<view class="search u-flex" @click="searchTap">
					<u-icon name="search" color="#5D6086" size="32"></u-icon>
					<text>梵高名画</text>
				</view>
			</u-navbar>
			<view class="h-tabs" scroll-x="true">
				<u-tabs :list="menusList" :current="tabActive" @change="handelTabs" :is-scroll="true" bar-width="62"
					bar-height="8" gutter="40" active-color="#1B1B1B" inactive-color="#9E9E9E" font-size="30"></u-tabs>
			</view>

			<drawingColumn ref="DrawingColumn" :list="childMenus" key-name="name" @change="tabChange"></drawingColumn>
			<view class="line">
			</view>
			<view class="p-v">
				<view class="l">
					色彩作品
				</view>
				<view class="r">
					<view class="p-v-tabs">
						<view class="p-item" :class="type === 'image' ? 'active' : ''"
							@click="typeChange('image')">
							图片
						</view>
						<view class="p-item" :class="type === 'video' ? 'active' : ''" @click="typeChange('video')">
							视频
						</view>
					</view>
				</view>
			</view>
		</view>

		<u-waterfall v-model="list" ref="uWaterfall">
			<template v-slot:left="{leftList}">
				<view class="item" v-for="(item, index) in leftList" :key="index">
					<textbook-item :item="item"></textbook-item>
					
					<view class="play" v-if="type === 'video'">
						<image src="/static/public/video_icon.png"></image>
					</view>
				</view>
			</template>
			<template v-slot:right="{rightList}">
				<view class="item" v-for="(item, index) in rightList" :key="index">
					<textbook-item :item="item"></textbook-item>
					<view class="play" v-if="type === 'video'">
						<image src="/static/public/video_icon.png"></image>
					</view>
				</view>
			</template>
		</u-waterfall>

		<nodata v-if="!loading && !list.length"></nodata>
		<u-loadmore v-else bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addData"></u-loadmore>
	</view>
</template>

<script>
	import {
		menuList,
		appList
	} from '@/api/teaching_material.js'
	import drawingColumn from '@/components/drawingColumn/drawingColumn.vue'
	import TextbookItem from '@/components/textbook/textbookItem.vue'
	export default {
		components: {
			drawingColumn,
			TextbookItem
		},
		data() {
			return {
				loading: true,
				loadStatus: 'loadmore',
				type: 'image',
				tabActive: 0,
				childIndex: 0,
				menusList: [],
				childMenus: [],
				current: 1,
				size: 10,
				list: []
			};
		},
		onLoad(options) {
			this.getMenuList();
		},
		methods: {
			searchTap(){
				uni.navigateTo({
					url: '/pages/public/search'
				})
			},
			getMenuList() {
				this.$http.post(menuList).then(res => {
					this.menusList = res.data;
					this.childMenus = res.data.length ? res.data[0].childMenus : [];
					
					this.getList();
				}).catch(err => {
					console.log(err)
				})
			},
			getList() {
				this.loadStatus = 'loading';
				this.$http.post(appList, {
					firstMenuId: this.menusList.length > 0 ? this.menusList[this.tabActive].id : '',
					secondMenuId: this.childMenus.length > 0 ? this.childMenus[this.childIndex].id : '',
					type: this.type,
					size: this.size,
					current: this.current,
				}).then(res => {
					if (this.current === 1) {
						this.list = res.data.records;
					} else {
						this.list = this.list.concat(res.data.records);
					}
					if (res.data.records.length <= 0) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}

					this.loading = false;
				})
			},
			addData() {
				this.current++;
				this.getList();
			},
			handelTabs(e) {
				this.tabActive = e
				this.childMenus = this.menusList[this.tabActive].childMenus;
				this.current = 1;
				this.$refs.uWaterfall.clear();
				this.getList();
			},
			tabChange(e) {
				this.childIndex = e.index;
				this.current = 1;
				this.$refs.uWaterfall.clear();
				this.getList();
			},
			typeChange(type) {
				this.type = type;
				this.current = 1;
				this.$refs.uWaterfall.clear();
				this.getList();
			}
		},
		onReachBottom() {
			this.loadStatus = 'loading';
			this.getList()
		},
	}
</script>

<style lang="scss" scoped>
	.high-score {
		min-height: 100vh;
		background: #F3F3F3;

		.top {
			background: #FFFFFF;

			.search {
				margin-right: 22rpx;
				flex: 1;
				padding-left: 22rpx;
				height: 64rpx;
				background: #F3F3F3;
				border-radius: 34rpx;

				text {
					margin-left: 14rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #5D6086;
				}
			}
		}
	}

	.h-tabs {
		width: 100vw;
		margin-bottom: 42rpx;
	}

	.line {
		width: 100%;
		height: 2px;
		background-color: #E9E9E9;
		margin: 38rpx 0;
	}

	.p-v {
		display: flex;

		.l {
			flex: 1;
			line-height: 1;
			font-size: 34rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #3A3D71;
			padding-left: 32rpx;
			padding-bottom: 38rpx;
		}

		.r {
			flex: 1;

			.p-v-tabs {
				margin-top: -13rpx;
				width: 204rpx;
				height: 56rpx;
				background: #F3F3F3;
				border-radius: 28rpx;
				float: right;
				margin-right: 32rpx;
				display: flex;

				.p-item {
					text-align: center;
					flex: 1;
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #9E9E9E;
					line-height: 54rpx;
				}

				.active {
					width: 98rpx;
					height: 48rpx;
					background: #FFFFFF;
					border-radius: 24rpx;
					margin-top: 4rpx;
					margin-left: 4rpx;
					line-height: 50rpx;
					font-size: 28rpx;
					font-family: PingFang-SC-Heavy, PingFang-SC;
					font-weight: 800;
					color: #3A3D71;
				}
			}
		}
	}


	.item{
		position: relative;
		
		.play{
			position: absolute;
			top: 20rpx;
			right: 20rpx;
			image{
				width: 42rpx;
				height: 32rpx;
			}
		}
	}

	/deep/ .u-tab-item {
		font-weight: 400;
	}

	/deep/ .u-tab-bar {
		background-color: $u-type-primary !important;
	}
</style>
