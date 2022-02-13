<template>
	<view class="top">
		<view class="navbar">
			<u-navbar title="TOP美考" immersive back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>
		<view class="tabs u-flex" :class="tabIndex === 0 ? 'one' : tabIndex === 1 ? 'two' : 'three'">
			<view class="tab" @click="tabTap(0)" :class="tabIndex === 0 ? 'active' : ''">
				考试信息
			</view>
			<view class="line" v-if="tabIndex === 2"></view>
			<view class="tab" @click="tabTap(1)" :class="tabIndex === 1 ? 'active' : ''">
				我的未考
			</view>
			<view class="line" v-if="tabIndex === 0"></view>
			<view class="tab" @click="tabTap(2)" :class="tabIndex === 2 ? 'active' : ''">
				我的已考
			</view>
		</view>

		<view class="subtabs u-flex u-row-between">
			<view class="left u-flex">
				<view class="subtab u-flex" @click="statusTap()">
					<text v-if="examStatus === ''">全部</text>
					<text v-else-if="examStatus === 'NO_START'">未开始</text>
					<text v-else-if="examStatus === 'ONGOING'">正在进行</text>
					<text v-else-if="examStatus === 'EXAM_END'">考试结束</text>
					<image src="/static/public/arrow_down.png"></image>
				</view>
				<view class="subtab u-flex" @click="timeTap()">
					<text>{{examDate}}</text>
					<image src="/static/public/arrow_down.png"></image>
				</view>
			</view>

			<view class="right u-flex" @click="resetTap">
				<image src="/static/public/reset.png"></image>
			</view>
		</view>

		<view class="content">
			<scroll-view scroll-y scroll-with-animation class="left">
				<view v-for="(item,index) in menuList" :key="index" class="left-item">
					<view class="left-item-box u-flex u-row-center" v-if="item.childMenus.length > 0"
						@click.stop="menusTap(index)"
						:class="[menuIndex === index && item.childMenus.length !== 0  ? 'active' : '']">
						<text>{{item.name}}</text>
						<view class="left-icon" v-if="item.childMenus.length !== 0">
							<image v-if="menuIndex !== index" class="right" src="/static/public/arrow_right.png"></image>
							<image v-else class="down" src="/static/public/arrow_down_blue.png"></image>
						</view>
					</view>

					<view class="children" v-else>
						<view class="u-flex u-row-center left-item-children"
							:class="[menuIndex === index  ? 'children-active' : '']" v-for="(item, index) in item"
							:key="index">
							<view class="left-item-children-box">
								<text>{{item.name}}</text>
							</view>
						</view>
					</view>
					<view class="children" v-if="item.childMenus.length > 0 && menuIndex === index">
						<view class="u-flex u-row-center left-item-children"
							:class="[childCurrent === index1  ? 'children-active' : '']"
							v-for="(item1, index1) in item.childMenus" :key="index1"
							@click="childMenusTap(item1, index1)">

							<view class="left-item-children-box">
								<text>{{item1.name}}</text>
							</view>
						</view>
					</view>
				</view>

				<view v-for="(item,index) in proviceData" :key="index" class="left-item">
					<view class="left-item-box u-flex u-row-center" @click.stop="proviceTap(index)"
						:class="[proviceCurrent === index ? 'active1' : '']">
						<text>{{item.areaName}}</text>
					</view>
				</view>
			</scroll-view>

			<scroll-view scroll-y scroll-with-animation class="right" @scrolltolower="lower">
				<view class="list">
					<view class="item" v-for="(item, index) in list" :key="index">
						<view class="item-header u-flex" v-if="item.auditState === 'auditing'">
							<image :src="setSrc('top_review.png')"></image>
							<text>【审核中】主办方修改考试信息</text>
						</view>
						<view class="item-content u-flex">
							<view class="img">
								<image :src="item.url"></image>
								<view class="img-badge u-flex">
									<text>¥</text>
									<text>{{item.price}}</text>
								</view>
							</view>

							<view class="item-content-right">
								<view class="item-title u-line-1">{{item.name}}</view>
								<view class="item-subtitle u-line-2">{{item.remark}}</view>
							</view>
						</view>
						<view class="item-subcontent u-flex u-row-between">
							<view class="item-left">考试日期：{{item.examStartTime}}至{{item.examEndTime}}</view>
							<view class="item-right u-flex">
								<text>查看详情</text>
								<image src="/static/public/arrow_right.png"></image>
							</view>
						</view>


						<view class="item-footer u-flex u-row-between">
							<view class="item-left">
								报名日期：{{item.enrollStartTime}}至{{item.enrollEndTime}}
							</view>
							<view class="item-right u-flex" :class="moment(item.enrollEndTime).diff(moment(), 'days') >= 0 ? 'active' : ''">
								{{moment(item.enrollEndTime).diff(moment(), 'days') >= 0 ? '快捷报名' : '报名截止'}}
							</view>
						</view>
					</view>
				</view>
				<u-loadmore margin-top="30" margin-bottom="30" :status="loadStatus" @loadmore="addData"></u-loadmore>
			</scroll-view>
		</view>


		<!-- 状态 -->
		<u-popup v-model="popShow" mode="bottom" :safe-area-inset-bottom="true" border-radius="40">
			<view class="pop-content">

				<view class="pop-list">
					<view class="pop-item" @click="statusItemTap('')">全部</view>
					<view class="pop-item" @click="statusItemTap('NO_START')">未开始</view>
					<view class="pop-item" @click="statusItemTap('ONGOING')">正在进行</view>
					<view class="pop-item" @click="statusItemTap('EXAM_END')">考试结束</view>
					<u-gap height="14" bg-color="#F9F9F9"></u-gap>
					<view class="pop-item">取消</view>
				</view>
			</view>
		</u-popup>

		<!-- 时间 -->
		<u-picker mode="time" v-model="timeShow" :params="timeParams" :default-time="examDate"
			:safe-area-inset-bottom="true" confirm-color="#2C3AFF" @confirm="timeConfirmTap"></u-picker>
	</view>
