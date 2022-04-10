<template>
	<view class="scoreList">
		<view class="navbar">
			<u-navbar title="考试列表名称" back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>
		<view class="list">
			<view class="item u-flex" v-for="(item, index) in list" :key="index" @click="itemTap(item, index)">
				<view class="item-image">
					<image :src="item.url">
					</image>
				</view>

				<view class="item-main">
					<view class="item-header u-flex u-row-between">
						<view class="left">{{item.name}}</view>
						<view class="right">
							<image src="/static/public/arrow_right.png"></image>
						</view>
					</view>
					<view class="item-time">
						<u-icon name="clock" color="#9E9E9E" size="30"></u-icon>
						<text>{{moment(item.examStartTime).format('YYYY年MM月DD日')}}至{{moment(item.examEndTime).format('YYYY年MM月DD日')}}</text>
					</view>
				</view>
			</view>
		</view>
		<nodata v-if="!loading && !list.length"></nodata>
		<u-loadmore margin-top="30" margin-bottom="30" :status="loadStatus" @loadmore="addData"></u-loadmore>
	</view>
</template>

<script>
	import {
		examList2
	} from '@/api/exam.js'
	import moment from '@/common/moment.js'
	export default {
		data() {
			return {
				moment,
				loadStatus: 'loadmore',
				current: 1,
				size: 10,
				list: [], // 考试列表
				loading: true,
				type: 0
			};
		},

		onLoad(options) {
			if (options.type) this.type = Number(options.type)
			this.getList();
		},
		methods: {
			getList() {
				this.loadStatus = 'loading';
				this.$http.post(examList2, {
					size: this.size,
					current: this.current,
				}).then(res => {
					if (this.current === 1) {
						this.list = res.data.list;
					} else {
						this.list = this.list.concat(res.data.list);
					}
					if (res.data.list.length <= 0) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}
					this.loading = false
				})
			},
			addData() {
				this.current++;
				this.getList();
			},
			// 详情
			itemTap(item, index) {
				console.log(item)
				console.log(index)


				switch (this.type) {
					case 1:
					case 2:
					case 3:
					case 4:
						uni.navigateTo({
							url: `/pages/centers/achievement/studentList?id=${item.id}&type=${this.type}`
						})
						break;
					case 5:
						uni.navigateTo({
							url: `/pages/public/top/testUpload?id=${item.id}`
						})
						break;
					case 6:
						uni.navigateTo({
							url: `/pages/public/top/takeRecord?id=${item.id}`
						})
						break;
					default:
						uni.navigateTo({
							url: `/pages/centers/achievement/search?id=${item.id}`
						})

				}

			}
		},
		onReachBottom() {
			this.loadStatus = 'loading';
			this.addData();
		},
	}
</script>

<style lang="scss" scoped>
	.scoreList {
		.navbar {
			background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png');
			background-size: cover;
		}

		.list {
			padding-top: 28rpx;

			.item {
				margin: 0 28rpx 28rpx;
				padding: 20rpx;
				background: #FFFFFF;
				box-shadow: 0px 6rpx 16rpx 6rpx rgba(230, 230, 230, 0.5);
				border-radius: 24rpx;

				&-image {
					image {
						border-radius: 24rpx;
						width: 132rpx;
						height: 132rpx;
					}
				}

				&-main {
					margin-left: 20rpx;
					flex: 1;

					.item-header {

						.left {
							font-size: 26rpx;
							font-weight: bold;
							color: #3A3D71;
						}

						.right {
							image {
								width: 14rpx;
								height: 22rpx;
							}
						}
					}

					.item-time {
						margin-top: 30rpx;

						text {
							margin-left: 12rpx;
							font-size: 24rpx;
							color: #9E9E9E;
						}
					}
				}
			}
		}
	}
</style>
