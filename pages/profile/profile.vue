<template>
	<view class="container">
		<view class="page">
			<view class="header" @click="updateBgTap">
				<view class="header-text u-flex u-row-center">点击设置个性化背景</view>
				<view class="header-bg">
					<image :src="userInfo.bgUrl" mode="aspectFill"></image>
				</view>
				<view class="settings" :style="{top: StatusBar + 44 + 'px'}" @click.stop="toSetting">
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

							<view class="head-auth" v-if="userInfo.roleSelect === 'teacher'" >
								<image src="/static/my/no_auth.png" @click="goAuth" v-if="userInfo.authStatus === 0"></image>
								<image src="/static/my/auth.png" v-else-if="userInfo.authStatus === 1"></image>
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

					<view class="header-update" @click="userInfoTap">
						<image src="/static/my/update.png"></image>
						<text>完善资料</text>
					</view>
				</view>

				<view class="content-subheader">
					<view class="name">{{userInfo.fullName || '' }}</view>
					<view class="subheader-list" v-if="userInfo.roleSelect === 'teacher'">
						<view class="subheader-item" v-for="(item, index) in userInfo.skilledMajor" :key="index">
							{{item}}
						</view>
					</view>

					<view class="subheader-text" v-if="userInfo.introduce">
						<expandable-text :line="2" expandText="全文" foldText="收起">
							{{userInfo.introduce}}
						</expandable-text>
					</view>
				</view>

				<view class="content-rate u-flex" v-if="userInfo.roleSelect === 'teacher'">
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
				<u-sticky :offset-top="0" bg-color="#fff" @fixed="fixedTap" @unfixed="unfixedTap">

					<view class="navbar" v-if="isFixed">
						<u-navbar :title="title" :border-bottom="false" :is-back="false">
							<view class="navbar-right" slot="right">
								<image src="/static/public/user_setting.png"></image>
							</view>
						</u-navbar>
					</view>
					<view class="tabs">
						<u-tabs ref="tabs" :is-scroll="true" :list="tabList" :current="current" bar-width="62"
							bar-height="8" gutter="40" active-color="#1B1B1B" inactive-color="#9E9E9E" font-size="30"
							@change="tabChange">
						</u-tabs>
					</view>
				</u-sticky>
				<view class="borderBottom"></view>
				<!-- 
				<view class="subtabs">
					<drawingColumn></drawingColumn>
				</view>
 -->
				<view class="content-box" v-if="isTabActive === 1">
					<!-- 评画 -->
					<PaintingEvaluation v-show="current === 0" ref="PaintingEvaluation"></PaintingEvaluation>

					<!-- 动态 -->
					<dynamic v-show="current === 1" ref="Dynamic"></dynamic>

					<!-- 高分教材 -->
					<textbook v-show="current === 2" ref="Textbook"></textbook>

					<!-- 收益 -->
					<profit v-show="current === 3" ref="Profit"></profit>

					<!-- 订单 -->
					<order v-show="current === 4" ref="Order"></order>

					<!-- 收藏 -->
					<collection v-show="current === 5" ref="Collection"></collection>

					<!-- 消息 -->
					<message v-show="current === 6" ref="Message"></message>
				</view>
				
				<view class="content-box" v-if="isTabActive === 3">

					<!-- 动态 -->
					<dynamic v-show="current === 0" ref="Dynamic"></dynamic>

					<!-- 订单 -->
					<order v-show="current === 1" ref="Order"></order>

					<!-- 收藏 -->
					<collection v-show="current === 2" ref="Collection"></collection>

					<!-- 消息 -->
					<message v-show="current === 3" ref="Message"></message>

				</view>
				
				
				<view class="content-box" v-if="isTabActive === 2">

					<!-- 评画 -->
					<PaintingEvaluation v-show="current === 0" ref="PaintingEvaluation"></PaintingEvaluation>

					<!-- 动态 -->
					<dynamic v-show="current === 1" ref="Dynamic"></dynamic>

					<!-- 订单 -->
					<order v-show="current === 2" ref="Order"></order>

					<!-- 收藏 -->
					<collection v-show="current === 3" ref="Collection"></collection>

					<!-- 消息 -->
					<message v-show="current === 4" ref="Message"></message>

				</view>

			</view>
		</view>
		<tab-bar :selected="4"></tab-bar>
	</view>

