<template>
	<view class="container">
		<view class="label">银行卡账号</view>
		<view class="list">
			<view class="item u-flex">
				<view class="left u-flex u-row-between">
					<text class="left-label" style="">账号</text>
					<text>:</text>
				</view>
				<view class="right u-flex">
					<view class="right-item u-flex">
						<input type="number" v-model="params.bankAccountNumber" placeholder="请输入数字，限20个数字"
							maxlength="20" />
					</view>
				</view>
			</view>

			<!-- 户名 -->
			<view class="item u-flex">
				<view class="left u-flex u-row-between">
					<text class="left-label" style="">户名</text>
					<text>:</text>
				</view>
				<view class="right u-flex">
					<view class="right-item u-flex">
						<input type="text" v-model="params.bankAccountName" placeholder="请输入，限20个字" maxlength="20" />
					</view>
				</view>
			</view>

			<!-- 开户银行 -->
			<view class="item u-flex">
				<view class="left u-flex u-row-between">
					<text class="left-label" style="">开户银行</text>
					<text>:</text>
				</view>
				<view class="right u-flex">
					<view class="right-item u-flex" @click="selectTap(0)">
						<input type="text" v-model="params.bankCodeName" placeholder="请选择开户行" maxlength="30" disabled />
						<image src="/static/public/arrow_down.png"></image>
					</view>
				</view>
			</view>

			<!-- 所在省市 -->
			<view class="item u-flex">
				<view class="left u-flex u-row-between">
					<text class="left-label" style="">所在省市</text>
					<text>:</text>
				</view>
				<view class="right u-flex">
					<view class="right-item u-flex" @click="selectTap(1)">
						<input v-model="params.provinceName" type="text" placeholder="请选择" maxlength="30" disabled />
						<image src="/static/public/arrow_down.png"></image>
					</view>
					<view class="right-item u-flex" @click="selectTap(2)">
						<input v-model="params.cityName" type="text" placeholder="请选择" maxlength="30" disabled />
						<image src="/static/public/arrow_down.png"></image>
					</view>
				</view>
			</view>

			<!-- 开户支行 -->
			<view class="item u-flex">
				<view class="left u-flex u-row-between">
					<text class="left-label" style="">开户支行</text>
					<text>:</text>
				</view>
				<view class="right u-flex">
					<view class="right-item u-flex" @click="selectTap(3)">
						<input v-model="params.bankName" type="text" placeholder="请选择支行" maxlength="50" disabled />
						<image src="/static/public/arrow_down.png"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="label" style="margin-top: 34rpx;">支付宝账号</view>

		<view class="list">
			<!-- 支付宝账号 -->
			<view class="item u-flex">
				<view class="left u-flex u-row-between">
					<text class="left-label" style="">支付宝账号</text>
					<text>:</text>
				</view>
				<view class="right u-flex">
					<view class="right-item u-flex">
						<input v-model="params.alipayAccountNumber" type="text" placeholder="请输入支付宝账号" maxlength="20" />
					</view>
				</view>
			</view>

			<!-- 账号名称 -->
			<view class="item u-flex">
				<view class="left u-flex u-row-between">
					<text class="left-label" style="">账号名称</text>
					<text>:</text>
				</view>
				<view class="right u-flex">
					<view class="right-item u-flex">
						<input v-model="params.alipayAccountName" type="text" placeholder="请输入支付宝账号名称" maxlength="20" />
					</view>
				</view>
			</view>

		</view>
		<view class="footer">
			<view class="footer-btn" @click="submitTap">提交</view>
		</view>


		<u-select v-model="bankCodeShow" :list="bankCodeList" label-name="name" value-name="id"
			@confirm="bankCodeConfirm"></u-select>

		<u-select v-model="provinceShow" :list="provinceList" label-name="name" value-name="id"
			@confirm="provinceConfirm"></u-select>

		<u-select v-model="cityShow" :list="cityList" label-name="name" value-name="id" @confirm="cityConfirm">
		</u-select>

		<u-select v-model="bankShow" :list="bankList" label-name="name" value-name="id" @confirm="bankConfirm">
		</u-select>
	</view>
</template>

