<template>
	<view class="container">
		<view class="header">专业可多选</view>

		<view class="list">
			<view class="item u-flex u-row-between" v-for="(item, index) in list" :key="index">
				<view class="left">{{item.name}}</view>
				<view class="right">
					<u-checkbox v-model="item.checked" size="44" icon-size="30" shape="circle"></u-checkbox>
				</view>
			</view>
		</view>

		<view class="footer">
			<view class="footer-btn" @click="submitTap">确认</view>
		</view>
	</view>
</template>

<script>
	import {
		skilledMajorList
	} from '@/api/basic.js'
	export default {
		data() {
			return {
				skilledMajorId: [],
				list: []
			};
		},
		onLoad(options) {

			if (options.skilledMajorId) {
				this.skilledMajorId = options.skilledMajorId.split(',')
			}
			this.initData()
		},
		methods: {
			initData() {
				this.$http.get(skilledMajorList).then(res => {
					let data = res.data
					data.map(item => {
						let find = this.skilledMajorId.find(a => a == item.id)
						console.log(find)
						item['checked'] = !!find;
					})
					this.list = res.data
				})
			},
			submitTap() {
				let list = this.list.filter(item => !!item.checked)
				uni.$emit('selectChange', list)
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {

		.header {
			padding: 48rpx 0 0 32rpx;
			font-size: 26rpx;
			color: #8F9091;
		}

		.list {
			padding: 0 34rpx;

			.item {

				padding: 40rpx 0;
				border-bottom: 2rpx solid #EDEDED;

				.left {
					font-size: 26rpx;
					font-weight: bold;
					color: #3A3D71;
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
