<template>
	<view class="container">

		<view class="page">
			<view class="header">
				<image :src="userInfo.bgUrl"></image>
				<view class="settings" :style="{top: StatusBar + 44 + 'px'}" @tap="toSetting">
					<image src="/static/my/settings.png"></image>
				</view>
			</view>
			<view class="content">
				<view class="content-header u-flex u-row-between">
					<view class="u-flex">
						<view class="head">
							<view class="head-img u-flex u-row-center">
								<u-avatar size="186" :src="userInfo.headUrl"></u-avatar>
							</view>

							<view class="head-auth">
								<image src="/static/my/no_auth.png"></image>
							</view>
						</view>
						<!-- 0跳转默认展示关注tab页 -->
						<view class="header-item" @click="checkfocusList(0)">
							<text>关注</text>
							<text class="num">{{userInfo.followCount || 0}}</text>
						</view>
						<!-- 1跳转默认展示粉丝tab页 -->
						<view class="header-item" @click="checkfocusList(1)" style="margin-left: 42rpx;">
							<text>粉丝</text>
							<text class="num">{{userInfo.fansCount || 0}}</text>
						</view>
					</view>

					<view class="header-update">
						<image src="/static/my/update.png"></image>
						<text>完善资料</text>
					</view>
				</view>

				<view class="content-subheader">
					<view class="name">{{userInfo.fullName}}</view>
					<view class="subheader-list">
						<view class="subheader-item" v-for="(item, index) in userInfo.skilledMajor" :key="index">
							{{item}}
						</view>
					</view>

					<view class="subheader-text u-line-2">
						{{userInfo.introduce || ''}}
						<view class="fold" bindtap="fold" :data-text="foldText" :data-etc="textEtc"></view>
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
							<text>4.8</text>
						</view>
					</view>
					<view class="rate-item u-flex u-row-between">
						<view class="left u-flex">
							<image src="/static/my/pen.png"></image>
							<text>评画评分</text>
						</view>
						<view class="right u-flex">
							<image src="/static/my/star.png"></image>
							<text>4.8</text>
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

				<view class="subtabs">
					<drawingColumn></drawingColumn>
				</view>


				<view class="content-box">
					<!-- 评画 -->
					<painting-evaluation></painting-evaluation>
				</view>
			</view>
		</view>
		<tab-bar :selected="4"></tab-bar>
	</view>

</template>
<script>
	import tabBar from '@/components/tabbar/tabbar.vue'
	import drawingColumn from '@/components/drawingColumn/drawingColumn.vue'
	import PaintingEvaluation from '@/components/paintingEvaluation/paintingEvaluation.vue'

	import {
		getMyInfo
	} from '@/api/userInfo.js'
	export default {
		components: {
			tabBar,
			drawingColumn,
			PaintingEvaluation
		},
		data() {
			return {
				StatusBar: this.StatusBar,
				loading: true,
				hasLogin: false,
				userInfo: {},
				foldText: '展开',
				textEtc: '...',
				tabList: [{
					name: '评画'
				}, {
					name: '动态'
				}, {
					name: '高分教材',
				}, {
					name: '收益',
				}, {
					name: '订单',
				}, {
					name: '动态',
				}],
				current: 0,
				swiperCurrent: 0,
				isFixed: false,
			}
		},
		onLoad() {

		},

		async onShow() {
			await this.initData();
		},
		methods: {
			async initData() {
				this.hasLogin = this.$mStore.getters.hasLogin;
				if (this.hasLogin) {
					await this.getMemberInfo();
				} else {
					this.loading = false;
				}
			},
			// 获取用户信息
			async getMemberInfo() {
				await this.$http
					.post(getMyInfo)
					.then(async r => {

						console.log(r)
						this.loading = false;
						// var reg = /^(\d{3})\d*(\d{4})$/;
						// r.telephone = r.telephone ? r.telephone.replace(reg, '$1****$2') : null
						let user = r.data.user;
						user.skilledMajor = user.skilledMajor ? user.skilledMajor.split(",") : []
						this.userInfo = r.data.user;
					})
					.catch((err) => {
						console.log(err)
						this.hasLogin = false;
						this.userInfo = {};
						this.loading = false;
						uni.stopPullDownRefresh();
					});
			},
			tabChange(index) {
				this.current = index
				this.swiperCurrent = index;
			},
			fixedTap(e) {
				this.isFixed = true
			},
			unfixedTap() {
				this.isFixed = false
			},
			toSetting: function() {
				uni.navigateTo({
					url: '/pages/set/setting/index',
				});
			},
			/**
			 * @desc 点击关注和粉丝跳转至列表页
			 */
			checkfocusList(type) {
				uni.navigateTo({
					url: `/pages/profile/fansList?type=${type}`,
				});
			}

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

					image {
						width: 72rpx;
						height: 72rpx;
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
						padding: 0 28rpx 0 32rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						height: 68rpx;
						background: #F3F3F3;
						border-radius: 34rpx;

						image {
							width: 24rpx;
							height: 24rpx;
						}

						text {
							margin-left: 10rpx;
							font-size: 24rpx;
							color: #3A3D71;
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

						.subheader-item {
							display: inline-block;
							padding: 0 20rpx 0 22rpx;
							height: 48rpx;
							line-height: 48rpx;
							background: #F3F3F3;
							border-radius: 25rpx;

							text {
								font-size: 24rpx;
								color: #888C90;
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
					padding: 28rpx 0;
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
