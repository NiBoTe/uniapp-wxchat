<template>
	<view class="top">
		<view class="navbar">
			<u-navbar title="考试内容" immersive back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>


		<view class="content">
			<view class="subtitle">浙江省2022第一次美术模考</view>
			<view class="title">色彩</view>

			<view class="cells">
				<view class="cell">
					<view class="cell-label">考试题目：</view>
					<view class="cell-content">
						<text>色彩临摹</text>
					</view>
				</view>
				<view class="cell">
					<view class="cell-label">考试要求：</view>
					<view class="cell-content">
						<text>人物半身像随意创作性别年龄大小种族不限，西方人物室外风景色彩赏析，试题内容人物半身像随意创作性别年龄大小种族不限，西方人物室外风景色彩赏析，试题内容人物半身像随意创作性别年龄大小种族不限，西方人物室外风景色彩赏析，试题内容人物半身像随意创作性别年龄大小种族不限，西方人物室外风景色彩赏析。</text>
						<image
							src="https://img2.baidu.com/it/u=1814268193,3619863984&fm=253&fmt=auto&app=138&f=JPEG?w=632&h=500">
						</image>
					</view>
				</view>

				<view class="cell">
					<view class="cell-label">备 注：</view>
					<view class="cell-content">
						<text>人物半身像随意创作性别年龄大小种族不限，西方人物室外风景色彩赏析。</text>
					</view>
				</view>
			</view>
		</view>

		<view class="footer u-flex u-row-center">
			<!-- <view class="footer-btn disabled" @click="submitTap">考试时间未到</view> -->
			<view class="footer-btn" style="margin-right: 24rpx;" @click="submitTap">录制作画步骤</view>
			<view class="footer-btn disabled" @click="submitTap">上传试卷图片</view>
		</view>

		<!-- <view class="nodata">
			<image :src="setSrc('testContent_nodata.png')"></image>
			<text class="nodata-title">科目二(色彩)</text>
			<text class="nodata-subtitle">未开始考试，请在考前2分钟打开此页面考试</text>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: {
					backgroundImage: "url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png')",
					backgroundSize: 'cover',
				}
			};
		},
		methods: {
			submitTap() {

			}
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		.navbar {
			height: 146rpx;
		}

		.content {
			padding: 36rpx 36rpx 0 28rpx;

			.subtitle {
				font-size: 30rpx;
				text-align: center;
				color: #3A3D71;
			}

			.title {
				margin-top: 14rpx;
				font-size: 34rpx;
				font-weight: bold;
				text-align: center;
				color: #3A3D71;
			}

			.cells {
				.cell {
					display: flex;

					&-label {
						width: 134rpx;
						font-size: 26rpx;
						font-weight: bold;
						color: #3A3D71;
					}

					&-content {
						// width: 0;
						flex: 1;

						text {
							ont-size: 26rpx;
							color: #3A3D71;
							text-align: justify;
						}

						image {
							width: 100%;
						}
					}
				}
			}
		}

		.nodata {

			margin-top: 300rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			image {
				width: 396rpx;
				height: 314rpx;
			}

			&-title {
				margin-top: 38rpx;
				font-size: 30rpx;
				font-weight: bold;
				color: #3A3D71;
			}

			&-subtitle {
				width: 424rpx;
				text-align: center;
				margin-top: 16rpx;
				font-size: 24rpx;
				color: #B4B4B4;
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
				flex: 1;
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