<script>
	import {
		bankCodeList,
		provinceList,
		cityList,
		bankList,
		getMyWithdrawInfo,
		updateMyWithdrawInfo
	} from '@/api/user-withdraw.js'
	export default {
		data() {
			return {
				bankCodeShow: false,
				bankCodeList: [],
				provinceShow: false,
				provinceList: [],
				cityShow: false,
				cityList: [],
				bankShow: false,
				bankList: [],
				params: {
					alipayAccountName: '',
					alipayAccountNumber: '',
					bankAccountName: '',
					bankAccountNumber: '',
					bankCodeId: '',
					bankCodeName: '',
					bankId: '',
					bankName: '',
					cityId: '',
					cityName: '',
					provinceId: '',
					provinceName: ''
				}
			};
		},
		onLoad() {
			this.initData()
			this.getBankCodeList();
			this.getProvinceList();
		},
		methods: {
			initData(){
				this.$http.get(getMyWithdrawInfo).then(res => {
					if(res.data){
						this.params = res.data
					}
				}).catch(err => {
					console.log(err)
				})
			},
			// 获取开户银行
			getBankCodeList() {
				this.$http.get(bankCodeList).then(res => {
					console.log(res)
					this.bankCodeList = res.data
				}).catch(err => {
					console.log(err)
				})
			},
			// 获取省份列表
			getProvinceList() {
				this.$http.get(provinceList).then(res => {
					console.log(res)
					this.provinceList = res.data

				}).catch(err => {
					console.log(err)
				})
			},
			// 获取市区列表
			getCityList() {
				this.$http.get(cityList, {
					province_id: this.params.provinceId
				}).then(res => {
					console.log(res)
					this.cityList = res.data
				}).catch(err => {
					console.log(err)
				})
			},
			// 获取开户支行列表
			getBankList() {
				this.$http.get(bankList, {
					bankCodeId: this.params.bankCodeId,
					oraareacode: this.params.cityId.substr(0, this.params.cityId.length - 2)
				}).then(res => {
					this.bankList = res.data
				}).catch(err => {
					console.log(err)
				})
			},
			// 选择开户银行
			bankCodeConfirm(e) {
				this.params.bankCodeId = e[0].value
				this.params.bankCodeName = e[0].label
				this.getBankList();
			},

			// 选择省份
			provinceConfirm(e) {
				console.log(e)
				this.params.provinceId = e[0].value
				this.params.provinceName = e[0].label
				this.params.cityId = ''
				this.params.cityName = ''
				this.getCityList();
			},
			// 选择城市
			cityConfirm(e) {
				this.params.cityId = e[0].value
				this.params.cityName = e[0].label

				if (this.params.bankCodeId !== '') {
					this.getBankList();
				}
			},
			// 开户支行
			bankConfirm(e){
				this.params.bankId = e[0].value
				this.params.bankName = e[0].label
			},
			// 打开选择器
			selectTap(type) {

				switch (type) {
					case 0:
						this.bankCodeShow = true;
						break;
					case 1:
						this.provinceShow = true;
						break;
					case 2:
						if (this.params.provinceId === '') return this.$mHelper.toast('请选择所在省份')
						this.cityShow = true;
						break;
					case 3:
						if (this.params.bankCodeId === '') return this.$mHelper.toast('请选择开户银行')
						if (this.params.cityId === '') return this.$mHelper.toast('请选择所在市')
						this.bankShow = true;
						break;
				}
			},
			// 提交
			submitTap(){
				this.$http.post(updateMyWithdrawInfo, this.params).then(res => {
					this.$mHelper.toast('提交成功')
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.label {
			padding: 22rpx 0;
			text-align: center;
			font-size: 32rpx;
			color: #1B1B1B;
			border-top: 2rpx solid #EDEDED;
			border-bottom: 2rpx solid #EDEDED;
		}

		.list {
			.item {
				margin: 32rpx 18rpx 2rpx;

				.left {
					margin-right: 10rpx;
					width: 162rpx;

					text {
						font-size: 28rpx;
						font-weight: bold;
						color: #1B1B1B;

						&.left-label {
							margin-right: 10rpx;
							flex: 1;
							text-align-last: justify;
							text-align: justify;
							text-justify: distribute-all-lines;
						}
					}
				}

				.right {
					flex: 1;

					&-item {
						padding: 0 26rpx 0 16rpx;
						flex: 1;
						height: 60rpx;
						border: 2rpx solid rgba(158, 158, 158, 0.34);
						border-radius: 10rpx;

						input {
							flex: 1;
							font-size: 24rpx;
							color: #3A3D71;
						}

						image {
							margin-left: 24rpx;
							width: 34rpx;
							height: 24rpx;
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
	}
</style>
