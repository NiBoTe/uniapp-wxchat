<template>
	<view class="container">

		<view class="page">
			<view class="header">
				<image :src="userInfo.bgImg"></image>

				<view class="navbar">
					<u-navbar title=" " immersive back-icon-color="#ffffff" :background="background"
						:border-bottom="false" title-color="#ffffff">
						<view slot="right" class="right">
							<image src="/static/public/teacherDynamic/d_icon_fx.png"></image>
						</view>
					</u-navbar>
				</view>
				<!-- <view class="settings" :style="{top: StatusBar + 44 + 'px'}">
					<image class="settings-back" @click="goBack" src="/static/public/teacherDynamic/d_icon_back.png">
					</image>
					
				</view> -->
			</view>
			<view class="content">
				<view class="content-header u-flex u-row-between">
					<view class="u-flex">
						<view class="head">
							<view class="head-img u-flex u-row-center">
								<u-avatar size="186" :src="userInfo.headUrl"></u-avatar>
							</view>

							<view class="head-auth">
								<image src="/static/my/no_auth.png" v-if="!userInfo.authStatus"></image>
								<image src="/static/my/auth.png" v-else></image>
							</view>
						</view>
						<view class="header-item">
							<text>关注</text>
							<text class="num">{{userInfo.followCount}}</text>
						</view>
						<view class="header-item" style="margin-left: 42rpx;">
							<text>粉丝</text>
							<text class="num">{{userInfo.fansCount}}</text>
						</view>
					</view>

					<view class="header-update u-flex u-row-center" :class="userInfo.isFollow ? 'disabled' : ''">
						<text>{{userInfo.isFollow ? '已关注' : '关注'}}</text>
					</view>
				</view>

				<view class="content-subheader">
					<view class="name">{{userInfo.fullName}}</view>
					<view class="subheader-list">
						<view class="subheader-item lable main-item">
							<view v-for="(item,index) in lableList">{{item}}</view>
						</view>
					</view>

					<view class="subheader-text u-line-2">
						{{userInfo.introduce}}
						<!-- <view class="fold" bindtap="fold" :data-text="foldText" :data-etc="textEtc"></view> -->
					</view>
				</view>

				<view class="content-rate u-flex">
					<view class="rate-item u-flex u-row-between" style="margin-right: 46rpx;">
						<view class="left u-flex">
							<image src="/static/my/book.png"></image>
							<text>高分教材</text>
						</view>
						<view class="right u-flex">
							<image src="/static/my/star.png"></image>
							<text>{{userInfo.publishScore}}</text>
						</view>
					</view>
					<view class="rate-item u-flex u-row-between">
						<view class="left u-flex">
							<image src="/static/my/pen.png"></image>
							<text>评画评分</text>
						</view>
						<view class="right u-flex">
							<image src="/static/my/star.png"></image>
							<text>{{userInfo.paintEvaluateScore}}</text>
						</view>
					</view>
				</view>

				<u-gap height="16" bg-color="#F7F7F7" margin-top="40"></u-gap>
				<u-sticky :offset-top="0" bg-color="#fff" @fixed="fixedTap" @unfixed="unfixedTap">
					<view class="tabs" :style="{paddingTop: isFixed ? StatusBar + 'px' : '0'}">
						<u-tabs ref="tabs" :is-scroll="true" :list="tabList" :current="current" bar-width="62"
							bar-height="8" gutter="40" active-color="#1B1B1B" inactive-color="#9E9E9E" font-size="30"
							@change="tabChange">
						</u-tabs>
					</view>
				</u-sticky>
				<view class="borderBottom"></view>

				<!-- 评画tabs -->
				<view class="" v-if="current == 0">
					<!-- 评画-评论类型 -->
					<view class="subtabs">
						<drawingColumn></drawingColumn>
					</view>
					<view class="content-box">
						<!-- 评画-内容 -->
						<painting-evaluation ref="PaintingEvaluation"></painting-evaluation>
					</view>
				</view>
				<!-- 高分教材 -->
				<view class="" v-if="current == 1">
					<!-- 高分教材-评论类型 -->
					<view class="subtabs">
						<drawingColumn></drawingColumn>
					</view>
					<!-- 高分教材-评论类型 -->
					<view class="content-box">
						<comment-drawing></comment-drawing>
					</view>
				</view>
				<!-- 评论 -->
				<view class="" v-if="current == 2">
					<view class="content-box">
						<dynamic></dynamic>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="footer-btn" v-if="current == 0" @click="submitTap">
				<image class="footer-img" src="/static/public/teacherDynamic/d_icon_score.png" mode=""></image>邀请评画
			</view>
		</view>
	</view>

