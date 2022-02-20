<template>
	<view class="top">
		<view class="navbar">
			<u-navbar title="拍摄记录" immersive back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>

		<view class="tabs">
			<view class="tabs-header">{{examDetail.name}}</view>
			<view class="tabs-content">
				<u-tabs ref="tabs" :is-scroll="true" :list="tabList" name="subjectName" :current="current"
					bar-width="62" bar-height="8" gutter="40" active-color="#1B1B1B" inactive-color="#9E9E9E"
					font-size="30" @change="tabChange">
				</u-tabs>
			</view>
		</view>

		<view class="subtabs">
			<drawingColumn ref="DrawingColumn" :list="statusList" key-name="name" @change="tabDrawChange"
				active-color="#ffffff"></drawingColumn>
			<view class="right">人数：{{total}}人</view>
		</view>

		<view class="content">
			<scroll-view scroll-y scroll-with-animation class="scroll-warper" @scrolltolower="lower">
				<view class="list">
					<view class="item" v-for="(item, index) in list" :key="index" @click="detailTap(item, index)">
						<view class="item-header u-flex u-row-between">
							<view class="left">
								<view class="item-style"></view>
								<text>{{item.name || ''}}</text>
							</view>

							<view class="right" v-if="item.uploadState === 'uploaded'">
								<text>查看详情</text>
								<image src="/static/public/arrow_right.png"></image>
							</view>
						</view>

						<view class="item-content u-flex u-row-between">
							<view class="left">
								<text>身份证号：{{item.identification || '—'}}</text>
								<text>准考证号：{{item.admissionTicketCode || ''}}</text>
							</view>

							<view class="right u-flex u-row-center" v-if="item.uploadState=== 'not_uploaded'">去上传</view>
						</view>
					</view>
				</view>

				<u-loadmore margin-top="30" margin-bottom="30" :status="loadStatus" @loadmore="addData"></u-loadmore>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		examDetail,
		examPaperList
	} from '@/api/exam.js'
	export default {
		data() {
			return {
				id: null,
				examDetail: {},
				tabList: [],
				type: 0,
				examSubjectItem: {},
				current: 0,
				statusList: [{
						name: '未上传',
						value: 'not_uploaded'
					},
					{
						name: '已上传',
						value: 'uploaded'
					}
				],
				statusIndex: 0,
				current: 1,
				size: 10,
				total: 0,
				list: [], // 考试列表
			};
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id;
				this.type = options.type;
				this.initData()
			}
		},
		methods: {
			initData() {
				this.$http.post(examDetail, {
					id: this.id
				}).then(res => {
					this.examDetail = res.data
					this.tabList = this.examDetail.examSubjectList;
					this.examSubjectItem = this.examDetail.examSubjectList[0]
					// this.getList();
				}).catch(err => {
					console.log(err)
				})
			},
			getList() {
				this.loadStatus = 'loading';
				this.$http.post(examPaperList, {
					course: this.examSubjectItem.subjectName,
					examId: this.examId,
					uploadState: this.statusList[this.statusIndex].value,
					size: this.size,
					current: this.current,
				}).then(res => {
					this.total = res.data.total;
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
				})

			},
			// tab切换
			tabChange(e) {
				this.current = e;
				this.examSubjectItem = this.tabList[e];
				this.current == 1;
				this.getList();
			},

			// 状态
			tabDrawChange(e) {
				this.statusIndex = e.index
				this.current == 1;
				this.getList();
			},
			lower() {
				this.loadStatus = 'loading';
				this.addData();
			},
			addData() {
				this.current++;
				this.getList();
			},
			// 查看详情
			detailTap(item, index){
				uni.navigateTo({
					url: `/pages/public/top/testUpload?id=${this.id}&type=${this.type}&code=${item.admissionTicketCode}&uploadState=${item.uploadState}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		height: calc(100vh);
		background-color: #F3F3F3;

		.navbar {
			height: 206rpx;
			background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png');
			background-size: cover;
		}

		.tabs {
			margin-top: -55rpx;

			width: 100%;
			background-color: #fff;
			border-radius: 40rpx 40rpx 0px 0px;

			&-header {
				padding: 28rpx 0;
				text-align: center;
				font-size: 30rpx;
				font-weight: bold;
				color: #3A3D71;
				border-bottom: 2rpx solid #E9E9E9;
			}
		}

		.subtabs {

			margin: 28rpx 40rpx 24rpx 10rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.right {
				font-size: 24rpx;
				color: #868686;
			}
		}


		.content {
			.list {
				.item {
					margin: 0 40rpx 28rpx;
					background: #FFFFFF;
					border-radius: 24rpx;

					&-header {

						margin-right: 24rpx;
						padding: 32rpx 0 28rpx 0;

						.left {
							.item-style {
								margin-right: 14rpx;
								width: 10rpx;
								height: 32rpx;
								background: #2C3AFF;
								border-radius: 0px 4rpx 4rpx 0px;
							}

							text {
								font-size: 26rpx;
								font-weight: 800;
								color: #3A3D71;
							}
						}

						.right {
							text {
								margin-right: 8rpx;
								font-size: 24rpx;
								color: #9E9E9E;
							}

							image {
								width: 12rpx;
								height: 22rpx;
							}
						}
					}


					&-content {
						margin: 0 24rpx 0 22rpx;
						padding-bottom: 32rpx;
						border-top: 2rpx solid #E9E9E9;

						.left {
							display: flex;
							flex-direction: column;

							text {
								display: inline-block;
								margin-top: 18rpx;
								font-size: 26rpx;
								color: #3A3D71;
							}
						}

						.right {
							width: 128rpx;
							height: 62rpx;
							background: #EFF2FF;
							border-radius: 31rpx;
							font-size: 26rpx;
							font-weight: 500;
							color: $u-type-primary;
						}
					}
				}
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
