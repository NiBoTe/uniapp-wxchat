<template>
	<view class="container">

		<view class="list">
			<view class="item u-flex u-row-between" v-for="(item, index) in list" :key="index"
				@click="selectTap(item, index)">
				<view class="left">{{item.name}}</view>
				<view class="right" v-if="item.selected">
					<u-icon name="checkbox-mark" :color="themeColor" size="28"></u-icon>
				</view>
			</view>
		</view>

		<view class="footer">
			<view class="footer-btn" @click="submitTap">提交</view>
		</view>
	</view>
</template>

<script>
	import {
		areaList
	} from '@/api/basic.js'
	export default {
		data() {
			return {
				themeColor: this.$mConstDataConfig.themeColor,
				list: []
			};
		},
		onLoad(options) {
			this.initData(options.names);
		},
		methods: {
			initData(names) {
				this.$http.post(areaList).then(res => {
					let data = res.data;
					data.map(item => {
						item['selected'] = names ? names.indexOf(item.name) !== -1 : false;
					})
					this.list = data
				}).catch(err => {
					console.log(err)
				})
			},
			selectTap(item) {
				item.selected = !item.selected
			},
			submitTap(){
				let list = []
				this.list.map(item => {
					if(item.selected){
						list.push(item)
					}
				})
				uni.$emit('select', list)
				this.$mRouter.back();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		background-color: #fff;
		padding-bottom: 160rpx;
		box-sizing: border-box;

		.list {
			.item {
				padding: 22rpx 30rpx 22rpx 34rpx;
				border-top: 2rpx solid #EDEDED;
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
</style>
