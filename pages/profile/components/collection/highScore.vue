<template>
	<view class="container">
		<scroll-view :scroll-y="isFixed" class="scroll-warper" @scrolltolower="lower">
			<view class="list">
				<view class="item" v-for="(item, index) in list" :key="index" @click="detailTap(item, index)">
					<view class="img">
						<image :src="item.hdImg !== '' ? item.hdImg : item.mosaicImg"></image>
					</view>
					<view class="bottom">
						<view class="text u-line-1">
							{{item.copyright}}
						</view>
						<view class="operation u-flex u-row-between">
							<view class="left u-flex">
								<u-icon name="eye" color="#3A3D71" size="30"></u-icon>
								<view class="num">{{item.viewCount}}次</view>
							</view>
							<view class="start" @click.stop="favoriteTap(item, index)">
								<u-icon name="star" color="#3A3D71" v-show="!item.isFavorite"></u-icon>
								<u-icon name="star-fill" color="#35CE96" v-show="item.isFavorite"></u-icon>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<nodata v-if="!loadStatus !== 'loading' && !list.length"></nodata>
			<u-loadmore v-else :status="loadStatus" @loadmore="addData"></u-loadmore>
		</scroll-view>
	</view>
</template>
<script>
	import {
		addFavorite
	} from '@/api/history_exam.js'
	
	import { examPaperList } from '@/api/favorite.js'
	export default {
		components: {

		},
		data() {
			return {
				isFixed: false,
				loadStatus: 'loadmore',
				current: 1,
				size: 10,
				list: [],
			}
		},
		created() {
			this.initData();
		},
		methods: {
			initData() {
				this.loadStatus = 'loading';
				this.$http.post(examPaperList, {
					current: this.current,
					size: this.size,
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

				}).catch(err => {
					console.log(err)
				})
			},
			lower() {
				this.loadStatus = 'loading';
				this.addData();
			},
			addData() {
				this.current++;
				this.initData();
			},
			// 收藏
			favoriteTap(item, index) {
				this.$http.post(addFavorite, null, {
					params: {
						examPaperImgId: item.id,
						addFavorite: !item.isFavorite
					}
				}).then(res => {
					this.$set(this.list[index], 'isFavorite', !item.isFavorite)
					this.$mHelper.toast(item.isFavorite ? '收藏成功' : '取消收藏成功')
				}).catch(err => {
				})
			},
			// 查看详情
			detailTap(item, index){
				this.$mRouter.push({
					route: `/pages/public/historyExQuestions/detail?id=${item.id}`
				})
			},
			// 刷新
			refresh() {
				this.current = 1;
				this.initData();
			},
			noScroll(bool) {
				this.isFixed = bool
			}
		}
	}
</script>
<style lang="scss">
	.container {
		height: 100vh;
		.scroll-warper {
			height: 100%;
			padding-bottom: 170rpx;
			.list {
				padding: 28rpx;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;

				.item {
					margin-bottom: 28rpx;
					width: 49%;
					height: 560rpx;
					background: #FFFFFF;
					border-radius: 16rpx;
					overflow: hidden;

					.img {
						width: 100%;
						height: 440rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.bottom {
						padding-left: 26rpx;

						.text {
							margin-top: 16rpx;
							font-size: 24rpx;
							font-family: PingFang-SC-Regular, PingFang-SC;
							font-weight: 400;
							color: #888C90;
							line-height: 24rpx;
						}

						.operation {
							margin-top: 22rpx;
							position: relative;

							.start {
								margin-right: 24rpx;
							}

							.num {
								display: inline-block;
								font-size: 24rpx;
								font-family: PingFang-SC-Medium, PingFang-SC;
								font-weight: 500;
								color: #3A3D71;
								margin-left: 16rpx;
							}
						}
					}
				}
			}
		}

	}
</style>
