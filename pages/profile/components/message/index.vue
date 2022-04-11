<template>
	<view class="container">

		<view class="subtabs">
			<drawingColumn ref="DrawingColumn" :list="allList" key-name="name" @change="tabChange">
			</drawingColumn>
		</view>

		<scroll-view class="list-view" :scroll-y="isFixed" @scrolltolower="lower">
			<view class="item" v-for="(item, index) in list" :key="index" @click="goDetail(item)">
				<view class="title">{{item.title}}</view>
				<view class="subtitle" :class="item.type === 0 ? 'order' : ''">{{item.content}}</view>

				<view class="content u-flex" v-if="item.type === 2">
					<image :src="item.extData.image"></image>
					<text class="u-line-1">{{item.extData.title}}</text>
				</view>

				<view class="item-footer u-flex u-row-between">
					<view class="left" v-if="item.type === 0">订单编号：{{item.targetId}}</view>
					<view class="right" v-if="item.type === 0">查看订单 ></view>
					<view class="right" v-else-if="item.type === 1">查看考试 ></view>
					<view class="right" v-else-if="item.type === 2">查看详情 ></view>
				</view>
			</view>
			<nodata v-if="!loadStatus !== 'loading' && !list.length"></nodata>
			<u-loadmore v-else :status="loadStatus" @loadmore="addData"></u-loadmore>
		</scroll-view>


	</view>
</template>

<script>
	import {
		messageList
	} from '@/api/message.js'
	import moment from '@/common/moment.js'
	export default {
		data() {
			return {
				moment,
				isFixed: false,
				allList: [{
					name: '订单信息',
					value: 0
				}, {
					name: '考试信息',
					value: 1
				}, {
					name: '动态提醒',
					value: 2
				}, {
					name: '系统通知',
					value: 3
				}],
				loadStatus: 'loadmore',
				current: 1,
				size: 10,
				list: [], // 考试列表
				type: 0,
			};
		},
		created() {
			this.getList();
		},
		methods: {
			tabChange(e) {
				this.type = e.index;
				this.current = 1;
				this.getList()
			},
			// 获取列表
			getList() {
				this.loadStatus = 'loading';
				this.$http.post(messageList, {
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
				})

			},
			lower() {
				console.log('======')
				this.loadStatus = 'loading';
				this.addData();
			},
			addData() {
				this.current++;
				this.getList();
			},

			goDetail(item, index) {

				switch (item.type) {
					case 0:
						if (item.targetType === 3) {
							uni.navigateTo({
								url: `/pages/set/order/textbookDetail?orderId=${item.targetId}`
							})
							return
						}
						if (item.targetType === 9) {
							uni.navigateTo({
								url: `/pages/centers/paintingEvaluation/detail?id=${item.targetId}&source=list&type=teacherInfo`
							})
							return
						}
						if (item.targetType === 10) {
							uni.navigateTo({
								url: `/pages/centers/paintingEvaluation/teacherIndex?tabCurrent=1`
							})

							return
						}

						if (item.targetType === 11) {
							uni.navigateTo({
								url: `/pages/centers/paintingEvaluation/detail?id=${item.targetId}&source=list&type=default`
							})
							return
						}
						
						if (item.targetType === 12) {
							uni.navigateTo({
								url: `/pages/centers/paintingEvaluation/detail?id=${item.targetId}&source=home&type=default`
							})
							return
						}
						break;

					case 1:
						uni.navigateTo({
							url: `/pages/public/top/detail?id=${item.targetId}&type=0`
						})
						break;

					case 2:
						if (item.targetType === 5) {
							if(item.extData.type === 'image') {
								uni.navigateTo({
									url: `/pages/public/highScore/teachingMaterialDetail?id=${item.targetId}`
								})
							} else {
								uni.navigateTo({
									url: `/pages/public/highScore/videoDetail?id=${item.targetId}`
								})
							}
							return
						}
						if (item.targetType === 9) {
							uni.navigateTo({
								url: `/pages/centers/paintingEvaluation/detail?id=${item.targetId}&source=list&type=teacherInfo`
							})
							return
						}
						if (item.targetType === 10) {
							uni.navigateTo({
								url: `/pages/centers/paintingEvaluation/teacherIndex?tabCurrent=1`
							})
							return
						}
						

						if (item.targetType === 11) {
							uni.navigateTo({
								url: `/pages/centers/paintingEvaluation/detail?id=${item.targetId}&source=list&type=default`
							})
							return
						}
						
						if (item.targetType === 12) {
							uni.navigateTo({
								url: `/pages/centers/paintingEvaluation/detail?id=${item.targetId}&source=home&type=default`
							})
							return
						}
						uni.navigateTo({
							url: `/pages/module/circleDetail/index?id=${item.targetId}`
						})
						break;
				}

			},
			orderDetail(item) {
				switch (item.targetType) {
					case 0:
						uni.navigateTo({
							url: `/pages/set/order/highScoreDetail?orderId=${item.targetId}`
						})
						break;
					case 1:
						uni.navigateTo({
							url: `/pages/set/order/registrationDetails?orderId=${item.targetId}`
						})
						break;
					case 2:
						uni.navigateTo({
							url: `/pages/set/order/paintingEvaluationDetail?orderId=${item.targetId}`
						})
						break;
					case 3:
						uni.navigateTo({
							url: `/pages/set/order/textbookDetail?orderId=${item.targetId}`
						})
						break;
				}
			},
			lower() {
				console.log('=====')
				this.loadStatus = 'loading';
				this.addData();
			},
			noScroll(bool) {
				this.isFixed = bool
			},
			refresh() {
				this.current = 1;
				this.getList()
			},

		}
	}
</script>

<style lang="scss" scoped>
	.container {
		// width: 100vw;
		min-height: 100vh;
	}

	.subtabs {
		padding: 28rpx 0;
		background-color: #fff;
	}

	.list-view {
		padding-bottom: 160rpx;
		position: relative;
		padding-top: 28rpx;

		.item {
			margin: 0 34rpx 28rpx;
			background: #FFFFFF;
			border-radius: 24rpx;


			.title {
				padding: 22rpx 28rpx 8rpx 28rpx;
				font-size: 28rpx;
				font-weight: bold;
				color: #3A3D71;
			}


			.subtitle {
				padding: 0 24rpx 14rpx 26rpx;
				font-size: 20rpx;
				color: #3A3D71;

				&.order {
					border-bottom: 2rpx solid #E9E9E9;
				}
			}

			.content {
				margin: 10rpx 60rpx 0 30rpx;
				padding: 2rpx 28rpx 6rpx 10rpx;
				background: #E8E8E8;

				image {
					width: 34px;
					height: 30px;
				}

				text {
					flex: 1;
					margin-left: 6rpx;
					font-size: 20rpx;
					color: #9E9E9E;
				}
			}

			&-footer {
				padding: 24rpx 22rpx 24rpx 26rpx;

				.left {
					font-size: 18rpx;
					color: #9E9E9E;
				}

				.right {
					flex: 1;
					text-align: right;
					font-size: 20rpx;
					color: $u-type-primary;
				}
			}

		}
	}
</style>
