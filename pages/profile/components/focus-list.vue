<template>
	<view class="fans-container">
		<scroll-view scroll-y class="scroll-warper" @scrolltolower="lower">
			<view class="item-list" v-for="(item,index) in list" :key="index">
				<view class="pic">
					<view class="pic-inner">
						<u-avatar size="116" :src="item.headUrl"></u-avatar>
						<image v-if="item.authStatus === 1" class="v-logo" src="/static/public/auth.png"></image>
					</view>
				</view>
				<view class="desc u-row-between u-flex">
					<view class="name">{{item.fullName}}</view>
					<view class="btn" v-if="item.isFollow" @click="addFollowTap(item, index)">
						<text>取消关注</text>
					</view>
					<view class="btn" v-else @click="addFollowTap(item, index)">
						<text>关注</text>
					</view>
				</view>
			</view>
			<nodata v-if="!loading && !list.length"></nodata>
			<u-loadmore v-else margin-top="30" margin-bottom="30" :status="loadStatus" @loadmore="addData"></u-loadmore>
		</scroll-view>
	</view>
</template>

<script>
	import {
		followingList,
		addFollow
	} from '@/api/teacher.js'
	export default {
		data() {
			return {
				loading: true,
				loadStatus: 'loadmore',
				current: 1,
				size: 10,
				list: []
			};
		},
		created() {
			this.getList();
		},
		methods: {
			getList() {
				this.loading = true;
				this.loadStatus = 'loading';
				this.$http.post(followingList, {
					current: this.current,
					size: this.size,
					userId: this.$mStore.state.userInfo.id
				}).then(res => {
					let data = res.data.records
					if (this.current === 1) {
						this.list = data;
					} else {
						this.list = this.list.concat(data);
					}
					if (data.length <= 0) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}

					this.loading = false;

				}).catch(err => {
					console.log(err)
				})
			},
			lower() {
				this.loadStatus = 'loading';
				this.addData();
			},
			addData() {
				this.current++;
				this.getList();
			},
			addFollowTap(item, index) {
				this.$http.post(addFollow, null, {
					params: {
						toAppUserId: item.id,
						isFollow: !item.isFollow
					}
				}).then(res => {
					this.$mHelper.toast(!item.isFollow ? '关注成功' : '取消关注成功');
					this.$set(this.list[index], 'isFollow', !item.isFollow)
				})
			}
		}
	}
</script>

<style lang="scss">
	.fans-container {
		.item-list {
			height: 165rpx;
			display: flex;

			.pic {
				width: 170rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.pic-inner {
					position: relative;

					image {
						border-radius: 50%;
						width: 116rpx;
						height: 116rpx;
					}

					.v-logo {
						position: absolute;
						right: 0;
						bottom: 0;
						width: 42rpx;
						height: 42rpx;
					}
				}
			}

			.desc {
				flex: 1;
				border-bottom: 2rpx solid #E9E9E9;
				padding-right: 40rpx;

				.name {
					font-size: 28rpx;
					font-weight: bold;
					color: #3A3D71;
				}

				.btn {
					width: 134rpx;
					height: 58rpx;
					background: #FFFFFF;
					border-radius: 30rpx;
					border: 2rpx solid #C8C8C8;
					display: flex;
					justify-content: center;
					align-items: center;

					text {
						font-size: 24rpx;
						color: #9C9C9C;
					}
				}
			}
		}
	}
</style>
