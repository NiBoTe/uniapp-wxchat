<template>
	<view class="centers">
		<view class="label">科目名称</view>
		<view class="list">
			<view class="item" v-for="(item, index) in list" :key="index" @click="selectNameTap(index)"
				:class="nameActive === index ? 'active' : ''">
				{{item.name}}
			</view>

		</view>

		<view class="line"></view>

		<view class="label">科目类别</view>
		<view class="list type" v-if="list.length">
			<view class="item" v-for="(item, index) in list[nameActive].childMenus" :key='index'
				@click="selectTypeTap(index)" :class="typeActive === index ? 'active' : ''">{{item.name}}</view>
		</view>

		<view class="footer">
			<view class="footer-btn" @click="submitTap">确认</view>
		</view>
	</view>
</template>

<script>
	import {
		myMenuList2
	} from '@/api/teaching_material'
	export default {
		data() {
			return {
				nameActive: 0,
				typeActive: 0,
				list: []
			};
		},
		onLoad() {
			this.initData();
		},
		methods: {
			initData() {
				this.$http.post(myMenuList2).then(res => {
					this.list = res.data
				})
			},
			// 选择科目名称
			selectNameTap(index) {
				this.nameActive = index
				this.typeActive = 0
			},
			// 类型选择
			selectTypeTap(index) {
				this.typeActive = index
			},
			// 确认
			submitTap() {
				uni.$emit('selectAccount', {
					subject: this.list[this.nameActive],
					subjectType: this.list[this.nameActive].childMenus[this.typeActive]
				})

				this.$mRouter.back();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.centers {
		background-color: #fff;

		.label {
			margin: 30rpx 32rpx;
			font-size: 24rpx;
			font-weight: bold;
			color: #3A3D71;
		}

		.list {
			display: flex;
			flex-wrap: wrap;

			&.type {
				.item {
					padding: 14rpx 18rpx;
				}
			}

			.item {
				display: inline-block;
				margin: 0 20rpx 38rpx;
				padding: 14rpx 26rpx;
				font-size: 26rpx;
				color: #3A3D71;
				border: 2rpx solid transparent;
				background: #F3F3F3;
				border-radius: 40rpx;

				&.active {
					border: 2rpx solid $u-type-primary;
					background: #EFF2FF;
				}
			}
		}

		.line {
			margin: 0 32rpx;
			border: 2rpx solid #D8D8D8;
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
</style>
