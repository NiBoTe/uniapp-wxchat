<template>
	<view class="evaluate">
		<view class="header u-flex">
			<image :src="detail.items[activeIndex].hdImg"></image>
			<view class="right">
				<view class="title">{{detail.items[activeIndex].description}}</view>
				<view class="subtitle u-flex">
					<u-rate :count="5" v-model="star" inactive-icon="star-fill" active-color="#35CE96"
						inactive-color="#E3E3E3" gutter="16" size="32"></u-rate>
					<text v-if="star <= 2">非常差</text>
					<text v-else-if="star <= 4">一般</text>
					<text v-else>优秀</text>
				</view>
			</view>
		</view>


		<view class="card">
			<view class="card-textarea">
				<view class="card-placeholder u-flex" v-if="!isFocus" @click="isFocus = true">
					<image src="/static/public/update.png"></image>
					<text>此刻你的想法…</text>
				</view>
				<view class="card-text" v-else>
					<textarea v-model="content" focus maxlength="300" />
				</view>
				<view class="card-length" :class="content.length ? 'active' : ''">{{content.length}}/300</view>
			</view>

			<view class="label">给TA几个评语标签吧～</view>

			<view class="list">
				<u-row gutter="16">
					<u-col span="3" v-for="(item,index) in labelList" :key="index">
						<view class="item" :class="item.selected ? 'active' : ''" @click="itemTap(item, index)">
							{{item.name}}</view>
					</u-col>
				</u-row>
			</view>
		</view>

		<view class="footer">
			<view class="footer-btn" @click="submitTap">
				<text>提交</text>
			</view>
		</view>
	</view>
</template>

<script>

	import {
		getDetail,
		teachingMaterialCommentTagList,
		confirmCompleted
	} from '@/api/teaching_material.js'
	export default {
		data() {
			return {
				star: 4,
				id: null,
				detail: {},
				isFocus: false,
				content: '',
				labelList: [],
				activeIndex: 0,
			};
		},
		onLoad(options) {
			this.getLabelList();
			if (options.id) {
				this.id = options.id
				this.activeIndex = Number(options.index)
				this.initData()
			}
		},
		watch: {
			content(val) {
				if (!val.length) {
					this.isFocus = false;
				}
			}
		},
		methods: {
			initData() {
				this.$http.get(getDetail, {
					id: this.id
				}).then(res => {
					this.detail = res.data
				})
			},

			getLabelList() {
				this.$http.get(teachingMaterialCommentTagList).then(res => {
					console.log(res)
					res.data.map(item => {
						item['selected'] = false;
					})
					this.labelList = res.data
				})
			},
			// 选择标签
			itemTap(item, index) {
				item['selected'] = !item['selected']
			},
			// 提交
			submitTap() {
				let tags = [];
				this.labelList.map(item => {
					if (item.selected) {
						tags.push(item.id)
					}
				})
				this.$http.post(confirmCompleted, {
					tagId: tags.join(','),
					stars: this.star,
					orderId: this.detail.id,
					content: this.content,
				}).then(res => {
					uni.navigateBack({
						delta: 2
					})
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.evaluate {
		min-height: 100vh;
		background-color: #F3F3F3;
		padding-top: 30rpx;

		.header {
			margin: 0 34rpx 30rpx;
			padding: 14rpx;
			background: #FFFFFF;
			border-radius: 24rpx;

			image {
				width: 200rpx;
				height: 174rpx;
				border-radius: 24rpx;
			}

			.right {
				height: 174rpx;
				margin-left: 22rpx;
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-around;


				.title {
					font-size: 28rpx;
					color: #3A3D71;
				}

				.subtitle {
					text {
						margin-left: 44rpx;
						font-size: 28rpx;
						color: #9E9E9E;
					}
				}
			}
		}

		.card {
			margin: 0 34rpx;
			background: #FFFFFF;
			border-radius: 24rpx;

			&-textarea {
				position: relative;
				padding: 38rpx 30rpx 22rpx 28rpx;
				min-height: 240rpx;
				border-bottom: 2rpx solid #E9E9E9;

				textarea {
					height: 160rpx;
					font-size: 26rpx;
					color: #3A3D71;
				}

				.card-placeholder {
					image {
						width: 28rpx;
						height: 30rpx;
					}

					text {
						margin-left: 12rpx;
						font-size: 28rpx;
						color: #B0B3BF;
					}
				}

				.card-length {
					position: absolute;
					bottom: 24rpx;
					right: 30rpx;
					font-size: 28rpx;
					font-weight: 300;
					color: #8F9091;

					&.active {
						color: #1B1B1B;
					}
				}
			}


			.label {
				margin: 24rpx 30rpx;
				font-size: 26rpx;
				color: #3A3D71;
			}

			.list {
				padding: 0 22rpx 10rpx;

				.item {
					margin-bottom: 30rpx;
					min-width: 144rpx;
					height: 58rpx;
					line-height: 58rpx;
					text-align: center;
					background: #F3F3F3;
					border-radius: 30rpx;
					font-size: 26rpx;
					color: #3A3D71;


					&.active {
						background-color: #EFF2FF;
						color: $u-type-primary;
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
