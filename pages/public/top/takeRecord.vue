<template>
	<view class="top">
		<view class="navbar" :style="{paddingTop: StatusBar - 20 + 'px'}">
			<u-navbar title="拍摄记录" immersive back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>

		<view class="tabs">
			<view class="tabs-header">{{examDetail.name}}</view>
			<view class="tabs-content">
				<u-tabs ref="tabs" :is-scroll="true" :list="tabList" name="subjectName" :current="tabCurrent"
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
							<view class="left u-flex">
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
							<view class="right u-flex u-row-center" :class="!timeInByDate(item) && item.faceDetectState !== 1 ? 'disabled' : ''" v-if="item.uploadState=== 'not_uploaded'">去上传</view>
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
		examPaperList,
		getSubjectNameList,
		searchByAdmissionTicketCode
	} from '@/api/exam.js'
	export default {
		data() {
			return {
				id: null,
				StatusBar: this.StatusBar,
				examDetail: {},
				tabList: [],
				type: 0,
				examSubjectItem: {},
				tabCurrent: 0,
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
			if (options.id && options.id !== 'null') {
				this.id = options.id;
				this.type = options.type;
				this.initData()
			} else {
				this.initData()
			}

		},
		methods: {
			initData() {
				console.log(this.id)
				if (this.id != null) {
					this.$http.post(examDetail, {
						id: this.id
					}).then(res => {
						this.examDetail = res.data
						this.tabList = this.examDetail.examSubjectList;
						this.examSubjectItem = this.examDetail.examSubjectList[0]
						this.getList();
					}).catch(err => {
						console.log(err)
					})
				} else {
					this.$http.post(getSubjectNameList).then(res => {
						let list = []
						let data = res.data;
						data.map(item => {
							list.push({
								subjectName: item
							})
						})

						this.tabList = list;
						this.examSubjectItem = list[0]
						this.getList();
					}).catch(err => {
						console.log(err)
					})
				}

			},
			getList() {
				this.loadStatus = 'loading';
				this.$http.post(examPaperList, {
					course: this.examSubjectItem.subjectName,
					examId: this.id,
					uploadState: this.statusList[this.statusIndex].value,
					size: this.size,
					current: this.current,
				}).then(res => {
					this.total = res.data.total;
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
			// tab切换
			tabChange(e) {
				this.tabCurrent = e;
				this.examSubjectItem = this.tabList[e];
				this.current == 1;
				this.getList();
			},
			// 状态
			tabDrawChange(e) {
				console.log(e)
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
			detailTap(item, index) {

				if (item.uploadState !== 'uploaded') {
					this.$http.post(searchByAdmissionTicketCode, {
						admissionTicketCode: item.admissionTicketCode,
						course: item.course
					}).then(res => {
						let detail = res.data[0];
						if (!this.$mHelper.timeInByDate(detail.uploadPaperStarttime, detail.uploadPaperEndtime)) {
							return this.$mHelper.toast('试卷上传时间已过')
						}
						
						if (detail.faceDetectState !== 1) {
							return this.$mHelper.toast('人脸认证未通过')
						}
						uni.navigateTo({
							url: `/pages/public/top/testUpload?id=${this.id}&type=${this.type}&code=${item.admissionTicketCode}&uploadState=${item.uploadState}&course=${item.course}&statusIndex=${this.statusIndex}&img=${item.img}`
						})
					}).catch(err => {
						this.$mHelper.toast(err.msg)
					})
				} else {
					uni.navigateTo({
						url: `/pages/public/top/testUpload?id=${this.id}&type=${this.type}&code=${item.admissionTicketCode}&uploadState=${item.uploadState}&course=${item.course}&statusIndex=${this.statusIndex}&img=${item.img}`
					})
				}
			},
			timeInByDate(item){
				return this.$mHelper.timeInByDate(item.uploadPaperStarttime, item.uploadPaperEndtime)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		height: calc(100vh);
		background-color: #F3F3F3;

		.navbar {
			height: 206rpx;
			box-sizing: content-box;
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
							&.disabled {
								background: #F2F2F2;
								color: #9E9E9E;
							}
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
