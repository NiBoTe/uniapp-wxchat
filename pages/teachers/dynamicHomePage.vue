<template>
	<view class="container">

		<view class="page">
			<view class="header">
				<image :src="userInfo.bgUrl"></image>

				<view class="navbar">
					<u-navbar title=" " immersive back-icon-color="#ffffff" :background="background"
						:border-bottom="false" title-color="#ffffff">
						<!-- <view slot="right" class="navbar-right">
							<image src="/static/public/teacherDynamic/d_icon_fx.png"></image>
						</view> -->
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
							<text class="num">{{userInfo.fansCount || 0}}</text>
						</view>
					</view>

					<view class="header-update u-flex u-row-center" @click.stop="followTap"
						:class="userInfo.isFollow ? 'disabled' : ''">
						<text>{{userInfo.isFollow ? '已关注' : '关注'}}</text>
					</view>
				</view>

				<view class="content-subheader">
					<view class="name">{{userInfo.fullName || ''}}</view>
					<view class="subheader-list">
						<view class="subheader-item lable main-item">
							<view v-for="(item,index) in lableList">{{item}}</view>
						</view>
					</view>

					<view class="subheader-text" v-if="userInfo.introduce">
						<expandable-text :line="2" expandText="全文" foldText="收起">
							{{userInfo.introduce}}
						</expandable-text>
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
							<text>{{userInfo.publishScore || 5}}</text>
						</view>
					</view>
					<view class="rate-item u-flex u-row-between">
						<view class="left u-flex">
							<image src="/static/my/pen.png"></image>
							<text>评画评分</text>
						</view>
						<view class="right u-flex">
							<image src="/static/my/star.png"></image>
							<text>{{userInfo.paintEvaluateScore || 5}}</text>
						</view>
					</view>
				</view>

				<u-gap height="16" bg-color="#F7F7F7" margin-top="40"></u-gap>
				<view class="content-tabs">
					<u-sticky bg-color="#fff" @fixed="fixedTap" @unfixed="unfixedTap">
						 <!-- :style="{paddingTop: isFixed ? StatusBar + 'px' : '0'}" -->
						<view class="tabs" :style="{paddingTop: isFixed ? StatusBar + 'px' : '0'}">
							<u-tabs ref="tabs" :is-scroll="true" :list="tabList" :current="current" bar-width="62"
								bar-height="8" gutter="40" active-color="#1B1B1B" inactive-color="#9E9E9E" font-size="30"
								@change="tabChange">
							</u-tabs>
						</view>
					</u-sticky>
				</view>

				<!-- 评画tabs -->
				<view class="" v-show="current == 0">
					<!-- 评画-评论类型 -->
					<u-gap height="16" bg-color="#F7F7F7"></u-gap>
					<view class="subtabs" v-if="tagPaintList.length">
						<drawingColumn ref="DrawingColumn" :list="tagPaintList" key-name="name">
						</drawingColumn>
					</view>
					<view class="content-box">
						<!-- 评画-内容 -->
						<painting-evaluation ref="PaintingEvaluation" :teacherId="id" @unfixedTap="unfixedTap" source="home"></painting-evaluation>
					</view>
				</view>
				<!-- 高分教材 -->
				<view class="" v-show="current == 1">
					<u-gap height="16" bg-color="#F7F7F7"></u-gap>
					<!-- 高分教材-评论类型 -->
					<view class="subtabs" v-if="tagTeachingMaterialList.length">
						<drawingColumn ref="DrawingColumn" :list="tagTeachingMaterialList" key-name="name">
						</drawingColumn>
					</view>
					<!-- 高分教材-评论类型 -->
					<view class="content-box">
						<Textbook ref="TextBook" :teacherId="id" type="user" @unfixedTap="unfixedTap"></Textbook>
					</view>
				</view>
				<!-- 评论 -->
				<view class="" v-show="current == 2">
					<view class="content-box">
						<dynamic ref="Dynamic" :teacherId="id" @unfixedTap="unfixedTap"></dynamic>
					</view>
				</view>
			</view>
		</view>
		<view class="footer" v-if="current == 0">
			<view class="footer-btn" @click="submitTap">
				<image class="footer-img" src="/static/public/teacherDynamic/d_icon_score_write.png"></image>邀请评画
			</view>
		</view>
	</view>

