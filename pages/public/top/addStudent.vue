<template>
	<view class="top">
		<view class="navbar">
			<u-navbar title="添加学生信息" back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>

		<view class="content">
			<view class="list">
				<view class="item u-flex u-row-between">
					<view class="left">
						<view class="left-title">
							<text>*</text>
							<text>学生照片</text>
						</view>
						<view class="left-subtitle">正面免冠证件照</view>
					</view>

					<view class="right u-flex">
						<!-- uploadImage -->
						<view class="uploadImg u-flex u-row-center" @click="uploadImage">
							<u-icon v-if="url === ''" name="plus" color="#9E9E9E" size="40"></u-icon>
							<image v-else :src="url"></image>
						</view>
					</view>
				</view>

				<view class="item u-flex u-row-between">
					<view class="left">
						<view class="left-title">
							<text>考生来源</text>
						</view>
					</view>

					<view class="right u-flex" @click="provinceShow = true">
						<input type="text" disabled v-model="province" placeholder="请输入机构名称" />
						<image src="/static/public/arrow_right.png"></image>
					</view>
				</view>

				<view class="item u-flex u-row-between">
					<view class="left">
						<view class="left-title">
							<text class="tips">*</text>
							<text>考生姓名</text>
						</view>
					</view>

					<view class="right u-flex">
						<input type="text" v-model="name" placeholder="请输入考生姓名" />
					</view>
				</view>

				<view class="item u-flex u-row-between">
					<view class="left">
						<view class="left-title">
							<text class="tips">*</text>
							<text>性别</text>
						</view>
					</view>

					<view class="right u-flex">
						<u-radio-group v-model="sex" @change="radioGroupChange" :active-color="themeColor">
							<u-radio v-for="(item, index) in sexList" :key="index" :name="item.value"
								:disabled="item.disabled">
								{{item.name}}
							</u-radio>
						</u-radio-group>
					</view>
				</view>

				<view class="item u-flex u-row-between">
					<view class="left">
						<view class="left-title">
							<text>手机号码</text>
						</view>
					</view>

					<view class="right u-flex">
						<input type="number" maxlength="11" v-model="mobile" placeholder="请输入手机号码" />
					</view>
				</view>

				<view class="item u-flex u-row-between">
					<view class="left">
						<view class="left-title">
							<!-- <text class="tips">*</text> -->
							<text>身份证号码</text>
						</view>
					</view>

					<view class="right u-flex">
						<input type="idcard" maxlength="18" v-model="identification" placeholder="请输入身份证号码" />
					</view>
				</view>

			</view>

		</view>


		<view class="footer">
			<view class="footer-btn" @click="submitTap">添加</view>
		</view>

		<u-picker mode="selector" v-model="provinceShow" :range="provinceList" range-key="name" @confirm="provinceTap"></u-picker>
	</view>
</template>

<script>
	import {
		generatePostPolicy,
		areaList
	} from '@/api/basic.js'
	export default {
		data() {
			return {

				background: {
					backgroundImage: "url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png')",
					backgroundSize: 'cover',
				},
				index: -1,
				name: '',
				province: '',
				identification: '',
				mobile: '',
				url: '',
				sex: '女',
				provinceShow: false,
				provinceList: [],
				sexList: [{
						name: '女',
						value: '女'
					},
					{
						name: '男',
						value: '男'
					}
				],
			};
		},
		onLoad(options) {
			if(options.item){
				let item = JSON.parse(options.item)
				this.name = item.name;
				this.province = item.province;
				this.identification = item.identification;
				this.mobile = item.mobile;
				this.url = item.url;
				this.sex = item.gender;
				
				this.index = options.index
			}
			this.getAreaList()
		},
		methods: {
			getAreaList() {
				this.$http.get(areaList).then(res => {
					console.log(res)
					this.provinceList = res.data
				})
			},
			submitTap() {
				if(this.name === ''){
					return this.$mHelper.toast('请输入考生姓名')
				}
				
				if(this.mobile !== ''){
					if(!this.$mHelper.checkMobile(this.mobile)) {
						return this.$mHelper.toast('请输入正确的手机号码')
					}
				}
				if(this.identification !== ''){
					if(!this.$mHelper.checkIdCard(this.identification)) {
						return this.$mHelper.toast('请输入正确的身份证号码')
					}
				}
				console.log(this.sex)
				uni.$emit('examineeInfoChange', {
					params: {
						gender: this.sex,
						identification: this.identification,
						mobile: this.mobile,
						name: this.name,
						province: this.province,
						url: this.url,
					},
					index: this.index
				})
				
				this.$mRouter.back();
			},
			radioGroupChange(e) {
				console.log(e)
			},
			// 上传头像
			uploadImage() {
				// 从相册选择图片
				const _this = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function(res) {
						_this.handleUploadFile(res.tempFilePaths);
					}
				});
			},
			// 上传头像
			handleUploadFile(data) {
				const _this = this;
				const filePath = data.path || data[0];

				_this.$http.get(generatePostPolicy, {
					app_token: uni.getStorageSync('accessToken')
				}).then(res => {
					console.log(res)
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
							_this.url = r;
						});
				}).catch(err => {
					console.log(err)
				})
			},
			// 选择省份
			provinceTap(e){
				console.log(e)
				this.province = this.provinceList[e].name
			}
		},
		
	}
</script>

<style lang="scss" scoped>
	.top {
		height: calc(100vh);
		overflow: hidden;
		background-color: #fff;
	}

	.content {
		height: 100%;
		overflow: auto;

		.list {
			.item {
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


					&-title {
						text {
							&.tips {
								color: #FF334D;
							}
						}

					}

					&-subtitle {
						font-size: 24rpx;
						color: $u-type-primary;
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

					image {
						margin-left: 16rpx;
						width: 16rpx;
						height: 28rpx;
					}

					.uploadImg {
						width: 150rpx;
						height: 210rpx;
						background: #EDEFF2;

						image {
							margin-left: 0;
							width: 100%;
							height: 100%;
						}
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
</style>
