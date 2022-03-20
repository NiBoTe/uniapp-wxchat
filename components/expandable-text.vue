<template>
	<view class="jj-expandable-text">
		<view class="text" :class="{'expandable': !collapse}" :style="{'--lineheight':lineHeight + 'rpx',
			'line-height': lineHeight + 'rpx',
			'max-height': collapse ? (lineHeight * line) + 'rpx' : '1000px'}">
			<view class="btn" v-if="lines > line" @click="collapse = !collapse"
				:class="{'clearboth': !collapse || line > 1}" :style="{'height': lineHeight + 'rpx'}">
				<template v-if="useExpandSlot">
					<slot v-if="collapse" name="expand-icon"></slot>
					<slot v-else name="fold-icon"></slot>
				</template>
				<text v-else class="opt-hint">{{collapse ? expandText : foldText}}</text>
			</view>
			<text class="jj-content">
				<slot>{{ longText ? longText : '' }}</slot>
			</text>
		</view>
		<!-- <view>
			<text class="jj-placeholder">
				{{ placeholder }}
			</text>
		</view> -->
	</view>
</template>
<script>
	export default {
		name: 'ExpandableText',
		props: {
			// 展示多少行
			line: {
				type: [Number, String],
				default: 1
			},
			// 单行文本所占高度，rpx单位
			lineHeight: {
				type: [Number],
				default: 32
			},
			longText: {
				type: [String],
				default: ''
			},
			useExpandSlot: { // 自定义展开、收起布局
				type: Boolean,
				default: false
			},
			// 自定义展开文字
			expandText: {
				type: String,
				default: "全文"
			},
			// 自定义收起文字
			foldText: {
				type: String,
				default: "收起"
			}
		},
		data() {
			return {
				isHide: true, // 是否隐藏多余行。初始状态不隐藏
				// lineHeight: 33, // 单行文本所占高度，rpx单位
				textHeight: 0, // 全量所占文本高度
				// placeholder: '占位', // 占位文本，计算文字的行高
				collapse: true, // 是否处于文本收缩状态，默认是
			};
		},
		watch: {
			longText() {
				let that = this
				setTimeout(() => {
					let query = uni.createSelectorQuery().in(that);
					// 获取所有文本在html中的高度
					query.select('.jj-content').boundingClientRect(data => {
						that.textHeight = data.height
					}).exec();
				}, 100)
			}
		},
		mounted() {
			let query = uni.createSelectorQuery().in(this);
			setTimeout(() => {
				// 获取所有文本在html中的高度
				query.select('.jj-content').boundingClientRect(data => {
					this.textHeight = data.height
				}).exec();
			}, 200)
		},
		computed: {
			// 全文本所占总行数
			lines() {
				let ll = 0
				if (this.textHeight > 0 && this.lineHeight > 0) {
					const actual = uni.upx2px(this.lineHeight)
					console.log('actual', actual)
					ll = Math.ceil(this.textHeight / actual)
				}
				return ll
				// return Math.ceil(this.textHeight > 0 && this.lineHeight > 0 ? this.textHeight * 2 / this.lineHeight : 0)
			}
		}
	}
</script>
<style scoped lang="scss">
	.clearboth {
		clear: both;
	}
	.jj-content{
		word-break: break-all;
		font-size: 26rpx;
		color: #3A3D71;
	}

	.jj-expandable-text {
		display: flex;
	}

	.jj-expandable-text .text {
		position: relative;
		line-height: 1.5;
		max-height: 1.5em;
		overflow: hidden;
		transition: .3s max-height;
	}

	.jj-expandable-text .text::before {
		content: '';
		float: right;
		width: 0;
		/*设置为0，或者不设置宽度*/
		height: calc(100% - var(--lineheight));
		/*先随便设置一个高度*/
		background: red;
	}

	.jj-expandable-text .text::after {
		content: '';
		width: 100%;
		height: 100%;
		position: absolute;
		background: #fff;
	}

	.jj-expandable-text .expandable {
		max-height: 1000px;
		/*超出最大行高度就可以了*/
	}

	.jj-expandable-text .expandable::after {
		visibility: hidden;
	}

	.jj-expandable-text .btn {
		float: right;
		position: relative;
		margin-left: 1em;
	}

	.jj-expandable-text .btn .opt-hint {
		font-size: 26rpx;
		color: $u-type-primary;
	}

	.jj-expandable-text .btn::before {
		content: '...';
		position: absolute;
		letter-spacing: 2rpx;
		left: -6rpx;
		bottom: -2rpx;
		color: inherit;
		transform: translateX(-100%)
	}

	.jj-expandable-text .btn::after {
		content: '.';
		opacity: 0;
		width: 0;
	}

	.jj-expandable-text .expandable .btn::after {
		content: '.';
		opacity: 0;
		width: 0;
	}

	.jj-expandable-text .expandable .btn::before {
		visibility: hidden;
		/*在展开状态下隐藏省略号*/
	}

	// .jj-placeholder {
	// 	visibility: hidden;
	// }
</style>
