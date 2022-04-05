<template>
	<view class="container">

		<view class="search u-flex" :style="{paddingTop: StatusBar + 44 + 'px'}">
			<view class="back u-flex" @click="$mRouter.back()">
				<image src="/static/public/arrow_left.png"></image>
			</view>
			<view class="search-content">
				<u-search :border-color="keyword !== '' ? themeColor : ''" search-icon="/static/public/search.png"
					search-icon-color="#9E9E9E" color="#3A3D71" placeholder-color="#A8A8A8" placeholder="请输入关键词搜索"
					v-model="keyword" :action-style="{color: '#2C3AFF'}" @change="goSearch" @search="searchTap"
					@custom="searchTap">
				</u-search>
			</view>
		</view>
		<view class="content">
			<view class="panel" v-if="!searchConentStatus">
				<view class="label u-flex u-row-between">
					<view class="left">热门搜索</view>
				</view>
				<view class="hot">
					<view class="hot-list">
						<view class="hot-item u-flex" v-for="(item, index) in hotList" :key="index"
							@click="hotKeyWordTap(item)">{{item.name}}</view>
					</view>
				</view>

				<view class="line"></view>

				<view class="label u-flex u-row-between">
					<view class="left">历史搜索</view>
					<view class="right" @click="deleteTap">
						<image src="/static/public/delete.png"></image>
					</view>
				</view>

				<view class="history">
					<view class="history-list">
						<view class="history-item u-flex" v-for="(item, index) in historyList" :key="index" @click="historyTap(item)">{{item}}
						</view>
					</view>
				</view>
			</view>
			<view class="search-list" v-if="searchStatus">
				<view class="search-item u-flex u-row-between" v-for="(item, index) in searchList" :key="index"
					@click="hotKeyWordTap(item)">
					<view class="left u-flex">
						<image src="/static/public/search.png"></image>
						<rich-text class="center" :nodes="$mHelper.highlightKeyword(item.name, keyword, 'customClass')">
						</rich-text>
					</view>
					<view class="right">约{{item.resultCount}}个结果</view>
				</view>
			</view>

			<view class="main">
				<!-- <no-data></no-data> -->
				<view class="tabs">
					<u-tabs ref="tabs" :is-scroll="true" :list="tabList" :current="current" bar-width="62"
						bar-height="8" gutter="40" active-color="#1B1B1B" inactive-color="#9E9E9E" font-size="30"
						@change="tabChange">
					</u-tabs>
				</view>
				<view class="borderBottom"></view>

				<view class="main-box">
					<!-- 考试 -->
					<examination ref="Examination" v-show="current === 0"></examination>
					<!-- 历年考题 -->
					<examination-paper ref="ExaminationPaper" v-show="current === 1"></examination-paper>


					<!-- 高分教材 -->
					<text-book ref="TextBook" v-show="current === 2"></text-book>

					<!-- 评画 -->
					<painting-evaluation ref="PaintingEvaluation" v-show="current === 3"></painting-evaluation>

					<!-- 名师 -->
					<famous-teacher ref="FamousTeacher" v-show="current === 4"></famous-teacher>

					<!-- 动态 -->
					<dynamic ref="Dynamic" v-if="current === 5"></dynamic>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import NoData from '@/components/nodata/index.vue'
	import {
		hotKeywordList,
		hotKeywordPlusViewCount,
		searchCount,
		searchMatch
	} from '@/api/search.js'
	import ExaminationPaper from './components/examinationPaper/examinationPaper.vue'
	import Examination from './components/examination/examination.vue'
	import TextBook from './components/textbook/textbook.vue'
	import PaintingEvaluation from './components/paintingEvaluation/paintingEvaluation.vue'
	import FamousTeacher from './components/famousTeacher/famousTeacher.vue'
	import Dynamic from './components/dynamic/dynamic.vue'
	export default {
		components: {
			// NoData
			ExaminationPaper,
			Examination,
			TextBook,
			PaintingEvaluation,
			FamousTeacher,
			Dynamic
		},
		data() {
			return {
				themeColor: this.$mConstDataConfig.themeColor,
				keyword: '',
				searchConentStatus: false,
				searchStatus: false,
				StatusBar: this.StatusBar,
				tabList: [{
					name: '考试'
				}, {
					name: '历年考题'
				}, {
					name: '高分教材',
				}, {
					name: '评画',
				}, {
					name: '名师',
				}, {
					name: '动态',
				}],
				statu: true,
				current: 0,
				swiperCurrent: 0,
				hotList: [],
				historyList: [],
				searchList: []
			};
		},
		watch: {
			keyword(val) {
				console.log(val)
			}
		},
		onLoad() {

			let list = uni.getStorageSync('historyList') !== '' ? uni.getStorageSync('historyList') : [];
			this.historyList = list;
			this.getHotList();
		},
		methods: {
			// 搜索
			searchTap() {
				let text = this.keyword.replace(/ /g, '');
				if(this.keyword !== '' && text !== ''){
					if(this.historyList.length > 0 && this.historyList[this.historyList.length - 1] === text){
						console.log('========')
					} else {
						this.historyList.unshift(this.keyword);
					}
					if(this.historyList.length > 8){
						this.historyList.pop()
					}
					uni.setStorageSync('historyList', this.historyList);
					this.searchConentStatus = true;
					this.seachContent(this.keyword)
				}

			},
			// 热门搜索
			hotKeyWordTap(item) {
				this.$http.post(hotKeywordPlusViewCount, null, {
					params: {
						id: item.id
					}
				}).then(res => {
					this.keyword = item.name
					this.searchStatus = false;
					this.searchConentStatus = true;
					this.seachContent(item.name)
				})
			},
			// 历史搜索
			historyTap(item){
				this.keyword = item;
				this.seachContent(item.name)
			},
			// 搜索内容
			seachContent(keyword) {
				this.$refs.Examination.refresh(keyword);
				this.$refs.ExaminationPaper.refresh(keyword);
				this.$refs.TextBook.refresh(keyword);
				this.$refs.PaintingEvaluation.refresh(keyword);
				this.$refs.FamousTeacher.refresh(keyword);
				
			},
			// 删除历史记录
			deleteTap() {
				uni.clearStorageSync('historyList')
				this.historyList = []
			},

			// 实时搜索
			goSearch() {
				// 保持this的指向始终指向vue实例
				const that = this;
				if (!that.statu) {
					return;
				}
				that.statu = false;
				setTimeout(function() {
					that.markSure(); // 调用写好的方法
					that.statu = true;
				}, 1000)
			},
			// 搜索结果
			markSure() {
				this.$http.post(searchMatch, {
					keyword: this.keyword
				}).then(res => {
					console.log(res)
					this.searchList = res.data
					if (this.searchList.length) {
						this.searchStatus = true
					}
				})
			},
			getHotList() {
				this.$http.get(hotKeywordList).then(res => {
					this.hotList = res.data
				})
			},
			tabChange(index) {
				this.current = index
				this.swiperCurrent = index;
				
				if(index === 5) {
					
					this.$nextTick(() => {
						this.$refs.Dynamic.refresh(this.keyword);
					})
				}
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				console.log(dx)
				// this.$refs.tabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				// this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {

		position: relative;
		height: 100vh;
		overflow: hidden;
		.panel {
			position: absolute;
			z-index: 99;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #fff;

			.label {
				padding: 40rpx 32rpx 28rpx;

				.left {
					font-size: 26rpx;
					font-weight: bold;
					color: #3A3D71;
				}

				.right {
					image {
						width: 32rpx;
						height: 32rpx;
					}
				}

			}

			.hot {
				margin: 0 12rpx 0 32rpx;
				padding-bottom: 12rpx;

				&-list {

					display: flex;
					flex-wrap: wrap;

					.hot-item {
						margin: 0 20rpx 28rpx 0;
						padding: 0 22rpx;
						height: 52rpx;
						background: #EFF2FF;
						border-radius: 26rpx;
						font-size: 24rpx;
						color: #3A3D71;
					}
				}
			}

			.line {
				margin: 0 32rpx;
				height: 2rpx;
				border: 2rpx solid #E9E9E9;
			}

			.history {
				margin: 0 12rpx 0 32rpx;
				padding-bottom: 12rpx;

				&-list {
					display: flex;
					flex-wrap: wrap;

					.history-item {
						margin: 0 20rpx 28rpx 0;
						padding: 0 22rpx;
						height: 52rpx;
						background: #F3F3F3;
						border-radius: 26rpx;
						font-size: 24rpx;
						color: #3A3D71;
					}
				}
			}
		}

		.search {
			margin-right: 30rpx;
			padding: 20rpx 0;

			.back {
				margin: 24rpx;

				image {
					width: 36rpx;
					height: 36rpx;
				}
			}

			&-content {
				flex: 1;
			}
		}


		.content {
			min-height: 100vh;
			position: relative;

			.search-list {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				z-index: 999;
				background-color: #fff;

				.search-item {
					margin: 0 32rpx;
					padding: 28rpx 0;
					border-bottom: 2rpx solid #E9E9E9;


					.left {
						flex: 1;
						margin-right: 28rpx;
						font-size: 26rpx;
						color: #3A3D71;

						image {
							margin-right: 16rpx;
							width: 32rpx;
							height: 32rpx;
						}
					}

					.center {
						flex: 1;
					}


					.right {
						font-size: 26rpx;
						color: #9E9E9E;
					}
				}
			}


			.main {
				border-top: 2px solid #E9E9E9;
				.tabs {
					padding-top: 4rpx;
				}

				.borderBottom {
					margin-top: -10rpx;
					height: 2rpx;
					border: 2rpx solid #E9E9E9;
				}

				&-box {
					background-color: #F3F3F3;
				}
			}
		}


		.customClass {
			color: $u-type-primary;
		}

		/deep/ .u-tab-item {
			font-weight: 400;
		}

		/deep/ .u-tab-bar {
			background-color: $u-type-primary !important;
		}
	}
</style>
