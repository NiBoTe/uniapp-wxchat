<template>
	<view class="top">
		<view class="navbar">
			<u-navbar title="考试报名" back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>

		<view class="content">
			<view class="base">
				<view class="base-item u-flex u-row-between">
					<view class="left">
						<text>考试编码</text>
					</view>
					<view class="right">
						<text>{{detail.no}}</text>
					</view>
				</view>
				<view class="base-item u-flex u-row-between">
					<view class="left">
						<text>考试名称</text>
					</view>
					<view class="right">
						<text>{{detail.name}}</text>
					</view>
				</view>
				<view class="base-item u-flex u-row-between">
					<view class="left">
						<text>考试科目</text>
					</view>
					<view class="right">
						<text v-for="(item, index) in detail.examSubjectList" :key="index">{{item.subjectName}}<text
								v-if="index !== detail.examSubjectList.length - 1">、</text></text>
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
						<input v-else type="text" @focus="focus" v-model="studioCode" placeholder="请输入机构编码"
							@confirm="studioCodeInput" />
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
						<input v-else type="text" v-model="studioName" placeholder="请输入机构名称" />
					</view>
				</view>

				<view class="base-item u-flex u-row-between" @click="selectAddressTap">
					<view class="left">
						<text class="tips">*</text>
						<text>考试地址</text>
					</view>
					<view class="right">
						<input type="text" v-model="address" disabled placeholder="请输入考试地址" />
					</view>
				</view>

				<view class="base-item u-flex u-row-between" @click="receivingTap" v-if="detail.isNeedExpress">
					<view class="left">

						<text v-if="detail.isNeedExpress" class="tips">*</text>
						<text>收货地址</text>
					</view>
					<view class="right">
						<input type="text" v-model="addressName" disabled placeholder="请输入收货地址" />
					</view>
				</view>
			</view>

			<u-gap height="16" bg-color="#F7F7F7"></u-gap>

			<view class="list">
				<view class="item u-flex u-row-between" v-for="(item, index) in examineeInfos" :key="index">

					<view @click="deleteTap(index)">
						<u-icon name="minus-circle-fill" color="#FF334D"></u-icon>
					</view>
					<view class="item-box u-flex u-row-between">
						<view class="left-box">
							<text class="left-name">{{item.name}}</text>
							<text class="left-subname">{{$mHelper.certificatecode(item.identification)}}</text>
						</view>
						<view class="right" @click="updateTap(item, index)">
							<image src="/static/public/update.png"></image>
						</view>
					</view>
				</view>
			</view>

			<view class="add u-flex" @click="addStudentTap">
				<image src="/static/public/add_people.png"></image>
				<text>添加学生信息</text>
			</view>
		</view>
		<view class="footer">
			<view class="footer-num u-flex u-row-between">
				<view class="left">总人数：{{examineeInfos.length}}人</view>
				<view class="right u-flex">
					<view class="right-label">总费用</view>
					<view class="right-price">
						<text>¥</text>
						<text>{{totalPrice}}</text>
					</view>
				</view>
			</view>
			<view class="footer-btn" @click="submitTap">去支付</view>
		</view>

		<!-- 选择地址 -->
		<u-popup v-model="popShow" mode="bottom" closeable :safe-area-inset-bottom="true" border-radius="40">
			<view class="pop-header">请选择考试地址</view>
			<view class="pop-content">
				<sort-picker-list ref="sortPickerList" :list="examAddressList" @select="addressSelectTap">
				</sort-picker-list>
			</view>
		</u-popup>


		<u-modal v-model="modalShow" :show-title="false" border-radius="32" cancel-color="#9E9E9E"
			:show-cancel-button="showCancelButton" :cancel-style="cancelStyle" :confirm-style="confirmStyle"
			:cancel-text="cancelText" :confirm-text="confirmText" :confirm-color="themeColor" :mask-close-able="true"
			@confirm="confirmTap">
			<view class="modal-content">
				<!-- 删除 -->
				<view class="remove" v-if="modalType === 'remove'">
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
	import {
		examDetail,
		examineeList,
		examOrderCreate,
		getStudioNameByStudioCode
	} from '@/api/exam.js';
	import {
		orderPay
	} from '@/api/order.js';
	import MenusPops from "@/components/menus-popups/menus-popups.vue";
	import SortPickerList from '@/components/sortPickerList.vue';
	export default {
		components: {
			MenusPops,
			SortPickerList
		},
		data() {
			return {
				id: null,
				loading: true,
				detail: {},
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
				codeName: '',
				examAddressList: [],
				examineeInfos: [],
				examineeIndex: 0,
				modalType: 'remove',
				address: '', // 考试地址
				addressDetail: {}, // 收货地址
				addressName: '', // 收货地址名称
				studioCode: '', // 机构编码
				studioName: '', // 机构名称
			}
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id;
				this.initData();
				this.getPeopleList();
			}
			let datas = uni.getStorageSync('examineeInfos');
			if (datas !== '') {
				let params = JSON.parse(datas)
				if (params.id == this.id) {
					this.examineeInfos = params.data
				}
			}
			uni.$on('examineeInfoChange', (data) => {
				if (data) {
					if (data.index < 0) {
						this.examineeInfos.push(data.params)
					} else {
						this.$set(this.examineeInfos, data.index, data.params)
					}
					let datas = {
						data: this.examineeInfos,
						id: this.id
					}
					uni.setStorageSync('examineeInfos', JSON.stringify(datas))
				}
			})

			uni.$on('selectAddress', (data) => {
				this.addressDetail = data.item
				this.addressName =
					`${this.addressDetail.areaNames.replace(/,/g, ' ')}${this.addressDetail.address}`
				// this.initData();
			})
		},
		computed: {
			totalPrice() {
				return (this.examineeInfos.length * (this.detail.price || 0) / 100).toFixed(2)
			}
		},
		methods: {
			initData() {
				this.$http.post(examDetail, {
					id: this.id
				}).then(res => {
					console.log(res)
					this.detail = res.data;
					this.examAddressList = this.$mHelper.segSort(this.detail.examAddressList, 'province')
					console.log(this.examAddressList)
					this.loading = false;
				}).catch(err => {
					console.log(err)
				})
			},

			getPeopleList() {
				this.$http.post(examineeList, {
					current: 1,
					examId: this.id,
					size: 10,
					state: "untested"
				}).then(res => {
					console.log(res)
				}).catch(err => {
					console.log(err)
				})
			},
			submitTap() {
				if (this.examineeInfos.length <= 0) {
					return this.$mHelper.toast('请添加学生信息');
				}
				if (this.address === '') {
					return this.$mHelper.toast('请选择考试地址');
				}

				if (this.detail.isNeedExpress && this.addressName === '') {
					return this.$mHelper.toast('请选择收货地址');
				}

				let subjects = [];
				this.detail.examSubjectList.map(item => {
					subjects.push(item.subjectName);
				})

				this.$http.post(examOrderCreate, {
					address: this.address,
					examId: this.id,
					examineeInfos: this.examineeInfos,
					receiveAddressId: this.addressDetail.id,
					studioCode: this.typeMenus ? this.studioCode : 'A888888',
					subject: subjects.join('+')
				}).then(res => {
					console.log(res)
					this.goPay(res.data.examOrderId)
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
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
				this.scrollTop = e.detail.scrollTop;
			},
			indexListScroll(e) {
				this.scrollTop = e;
			},
			// 添加考生
			addStudentTap() {
				uni.navigateTo({
					url: '/pages/public/top/addStudent'
				})
			},
			// 编辑考生信息
			updateTap(item, index) {
				uni.navigateTo({
					url: `/pages/public/top/addStudent?item=${JSON.stringify(item)}&index=${index}`
				})
			},
			// 删除考生信息
			deleteTap(index) {
				this.examineeIndex = index;
				this.modalType = 'remove';
				this.modalShow = true
			},

			// 确认
			confirmTap() {
				console.log('=======')
				if (this.modalType === 'remove') {
					this.examineeInfos.splice(this.examineeIndex, 1);
				}
			},
			// 选择考试地址
			selectAddressTap() {
				this.popShow = true;
			},

			// 确认地址
			addressSelectTap(item) {
				this.address = item.examAddress
				this.popShow = false
			},
			// 选择收货地址
			receivingTap() {
				console.log('=========')
				this.$mRouter.push({
					route: '/pages/set/address/index'
				})
			},
			studioCodeInput(e) {
				this.getCodeName()
			},

			// 获取机构
			getCodeName() {
				this.$http.post(getStudioNameByStudioCode, {
					examId: this.id,
					studioCode: this.studioCode
				}).then(res => {
					console.log(res)
					this.studioName = res.data
				}).catch(err => {
					console.log(err)
				})
			},
			goPay(orderId) {
				this.$http.post(orderPay, {
					openid: this.$mStore.state.openid,
					orderId,
					payType: 1,
					tradeType: 'JSAPI'
				}).then(res => {
					let params = res.data
					uni.hideLoading()
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: params.timeStamp,
						nonceStr: params.nonceStr,
						package: params.packageValue,
						signType: params.signType,
						paySign: params.paySign,
						success: (res) => {
							this.$mHelper.toast('支付成功')
							setTimeout(() => {
								uni.redirectTo({
									url: `/pages/public/top/paySuccess?orderId=${orderId}&payStatus=1`
								})
							}, 1500)
							uni.removeStorageSync('examineeInfos')
						},
						fail: (err) => {
							this.$mHelper.toast('支付失败')
							setTimeout(() => {
								uni.redirectTo({
									url: `/pages/public/top/paySuccess?orderId=${orderId}&payStatus=0`
								})
							}, 1500)
						}
					});
				}).catch(err => {
					uni.hideLoading()
				})
			}
		},

	}
