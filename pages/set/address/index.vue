<template>
	<view class="container">
		<view class="content" v-if="list.length">
			<view class="list">
				<u-swipe-action v-for="(item, index) in list" :vibrate-short="true" :key="item.id" :show="item.show"
					:index="index" @click="click" @open="open" :options="options" btn-width="200">
					<view class="item u-flex u-row-between" @click="detailTap(item, index)">
						<view class="item-box">
							<view class="header u-flex">
								<view class="header-label u-flex u-row-center default" v-if="item.isDefault">默认</view>
								<view class="header-label u-flex u-row-center"
									:class="item.tag === '家' ? 'home' : item.tag === '公司' ? 'company' : 'school'"
									v-else>
									{{item.tag}}
								</view>
								<view class="header-name">{{item.realname}}</view>
								<view class="header-phone">{{item.mobile}}</view>
							</view>
							<view class="address">{{item.areaNames.replace(/,/g, ' ')}}{{item.address}}</view>
						</view>

						<view class="update" @click.stop="updateTap(item)">
							<image src="/static/public/update.png"></image>
						</view>
					</view>
				</u-swipe-action>
			</view>
		</view>
		<view class="footer">
			<view class="footer-btn" @click="submitTap">
				<u-icon name="plus" color="#fff" style="margin-right: 12rpx;"></u-icon>
				<text>添加收货地址</text>
			</view>
		</view>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<nodata v-if="!loading && !list.length"></nodata>
	</view>


</template>

<script>
	import {
		addressList,
		addressUpdate,
		addressDelete
	} from '@/api/receive-address.js'
	export default {
		data() {
			return {
				loading: true,
				list: [],
				disabled: false,
				btnWidth: 180,
				show: false,
				options: [{
						text: '设为默认',
						style: {
							backgroundColor: '#F3F3F3',
							color: '#3A3D71',
							fontSize: '24rpx',
							fontWeight: 'bold'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d',
							fontSize: '24rpx',
							fontWeight: 'bold'
						}
					}
				]
			};
		},
		onLoad() {
			this.initData();

		},
		onShow() {
			uni.$on('isUpdate', (data) => {
				this.initData();
			})
		},
		methods: {
			initData() {
				this.$http.post(addressList).then(res => {
					let data = res.data;
					data.map(item => {
						item['show'] = false;
					})
					this.list = data
					this.loading = false;
				})
			},
			updateTap(item) {
				this.$mRouter.push({
					route: `/pages/set/address/add?item=${JSON.stringify(item)}`
				})
			},
			click(index, index1) {
				if (index1 == 1) {
					this.list[index].show = false;
					this.deleteAddress(index)
				} else {
					this.list[index].show = false;
					this.updateAddress(index);
				}
			},

			// 修改地址
			updateAddress(index) {
				let params = JSON.parse(JSON.stringify(this.list[index]));
				params.isDefault = true;
				this.$http.post(addressUpdate, params).then(res => {
					this.initData()
					this.$mHelper.toast('设置成功');
				})
			},

			// 删除地址
			deleteAddress(index) {
				this.$http.post(addressDelete, {
					id: this.list[index].id
				}).then(res => {
					// this.initData()
					this.list.splice(index, 1);
					this.$mHelper.toast('删除成功');
				})
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if (index != idx) this.list[idx].show = false;
				})
			},
			// 新增收获地址
			submitTap() {
				uni.navigateTo({
					url: '/pages/set/address/add'
				})
			},
			// 选择地址
			detailTap(item, index) {
				uni.$emit('selectAddress', {
					item,
					index
				})
				this.$mRouter.back();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #fff;

		.list {


			padding-bottom: 160rpx;

			.item {
				margin: 0 34rpx;
				padding: 34rpx 0;
				border-bottom: 2rpx solid #E9E9E9;


				&-box {
					flex: 1;
					margin-right: 68rpx;

					.header {
						&-label {
							width: 92rpx;
							height: 46rpx;
							border-radius: 23rpx;
							font-size: 24rpx;
							font-weight: 500;
							color: #FFFFFF;

							&.default {
								background-color: $u-type-primary;
								color: #fff;
							}

							&.home {
								background-color: #EFF2FF;
								color: $u-type-primary;
							}

							&.school {
								background-color: #FFF3EA;
								color: #FF8827;
							}

							&.company {
								background-color: rgba(53, 206, 150, 0.08);
								color: #35CE96;
							}
						}

						&-name {
							margin: 0 24rpx;
							font-size: 28rpx;
							font-weight: bold;
							color: #3A3D71;
						}

						&-phone {
							font-size: 26rpx;
							color: #8F9091;
						}
					}

					.address {
						margin-top: 4rpx;
						font-size: 26rpx;
						color: #3A3D71;
					}
				}

				.update {
					image {
						width: 32rpx;
						height: 32rpx;
					}
				}
			}
		}

		.footer {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 14rpx 34rpx;
			padding-bottom: calc(60rpx + constant(safe-area-inset-bottom));
			padding-bottom: calc(60rpx + env(safe-area-inset-bottom));
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

	/deep/ .u-btn-text {
		font-size: 24rpx;
		font-weight: bold;
	}
</style>
