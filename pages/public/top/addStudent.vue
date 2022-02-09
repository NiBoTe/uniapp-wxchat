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
						<input type="text" v-model="codeName" placeholder="请输入机构名称" />
					</view>
				</view>

				<view class="item u-flex u-row-between">
					<view class="left">
						<view class="left-title">
							<text>考生来源</text>
						</view>
					</view>

					<view class="right u-flex">
						<input type="text" v-model="codeName" placeholder="请输入机构名称" />
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
						<input type="text" v-model="codeName" placeholder="请输入考生姓名" />
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
						<input type="number" maxlength="11" v-model="codeName" placeholder="请输入手机号码" />
					</view>
				</view>

				<view class="item u-flex u-row-between">
					<view class="left">
						<view class="left-title">
							<text class="tips">*</text>
							<text>身份证号码</text>
						</view>
					</view>

					<view class="right u-flex">
						<input type="idcard" maxlength="18" v-model="codeName" placeholder="请输入身份证号码" />
					</view>
				</view>

			</view>

		</view>


		<view class="footer">
			<view class="footer-btn" @click="submitTap">添加</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

				background: {
					backgroundImage: "url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png')",
					backgroundSize: 'cover',
				},
				codeName: '',
				sex: '1',
				sexList: [{
						name: '女',
						value: '1'
					},
					{
						name: '男',
						value: '2'
					}
				],
			};
		},
		methods: {
			radioGroupChange(e) {
				console.log(e)
			}
		}
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
