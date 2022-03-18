<template>
	<view class="top">
		<view class="navbar">
			<u-navbar title="考试详情" back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>

		<view class="content">
			<view class="card">
				<view class="card-header u-flex">
					<view class="left">
						<image :src="detail.url" mode="scaleToFill">
						</image>
						<view class="left-badge u-flex u-row-center" @click="prevViewTap">
							<image src="/static/public/search_white.png"></image>
						</view>

					</view>

					<view class="right">
						<view class="right-title">{{detail.name}}</view>
						<view class="right-subtitle">考试编码：{{detail.no}}</view>
						<view class="right-bottom u-flex u-row-between">
							<view class="right-bottom-left">考试费用</view>
							<view class="right-bottom-right u-flex">
								<text>¥</text>
								<text>{{(detail.price / 100).toFixed(2)}}</text>
							</view>
						</view>
					</view>
				</view>

				<view class="card-times">
					<view class="card-time u-flex u-row-between">
						<view class="left u-flex">
							<image src="/static/public/time.png"></image>
							<text>报名日期</text>
						</view>
						<view class="right">
							<text>{{detail.enrollStartTime}}至{{detail.enrollEndTime}}</text>
						</view>
					</view>
					<view class="card-time u-flex u-row-between">
						<view class="left u-flex">
							<image src="/static/public/time.png"></image>
							<text>考试日期</text>
						</view>
						<view class="right">
							<text>{{detail.examStartTime}}至{{detail.examEndTime}}</text>
						</view>
					</view>
				</view>

				<view class="gaps" v-if="detail.auditState !== 'auditing'"></view>
				<view class="card-label u-flex" v-if="detail.auditState !== 'auditing'">
					<image src="/static/public/DELE.png"></image>
					<text>考试简介</text>
				</view>

				<view class="card-text" v-if="detail.auditState !== 'auditing'">
					<text>{{detail.remark}}</text>
				</view>
			</view>

			<!-- 审核状态 -->
			<view class="card card-examine u-flex" v-if="detail.auditState === 'auditing'">
				<image :src="setSrc('top_review.png')"></image>
				<text>【审核中】主办方修改考试信息</text>
			</view>

			<!-- 考试简介 -->
			<view class="card" v-if="detail.auditState === 'auditing'">
				<view class="card-label u-flex">
					<image src="/static/public/DELE.png"></image>
					<text>考试简介</text>
				</view>

				<view class="card-text">
					<text>{{detail.remark}}</text>
				</view>
			</view>

			<!-- 考试科目 -->

			<view class="card">
				<view class="card-label u-flex">
					<image src="/static/public/course.png"></image>
					<text>考试科目</text>
				</view>

				<view class="card-list">
					<view class="card-item u-flex u-row-between" v-for="(item, index) in detail.examSubjectList"
						:key="index">
						<view class="left">
							<text>{{item.subjectName}}</text>
							<text class="time" v-if="type === 2">考试时间：{{item.subjectStarttime}}-{{item.subjectEndtime}}</text>
						</view>
						<view class="right" v-if="type !== 2">
							<text>{{item.subjectDate}}</text>
							<text>{{item.subjectStarttime}}-{{item.subjectEndtime}}</text>
						</view>

						<view class="right u-flex" v-else @click="seeTestTap(item)">
							<text class="see">查看考题</text>
							<image src="/static/public/arrow_right.png"></image>
						</view>
					</view>

				</view>
			</view>


			<!-- 考试地址 -->
			<view class="card" v-if="type !== 2">
				<view class="card-label u-flex">
					<image src="/static/public/address.png"></image>
					<text>考试地址</text>
				</view>

				<view class="card-address">
					<view class="card-address-item" v-for="(item, index) in examAddressList" :key="index">
						<view class="card-address-code">{{item.letter}}</view>
						<view class="card-address-text" v-for="(itemc, indexc) in item.data">{{itemc.examAddress}}</view>
					</view>
				</view>
			</view>


			<!-- 考生信息 -->
			<view class="card" v-if="type === 2" style="padding-top: 32rpx;" @click="studentTap">
				<view class="card-label u-flex u-row-between">
					<view class="left u-flex">
						<image src="/static/public/exam_people.png"></image>
						<text>考生信息</text>
					</view>
					<view class="right">
						<image src="/static/public/arrow_right.png"></image>
					</view>
				</view>
			</view>
		</view>


		<view class="footer" v-if="type === 0">
			<view class="footer-btn" v-if="!detail.errorState" :class="!isSignUp ? 'disabled' : ''" @click="submitTap">
				{{moment(detail.enrollEndTime).diff(moment(), 'days') >= 0 ? '立即报名' : '报名截止'}}</view>
				
				<view class="footer-btn disabled" v-else>
					{{detail.errorState === 'delay' ? '立即报名' : '考试已取消'}}</view>
		</view>
		<view class="footer" v-if="type === 1">
			<view class="footer-btn" @click="submitNoTap" :class="!detail.errorState ? '' : 'disabled'">去考试</view>
		</view>

		<top-tips ref="TopTips" @enterClick="enterClick"></top-tips>

		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
	import TopTips from './components/top-tips.vue'
	
	import moment from '@/common/moment.js'
	import {
		examDetail
	} from '@/api/exam.js'
	export default {
		components: {
			TopTips
		},
		data() {
			return {
				moment,
				id: null,
				loading: true,
				detail: {},
				examAddressList: [],
				background: {
					backgroundImage: "url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png')",
					backgroundSize: 'cover',
				},
				type: 0,
				isSignUp: false,
			};
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id;
				this.type = Number(options.type);
				this.initData();
			}

		},
		methods: {
			initData() {
				this.$http.post(examDetail, {
					id: this.id
				}).then(res => {
					this.detail = res.data;
					this.examAddressList = this.$mHelper.segSort(this.detail.examAddressList, 'examAddress')
					this.isSignUp = this.diffSignUp();
					this.loading = false;
				}).catch(err => {
					console.log(err)
				})
			},
			submitTap() {
				if(!this.isSignUp){
					return
				}
				const checked = uni.getStorageSync('examChecked')
				if (checked) {
					this.$mRouter.push({
						route: `/pages/public/top/signUp?id=${this.id}`
					})
				} else {
					this.$refs.TopTips.open();
				}
			},
			enterClick() {
				this.$mRouter.push({
					route: `/pages/public/top/signUp?id=${this.id}`
				})
			},
			// 预览图片
			prevViewTap() {
				uni.previewImage({
					urls: [this.detail.urlHd],
					current: 0
				})
			},
			// 查看考生
			studentTap() {
				// console.log(';========')
				this.$mRouter.push({
					route: `/pages/public/top/studentList?id=${this.id}`
				})
			},
			// 查看考试
			seeTestTap(item) {
				console.log(item)
				this.$mRouter.push({
					route: `/pages/public/top/testContent?examId=${this.id}&examSubjectItem=${JSON.stringify(item)}&type=${this.type}`
				})
			},
			// 去考试
			submitNoTap(){
				this.$mRouter.push({
					route: `/pages/public/top/studentList?id=${this.id}&type=${this.type}`
				})
			},
			// 是否可以报名
			diffSignUp() {
				return this.$mHelper.timeInByDate(`${this.detail.enrollStartTime} 00:00:00`, `${this.detail.enrollEndTime} 23:59:59`) > 0
			},
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		height: calc(100vh);
		background-color: #F3F3F3;
	}

	.content {
		height: calc(100vh - 146rpx);
		overflow: auto;
		padding-bottom: calc(134rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(134rpx + env(safe-area-inset-bottom));

		.card {
			margin: 20rpx 34rpx 0 28rpx;
			padding: 20rpx 20rpx 34rpx;
			background: #FFFFFF;
			border-radius: 24rpx;

			&-header {
				border-bottom: 2rpx solid #E9E9E9;
				padding-bottom: 38rpx;

				.left {
					position: relative;
					border-radius: 16rpx;
					overflow: hidden;
					width: 248rpx;
					height: 248rpx;

					&>image {
						width: 100%;
						height: 100%;
					}

					&-badge {
						position: absolute;
						right: 0;
						bottom: 0;
						width: 64rpx;
						height: 64rpx;
						border-top-left-radius: 40rpx;
						background: rgba($color: #000000, $alpha: .5);

						image {
							width: 34rpx;
							height: 34rpx;
						}
					}
				}

				.right {
					height: 248rpx;
					flex: 1;
					margin-left: 20rpx;
					padding-top: 20rpx;

					&-title {
						font-size: 28rpx;
						font-weight: bold;
						color: #3A3D71;
						line-height: 36rpx;
					}

					&-subtitle {
						margin-top: 16rpx;
						font-size: 26rpx;
						color: #3A3D71;
					}

					&-bottom {
						margin-top: 30rpx;

						&-left {
							font-size: 26rpx;
							color: #3A3D71;
						}

						&-right {
							align-items: flex-end;
							font-size: 34rpx;
							font-weight: 800;
							color: #35CE96;

							text {
								font-size: 28rpx;
								font-weight: bold;
								color: #35CE96;
							}
						}
					}
				}
			}



			&-times {
				.card-time {
					margin-top: 34rpx;

					.left {
						image {
							width: 28rpx;
							height: 28rpx;
						}

						text {
							margin-left: 18rpx;
							font-size: 26rpx;
							font-weight: bold;
							color: #3A3D71;
						}
					}

					.right {
						text {
							font-size: 26rpx;
							color: #3A3D71;
						}
					}
				}
			}

			// 审核状态
			&.card-examine {
				padding-bottom: 20rpx;

				image {
					width: 48rpx;
					height: 48rpx;
				}

				text {
					margin-left: 14rpx;
					font-size: 26rpx;
					font-weight: bold;
					color: #FF334D;
				}
			}


			&-label {


				image {
					width: 48rpx;
					height: 48rpx;
				}

				.right {
					image {
						width: 12rpx;
						height: 22rpx;
					}
				}

				text {
					margin-left: 14rpx;
					font-size: 26rpx;
					font-weight: bold;
					color: #3A3D71;
				}
			}

			&-text {
				margin-top: 18rpx;

				text {
					font-size: 26rpx;
					color: #3A3D71;
					line-height: 36rpx;
				}
			}

			// 考试科目
			&-list {

				.card-item {
					padding: 22rpx 0;
					border-bottom: 2rpx solid #E9E9E9;

					.left {



						text {
							font-size: 26rpx;
							font-weight: 500;
							color: #3A3D71;

							&.time {
								margin-left: 16rpx;
								font-size: 19rpx;
								color: #9E9E9E;
							}
						}
					}

					.right {
						text {
							font-size: 26rpx;
							color: #9E9E9E;

							&:last-of-type {
								margin-left: 20rpx;
								color: #3A3D71;
							}

							&.see {
								font-size: 24rpx;
								color: #9E9E9E;
							}
						}


						image {

							margin-left: 8rpx;
							width: 12rpx;
							height: 22rpx;
						}
					}
				}
			}


			// 考试地址

			&-address {
				&-item {
					border-bottom: 2rpx solid #E9E9E9;

					.card-address-code {
						margin: 28rpx 0 24rpx;
						font-size: 28rpx;
						font-weight: 500;
						color: #3A3D71;
					}

					.card-address-text {
						margin-bottom: 26rpx;
						font-size: 26rpx;
						color: #3A3D71;
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

	// 间隔
	.gaps {
		height: 2rpx;
		background: #E9E9E9;
		margin: 36rpx 0 22rpx 0;
	}
</style>
