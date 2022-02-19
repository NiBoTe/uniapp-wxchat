<template>
	<view class="top">
		<view class="header">
			<drawingColumn v-if="examDetail.examSubjectList" ref="DrawingColumn" :list="examDetail.examSubjectList"
				key-name="subjectName" @change="tabChange"></drawingColumn>
			<view class="tabs u-flex">
				<view class="tab" :class="faceDetectState === '' ? 'active' : ''" @click="tabClick('')">
					<view class="tab-num">339</view>
					<view class="tab-name">全部</view>
					<view class="tab-border"></view>
				</view>
				<view class="tab" :class="faceDetectState === 1 ? 'active' : ''" @click="tabClick(1)">
					<view class="tab-num">339</view>
					<view class="tab-name">验证成功</view>
					<view class="tab-border"></view>
				</view>
				<view class="tab" :class="faceDetectState === -1 ? 'active' : ''" @click="tabClick(-1)">
					<view class="tab-num">339</view>
					<view class="tab-name">验证失败</view>
					<view class="tab-border"></view>
				</view>
				<view class="tab" :class="faceDetectState === 0 ? 'active' : ''" @click="tabClick(0)">
					<view class="tab-num">339</view>
					<view class="tab-name">未验证</view>
					<view class="tab-border"></view>
				</view>
			</view>

		</view>
		<scroll-view scroll-y class="scroll-warper" @scrolltolower="lower">
			<view class="list">
				<view class="item">
					<view class="item-header u-flex u-row-between">
						<view class="left u-flex">
							<view class="left-style"></view>
							<view class="left-text">朱明义</view>
						</view>
						<view class="right">
							<text class="success">验证成功</text>
							<text class="no">未验证</text>

							<view class="right-btn u-flex u-row-center">
								<text>去验证</text>
							</view>
						</view>
					</view>

					<view class="item-subheader u-flex u-row-between error">
						<view class="left">准考证号 E000002021098</view>
						<view class="right u-flex u-row-center">
							<u-icon name="clock" color="#9E9E9E" size="30"></u-icon>
							<text>2022-02-11</text>
						</view>
					</view>

					<view class="item-footer u-flex u-row-between">
						<view class="left">失败原因：人脸识别信息有误</view>
						<view class="right">
							<text class="error">验证失败</text>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore :status="loadStatus" @loadmore="addData"></u-loadmore>
		</scroll-view>
		<view class="footer">
			<view class="footer-btn" @click="submitTap">去考试</view>
		</view>
	</view>
</template>

<script>
	import drawingColumn from '@/components/drawingColumn/drawingColumn.vue'
	import {
		examDetail,
		faceDetectExamineeList
	} from '@/api/exam.js'
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
				list: []
			};
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id;
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
				}).catch(err => {
					console.log(err)
				})
			},
			getList() {
				this.loadStatus = 'loading';
				this.$http.post(faceDetectExamineeList, {
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
				this.getList();
			},
			tabChange(e) {
				console.log(e)
			},
			// tab状态
			tabClick(tab) {
				this.faceDetectState = tab;
				this.current = 1;
				this.getList();
			}
		},
	}
</script>

<style lang="scss" scoped>
	.top {
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
						border-bottom: 2rpx solid #E9E9E9;
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

				&-footer {
					margin-top: 24rpx;

					.left {
						font-size: 26rpx;
						color: #9E9E9E;
					}

					.right {
						text {
							&.error {
								font-size: 26rpx;
								color: #FF334D;
							}
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
