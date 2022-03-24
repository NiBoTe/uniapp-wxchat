<template>
	<view class="studentList">
		<view class="header">
			<view class="tabs u-flex">
				<view class="tab" :class="faceDetectState === '' ? 'active' : ''" @click="tabClick('')">
					<view class="tab-num">{{total}}</view>
					<view class="tab-name">全部</view>
					<view class="tab-border"></view>
				</view>
				<view class="tab" :class="faceDetectState === 'tested' ? 'active' : ''" @click="tabClick('tested')">
					<view class="tab-num">{{testedCount}}</view>
					<view class="tab-name">已考</view>
					<view class="tab-border"></view>
				</view>
				<view class="tab" :class="faceDetectState === 'untested' ? 'active' : ''" @click="tabClick('untested')">
					<view class="tab-num">{{untestedCount}}</view>
					<view class="tab-name">未考</view>
					<view class="tab-border"></view>
				</view>
				<view class="tab" :class="faceDetectState === 'not_pay' ? 'active' : ''" @click="tabClick('not_pay')">
					<view class="tab-num">{{notPayCount}}</view>
					<view class="tab-name">未支付</view>
					<view class="tab-border"></view>
				</view>
			</view>

		</view>
		<scroll-view scroll-y class="scroll-warper" @scrolltolower="lower">
			<view class="list">
				<view class="item" v-for="(item, index) in list" :key="index" @click="detailTap(item)">
					<view class="item-header u-flex u-row-between">
						<view class="left u-flex">
							<view class="left-style"></view>
							<view class="left-text">{{item.name}}</view>
						</view>
						<view class="right" v-if="type !== 4">
							<text class="success" v-if="item.state === 'tested'">已考试</text>
							<text class="no" v-else-if="item.state === 'untested'">未考试</text>
							<text class="no" v-else-if="item.state === 'not_pay'">未支付</text>
						</view>
						<view class="right" v-else-if="type === 4">
							<text class="success" v-if="item.state === 'tested'">已考</text>
							<text class="error" v-else-if="item.state === 'untested'">未考</text>
							<text class="no" v-else-if="item.state === 'not_pay'">未支付</text>
						</view>
					</view>
					<view class="item-subheader u-flex u-row-between"
						:class="item.faceDetectState === -1 ? 'error' : ''">
						<view class="left">准考证号 {{item.admissionTicketCode}}</view>
						<view class="right u-flex u-row-center">
							<u-icon name="clock" color="#9E9E9E" size="30"></u-icon>
							<text>{{item.createTime}}</text>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore margin-top="30" margin-bottom="30" :status="loadStatus" @loadmore="addData"></u-loadmore>
		</scroll-view>

		<view class="footer" v-if="type !== 4">
			<view class="footer-btn" :class="name === '' ? 'disabled' : ''" @click="submitTap">批量查询</view>
		</view>
	</view>
</template>