</template>
<script>
	import drawingColumn from '@/components/drawingColumnTeachers/drawingColumn.vue'
	import PaintingEvaluation from '@/components/paintingEvaluation/paintingEvaluation.vue'
	import CommentDrawing from '@/pages/teachers/commentDrawing/paintingEvaluation.vue'
	import Dynamic from '@/pages/teachers/dynamic/dynamic.vue'

	import {
		teacherDetail
	} from '@/api/teacher.js'
	export default {
		components: {
			drawingColumn,
			PaintingEvaluation,
			CommentDrawing,
			Dynamic
		},
		data() {
			return {
				StatusBar: this.StatusBar,
				foldText: '展开',
				textEtc: '...',
				tabList: [{
					name: '评画'
				}, {
					name: '高分教材',
				}, {
					name: '动态',
				}],
				current: 0,
				swiperCurrent: 0,
				isFixed: false,
				// 标签
				lableList: [],
				userInfo: {}
			}
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id;
				this.initData();
			}
		},
		methods: {
			initData() {
				this.$http.get(teacherDetail, {
					teacherId: this.id
				}).then(res => {
					console.log(res)
					this.userInfo = res.data
					this.lableList = this.userInfo.skilledMajor ? this.userInfo.skilledMajor.split(',') : []
					console.log(this.userInfo)
				}).catch(err => {
					console.log(err)
				})
			},
			tabChange(index) {
				this.current = index
				this.swiperCurrent = index;
			},
			fixedTap(e) {
				this.isFixed = true
				this.$refs.PaintingEvaluation.noScroll(this.isFixed)
			},
			unfixedTap() {
				this.isFixed = false
				this.$refs.PaintingEvaluation.noScroll(this.isFixed)
			},
			goBack() {
				this.$mRouter.back();
			},
			// 邀请评画
			submitTap() {}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		position: relative;
		height: 100vh;

		.page {
			.header {
				position: relative;
				height: 440rpx;

				image {
					width: 100%;
					height: 440rpx;
				}

				.settings {
					position: absolute;
					z-index: 9;
					right: 34rpx;
					left: 34rpx;
					display: flex;
					justify-content: space-between;

					image {
						width: 72rpx;
						height: 72rpx;
					}

					&-back {
						width: 20rpx !important;
						height: 36rpx !important;
						;
					}
				}
			}


			.content {
				margin-top: -100rpx;
				position: relative;
				background-color: #fff;
				border-radius: 40rpx 40rpx 0px 0px;

				&-header {
					padding: 0 34rpx;

					.head {
						margin-top: -72rpx;
						margin-right: 42rpx;

						&-img {
							position: relative;
							width: 202rpx;
							height: 202rpx;
							background-color: #fff;
							border-radius: 50%;
							overflow: hidden;

							image {
								width: 186rpx;
								height: 186rpx;
								border-radius: 50%;
							}
						}

						&-auth {
							position: relative;
							z-index: 9;
							margin-top: -28rpx;
							display: flex;
							justify-content: center;

							image {
								width: 136rpx;
								height: 46rpx;

							}
						}
					}


					.header-item {
						display: flex;
						flex-direction: column;
						align-items: center;

						text {
							font-size: 24rpx;
							color: #888C90;

							&.num {
								display: block;
								margin-top: 18rpx;
								font-size: 30rpx;
								font-weight: 800;
								color: #3A3D71;
							}
						}
					}

					.header-update {
						width: 190rpx;
						height: 68rpx;
						line-height: 68rpx;
						background: #F3F3F3;
						border-radius: 34rpx;
						font-size: 24rpx;
						font-weight: bold;
						color: $u-type-primary;

						&.disabled {
							font-weight: 500;
							color: #888C90;
						}
					}
				}


				&-subheader {
					padding: 42rpx 28rpx 18rpx 34rpx;

					.name {
						font-size: 40rpx;
						font-weight: 600;
						color: #1B1B1B;
					}

					.subheader-list {
						margin-top: 18rpx;

						.lable {
							display: flex;

							view {
								width: 84rpx;
								height: 42rpx;
								background: #EFF2FF;
								border-radius: 21px;
								margin-right: 30rpx;
								font-size: 24rpx;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: #676A8B;
								line-height: 42rpx;
								margin-bottom: 20rpx;
								text-align: center;
							}
						}
					}

					.subheader-text {
						margin-top: 14rpx;
						position: relative;
						line-height: 46rpx;
						font-size: 26rpx;
						color: #3A3D71;

						.fold::before {
							//设置在文本下面的展开按钮那一部分，此部分的前面设置——...省略号，并通过绝对定位设置在超出部分的后面
							content: attr(data-etc);
							position: absolute;
							left: 0;
							transform: translateX(4rpx);

						}

						.fold::after {
							//设置文本下面的展开按钮的那一部分，此部分的后面设置——展开  展开按钮，并通过绝对定位设置在省略号的后面
							content: attr(data-text);
							position: absolute;
							right: 0;
							color: $u-type-primary;
						}

						.fold {
							//展开按钮的那一部分，同样设置绝对定位，并设置宽高，将通过样式实现的省略号遮住，同时将::before和::after展开的内容设置在里面
							width: 110rpx;
							height: 45rpx;
							position: absolute;
							right: 0;
							bottom: 0;
							background-color: #fff;
						}

						.foldIntroduct {
							//出现此样式名时，设置不出现省略号和展开按钮
							-webkit-line-clamp: inherit !important;
						}
					}
				}



				&-rate {
					padding: 0 32rpx 0 36rpx;

					.rate-item {
						flex: 1;
						height: 68rpx;
						background: linear-gradient(270deg, rgba(248, 250, 255, 0) 0%, #EFF2FF 100%);
						border-radius: 12rpx;

						.left {
							image {
								margin-left: 24rpx;
								width: 30rpx;
								height: 30rpx;
							}

							text {
								margin-left: 14rpx;
								font-size: 24rpx;
								color: #3A3D71;
							}
						}

						.right {

							image {
								width: 26rpx;
								height: 26rpx;
							}

							text {
								margin-left: 12rpx;
								font-size: 28rpx;
								font-weight: 800;
								color: #676A8B;
							}
						}
					}
				}

				.tabs {
					padding-top: 4rpx;
					background-color: #fff;
				}

				.borderBottom {
					margin-top: -10rpx;
					height: 2rpx;
					border: 2rpx solid #E9E9E9;
				}

				.subtabs {
					// padding: 28rpx 0;
					padding-top: 28rpx;
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
		z-index: 9999;

		&-img {
			width: 38rpx;
			height: 38rpx;
			vertical-align: middle;
			margin-right: 8rpx;
		}

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

	/deep/ .u-tab-item {
		font-weight: 400;
	}

	/deep/ .u-tab-bar {
		background-color: $u-type-primary !important;
	}
</style>
