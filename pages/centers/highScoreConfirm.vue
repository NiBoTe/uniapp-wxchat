<template>
	<view class="center">
		<view class="content">
			<view class="header">
				<textarea v-model="params.description" placeholder="输入详情内容…" maxlength="200" />
				<view class="header-length" :class="description.length ? 'active' : ''">{{params.expressContent.length}}/200
				</view>
			</view>

			<view class="subheader u-flex u-row-between" v-if="params.isNeedExpress">
				<view class="left">发货内容</view>
				<view class="right">{{params.expressContent}}</view>
			</view>

			<view class="swiper-wrapper">
				<swiper class="swiper" :current="swiperCurrentIndex" @change="changeSwiper"
					:style="[{height: height + 'px'}]">
					<swiper-item v-for="(item, index) in params.items" :key="index">
						<view class="swiper-item">
							<image :src="item.url" mode="widthFix">
							</image>
							<view class="cover u-flex u-row-center" v-if="index === 0">封面</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>

		<view class="footer">
			<view class="footer-btn" :class="title === '' ? 'disabled' : ''" @click="submitTap">发布</view>
		</view>
	</view>
</template>

<script>
	import {
		myAddTeachingMaterial
	} from '@/api/teaching_material.js'
	export default {
		data() {
			return {
				swiperCurrentIndex: 0,
				height: 0,
				description: '',
				btnLoading: false,
				params: {
					description: '',
					expressContent: '',
					items: [],
					isNeedExpress: false,
				}
			};
		},
		onLoad(options) {
			if (options.params) {
				this.params = JSON.parse(options.params)
				console.log(this.params)
			}
		},
		onReady() {
			this.$nextTick(() => {
				this.getCurrentSwiperHeight('.swiper-item');
			})
		},
		methods: {
			getCurrentSwiperHeight(element) {
				let query = uni.createSelectorQuery().in(this);
				query.selectAll(element).boundingClientRect();
				query.exec((res) => {
					this.height = res[0][this.swiperCurrentIndex].height;
				})
			},
			// 切换swiper
			changeSwiper(e) {
				this.swiperCurrentIndex = e.detail.current;
				this.getCurrentSwiperHeight('.swiper-item');
			},
			// 提交
			submitTap() {
				if(this.btnLoading) return 
				this.btnLoading = true;
				if (this.params.expressContent === '') {
					return this.$mHelper.toast('请输入详细内容')
				}
				console.log(this.params)
				this.$http.post(myAddTeachingMaterial, this.params).then(res => {
					this.$mHelper.toast('发布成功')
					setTimeout(() => {
						uni.navigateBack({
							delta: 2
						})
					}, 1500)
				}).catch(err => {
					this.$mHelper.toast(err.msg);
					setTimeout(() => {
						this.btnLoading = false;
					}, 500)
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.center {
		min-height: 100vh;
		background-color: #fff;

		.content {
			padding-bottom: 160rpx;
		}

		.header {
			height: 240rpx;
			margin: 48rpx 34rpx 0;
			position: relative;


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

		.subheader {
			margin: 0 34rpx 0 30rpx;
			padding: 20rpx 0 26rpx 4rpx;
			border-top: 2rpx solid #E9E9E9;
			font-size: 26rpx;
			color: #3A3D71;

			.right {
				width: 0;
				flex: 1;
				text-align: right;
			}
		}

		.swiper-wrapper {
			margin: 0 32rpx 0 34rpx;

			.swiper {
				width: 100%;

				&-item {
					width: 100%;
					position: relative;

					image {
						width: 100%;
					}

					.cover {
						position: absolute;
						top: 22rpx;
						left: 22rpx;
						width: 132rpx;
						height: 68rpx;
						background: #FF334D;
						font-size: 26rpx;
						color: #FFF9F9;
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
