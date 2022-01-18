<template>
	<view class="container">
		<view class="search u-flex">
			<view class="back u-flex" @click="$mRouter.back()">
				<image src="/static/public/arrow_left.png"></image>
			</view>
			<view class="search-content">
				<u-search :border-color="keyword !== '' ? themeColor : ''" search-icon="/static/public/search.png"
					search-icon-color="#9E9E9E" color="#3A3D71" placeholder-color="#A8A8A8" placeholder="日照香炉生紫烟"
					v-model="keyword" :action-style="{color: '#2C3AFF'}"></u-search>
			</view>
		</view>
		<view class="content">
			<view class="search-list" v-if="searchStatus">
				<view class="search-item u-flex u-row-between">
					<view class="left u-flex">
						<image src="/static/public/search.png"></image>
						<rich-text :nodes="$mHelper.highlightKeyword('人物色彩', keyword, 'customClass')"></rich-text>
					</view>
					<view class="right">约285个结果</view>
				</view>
				<view class="search-item u-flex u-row-between">
					<view class="left u-flex">
						<image src="/static/public/search.png"></image>
						<rich-text :nodes="$mHelper.highlightKeyword('人物色彩', keyword, 'customClass')"></rich-text>
					</view>
					<view class="right">约285个结果</view>
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
					<examination-paper v-show="current === 0"></examination-paper>

					<!-- 历年考题 -->
					<examination v-show="current === 1"></examination>

					<!-- 高分教材 -->
					<text-book v-show="current === 2"></text-book>

					<!-- 评画 -->
					<painting-evaluation v-show="current === 3"></painting-evaluation>

					<!-- 名师 -->
					<famous-teacher v-show="current === 4"></famous-teacher>

					<!-- 动态 -->
					<dynamic v-show="current === 5"></dynamic>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import NoData from '@/components/nodata/index.vue'

	import ExaminationPaper from '@/components/examinationPaper/examinationPaper.vue'
	import Examination from '@/components/examination/examination.vue'
	import TextBook from '@/components/textbook/textbook.vue'
	import PaintingEvaluation from '@/components/paintingEvaluation/paintingEvaluation.vue'
	import FamousTeacher from '@/components/famousTeacher/famousTeacher.vue'
	import Dynamic from '@/components/dynamic/dynamic.vue'
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
				searchStatus: false,
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
				current: 0,
				swiperCurrent: 0,
			};
		},
		methods: {
			tabChange(index) {
				this.current = index
				this.swiperCurrent = index;
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
						font-size: 26rpx;
						color: #3A3D71;

						image {
							margin-right: 16rpx;
							width: 32rpx;
							height: 32rpx;
						}
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
