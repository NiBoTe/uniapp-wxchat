<template>
	<view class="tab-bar">
		<view v-for="(item,index) in list" :key="index" class="tab-bar-item" @click="switchTab(item, index)">
			<!-- <image class="tab-center" v-if="index === 2" src="/static/public/center.png"></image> -->
			<image class="tab-center" v-if="index === 2" :src="item.defaultIcon"></image>
			<view class="tab_text" v-else :style="{color: selected === index ? selectedColor : color}">{{item.name || ''}}
			</view>
		</view>

		<u-popup v-model="popShow" mode="bottom" border-radius="40">
			<view class="pop-content">
				<view class="pop-list">
					<view class="pop-item" @click="itemTap(0)">
						<image src="/static/public/want_painting.png"></image>
						<text>{{userInfo.roleSelect === 'teacher' ? '评画' : '我要评画'}}</text>
					</view>

					<view class="pop-item" v-if="userInfo.roleSelect === 'teacher'" @click="itemTap(1)">
						<image src="/static/public/my_textbook.png"></image>
						<text>高分教材</text>
					</view>

					<view class="pop-item" @click="itemTap(2)">
						<image src="/static/public/dynamic_release.png"></image>
						<text>发布动态</text>
					</view>
					<view class="pop-item" @click="itemTap(3)">
						<image src="/static/public/my_application.png"></image>
						<text>我的报考</text>
					</view>
				</view>

				<view class="pop-close" @click="popShow = false">
					<image src="/static/public/my_close.png"></image>
				</view>
			</view>
		</u-popup>
	</view>

</template>



<script>
	import {
		tabList,
		tabPlusViewCount
	} from '@/api/homepage.js'
	export default {
		props: {
			selected: { // 当前选中的tab index
				type: Number,
				default: 0,

			}
		},
		data() {
			return {
				color: "#9C9C9C",
				selectedColor: this.$mConstDataConfig.themeColor,
				popShow: false,

				pathList: [{
						"pagePath": "/pages/index/index",
						"text": "首页"
					},
					{
						"pagePath": "/pages/circle/index",
						"text": "广场"
					},
					{
						"pagePath": "/pages/center/index",
						"text": "中心"
					},
					{
						"pagePath": "/pages/teacher/index",
						"text": "名师"
					},
					{
						"pagePath": "/pages/profile/profile",
						"text": "我的"
					}
				],
				list: [{
						"pagePath": "/pages/index/index",
						"text": "首页"
					},
					{
						"pagePath": "/pages/circle/index",
						"text": "广场"
					},
					{
						"pagePath": "/pages/center/index",
						"text": "中心"
					},
					{
						"pagePath": "/pages/teacher/index",
						"text": "名师"
					},
					{
						"pagePath": "/pages/profile/profile",
						"text": "我的"
					}
				],
				userInfo: {},
				hasLogin: false
			}
		},
		async created() {
			await this.initData()
		},
		mounted() {

			this.userInfo = this.$mStore.state.userInfo
		},
		methods: {
			async initData() {
				let res = await this.$http.get(tabList)
				console.log(res)

				let data = res.data

				data.map(item => {
					switch (item.id) {
						case '1':
							item['pagePath'] = "/pages/index/index";
							break;
							
						case '2':
							item['pagePath'] = "/pages/circle/index";
							break;
							
						case '3':
							item['pagePath'] = "/pages/center/index";
							break;
							
						case '4':
							item['pagePath'] = "/pages/teacher/index";
							break;
							
						case '5':
							item['pagePath'] = "/pages/profile/profile";
							break;
					}
				})
				this.list = data;
			},
			switchTab(item, index) {
				this.hasLogin = this.$mStore.getters.hasLogin
				let url = item.pagePath;
				if (index === 2) {
					this.popShow = true
					this.userInfo = this.$mStore.state.userInfo
				} else if (index === 4) {
					this.popShow = false
					if (this.hasLogin) {
						uni.switchTab({
							url
						})
					} else {
						uni.navigateTo({
							url: '/pages/public/logintype'
						})
					}
				} else {
					this.popShow = false
					uni.switchTab({
						url
					})
				}
				
				this.$http.post(tabPlusViewCount, null, {
					params: {
						id: item.id
					}
				}).then(res => {
					console.log(res)
				})
			},
			itemTap(index) {
				this.popShow = false
				this.hasLogin = this.$mStore.getters.hasLogin
				switch (index) {
					case 0:
						if (this.userInfo && this.userInfo.roleSelect !== 'teacher') {
							this.navTo('/pages/centers/paintingEvaluation/teacherList')
						} else {
							this.navTo('/pages/centers/paintingEvaluation/teacherIndex')
						}
						break;
					case 1:

						if (!this.hasLogin) {
							uni.navigateTo({
								url: '/pages/public/logintype'
							})
						}
						this.navTo('/pages/centers/highScoreRelease')
						break;
					case 2:
						if (!this.hasLogin) {
							uni.navigateTo({
								url: '/pages/public/logintype'
							})
						}
						this.navTo('/pages/centers/dynamicRelease')
						break;
					case 3:
						this.navTo('/pages/centers/myApplication')
						break;

				}
			},
			navTo(url) {
				console.log(url)
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss">
	.tab-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;
		height: 164rpx;
		background: white;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.tab-bar-item {
			flex: 1;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			.tab-center {
				width: 82rpx;
				height: 70rpx;
			}

			.tab_text {
				font-size: 34rpx;
				font-weight: 500;
			}
		}


		.pop-content {
			.pop-list {
				padding-top: 72rpx;
				display: flex;
				justify-content: space-around;
				align-items: center;

				.pop-item {
					display: flex;
					flex-direction: column;
					align-items: center;

					image {
						width: 112rpx;
						height: 86rpx;
					}

					text {
						font-size: 28rpx;
						color: #333333;
					}
				}
			}

			.pop-close {
				margin: 148rpx 0 40rpx 0;
				text-align: center;

				image {
					width: 34rpx;
					height: 34rpx;
				}
			}
		}
	}
</style>
