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
		<u-popup v-model="popShow" mode="bottom" closeable :safe-area-inset-bottom="true" border-radius="40">
			<view class="pop-header">请选择考试地址</view>
			<view class="pop-content">
				<sort-picker-list ref="sortPickerList"></sort-picker-list>
			</view>
		</u-popup>


		<u-modal v-model="modalShow" :show-title="false" border-radius="32" cancel-color="#9E9E9E"
			:show-cancel-button="showCancelButton" :cancel-style="cancelStyle" :confirm-style="confirmStyle"
			:cancel-text="cancelText" :confirm-text="confirmText" :confirm-color="themeColor" :mask-close-able="true">
			<view class="modal-content">
				<!-- 删除 -->
				<view class="remove">
					<image :src="setSrc('signUp_remove_bg.png')"></image>
					<text>是否删除当前学生信息</text>
				</view>

				<!-- 保存 -->
				<!-- <view class="save">
					<image :src="setSrc('signUp_save_bg.png')"></image>
					<text>是否保存当前学生信息</text>
					<text class="dec">信息保存下次可继续编辑</text>
				</view> -->

				<!-- 提交 -->
				<!-- <view class="submit">
					<image :src="setSrc('signUp_submit_bg.png')"></image>
					<text>请确认信息是否有误</text>
					<text class="dec">信息确认可直接提交支付</text>
				</view> -->
			</view>
		</u-modal>
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

				themeColor: this.$mConstDataConfig.themeColor,
				showCancelButton: true,
				cancelStyle: {
					fontWeight: '500'
				},
				confirmStyle: {
					fontWeight: '500'
				},
				cancelText: "取消",
				confirmText: "删除",
				popShow: false, // 选择地址
				modalShow: false, // 删除模态框
				scrollTop: 0,
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
				codeName: ''
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
	.pop-header {
		margin: 34rpx 28rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #3A3D71;
	}

	.pop-content {
		height: 800rpx;
	}


	//  删除、保存学生
	.modal-content {
		padding: 38rpx 38rpx 50rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #3A3D71;

		&>view {
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		// 删除
		.remove {
			image {
				width: 232rpx;
				height: 214rpx;
			}

			text {
				display: block;
				margin-top: 36rpx;
			}
		}

		// 保存
		.save {
			padding: 66rpx 38rpx 38rpx;

			image {
				width: 320rpx;
				height: 144rpx;
			}

			text {
				display: block;
				margin-top: 36rpx;

				&.dec {
					margin-top: 14rpx;
					font-size: 24rpx;
					color: #9E9E9E;
				}
			}
		}

		// 提交
		.submit {
			padding: 42rpx 38rpx 38rpx;

			image {
				width: 262rpx;
				height: 180rpx;
			}

			text {
				display: block;
				margin-top: 36rpx;
				&.dec {
					margin-top: 14rpx;
					font-size: 24rpx;
					color: #9E9E9E;
				}
			}
		}
	}
</style>
