<template>
	<view class="top">
		<view class="header">
			<drawingColumn v-if="examDetail.examSubjectList" ref="DrawingColumn" :list="examDetail.examSubjectList"
				key-name="subjectName" @change="tabChange"></drawingColumn>
			<view class="tabs u-flex" v-if="examSubjectItem.isFaceDetect">
				<view class="tab" :class="faceDetectState === '' ? 'active' : ''" @click="tabClick('')">
					<view class="tab-num">{{total}}</view>
					<view class="tab-name">全部</view>
					<view class="tab-border"></view>
				</view>
				<view class="tab" :class="faceDetectState === 1 ? 'active' : ''" @click="tabClick(1)">
					<view class="tab-num">{{successCount}}</view>
					<view class="tab-name">验证成功</view>
					<view class="tab-border"></view>
				</view>
				<view class="tab" :class="faceDetectState === -1 ? 'active' : ''" @click="tabClick(-1)">
					<view class="tab-num">{{failCount}}</view>
					<view class="tab-name">验证失败</view>
					<view class="tab-border"></view>
				</view>
				<view class="tab" :class="faceDetectState === 0 ? 'active' : ''" @click="tabClick(0)">
					<view class="tab-num">{{notDetecteCount}}</view>
					<view class="tab-name">未验证</view>
					<view class="tab-border"></view>
				</view>
			</view>
			
			<view class="all" v-else>
				<text>全部</text>
				<text>{{total}}人</text>
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
						<view class="right" v-if="examSubjectItem.isFaceDetect">
							<text class="success" v-if="item.faceDetectState === 1">验证成功</text>
							<text class="no" v-else-if="item.faceDetectState === 0">未验证</text>

							<view class="right-btn u-flex u-row-center" v-else-if="item.faceDetectState === -1">
								<text>去验证</text>
							</view>
						</view>
					</view>
					<view class="item-subheader u-flex u-row-between" :class="item.faceDetectState === -1 ? 'error' : ''">
						<view class="left">准考证号 {{item.admissionTicketCode}}</view>
						<view class="right u-flex u-row-center">
							<u-icon name="clock" color="#9E9E9E" size="30"></u-icon>
							<text>{{item.createTime}}</text>
						</view>
					</view>

					<view class="item-footer u-flex u-row-between" v-if="item.faceDetectState === -1">
						<view class="left">失败原因：{{item.faceDetectError}}</view>
						<view class="right">
							<text class="error">验证失败</text>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore margin-top="30" margin-bottom="30" :status="loadStatus" @loadmore="addData"></u-loadmore>
		</scroll-view>
		<view class="footer" v-if="type === 1">
			<view class="footer-btn" @click="submitTap">去考试</view>
		</view>
	</view>
</template>

<script>
	import drawingColumn from '@/components/drawingColumn/drawingColumn.vue'
	import {
		examDetail,
		faceDetectExamineeList,
		faceDetectGetEidToken,
		faceDetectGetEidResult
	} from '@/api/exam.js'

	import moment from '@/common/moment.js'

	import {
		startEid
	} from '@/mp_ecard_sdk/main';
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
				failCount: 0, // 失败数量
				notDetecteCount: 0, // 未验证数量
				successCount: 0, //成功数量
				total: 0, // 全部
				type: 0, // 考试状态
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
				this.$http.post(faceDetectExamineeList, {
					course: this.course,
					examId: this.id,
					current: this.current,
					size: this.size,
					faceDetectState: this.faceDetectState
				}).then(res => {
					let data = res.data
					this.failCount = data.failCount;
					this.notDetecteCount = data.notDetecteCount;
					this.successCount = data.successCount
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
			tabChange(e) {
				this.course = e.item.subjectName;
				this.examSubjectItem = e.item;
				this.current = 1;
				this.getList()
			},
			// tab状态
			tabClick(tab) {
				this.faceDetectState = tab;
				this.current = 1;
				this.getList();
			},
			// 去考试
			submitTap() {

				this.$mRouter.push({
					route: `/pages/public/top/testContent?examId=${this.id}&examSubjectItem=${JSON.stringify(this.examSubjectItem)}&type=${this.type}`
				})
				// if(moment(`${this.examDetail.examStartTime} ${this.examSubjectItem.subjectStarttime}`).diff(moment(), 'seconds') > 0) {

				// } else {
				// 	this.$mRouter.push({
				// 		route: `/pages/public/top/testRecording?id=${this.id}&course=${this.course}&type=${this.type}`
				// 	})
				// }

			},
			// 验证
			detailTap(item) {
				if (item.faceDetectState !== 1) {
					this.faceVerify(item.id)
				}
			},
			faceVerify(id) {
				this.$http.post(faceDetectGetEidToken, {
					course: this.course,
					id
				}).then(res => {
					this.goSDK(res.data)
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			},
			// 示例方法
			goSDK(token) {
				const _this = this
				startEid({
					data: {
						token,
					},
					verifyDoneCallback(res) {
						const {
							token,
							verifyDone
						} = res;
						console.log('收到核身完成的res:', res);
						console.log('核身的token是:', token);
						console.log('是否完成核身:', verifyDone);
						_this.isVerifyDone(token);
					},
				});
			},
			// 验证是否成功
			isVerifyDone(token) {
				this.$http.get(faceDetectGetEidResult, {
					token
				}).then(res => {
					console.log('是否验证成功============', res)
					this.current = 1;
					this.getList();
				}).catch(err => {
					this.$mHelper.toast(err.msg)
					this.current = 1;
					this.getList();
				})
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
					padding-top: 24rpx;
					border-top: 2rpx solid #E9E9E9;

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
	
	// 全部
	.all{
		padding: 26rpx 0 24rpx 32rpx;
		text{
			font-size: 22rpx;
			font-weight: bold;
			color: #3A3D71;
			
			&:last-of-type{
				margin-left: 14rpx;
				font-size: 28rpx;
			}
		}
	}
</style>