</script>

<style scoped lang="scss">
	.top {
		height: calc(100vh);
		overflow: hidden;
		background-color: #fff;
	}


	.content {
		height: 100%;
		padding-bottom: 330rpx;
		overflow: auto;

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


		.list {
			.item {
				padding: 0 34rpx 0 26rpx;

				&-box {
					flex: 1;
					padding: 36rpx 0;
					border-bottom: 2rpx solid #E9E9E9;

					.left-box {
						margin-left: 24rpx;
						display: flex;
						flex-direction: column;

						.left-name {
							font-size: 26rpx;
							font-weight: bold;
							color: #3A3D71;
						}

						.left-subname {
							margin-top: 10rpx;
							font-size: 24rpx;
							color: #3A3D71;
						}
					}
				}

				.right {
					image {
						width: 32rpx;
						height: 32rpx;
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

		&-num {
			padding-bottom: 38rpx;

			.left {
				font-size: 26rpx;
				color: #9E9E9E;
			}

			.right {

				&-label {
					font-size: 24rpx;
					color: #3A3D71;
				}

				&-price {
					margin-left: 24rpx;

					text {
						font-size: 34rpx;
						font-weight: 800;
						color: #35CE96;

						&:first-of-type {
							font-size: 28rpx;
							font-weight: bold;
							color: #35CE96;
						}
					}
				}
			}
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