</template>
<script>
	import drawingColumn from '@/components/drawingColumnTeachers/drawingColumn.vue'
	import PaintingEvaluation from './components/paintingEvaluation/paintingEvaluation.vue'
	import Textbook from '@/components/textbook/textbook.vue'
	import Dynamic from '@/pages/teachers/dynamic/dynamic.vue'

	import {
		teacherDetail,
		teacherTagPaintEvaluate,
		teacherTagTeachingMaterial,
		addFollow
	} from '@/api/teacher.js'
	export default {
		components: {
			drawingColumn,
			PaintingEvaluation,
			Textbook,
			Dynamic
		},
		data() {
			return {
				id: null,
				hasLogin: false,
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
				isFixed: false,
				// 标签
				lableList: [],
				userInfo: {},
				tagPaintList: [], // 评画统计标签
				tagTeachingMaterialList: [], // 高分教材统计标签
				activeIndex: 0
			}
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id;
				
				this.activeIndex = options.index || 0;
				this.initData();
				this.getPaint();
				this.getTeachingMaterial();
			}
		},
		methods: {
			initData() {
				this.$http.get(teacherDetail, {
					teacherId: this.id
				}).then(res => {
					this.userInfo = res.data
					this.lableList = this.userInfo.skilledMajor ? this.userInfo.skilledMajor.split(',') : []
				}).catch(err => {
					console.log(err)
				})
			},

			getPaint() {
				this.$http.get(teacherTagPaintEvaluate, {
					teacherId: this.id
				}).then(res => {
					this.tagPaintList = res.data;
				})
			},

			getTeachingMaterial() {
				this.$http.get(teacherTagTeachingMaterial, {
					teacherId: this.id
				}).then(res => {
					this.tagTeachingMaterialList = res.data;
				})
			},
			tabChange(index) {
				this.current = index
			},
			fixedTap(e) {
				this.isFixed = true
				this.$refs.PaintingEvaluation.noScroll(this.isFixed)
				this.$refs.TextBook.noScroll(this.isFixed)
				this.$refs.Dynamic.noScroll(this.isFixed)
			},
			unfixedTap() {
				this.isFixed = false
				this.$refs.PaintingEvaluation.noScroll(this.isFixed)
				this.$refs.TextBook.noScroll(this.isFixed)
				this.$refs.Dynamic.noScroll(this.isFixed)
			},
			goBack() {
				this.$mRouter.back();
			},
			// 邀请评画
			submitTap() {
				this.hasLogin = this.$mStore.getters.hasLogin
				if(this.hasLogin) {
					uni.navigateTo({
						url: `/pages/teachers/inviteComments/index?teacherId=${this.id}`
					})
				} else {
					uni.navigateTo({
						url: '/pages/public/logintype'
					})
				}
			},
			followTap() {
				this.$http.post(addFollow, null, {
					params: {
						toAppUserId: this.id,
						isFollow: !this.userInfo.isFollow
					}
				}).then(res => {
					this.$mHelper.toast(!this.userInfo.isFollow ? '关注成功' : '取消关注成功');
					this.$set(this.userInfo, 'isFollow', !this.userInfo.isFollow)
					uni.$emit('update', this.userInfo.isFollow)
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.navbar-right {
		margin-right: 24rpx;
		image {
			width: 72rpx !important;
			height: 72rpx !important;;
		}
	}

	.container {
		position: relative;
		min-height: 100vh;
		background-color: #F3F3F3;



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

				&-box {
					background-color: #F3F3F3;
				}


				&-header {
					background-color: #fff;
					border-radius: 40rpx 40rpx 0px 0px;

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
					background-color: #fff;

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
					}
				}



				&-rate {

					padding: 0 32rpx 0 36rpx;
					background-color: #fff;

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
				
				.content-tabs{
					position: relative;
					z-index: 999;
				}
				.borderBottom {
					margin-top: -10rpx;
					height: 2rpx;
					border: 2rpx solid #E9E9E9;
				}

				.subtabs {
					// padding: 28rpx 0;
					padding-top: 28rpx;
					padding-bottom: 32rpx;
					background-color: #fff;
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
	
	/deep/ .u-back-wrap{
		position: relative;
		z-index: 10000;
	}
</style>
