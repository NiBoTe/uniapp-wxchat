<template>
	<view class="top">
		<view class="navbar">
			<u-navbar title="考试报名" immersive back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>

		<view class="content">
			<view class="base">
				<view class="base-item u-flex u-row-between">
					<view class="left">
						<text>机构编码</text>
					</view>
					<view class="right">
						<text>2786882934234</text>
					</view>
				</view>
				<view class="base-item u-flex u-row-between">
					<view class="left">
						<text>考试名称</text>
					</view>
					<view class="right">
						<text>2021第三届模拟考试</text>
					</view>
				</view>
				<view class="base-item u-flex u-row-between">
					<view class="left">
						<text>考试科目</text>
					</view>
					<view class="right">
						<text>素描、速写、色彩</text>
					</view>
				</view>
				<view class="base-item u-flex u-row-between">
					<view class="left">
						<text class="tips">*</text>
						<text>机构编码</text>
					</view>
					<view class="right">
						<text v-if="!typeMenus" @click="focus"
							:style="{color: code === '' ? '#999' : '#3A3D71'}">{{code !== '' ? code : '请输入机构编码'}}</text>
						<input v-else type="text" @focus="focus" v-model="code" placeholder="请输入机构编码" />
						<menus-pops v-model="menusPopShow" :dynamic="false" :popData="menusData" @tapPopup="tapPopup"
							:x="344" :y="300" placement="top-end" type="custom"></menus-pops>
					</view>
				</view>

				<view class="base-item u-flex u-row-between">
					<view class="left">
						<text class="tips">*</text>
						<text>机构名称</text>
					</view>
					<view class="right">
						<text v-if="!typeMenus"
							:style="{color: code === '' ? '#999' : '#3A3D71'}">{{code !== '' ? code : '-'}}</text>
						<input v-else type="text" v-model="codeName" placeholder="请输入机构名称" />
					</view>
				</view>

				<view class="base-item u-flex u-row-between">
					<view class="left">
						<text class="tips">*</text>
						<text>考试地址</text>
					</view>
					<view class="right">
						<input type="text" placeholder="请输入考试地址" />
					</view>
				</view>

				<view class="base-item u-flex u-row-between">
					<view class="left">
						<text>收货地址</text>
					</view>
					<view class="right">
						<input type="text" placeholder="请输入收货地址" />
					</view>
				</view>
			</view>

			<u-gap height="16" bg-color="#F7F7F7"></u-gap>


			<view class="add u-flex">
				<image src="/static/public/add_people.png"></image>
				<text>添加学生信息</text>
			</view>
		</view>
		<view class="footer">
			<view class="footer-btn" @click="submitTap">去支付</view>
		</view>

		<!-- 选择地址 -->
		<u-popup v-model="popShow" mode="bottom" :safe-area-inset-bottom="true" border-radius="40">
			<view class="pop-content">
				<sort-picker-list ref="sortPickerList"></sort-picker-list>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import MenusPops from "@/components/menus-popups/menus-popups.vue";
	import SortPickerList from '@/components/sortPickerList.vue'
	export default {
		components: {
			MenusPops,
			SortPickerList
		},
		data() {
			return {
				popShow: true, // 选择地址
				scrollTop: 0,
				indexList: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
					"T", "U",
					"V", "W", "X", "Y", "Z"
				],
				background: {
					backgroundImage: "url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png')",
					backgroundSize: 'cover',
				},
				menusPopShow: false,
				menusData: [{
					title: '个人'
				}, {
					title: '机构'
				}],
				typeMenus: false,
				code: '',
				codeName: '',
				dataArr: [{
						name: '中国',
						value: 'China'
					},
					{
						name: '俄罗斯',
						value: 'Russia'
					},
					{
						name: '美国',
						value: 'America'
					},
					{
						name: '澳大利亚',
						value: 'Australia'
					},
					{
						name: '巴西',
						value: 'Brazil'
					},
					{
						name: '韩国',
						value: 'Korea'
					},
					{
						name: '朝鲜',
						value: 'North Korea'
					},
					{
						name: '英国',
						value: 'Britain'
					},
					{
						name: '德国',
						value: 'Germany'
					},
					{
						name: '加拿大',
						value: 'Canada'
					},
					{
						name: '非洲',
						value: 'New Zealand'
					},
				]
			}
		},
		methods: {
			submitTap() {

			},
			focus() {
				this.menusPopShow = true;
				
			},
			tapPopup(e) {
				console.log(e)
				this.code = '';
				if (e.title === '个人') {
					this.code = e.title + '报名';
					this.codeName = this.code;
				} else {
					this.codeName = '';
				}
				this.typeMenus = e.title !== '个人';
			},
			popScroll(e) {
				console.log(e)
				this.scrollTop = e.detail.scrollTop;
			},
			indexListScroll(e) {
				console.log(e)
				this.scrollTop = e;
			}
		},

	}
</script>

<style scoped lang="scss">
	.top {
		height: calc(100vh);
		background-color: #fff;
	}

	.navbar {
		height: 146rpx;
	}

	.content {
		height: calc(100vh - 146rpx);
		overflow: auto;

		// padding-bottom: calc(134rpx + constant(safe-area-inset-bottom));
		// padding-bottom: calc(134rpx + env(safe-area-inset-bottom));

		.base {
			&-item {
				margin: 0 40rpx 0 28rpx;
				padding: 36rpx 0 42rpx;
				border-bottom: 2rpx solid #E9E9E9;

				&:last-of-type {
					border-bottom: none;
				}

				.left {
					font-size: 26rpx;
					font-weight: bold;
					color: #3A3D71;

					text {
						&.tips {
							color: #FF334D;
						}
					}


				}

				.right {
					position: relative;

					text {
						font-size: 26rpx;
						color: #3A3D71;
					}

					input {
						text-align: right;
						font-size: 26rpx;
						color: #3A3D71;
					}
				}
			}
		}


		// 添加学生
		.add {
			margin: 36rpx 34rpx 40rpx 28rpx;
			height: 108rpx;
			background: #EFF2FF;
			border-radius: 16rpx;
			justify-content: center;

			image {
				width: 42rpx;
				height: 42rpx;

			}

			text {
				margin-left: 16rpx;
				font-size: 24rpx;
				color: #2C3AFF;
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


	// 选择地址
	.pop-content {
		height: 1000rpx;
	}
</style>
