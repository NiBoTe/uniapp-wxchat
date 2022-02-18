<template>
	<view class="top">
		<view class="navbar">
			<u-navbar title="成绩查询" back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>


		<view class="content">
			<view class="label">
				<text class="required">*</text>
				<text>考试名称</text>
			</view>

			<view class="item u-flex u-row-between">
				<view class="left">
					<input type="text" v-model="province" placeholder="请选择考试名称" />
				</view>
				<view class="right">
					<image src="/static/public/arrow_right.png"></image>
				</view>
			</view>
			
			<view class="label">
				<text>准考证号</text>
			</view>
			
			<view class="item u-flex u-row-between">
				<view class="left">
					<input type="text" v-model="province" placeholder="请输入准考证号" />
				</view>
				<view class="right">
					<image src="/static/public/arrow_right.png"></image>
				</view>
			</view>
			
			
			<view class="label">
				<text>学生姓名</text>
			</view>
			
			<view class="item u-flex u-row-between">
				<view class="left">
					<input type="text" v-model="province" placeholder="请输入学生姓名" />
				</view>
				<view class="right">
					<image src="/static/public/arrow_right.png"></image>
				</view>
			</view>
			
			<view class="label">
				<text>身份证号</text>
			</view>
			
			<view class="item u-flex u-row-between">
				<view class="left">
					<input type="text" v-model="province" placeholder="请输入身份证号" />
				</view>
				<view class="right">
					<image src="/static/public/arrow_right.png"></image>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="footer-btn" @click="submitTap">查询</view>
		</view>
		
		<u-picker mode="selector" v-model="testShow" :range="testList" range-key="name" @confirm="testTap"></u-picker>
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
				testShow: false,
				testList: [],
			};
		},
		methods:{
			submitTap(){
				
			},
			// 确认选择
			testTap(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top {



		.content {
			padding: 0 34rpx;

			.label {
				padding: 40rpx 0 26rpx;

				text {
					font-size: 26rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #3A3D71;

					&.required {
						color: #FF334D;
					}
				}
			}

			.item {
				padding: 0 28rpx;
				height: 88rpx;
				background: #F3F3F3;
				border-radius: 24rpx;

				.left {
					input {
						font-size: 26rpx;
						color: #3A3D71;
					}
				}

				.right {
					image {
						width: 12rpx;
						height: 22rpx;
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