</template>

<script>
	import moment from '@/common/moment.js'

	import {
		proviceList,
		examMenuList,
		examList,
		examList2
	} from '@/api/exam.js'
	export default {
		data() {
			return {
				moment,
				loadStatus: 'loadmore',
				tabIndex: 0,
				menuIndex: 0,
				childCurrent: 0,
				proviceCurrent: -1,
				popShow: false,
				timeShow: false,
				timeParams: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				examDate: moment().format('YYYY-MM-DD'),
				examStatus: '',
				proviceData: [], // 省份列表
				menuList: [], // 菜单
				current: 1,
				size: 10,
				list: [], // 考试列表
			};
		},
		onLoad() {
			this.getProviceList();
			this.getMenuList();
			this.getList()
		},
		methods: {
			
			getList(){
				this.loadStatus = 'loading';
				this.$http.post(examList, {
					examDate: this.examDate,
					examStatus: this.examStatus,
					// firstMenuId: this.firstMenuId
					province: this.province,
					// secondMenuId: this.secondMenuId,
					size: this.size,
					current: this.current,
				}).then(res => {
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
			getProviceList() {
				this.$http.post(proviceList).then(res => {
					console.log(res)
					this.proviceData = res.data
				})
			},
			getMenuList() {
				this.$http.post(examMenuList, {
					examDate: this.examDate,
					examStatus: this.examStatus,
					province: '',
				}).then(res => {
					console.log(res)
					
					this.menuIndex = 0;
					this.childCurrent = 0;
					this.proviceCurrent = -1;
					this.menuList = res.data.menuList
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
			tabTap(index) {
				this.tabIndex = index;
			},
			// 院校
			menusTap(index) {
				this.menuIndex = this.menuIndex === index ? -1 : index
				this.childCurrent = 0;
				this.proviceCurrent = -1;
			},
			// 省份
			proviceTap(index) {
				this.menuIndex = -1;
				this.proviceCurrent = index
				this.current = 1;
				this.getList();
			},
			childMenusTap(item, index) {
				this.childCurrent = index
				this.current = 1;
				this.getList();
			},
			// 选择状态
			statusTap() {
				this.popShow = true;
			},
			timeTap() {
				this.timeShow = true;
				
			},
			// 选择状态
			statusItemTap(status) {
				this.examStatus = status
				this.popShow = false;
				this.getMenuList();
				this.current = 1;
				this.getList();
			},
			// 确认时间
			timeConfirmTap(e){
				this.examDate = `${e.year}-${e.month}-${e.day}`;
				this.current = 1;
				this.getList();	
			},
			resetTap(){
				this.examDate = moment().format('YYYY-MM-DD');
				this.examStatus = '';
				this.current = 1;
				this.getList();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		height: calc(100vh);
	}

	.navbar {
		height: 206rpx;
		background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png');
		background-size: cover;
	}

	.tabs {
		margin-top: -55rpx;
		width: 100%;
		height: 108rpx;

		&.one {
			background: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_tab01.png') no-repeat center;
			background-size: cover;
		}

		&.two {
			background: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_tab02.png') no-repeat center;
			background-size: cover;
		}

		&.three {
			background: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_tab03.png') no-repeat center;
			background-size: cover;
		}

		.tab {
			padding-top: 16rpx;
			flex: 1;
			text-align: center;
			font-size: 30rpx;
			color: #FFFFFF;

			&.active {
				font-size: 30rpx;
				font-weight: bold;
				color: $u-type-primary;
			}
		}

		.line {
			width: 2rpx;
			height: 26rpx;
			background-color: #FFFFFF;
		}
	}


	.subtabs {
		height: 100rpx;
		background-color: #fff;
		border-bottom: 2rpx solid #E9E9E9;
		padding: 0 32rpx 0 28rpx;

		.left {
			.subtab {
				margin-right: 40rpx;

				text {
					font-size: 26rpx;
					color: #3A3D71;
				}

				image {
					margin-left: 20rpx;
					width: 24rpx;
					height: 16rpx;
				}
			}
		}

		.right {

			image {
				margin-left: 10rpx;
				width: 28rpx;
				height: 30rpx;
			}

			text {
				margin-left: 10rpx;
				font-size: 26rpx;
				color: #9E9E9E;
			}
		}
	}

	.content {
		height: 100%;
		display: flex;

		.left {
			width: 176rpx;
			height: 100%;
			background-color: #F2F2F2;

			&-item {
				&-box {
					height: 80rpx;
					position: relative;
					display: flex;
					align-items: center;
					font-size: 26rpx;
					color: #9E9E9E;
					border-bottom: 2rpx solid #D2D5DE;

					&.active {
						color: $u-type-primary;

					}

					&.active1 {
						color: $u-type-primary;
						background-color: #fff;
					}

					.left-icon {
						margin-left: 12rpx;

						image {
							display: block;
						}

						image.right {
							width: 14rpx;
							height: 24rpx;
						}

						image.down {
							width: 26rpx;
							height: 18rpx;
						}
					}
				}

				.children {
					background-color: #fff;

					.left-item-children {
						&-box {
							margin: 0 20rpx;
							padding: 20rpx 0;
							text-align: center;
							font-size: 22rpx;
							color: #5E677A;
							border-bottom: 2rpx solid #D2D5DE;
						}

						&.children-active {
							background-color: #8EA7F7;

							.left-item-children-box {
								color: #fff;
								border-bottom: none;
							}
						}

						&:last-of-type {
							.left-item-children-box {
								border-bottom: none;
							}
						}
					}

				}

			}
		}


		.right {
			flex: 1;
			background-color: #F9FAF9;

			.list {
				.item {
					margin: 26rpx 28rpx 0 20rpx;
					background: #FFFFFF;
					box-shadow: 0px 6rpx 16rpx 6rpx rgba(230, 230, 230, 0.5);
					border-radius: 24rpx;

					&-header {
						height: 68rpx;
						padding: 0 24rpx;
						background: linear-gradient(90deg, #FFFFFF 0%, rgba(255, 184, 184, .29) 100%);
						border-radius: 24rpx 24rpx 0px 0px;

						image {
							width: 48rpx;
							height: 48rpx;
						}

						text {
							margin-left: 16rpx;
							font-size: 26rpx;
							font-weight: bold;
							color: #FF334D;
						}
					}

					&-content {
						padding: 8rpx 22rpx 14rpx 24rpx;

						.img {
							position: relative;

							image {
								display: block;
								width: 132rpx;
								height: 132rpx;
								border-radius: 16rpx;
							}

							&-badge {
								position: absolute;
								right: 0;
								bottom: 0;
								height: 34rpx;
								align-items: flex-end;
								padding: 0 10rpx 0 12rpx;
								background: rgba($color: #000000, $alpha: .5);
								border-radius: 16rpx 0px 16rpx 0px;

								text {
									font-size: 20rpx;
									font-weight: 800;
									color: #FFFFFF;

									&:first-of-type {
										font-size: 16rpx;
										font-weight: bold;
										color: #FFFFFF;
									}
								}
							}
						}

						&-right {
							flex: 1;
							width: 0;
							margin-left: 16rpx;

							.item-title {
								font-size: 28rpx;
								font-weight: bold;
								color: #3A3D71;
							}

							.item-subtitle {
								margin-top: 14rpx;
								font-size: 26rpx;
								color: #3A3D71;
							}
						}
					}

					&-subcontent {

						margin: 0 24rpx 16rpx;

						.item-left {
							font-size: 19rpx;
							color: #9E9E9E;
						}

						.item-right {
							image {
								width: 12rpx;
								height: 21rpx;
							}

							text {
								margin-right: 8rpx;
								font-size: 24rpx;
								color: #9E9E9E;
							}
						}
					}


					&-footer {
						margin: 0 22rpx 0 24rpx;
						padding: 16rpx 0 18rpx;
						border-top: 2rpx solid #E9E9E9;

						.item-left {
							font-size: 19rpx;
							color: #9E9E9E;
						}

						.item-right {
							padding: 0 18rpx;
							height: 50rpx;
							background: #EFF2FF;
							border-radius: 25rpx;
							font-size: 24rpx;
							font-weight: 500;
							color: #9E9E9E;

							&.active {
								background: #EFF2FF;
								color: #2C3AFF;
							}
						}
					}
				}
			}
		}
	}

	// 弹窗
	.pop-content {

		.pop-list {
			.pop-item {
				padding: 40rpx 0;
				border-bottom: 1rpx solid #D8D8D8;
				text-align: center;
				font-size: 30rpx;
				color: #3A3D71;

				&:nth-last-of-type(-n+2) {
					border-bottom: 0;
				}
			}
		}
	}
</style>
