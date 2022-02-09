<template>
	<view class="wrap">
		<view class="top">
			<view class="item">
				<input type="text" v-model="realname" placeholder-class="line" placeholder="收货人" maxlength="25" />
			</view>
			<view class="item">
				<input type="number" v-model="mobile" maxlength="11" placeholder-class="line" placeholder="手机号" />
			</view>
			<view class="item u-flex u-row-between" @tap="showRegionPicker">
				<input disabled v-model="areaNames" type="text" placeholder-class="line" placeholder="选择地区" />
				<image src="/static/public/arrow_right.png"></image>
			</view>
			<view class="item address">
				<textarea type="text" placeholder-class="line" maxlength="200" v-model="address"
					placeholder="详细地址：如街道、楼牌号等" />
			</view>
			<!-- <view class="site-clipboard">
				<textarea placeholder-class="line" value="" placeholder="粘贴文本,可自动识别姓名和地址等" />
				<view class="clipboard">
					地址粘贴板
					<u-icon name="arrow-down" class="icon" :size="20"></u-icon>
				</view>
			</view> -->
		</view>
		<view class="bottom">
			<view class="tag u-flex u-row-between">
				<view class="left">标签</view>
				<view class="right">
					<text class="tags u-flex u-row-center" :class="tagIndex === index ? 'tagActive' : ''"
						v-for="(item,index) in tagList" :key="index" @click="tagTap(index)">{{item}}</text>
				</view>
			</view>
			<view class="default u-flex u-row-between">
				<view class="left">设置为默认地址</view>
				<view class="right">
					<u-switch v-model="isDefault" :active-color="themeColor" inactive-color="#E8E9EB"></u-switch>
				</view>
			</view>
		</view>

		<view class="footer">
			<view class="footer-btn" @click="submitTap">保存</view>
		</view>
		<u-picker mode="region" ref="uPicker" v-model="show" @confirm="comfirmTap" />
	</view>
</template>

<script>
	import {
		areaList
	} from '@/api/basic.js'
	import {
		addressSave,
		addressUpdate
	} from '@/api/receive-address.js'
	export default {
		data() {
			return {
				show: false,
				themeColor: this.$mConstDataConfig.themeColor,
				item: null,
				address: '',
				areaIds: [],
				areaNames: '',
				mobile: '',
				realname: '',
				tagList: ['家', '公司', '学校'],
				tagIndex: 0,
				isDefault: false,
			};
		},
		onLoad(options) {

			if (options.item) {
				this.item = JSON.parse(options.item)
				this.initData()
			}
			this.getAreaList()
		},
		methods: {
			initData() {
				const {
					realname,
					mobile,
					areaNames,
					areaIds,
					isDefault,
					address,
					tag,
				} = this.item;
				this.realname = realname;
				this.mobile = mobile;
				this.areaIds = areaIds.replace(/,/g, ' ').replace(/0000/g, '')
				this.areaNames = areaNames.replace(/,/g, ' ')
				this.isDefault = isDefault
				this.address = address
				this.tagIndex = this.tagList.findIndex(item => tag === item);
				console.log(this.tagIndex)
			},
			getAreaList() {
				this.$http.post(areaList).then(res => {
					console.log(res)
				})
			},
			setDefault() {},
			showRegionPicker() {
				this.show = true;
			},
			comfirmTap(e) {
				this.areaIds = `${e.province.value}0000 ${e.city.value}0000 ${e.area.value}0000`
				this.areaNames = `${e.province.label} ${e.city.label} ${e.area.label}`
			},
			// 选择标签
			tagTap(index) {
				this.tagIndex = index
			},
			submitTap(e) {
				if (this.realname === '') {
					return this.$mHelper.toast('请输入收货人姓名');
				}
				if (!this.$mHelper.checkMobile(this.mobile)) {
					return this.$mHelper.toast('请输入正确的手机号码');
				}
				if (this.areaIds === '') {
					return this.$mHelper.toast('请选择地区');
				}

				if (this.address === '') {
					return this.$mHelper.toast('请输入详细地址');
				}
				
				
				if(!this.item) {
					this.$http.post(addressSave, {
						address: this.address,
						areaIds: this.areaIds.replace(/ /g, ','),
						areaNames: this.areaNames.replace(/ /g, ','),
						isDefault: this.isDefault,
						mobile: this.mobile,
						realname: this.realname,
						tag: this.tagList[this.tagIndex]
					}).then(res => {
						this.$mHelper.toast('保存成功');
						setTimeout(() => {
							uni.$emit('isUpdate');
							this.$mRouter.back();
						}, 1500)
					}).catch(err => {
						this.$mHelper.toast(err.msg);
					})
				} else {
					this.$http.post(addressUpdate, {
						id: this.item.id,
						address: this.address,
						areaIds: this.areaIds.replace(/ /g, ','),
						areaNames: this.areaNames.replace(/ /g, ','),
						isDefault: this.isDefault,
						mobile: this.mobile,
						realname: this.realname,
						tag: this.tagList[this.tagIndex]
					}).then(res => {
						this.$mHelper.toast('保存成功');
						setTimeout(() => {
							uni.$emit('isUpdate');
							this.$mRouter.back();
						}, 1500)
					}).catch(err => {
						this.$mHelper.toast(err.msg);
					})
				}
				
			}
		}
	};
</script>

<style lang="scss" scoped>
	/deep/ .line {
		font-size: 26rpx;
		color: #8F9091;
	}

	.wrap {
		background-color: #F3F3F3;
		height: 100vh;
		padding-top: 30rpx;

		.top {
			margin: 0 34rpx 28rpx;
			background-color: #ffffff;
			border-radius: 24rpx;
			padding: 0 30rpx 46rpx 36rpx;

			.item {
				padding: 32rpx 0 38rpx 0;
				border-bottom: 2rpx solid #E9E9E9;

				input {
					text-align: left;
					font-size: 26rpx;
					color: #3A3D71;
				}

				image {
					width: 12rpx;
					height: 22rpx;
				}
			}

			.address {
				border-bottom: none;

				textarea {
					height: 100rpx;
				}
			}

			.site-clipboard {
				padding-right: 40rpx;

				textarea {
					// width: 100%;
					height: 150rpx;
					background-color: #f7f7f7;
					line-height: 60rpx;
					margin: 40rpx auto;
					padding: 20rpx;
				}

				.clipboard {
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 26rpx;
					color: $u-tips-color;
					height: 80rpx;

					.icon {
						margin-top: 6rpx;
						margin-left: 10rpx;
					}
				}
			}
		}

		.bottom {
			margin: 28rpx 34rpx;
			padding: 40rpx;
			padding-right: 0;
			background: #FFFFFF;
			border-radius: 24rpx;

			.tag {
				margin-right: 30rpx;
				padding-bottom: 36rpx;
				border-bottom: 2rpx solid #E9E9E9;

				.left {
					font-size: 26rpx;
					font-weight: bold;
					color: #3A3D71;
				}

				.right {
					display: flex;
					flex-wrap: wrap;

					.tags {
						margin-left: 30rpx;
						width: 92rpx;
						height: 46rpx;
						background: #F3F3F3;
						border-radius: 23rpx;
						font-size: 24rpx;
						color: #3A3D71;

						&.tagActive {
							background-color: $u-type-primary;
							color: #fff;
						}
					}

					.plus {
						//padding: 10rpx 0;
					}
				}
			}

			.default {
				margin-top: 36rpx;
				margin-right: 30rpx;

				.left {
					font-size: 26rpx;
					font-weight: bold;
					color: #3A3D71;
				}

				.tips {
					font-size: 24rpx;
				}

				.right {}
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