</template>
<script>
	import tabBar from '@/components/tabbar/tabbar.vue'
	import drawingColumn from '@/components/drawingColumn/drawingColumn.vue'
	import PaintingEvaluation from './components/paintingEvaluation/paintingEvaluation.vue'
	import Dynamic from './components/dynamic/dynamic.vue'
	import Textbook from './components/textbook/textbook.vue'
	import Profit from './components/profit/index.vue'
	import Order from './components/order/index.vue'
	import Collection from './components/collection/index.vue'
	import Message from './components/message/index.vue'

	import {
		getMyInfo,
		updateBgUrl
	} from '@/api/userInfo.js'
	import {
		generatePostPolicy
	} from '@/api/basic.js'
	export default {
		components: {
			tabBar,
			drawingColumn,
			PaintingEvaluation,
			Dynamic,
			Textbook,
			Profit,
			Order,
			Collection,
			Message
		},
		data() {
			return {
				StatusBar: this.StatusBar,
				loading: true,
				hasLogin: false,
				userInfo: {},
				foldText: '展开',
				textEtc: '...',
				tabList: [],
				tabList1: [{
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
					name: '收藏',
				}, {
					name: '消息',
				}],
				tabList2: [{
					name: '评画'
				}, {
					name: '动态'
				}, {
					name: '订单',
				}, {
					name: '收藏',
				}, {
					name: '消息',
				}],
				tabList3: [{
					name: '动态'
				}, {
					name: '订单',
				}, {
					name: '收藏',
				}, {
					name: '消息',
				}],
				current: 0,
				swiperCurrent: 0,
				isFixed: false,
				isTabActive: -1,
				title: ''
			}
		},
		async onLoad() {
			await this.initData();
		},
		async onShow() {
			if(this.hasLogin){
				await this.getMemberInfo();
			}
			
			uni.$on('isRefresh', async (bool) => {
				if (bool) {
					await this.initData();
				}
			})
			uni.$on('isRefresh', async (bool) => {
				if (bool) {
					await this.getMemberInfo();
				}
			})
		},
		methods: {
			async initData() {
				this.hasLogin = this.$mStore.getters.hasLogin;
				this.tabList = this.tabList3
				if (this.hasLogin) {
					await this.getMemberInfo();
				} else {
					uni.navigateTo({
						url: '/pages/public/logintype'
					})
					this.loading = false;
				}
			},

			refresh() {

				this.$nextTick(() => {
					if (this.isTabActive === 1 || this.isTabActive === 2) {
						this.$refs.PaintingEvaluation.refresh();
					}
					this.$refs.Dynamic.refresh()
					if (this.isTabActive === 1) {
						this.$refs.Textbook.refresh()
						this.$refs.Profit.refresh()
					}
					this.$refs.Order.refresh()
					this.$refs.Collection.refresh()
					this.$refs.Message.refresh()
					
					setTimeout(() => {
						uni.stopPullDownRefresh()
					}, 1500)
				})
			},
			// 获取用户信息
			async getMemberInfo() {
				await this.$http
					.post(getMyInfo)
					.then(async r => {
						this.loading = false;
						let data = r.data
						let user = r.data.user;
						user.skilledMajor = user.skilledMajor ? user.skilledMajor.split(",") : []
						
						if(user.roleSelect !== this.userInfo.roleSelect) {
							if (user.roleSelect === 'teacher' && user.authStatus === 1) {
								this.tabList = this.tabList1
								this.isTabActive = 1
							} else if (user.roleSelect === 'teacher' && user.authStatus === 0) {
								this.tabList = this.tabList3
								this.isTabActive = 3
							} else {
								this.tabList = this.tabList2
								this.isTabActive = 2
							}
							this.refresh();
						}
						this.userInfo = user;
						this.title = this.userInfo.fullName
						this.$mStore.commit('login', data.user);
					
					})
					.catch((err) => {
						console.log(err)
						this.hasLogin = false;
						this.userInfo = {};
						this.loading = false;
						uni.stopPullDownRefresh();
					});
			},
			goLogin() {
				uni.navigateTo({
					url: '/pages/public/logintype'
				})
			},
			// 更换背景图
			updateBgTap() {
				if (!this.hasLogin) return this.goLogin()
				// 从相册选择图片
				const _this = this;
				if (!this.userInfo.bgUrl || this.userInfo.bgUrl === '') {
					uni.chooseImage({
						count: 1,
						sizeType: ['original', 'compressed'],
						sourceType: ['album'],
						success: function(res) {
							_this.handleUploadFile(res.tempFilePaths[0]);
						}
					});
				} else {
					uni.$on('updateUrl', () => {
						this.getMemberInfo()
					})
					uni.navigateTo({
						url: '/pages/set/updateUrl'
					})
				}
			},
			// 上传头像
			handleUploadFile(filePath) {
				const _this = this;
				_this.$http.get(generatePostPolicy, {
					app_token: uni.getStorageSync('accessToken')
				}).then(res => {
					let data = res.data;
					_this.$http
						.upload(data.host, {
							filePath,
							formData: {
								key: data.dir,
								policy: data.policy,
								OSSAccessKeyId: data.accessid,
								signature: data.signature,
							}
						})
						.then(r => {
							console.log(r)
							_this.setUpdateBgUrl(r)
						});
				}).catch(err => {
					console.log(err)
				})
			},

			setUpdateBgUrl(bgUrl) {
				this.$http.post(updateBgUrl, {
					bgUrl
				}).then(res => {
					this.getMemberInfo()
				})
			},
			tabChange(index) {
				this.current = index
				this.swiperCurrent = index;
			},
			fixedTap(e) {
				this.isFixed = true
				this.noScroll()
			},
			unfixedTap() {
				this.isFixed = false
				this.noScroll()
			},
			noScroll() {
				if (this.isTabActive === 1 || this.isTabActive === 2) {
					this.$refs.PaintingEvaluation.noScroll(this.isFixed)
				}

				this.$refs.Dynamic.noScroll(this.isFixed)
				if (this.isTabActive === 1) {
					this.$refs.Textbook.noScroll(this.isFixed)
					this.$refs.Profit.noScroll(this.isFixed)
				}
				this.$refs.Order.noScroll(this.isFixed)
				this.$refs.Collection.noScroll(this.isFixed)
				this.$refs.Message.noScroll(this.isFixed)
			},
			toSetting: function() {
				if (!this.hasLogin) return this.goLogin()
				
				uni.$on('roleSelect', (role) => {
					console.log(role)
					this.userInfo.roleSelect = role
					
					if (role === 'teacher' && this.userInfo.authStatus === 1) {
						this.tabList = this.tabList1
						this.isTabActive = 1
					} else if (role === 'teacher' && this.userInfo.authStatus === 0) {
						this.tabList = this.tabList3
						this.isTabActive = 3
					} else {
						this.tabList = this.tabList2
						this.isTabActive = 2
					}
				})
				uni.navigateTo({
					url: '/pages/set/setting/index',
				});
			},
			/**
			 * @desc 点击关注和粉丝跳转至列表页
			 */
			checkfocusList(type) {
				if (!this.hasLogin) return this.goLogin()
				uni.navigateTo({
					url: `/pages/profile/fansList?type=${type}`,
				});
			},
			// 完善资料
			userInfoTap() {
				if (!this.hasLogin) return this.goLogin()
				uni.navigateTo({
					url: '/pages/set/userInfo'
				})
			},
			// 去认证
			goAuth(){
				uni.navigateTo({
					url: '/pages/set/teacherAuth'
				})
			}
		},
		onPullDownRefresh() {
			this.refresh();
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		position: relative;
		height: 100vh;

		.navbar {
			&-right {
				margin-right: 24rpx;

				image {
					width: 44rpx;
					height: 44rpx;
				}
			}
		}

		.page {
			.header {
				position: relative;
				height: 440rpx;
				background-color: #9E9E9E;


				&-bg {
					position: relative;
					z-index: 2;
				}

				&-text {
					position: absolute;
					z-index: 1;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					font-size: 24rpx;
					color: #fff;
				}

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
				z-index: 3;
				background-color: #fff;
				border-radius: 40rpx 40rpx 0px 0px;

				&-box {
					background-color: #F3F3F3;
				}

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
							margin-right: 22rpx;
							display: inline-block;
							padding: 0 20rpx 0 22rpx;
							height: 48rpx;
							line-height: 48rpx;
							background: #F3F3F3;
							border-radius: 25rpx;
							font-size: 24rpx;
							color: #888C90;
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