<script>
	import drawingColumn from '@/components/drawingColumn/drawingColumn.vue'
	import {
		examDetail,
		examineeList,
	} from '@/api/exam.js'

	import moment from '@/common/moment.js'
	export default {
		components: {
			drawingColumn
		},
		data() {
			return {
				id: null,
				examDetail: {},
				drawList: [],
				loadStatus: 'loadmore',
				current: 1,
				size: 10,
				faceDetectState: '',
				course: '',
				examSubjectItem: {},
				list: [],
				untestedCount: 0, // 未考
				notPayCount: 0, // 未支付
				testedCount: 0, // 已考
				total: 0, // 全部
				type: 0, // 类型
			};
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id;
				this.type = Number(options.type);
				this.initData()
			}
		},
		methods: {
			initData() {
				this.$http.post(examDetail, {
					id: this.id
				}).then(res => {
					console.log(res)
					this.examDetail = res.data

					this.examSubjectItem = this.examDetail.examSubjectList[0]
					this.course = this.examDetail.examSubjectList[0].subjectName;
					this.getList()
				}).catch(err => {
					console.log(err)
				})
			},
			getList() {
				this.loadStatus = 'loading';
				this.$http.post(examineeList, {
					course: this.course,
					examId: this.id,
					current: this.current,
					size: this.size,
				}).then(res => {
					let data = res.data
					this.untestedCount = data.untestedCount;
					this.notPayCount = data.notPayCount;
					this.testedCount = data.testedCount
					this.total = data.total;
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
				this.getList();
			},
			// tab状态
			tabClick(tab) {
				this.faceDetectState = tab;
				this.current = 1;
				this.getList();
			},
			// 批量查询
			submitTap() {
				uni.navigateTo({
					url: `/pages/centers/achievement/cardSearch?id=${this.id}&type=${this.type}`
				})

			},
			// 查询
			detailTap(item) {

				console.log(item)

				switch (this.type) {
					case 4:
						uni.navigateTo({
							url: `/pages/centers/achievement/studentDetail?id=${item.id}`
						})
						break;
					default:
						uni.navigateTo({
							url: `/pages/centers/achievement/cardInfo?id=${this.id}&item=${JSON.stringify(item)}&type=${this.type}`
						})

				}
			},

		},
	}
</script>

<style lang="scss" scoped>
	.studentList {
		background: #F3F3F3;
		min-height: 100vh;

		.header {
			padding-top: 36rpx;
			background-color: #fff;

			.tabs {
				margin-top: 36rpx;

				.tab {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;

					&-num {
						font-size: 28rpx;
						font-weight: bold;
						color: #9E9E9E;
					}

					&-name {
						font-size: 22rpx;
						font-weight: bold;
						color: #9E9E9E;
					}


					&-border {
						margin-top: 14rpx;
						width: 62rpx;
						height: 8rpx;
						border-radius: 4rpx;
						background-color: transparent;
					}

					&.active {

						.tab-num {
							color: #3A3D71;
						}

						.tab-name {
							color: #3A3D71;
						}

						.tab-border {
							background-color: $u-type-primary;
						}
					}
				}
			}
		}
	}

	// 列表
	.scroll-warper {
		height: calc(100vh - 160rpx);

		.list {
			.item {
				margin: 28rpx 28rpx 0;
				padding: 26rpx;
				background: #FFFFFF;
				box-shadow: 0px 6rpx 16rpx 6rpx rgba(230, 230, 230, 0.5);
				border-radius: 24rpx;

				&-header {
					.left {
						font-size: 30rpx;
						font-weight: bold;
						color: #3A3D71;

						&-style {
							margin-right: 12rpx;
							width: 10rpx;
							height: 10rpx;
							border-radius: 50%;
							background: #35CE96;
						}
					}

					.right {
						text {
							font-size: 26rpx;

							&.success {
								color: #35CE96;
							}

							&.no {
								color: $u-type-primary;
							}

							&.error {
								color: #FF334D;
							}
						}

						&-btn {
							width: 136rpx;
							height: 58rpx;
							background: #EFF2FF;
							border-radius: 29rpx;

							text {
								font-size: 24rpx;
								font-weight: 500;
								color: $u-type-primary;
							}
						}
					}
				}

				&-subheader {
					margin-top: 42rpx;

					&.error {
						padding-bottom: 24rpx;

					}

					.left {
						font-size: 26rpx;
						color: #3A3D71;
					}

					.right {
						text {
							margin-left: 12rpx;
							font-size: 26rpx;
							color: #9E9E9E;
						}
					}
				}

			}
		}
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 9;
		padding: 14rpx 34rpx;
		padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
		background-color: #fff;

		&-btn {
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			background: $u-type-primary;
			box-shadow: 0px 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
			border-radius: 44rpx;
			font-size: 32rpx;
			color: #fff;

			&.disabled {
				background: #EDEFF2;
				color: #8F9091;
			}
		}
	}
</style>
