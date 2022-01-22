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
					<text>考试状态</text>
					<image src="/static/public/arrow_down.png"></image>
				</view>
				<view class="subtab u-flex" @click="timeTap()">
					<text>2022.08.29</text>
					<image src="/static/public/arrow_down.png"></image>
				</view>
			</view>

			<view class="right u-flex">
				<image src="/static/public/reset.png"></image>
			</view>
		</view>

		<view class="content">
			<scroll-view scroll-y scroll-with-animation class="left" :scroll-top="scrollTop" :scroll-into-view="itemId">
				<view v-for="(item,index) in tabbar" :key="index" class="left-item">
					<view class="left-item-box u-flex u-row-center" v-if="item.foods.length > 0"
						@click.stop="menusTap(index)"
						:class="[current === index && item.foods.length !== 0  ? 'active' : '']">
						<text>{{item.name}}</text>
						<view class="left-icon" v-if="item.foods.length !== 0">
							<image v-if="current !== index" class="right" src="/static/public/arrow_right.png"></image>
							<image v-else class="down" src="/static/public/arrow_down_blue.png"></image>
						</view>
					</view>

					<view class="children" v-else>
						<view class="u-flex u-row-center left-item-children"
							:class="[current === index  ? 'children-active' : '']" v-for="(item, index) in item"
							:key="index">
							<view class="left-item-children-box">
								<text>{{item.name}}</text>
							</view>
						</view>
					</view>
					<view class="children" v-if="item.foods.length > 0 && current === index">
						<view class="u-flex u-row-center left-item-children"
							:class="[childCurrent === index1  ? 'children-active' : '']"
							v-for="(item1, index1) in item.foods" :key="index1">

							<view class="left-item-children-box">
								<text>{{item1.name}}</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>

			<scroll-view scroll-y scroll-with-animation class="right">
				<view class="list">
					<view class="item">
						<view class="item-header u-flex">
							<image :src="setSrc('top_review.png')"></image>
							<text>【审核中】主办方修改考试信息</text>
						</view>
						<view class="item-content u-flex">
							<view class="img">
								<image
									src="https://img0.baidu.com/it/u=3904827974,2084857142&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500">
								</image>

								<view class="img-badge u-flex">
									<text>¥</text>
									<text>150</text>
								</view>
							</view>

							<view class="item-content-right">
								<view class="item-title u-line-1">山东省2022第二次美术…山东省2022第二次美术…</view>
								<view class="item-subtitle u-line-2">
									试题内容人物半身像随意创作性别年龄大小种族不限，随…试题内容人物半身像随意创作性别年龄大小种族不限，随…</view>
							</view>
						</view>
						<view class="item-subcontent u-flex u-row-between">
							<view class="item-left">考试日期：2022-08-30至2022-08-31</view>
							<view class="item-right u-flex">
								<text>查看详情</text>
								<image src="/static/public/arrow_right.png"></image>
							</view>
						</view>


						<view class="item-footer u-flex u-row-between">
							<view class="item-left">
								报名日期：2022-08-28至2022-08-29
							</view>
							<view class="item-right u-flex">快捷报名</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>


		<!-- 状态 -->
		<u-popup v-model="popShow" mode="bottom" :safe-area-inset-bottom="true" border-radius="40">
			<view class="pop-content">

				<view class="pop-list">
					<view class="pop-item">全部</view>
					<view class="pop-item">未开始</view>
					<view class="pop-item">正在进行</view>
					<view class="pop-item">考试结束</view>
					<u-gap height="14" bg-color="#F9F9F9"></u-gap>
					<view class="pop-item">取消</view>
				</view>
			</view>
		</u-popup>

		<!-- 时间 -->
		<u-picker mode="time" v-model="timeShow" :params="timeParams" :default-time="defaultTime" :safe-area-inset-bottom="true" confirm-color="#2C3AFF"></u-picker>
	</view>
</template>

<script>
	import moment from '@/common/moment.js'
	export default {
		data() {
			return {
				moment,
				tabIndex: 0,
				scrollTop: 0, //tab标题的滚动条位置
				current: 0,
				childCurrent: 0,
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
				defaultTime: '',
				tabbar: [{
					"name": "浙江省",
					"foods": [{
						"name": "中国美术学院",
						"key": "中国美术学院",
						"icon": "https://cdn.uviewui.com/uview/common/classify/1/1.jpg",
						"cat": 10
					}, {
						"name": "西安电子科技大学",
						"key": "西安电子科技大学",
						"icon": "https://cdn.uviewui.com/uview/common/classify/1/1.jpg",
						"cat": 10
					}]
				}, {
					"name": "陕西省",
					"foods": []
				}],
			};
		},
		onReady() {
				this.defaultTime = moment().format('YYYY-MM-DD')
		},
		methods: {
			tabTap(index) {
				this.tabIndex = index;
			},
			menusTap(index) {
				this.current = index
			},
			// 选择状态
			statusTap(){
				this.popShow = true;
			},
			timeTap(){
				this.timeShow = true;
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
