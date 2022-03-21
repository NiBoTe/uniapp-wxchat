<template>
	<view class="userInfo">
		<view class="item u-flex u-row-between">
			<view class="label">头像</view>
			<view class="head" @click="updateHeadTap">
				<view v-if="headUrl === ''" class="head-default u-flex u-row-center">头像</view>
				<u-avatar v-else size="120" :src="headUrl"></u-avatar>
			</view>
		</view>
		<view class="item u-flex u-row-between">
			<view class="label">昵称</view>
			<view class="input">
				<input v-model="fullName" type="text" placeholder="请输入昵称" />
			</view>
		</view>

		<view v-if="userInfo.roleSelect === 'teacher'" class="item u-flex u-row-between" @click="selectTap">
			<view class="label">擅长专业</view>
			<view class="input u-flex">
				<input v-model="skilledMajorNames" type="text" placeholder="请选择专业" disabled />
				<image src="/static/public/arrow_right.png"></image>
			</view>
		</view>

		<view class="item u-flex u-row-between" style="border-bottom: 0;">
			<view class="textarea">
				<textarea v-model="introduce" placeholder="请介绍自己的教育或任职经历..." maxlength="150" />
				<view class="textarea-length" :class="introduce.length ? 'active' : ''">{{introduce.length}}/150
				</view>
			</view>

		</view>
		<view class="footer">
			<view class="footer-btn" @click="submitTap">保存</view>
		</view>
	</view>
</template>

<script>
	import {
		generatePostPolicy
	} from '@/api/basic.js'

	import {
		getMyInfo,
		updateMyInfoV2
	} from '@/api/userInfo.js'

	import {
		skilledMajorList
	} from '@/api/basic.js'
	export default {
		data() {
			return {
				list: [],
				fullName: '',
				headUrl: '',
				introduce: '',
				skilledMajorId: '',
				skilledMajorNames: '',
				userInfo: {}
			};
		},

		onLoad() {
			this.userInfo = this.$mStore.state.userInfo
			if (this.userInfo) {
				this.fullName = this.userInfo.fullName;
				this.headUrl = this.userInfo.headUrl;
				this.introduce = this.userInfo.introduce || '';
				this.skilledMajorId = this.userInfo.skilledMajorId;
			}
			this.initData();
		},
		methods: {
			initData() {
				this.$http.get(skilledMajorList).then(res => {
					let user = this.userInfo,
						names = []
					let list = user.skilledMajorId ? user.skilledMajorId.split(',') : []
					this.list = res.data
					list.map(b => {
						this.list.map(a => {
							if (b == a.id) {
								names.push(a.name)
							}
						})
					})
					this.skilledMajorNames = names.join('、')
				})
			},
			// 更换头像
			updateHeadTap() {
				// 从相册选择图片
				const _this = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function(res) {
						_this.handleUploadFile(res.tempFilePaths[0]);
					}
				});
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
							_this.headUrl = r
						});
				}).catch(err => {
					console.log(err)
				})
			},
			submitTap() {
				this.$http.post(updateMyInfoV2, {
					fullName: this.fullName,
					headUrl: this.headUrl,
					introduce: this.introduce,
					skilledMajorId: this.skilledMajorId,
				}).then(res => {
					this.$mHelper.toast('保存成功')
					uni.$emit('isRefresh', true)
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			},
			// 选择专业
			selectTap() {
				uni.$on('selectChange', (list) => {
					let ids = [],
						names = [];
					list.map(item => {
						ids.push(item.id)
						names.push(item.name)
					})
					this.skilledMajorId = ids.join(',')
					this.skilledMajorNames = names.join('、')
				})
				uni.navigateTo({
					url: `/pages/set/selectMajor?skilledMajorId=${this.skilledMajorId}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.userInfo {

		.label {
			font-size: 26rpx;
			font-weight: bold;
			color: #3A3D71;
		}

		.item {
			margin: 0 34rpx;
			padding: 36rpx 0;
			border-bottom: 2rpx solid #EDEDED;

			.head {
				&-default {
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
					background: #F9F9F9;
					font-size: 24rpx;
					color: #8F9091;
				}
			}

			.input {
				flex: 1;
				justify-content: flex-end;

				input {
					text-align: right;
					font-size: 24rpx;
					color: #8F9091;
				}

				image {
					margin-left: 20rpx;
					width: 12rpx;
					height: 22rpx;
				}
			}

			.textarea {
				flex: 1;
				height: 240rpx;
				position: relative;
				border-bottom: 2rpx solid #E9E9E9;

				textarea {
					height: 160rpx;
					font-size: 24rpx;
					color: #8F9091;
				}

				&-length {
					position: absolute;
					bottom: 24rpx;
					right: 0;
					font-size: 28rpx;
					font-weight: 300;
					color: #8F9091;

					&.active {
						color: #1B1B1B;
					}
				}
			}
		}


		.footer {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 999;
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
	}
</style>
