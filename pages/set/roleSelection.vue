<template>
	<view class="container">
		<view class="list">
			<view class="item" :class="userInfo.roleSelect === 'teacher' ? 'active' : ''" @click="selectTap('teacher')">
				<image :src="setSrc('role_teacher.png')"></image>
				<view class="item-box">
					<view class="item-header">我是教师</view>
					<view class="item-subheader">开启线上第二职场</view>
				</view>

				<view class="item-badge u-flex u-row-center" v-show="userInfo.roleSelect === 'teacher'">当前角色</view>
			</view>
			<view class="item" :class="userInfo.roleSelect === 'not_teacher' ? 'active1' : ''"
				@click="selectTap('not_teacher')">
				<image :src="setSrc('role_student.png')"></image>
				<view class="item-box">
					<view class="item-header">我是学生</view>
					<view class="item-subheader">开启我的艺术之旅</view>
				</view>

				<view class="item-badge u-flex u-row-center" v-show="userInfo.roleSelect === 'not_teacher'">当前角色</view>
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
				userInfo: {}
			};
		},
		onLoad() {

		},

		onShow() {
			this.userInfo = this.$mStore.state.userInfo;
		},
		methods: {
			selectTap(type) {
				this.$http.post(updateRoleSelect, {
					roleSelect: type
				}).then(res => {
					this.$mStore.commit('login', Object.assign(this.$mStore.state.userInfo, {
						roleSelect: type
					}))
					
					uni.$emit('roleSelect', type)
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
			padding: 48rpx 40rpx 0;

			.item {
				margin-bottom: 38rpx;
				width: 100%;
				height: 256rpx;
				position: relative;
				border-radius: 30rpx;
				border: 4rpx solid transparent;

				&.active {
					border: 4rpx solid $u-type-primary;

					.item-badge {
						background: $u-type-primary;
					}
				}

				&.active1 {
					border: 4rpx solid #059E66;

					.item-badge {
						background: #059E66;
					}

				}


				&-badge {
					position: absolute;
					top: -4rpx;
					right: -4rpx;
					width: 140rpx;
					height: 44rpx;
					border-radius: 0px 30rpx 0px 30rpx;
					font-size: 24rpx;
					color: #FFFFFF;
				}

				image {
					width: 100%;
					height: 100%;
				}


				&-box {
					position: absolute;
					top: 52rpx;
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
