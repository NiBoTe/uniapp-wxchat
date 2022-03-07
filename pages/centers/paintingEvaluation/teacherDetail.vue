<template>
	<view class="detial">
		<view class="content">
			<image :src="detail.url"
				mode="widthFix"></image>
			<view class="content-text">
				<text>{{detail.title}}</text>
			</view>
		</view>

		<view class="footer">
			<view class="footer-btn" @click="submitTap">开始评画</view>
		</view>
	</view>
</template>

<script>
	import {
		orderItemPaintEvaluateDetail
	} from '@/api/paint_evaluate_v2_teacher.js'
	export default {
		data() {
			return {
				id: null,
				detail: {}
			};
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id
				this.initData()
			}
		},
		methods: {
			initData() {
				this.$http.get(orderItemPaintEvaluateDetail, {
					id: this.id
				}).then(res => {
					console.log(res)
					this.detail = res.data;
				})
			},
			submitTap() {
				uni.navigateTo({
					url: `/pages/centers/paintingEvaluation/drawingBoard?id=${this.id}`
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.detial {
		min-height: 100vh;
		background: #F3F3F3;
		padding-top: 28rpx;

		.content {
			margin: 0 34rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			overflow: hidden;
			text-align: center;

			image {
				display: block;
				width: 100%;
			}

			&-text {
				text-align: left;
				padding: 28rpx 30rpx;
				font-size: 26rpx;
				color: #3A3D71;
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
