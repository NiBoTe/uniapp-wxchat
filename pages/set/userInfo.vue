<template>
	<view class="userInfo">
		<view class="item u-flex u-row-between">
			<view class="label">头像</view>
			<view class="head">
				<view class="head-default u-flex u-row-center">头像</view>
				<!-- <u-avatar size="120" :src="url"></u-avatar> -->
			</view>
		</view>
		<view class="item u-flex u-row-between">
			<view class="label">昵称</view>
			<view class="input">
				<input type="text" placeholder="请输入昵称" />
			</view>
		</view>

		<view class="item u-flex u-row-between">
			<view class="label">擅长专业</view>
			<view class="input u-flex">
				<input type="text" placeholder="请选择专业" disabled />
				<image src="/static/public/arrow_right.png"></image>
			</view>
		</view>

		<view class="item u-flex u-row-between">
			<view class="textarea">
				<textarea v-model="description" placeholder="请介绍自己的教育或任职经历..." maxlength="150" />
				<view class="textarea-length" :class="description.length ? 'active' : ''">{{description.length}}/150
				</view>
			</view>
			
		</view>
		<view class="footer">
			<view class="footer-btn" @click="submitTap">保存</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '',
				description: ''
			};
		},
		methods:{
			submitTap(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.userInfo{
		
		.label{
			font-size: 26rpx;
			font-weight: bold;
			color: #3A3D71;
		}
		.item{
			margin: 0 34rpx;
			padding: 36rpx 0;
			border-bottom: 2rpx solid #EDEDED;
			
			&:last-of-type{
				border-bottom: none;
			}
			.head{
				&-default{
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
					background: #F9F9F9;
					font-size: 24rpx;
					color: #8F9091;
				}
			}
			
			.input{
				flex: 1;
				justify-content: flex-end;
				input{
					text-align: right;
					font-size: 24rpx;
					color: #8F9091;
				}
				
				image{
					margin-left: 20rpx;
					width: 12rpx;
					height: 22rpx;
				}
			}
			
			.textarea{
				flex: 1;
				height: 240rpx;
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
