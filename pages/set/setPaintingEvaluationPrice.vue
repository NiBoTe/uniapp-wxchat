<template>
	<view class="container">
		<view class="label">专业：{{detail.skilledMajorName || ''}}</view>

		<view class="item u-flex u-row-between">
			<view class="left">评画价格</view>
			<view class="right u-flex">
				<input type="digit" v-model="price" placeholder="请输入评画价格" />
				<text>元</text>
			</view>
		</view>

		<view class="textarea">
			<textarea v-model="description" placeholder="请输入评画描述，该描述方便别人更快了解你…" maxlength="120" />
			<view class="textarea-length" :class="description.length ? 'active' : ''">{{description.length}}/120</view>
		</view>

		<view class="footer">
			<view class="footer-btn" :class="price === '' ? 'disabled' : ''" @click="submitTap">提交</view>
		</view>
	</view>
</template>

<script>
	import {
		paintEvaluateSaveOrUpdate
	} from '@/api/paint_evaluate_v2_teacher.js'
	export default {
		data() {
			return {
				detail: {},
				description: '',
				price: '',
			};
		},
		onLoad(options) {
			if (options.detail) {
				this.detail = JSON.parse(options.detail)
				if (this.detail.paintEvaluate) {
					this.description = this.detail.paintEvaluate.description;
					this.price = this.detail.paintEvaluate.price
				}
			}
		},
		methods: {
			submitTap() {
				if (this.price === '') return
				this.$http.post(paintEvaluateSaveOrUpdate, {
					description: this.description,
					price: this.price,
					isDelete: false,
					skilledMajorId: this.detail.skilledMajorId
				}).then(res => {
					this.$mRouter.back()
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
			padding: 44rpx 34rpx;
			border-top: 4rpx solid #EDEDED;
			border-bottom: 2rpx solid #E9E9E9;
			font-size: 30rpx;
			font-weight: bold;
			color: #3A3D71;
		}

		.item {
			padding: 22rpx 22rpx 22rpx 34rpx;
			border-bottom: 2rpx solid #E9E9E9;


			.left {
				font-size: 26rpx;
				color: #3A3D71;
			}

			input {
				text-align: right;
				font-size: 24rpx;
				color: #3A3D71;
			}

			text {
				margin-left: 4rpx;
				font-size: 26rpx;
				color: #3A3D71;
			}
		}

		.textarea {
			height: 240rpx;
			margin: 48rpx 34rpx 0;
			position: relative;
			border-bottom: 2rpx solid #E9E9E9;

			textarea {
				height: 160rpx;
				font-size: 26rpx;
				color: #3A3D71;
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
