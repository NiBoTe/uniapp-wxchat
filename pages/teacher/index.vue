
<template>
	<view class="u-wrap">
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view">
				<view v-for="(item,index) in tabbar" :key="index" class="u-tab-item"
					:class="[currentIndex == index ? 'u-tab-item-active' : '']" @tap.stop="swichMenu(item, index)">
					<text class="u-line-1">{{item}}</text>
				</view>
			</scroll-view>
			<view class="right-box">
				<!-- option -->
				<view class="opt-container">
					<drawingColumn ref="DrawingColumn" :list="drawList" @change="tabChange"></drawingColumn>
				</view>
				<!-- option end-->
				<scroll-view scroll-y class="right-box-scroll" @scrolltolower="lower">
					<view class="page-view">
						<view class="class-item" v-for="(item , index) in list" :key="index" @click="detailTap(item)">
							<view class="item-container">
								<famous-teacher-item :item="item"></famous-teacher-item>
							</view>
						</view>
					</view>
					
					<u-loadmore margin-top="30" margin-bottom="30" :status="loadStatus" @loadmore="addData"></u-loadmore>
				</scroll-view>
			</view>
			
		</view>
		<tab-bar :selected="3"></tab-bar>
	</view>
</template>
<script>
	import tabBar from '@/components/tabbar/tabbar.vue'
	import { menuList, teacherList } from '@/api/teacher.js';
	import drawingColumn from '@/components/drawingColumn/drawingColumn.vue';
	import FamousTeacherItem from '@/components/famousTeacher/famousTeacherItem.vue';
	export default {
		components:{
			tabBar,
			drawingColumn,
			FamousTeacherItem
		},
		data() {
			return {
				loadStatus: 'loadmore',
				currentIndex: 0,  // 预设当前项的值
				tabbar: [],
				drawList: [], // 类型列表
				list: [],
				skilledMajorIndex: 0,
				province: '', // 省份
				current: 1,
				size: 10
			}
		},
		onLoad() {
			this.initData()
		},
		methods: {
			initData(){
				this.$http.get(menuList).then(res => {
					this.tabbar = res.data.provinceList
					this.drawList = res.data.skilledMajorList
					if(this.tabbar.length){
						this.province = this.tabbar[0]
						this.getList()
					}
				})
			},
			getList(){
				this.loadStatus = 'loading';
				console.log(this.drawList)
				console.log(this.skilledMajorIndex)
				this.$http.post(teacherList, {
					province: this.province,
					skilledMajorId: this.drawList[this.skilledMajorIndex].id,
					size: this.size,
					current: this.current,
				}).then(res => {
					
					if (this.current === 1) {
						this.list = res.data.records;
					} else {
						this.list = this.list.concat(res.data.records);
					}
					if (res.data.total <= this.list.length) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}
				})
			},
			lower() {
				this.loadStatus = 'loading';
				this.addData();
			},
			addData() {
				this.current++;
				this.getList();
			},
			detailTap(item){
				this.$mRouter.push({
					route: `/pages/teachers/dynamicHomePage?id=${item.id}`
				})
			},
			// 点击左边的栏目切换
			async swichMenu(item, index) {
				this.currentIndex = index;
				this.province = item;
				this.current = 1;
				this.getList();
			},
			// 筛选
			tabChange(value) {
				console.log(value)
				this.skilledMajorIndex = value.index;
				this.current = 1;
				this.getList();
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	// option-item
	.opt-container{
		background: #FFFFFF;
		height: 114rpx;
		padding-top: 30rpx;
		border-bottom: 2rpx solid #E9E9E9;
	}
	// option-item emd
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
		width: 0;
		flex: 1;
		background-color: rgb(250, 250, 250);
		&-scroll{
			height: 100%;
		}
	}

	.page-view {
		// padding: 16rpx;
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
