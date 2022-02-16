<template>
	<view class="tips">
		<u-popup v-model="popShow" mode="center" border-radius="32">
			<view class="pop-header">
				<image :src="setSrc('top_pop_bg.png')"></image>
				<view class="pop-header-box u-flex">
					<image :src="setSrc('top_pop_tips.png')"></image>
					<text>注意</text>
				</view>
			</view>

			<view class="pop-content">
				<view class="pop-title u-flex">
					<u-icon name="star-fill" color="#FFAA00"></u-icon>
					<text>推荐本账号只给账号使用者本人报名</text>
				</view>
				<view class="pop-subtitle">
					<u-icon name="star-fill" color="#FFAA00"></u-icon>
					<text>本账号可替他人及多人报名，但仅限多人同时使用一台移动设备登录本账号完成所有考试流程，请谨慎使用。</text>
				</view>

				<view class="pop-checked">
					<u-checkbox @change="checkboxChange"  shape="circle" v-model="checked" name="1">
						<text>不再提示</text>
					</u-checkbox>
				</view>
			</view>
			
			<view class="pop-footer" @click="submitTap">
				<text>确定</text>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				popShow: false,
				checked: false
			}
		},
		methods: {
			open() {
				this.popShow = true
			},
			submitTap(){
				this.popShow = false;
				this.$emit('enterClick')
				if(this.checked) uni.setStorageSync('examChecked', this.checked)
			},
			checkboxChange(e){
				this.checked = e;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pop-header {
		position: relative;

		&>image {
			width: 544rpx;
			height: 118rpx;
		}

		&-box {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;

			justify-content: center;
			align-items: center;

			image {
				width: 38rpx;
				height: 44rpx;
			}

			text {
				margin-left: 10rpx;
				font-size: 36rpx;
				font-weight: bold;
				color: #FFFFFF;
			}
		}
	}

	.pop-content {
		width: 544rpx;
		padding: 34rpx 34rpx 32rpx 28rpx;
		.pop-title{
			font-size: 28rpx;
			font-weight: 600;
			color: #1B1B1B;
			text{
				margin-left: 6rpx;
			}
		}
		
		.pop-subtitle{
			margin-top: 26rpx;
			line-height: 40rpx;
			font-size: 28rpx;
			color: #1B1B1B;
			text{
				margin-left: 6rpx;
			}
		}
		
		.pop-checked{
			margin-top: 28rpx;
			text{
				font-size: 28rpx;
				color: #9E9E9E;
			}
		}
	}
	.pop-footer{
		width: 100%;
		text-align: center;
		padding: 28rpx 0;
		border-top: 1px solid #D8D8D8;
		font-size: 36rpx;
		color: $u-type-primary;
	}
</style>
