<template>
	<view class="top-score-list">
		<view class="navbar">
			<u-navbar title="高分试卷" immersive back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>
		<scroll-view scroll-y class="scroll-warper" @scrolltolower="lower">
			<view class="list">
				<view class="item" v-for="(item, index) in list" :key="index" @click="detailTap(item)">
					<view class="img">
						<image :src="item.mosaicImg" mode="widthFix"></image>
					</view>
					<view class="bottom">
						<view class="text u-line-1">
							{{item.description}}
						</view>
						<view class="operation">
							<u-icon name="eye" color="#3A3D71" size="30"></u-icon>
							<view class="num">{{item.viewCount}}次</view>
							<view class="start" @click.top="favoriteTap(item, index)">
								<u-icon name="star" color="#3A3D71" v-show="!item.isFavorite"></u-icon>
								<u-icon name="star-fill" color="#35CE96" v-show="item.isFavorite"></u-icon>
							</view>
						</view>
					</view>
				</view>
			</view>

			<u-loadmore :status="loadStatus" @loadmore="addData"></u-loadmore>
		</scroll-view>
	</view>
</template>
<script>
	import {
		examPaperImgList,
		addFavorite
	} from '@/api/history_exam.js'
	export default {
		components: {

		},
		data() {
			return {
				questionId: null,
				loadStatus: 'loadmore',
				current: 1,
				size: 10,
				list: []
			}
		},
		onLoad(options) {
			if (options.questionId) this.questionId = options.questionId;

			this.initData()
		},
		methods: {
			initData() {

				this.loadStatus = 'loading';
				this.$http.post(examPaperImgList, {
					questionId: this.questionId,
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
					console.log(res)
					this.$set(this.list[index], 'isFavorite', !item.isFavorite)
					this.$mHelper.toast(item.isFavorite ? '收藏成功' : '取消成功')
				}).catch(err => {
					console.log(err)
				})
			},
			// 查看详情
			detailTap(item){
				this.$mRouter.push({
					route: `/pages/public/historyExQuestions/detail?id=${item.id}`
				})
			}
		}
	}
</script>
<style lang="scss">
	.top-score-list {
		overflow: hidden;

		.navbar {
			height: 206rpx;
			background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png');
			background-size: cover;
		}


		.scroll-warper {
			margin-top: -55rpx;
			height: calc(100vh - 160rpx);
			background: #F3F3F3;

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
								position: absolute;
								right: 24rpx;
								top: 4rpx;
								width: 34rpx;
								height: 34rpx;

								.start-img {
									width: 100%;
									height: 100%;
								}
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
