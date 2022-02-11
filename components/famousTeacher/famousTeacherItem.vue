<template>
	<view class="container">

		<view class="item u-flex">
			<view class="left">
				<u-avatar size="128" :src="detail.headUrl"></u-avatar>
				<view class="left-badge" v-if="detail.authStatus === 1">
					<image src="/static/public/auth.png"></image>
				</view>
			</view>

			<view class="right">
				<view class="title u-flex u-row-between">
					<text>{{detail.fullName}}</text>
					<view class="title-btn u-flex u-row-center" @click.stop="followTap"
						:class="detail.isFollow ? 'disabled' : ''">{{detail.isFollow ? '已关注' : '关注'}}</view>
				</view>

				<view class="subtitle u-line-2">{{detail.introduce}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		addFollow
	} from '@/api/teacher.js'
	export default {
		name: "FamousTeacherItem",
		props: {
			item: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		data() {
			return {
				detail: {}
			};
		},
		created() {
			this.detail = this.item
		},
		methods: {
			followTap() {
				this.$http.post(addFollow, null, {
					params: {
						toAppUserId: this.detail.id,
						isFollow: !this.detail.isFollow
					}
				}).then(res => {
					this.$mHelper.toast(!this.detail.isFollow ? '关注成功' : '取消成功');
					this.$set(this.detail, 'isFollow', !this.detail.isFollow)
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {

		.item {
			margin: 28rpx 30rpx 0 32rpx;
			padding: 20rpx;
			background: #FFFFFF;
			box-shadow: 0px 6rpx 16rpx 6rpx rgba(230, 230, 230, 0.5);
			border-radius: 24rpx;

			.left {
				position: relative;

				&-badge {
					position: absolute;
					right: 0;
					bottom: 0;

					image {
						width: 44rpx;
						height: 44rpx;
					}
				}
			}

			.right {
				flex: 1;
				margin-left: 20rpx;

				.title {
					text {
						font-size: 28rpx;
						font-weight: bold;
						color: #3A3D71;
					}

					&-btn {
						width: 100rpx;
						height: 42rpx;
						left-height: 42rpx;
						background: #EFF2FF;
						border-radius: 26rpx;
						font-size: 24rpx;
						font-weight: bold;
						color: $u-type-primary;

						&.disabled {
							background: #F2F2F2;
							color: #9E9E9E;
						}
					}
				}

				.subtitle {
					margin-top: 16rpx;
					font-size: 26rpx;
					color: #3A3D71;
				}
			}

		}
	}
</style>
