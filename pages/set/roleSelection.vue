<template>
	<view class="container">
		<view class="list">
			<view class="item" @click="selectTap('teacher')">
				<image :src="setSrc('role_teacher.png')"></image>
				<view class="item-box">
					<view class="item-header">我是教师</view>
					<view class="item-subheader">开启线上第二职场</view>
				</view>
			</view>
			<view class="item" @click="selectTap('not_teacher')">
				<image :src="setSrc('role_student.png')"></image>
				<view class="item-box">
					<view class="item-header">我是学生</view>
					<view class="item-subheader">开启我的艺术之旅</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		updateRoleSelect
	} from '@/api/userInfo.js'
	export default {
		data() {
			return {

			};
		},
		methods: {
			selectTap(type) {
				this.$http.post(updateRoleSelect, {
					roleSelect: type
				}).then(res => {
					this.$mStore.commit('login', Object.assign(this.$mStore.state.userInfo, {
						roleSelect: type
					}))
					this.$mRouter.reLaunch({
						route: '/pages/index/index'
					});
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.list {
			padding: 0 40rpx;

			.item {
				margin-bottom: 38rpx;
				width: 100%;
				height: 248rpx;
				position: relative;

				image {
					width: 100%;
					height: 248rpx;
				}


				&-box {
					position: absolute;
					top: 62rpx;
					left: 60rpx;

					.item-header {
						margin-left: 18rpx;
						font-size: 48rpx;
						font-weight: 500;
						color: #FFFFFF;
					}

					.item-subheader {
						margin-top: 18rpx;
						padding: 0 20rpx;
						height: 48rpx;
						line-height: 48rpx;
						border-radius: 32px;
						border: 2rpx solid #FFFFFF;
						font-size: 24rpx;
						font-weight: 500;
						color: #FFFFFF;
					}
				}
			}
		}
	}
</style>
