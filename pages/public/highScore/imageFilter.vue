<template>
	<view class="drawingBoard-body">

		<view class="back" :style="{top: StatusBar + 6 + 'px'}" @click="toBack">
			<image src="/static/public/arrow_left.png"></image>
		</view>
		<!-- <scroll-view :style="{top: top+'px', left: left+'px'}" class="scroll-view_H" scroll-x="true"> -->
		<view class="canvas">
			<!-- <view :style="{top: top+'px', left: left+'px'}" class="scroll-view_H" scroll-x="true"> -->
			<canvas canvas-id="canvas" class="canvas" disable-scroll="true"
				:style="{width: upx2px(canvas.width)+ 'px', height: upx2px(canvas.height) +'px'}"
				@touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"></canvas>
			<!-- </view> -->

			<!-- <view class="render-area" @touchstart="startPen">
				<image v-if="render_src" :src="render_src"
					:style="{width: render_image.width + 'px', height: render_image.height +'px'}"></image>
			</view> -->
		</view>
		<!-- </scroll-view> -->
		<view class="drawingBoard-fixed-bottom">

			<view class="drawingBoard-fixed-bottom-handle" v-if="selectActive === 1">
				<view class="drawingBoard-text">
					<view class="drawingBoard-color">
						<color-picker ref="colorPicker" :color="colorRgb" @confirm="colorConfirm"></color-picker>
					</view>

					<view class="thickness u-flex">
						<text>细</text>
						<view class="slider">
							<u-slider height="10" block-width="40" inactive-color="#D8D8D8" active-color="#999090"
								v-model="thicknessValue"></u-slider>
						</view>
						<text>粗</text>
					</view>
				</view>
			</view>
			<view class="drawingBoard-fixed-bottom-handle" v-if="selectActive === 2">
				<view class="drawingBoard-text">

					<view class="thickness u-flex">
						<text>0</text>
						<view class="slider">
							<u-slider height="10" block-width="40" inactive-color="#D8D8D8" active-color="#999090"
								v-model="contrastRatio" @end="sliderEnd" @start="sliderStart"></u-slider>
						</view>
						<view class="refresh u-flex" @click="resetTap(2)">
							<image src="/static/public/reset.png"></image>
							<text>重置</text>
						</view>
					</view>
				</view>
			</view>

			<view class="drawingBoard-fixed-bottom-handle" v-if="selectActive === 3">
				<view class="drawingBoard-text u-flex">
					<view class="drawingBoard-color" style="flex: 1;">
						<color-picker ref="colorPicker" :color="colorRgbThree" @confirm="colorThreeConfirm">
						</color-picker>
					</view>
					<view class="u-flex">
						<view class="refresh u-flex" style="margin: 0 40rpx 10rpx 0;" @click="resetTap(3)">
							<image src="/static/public/reset.png"></image>
							<text>重置</text>
						</view>
					</view>

				</view>
			</view>
			<view class="drawingBoard-fixed-bottom-item drawingBoard-tools">
				<view class="drawingBoard-tools-item" @click="selectHandle(0)">
					<image v-if="isBlack" :src="setSrc('highScore/icon01_active.png')"></image>
					<image v-else :src="setSrc('highScore/icon01.png')"></image>
					<text :class="isBlack ? 'active' : ''">黑白</text>
				</view>
				<view class="drawingBoard-tools-item" @click="selectHandle(1)">
					<image v-if="selectActive === 1" :src="setSrc('highScore/icon02_active.png')"></image>
					<image v-else :src="setSrc('highScore/icon02.png')"></image>
					<text :class="selectActive === 1 ? 'active' : ''">画笔</text>
				</view>
				<view class="drawingBoard-tools-item two" @click="selectHandle(2)">
					<image v-if="selectActive === 2" :src="setSrc('highScore/icon03_active.png')"></image>
					<image v-else :src="setSrc('highScore/icon03.png')"></image>
					<text :class="selectActive === 2 ? 'active' : ''">对比度</text>
				</view>
				<view class="drawingBoard-tools-item three" @click="selectHandle(3)">
					<image v-if="selectActive === 3" :src="setSrc('highScore/icon04_active.png')"></image>
					<image v-else :src="setSrc('highScore/icon04.png')"></image>
					<text :class="selectActive === 3 ? 'active' : ''">色调</text>
				</view>
				<view class="drawingBoard-tools-item four" @click="revoke">
					<image :src="setSrc('highScore/icon05.png')"></image>
					<text>撤销</text>
				</view>
				<!-- <view class="drawingBoard-tools-item" @click="clear">
					<image src="../../static/drawingBoard/qingkong_1.png"></image>
				</view> -->
			</view>

			<view class="drawingBoard-next u-flex">
				<view class="drawingBoard-btn" style="margin-right: 24rpx;" @click="toBack()">返回</view>
				<view class="drawingBoard-btn" @click="submitTap()">保存</view>
			</view>
			<!-- <view class="drawingBoard-fixed-bottom-item submit" @click="submitTap">提交</view> -->
		</view>
	</view>
</template>

<script>
	import ColorPicker from '@/components/color-picker/color-picker.vue'
	const transverse_canvas_width = 1000;
	const lengthways_canvas_height = 1000;
	import ImageFilters from '@/utils/weImageFilters.js';
	import Helper from '@/utils/weImageFiltersHelper.js';
	let helper = '';
	let strokes = [];
	let strokes_easy = [];

	let initImageData = {}
	export default {
		components: {
			ColorPicker
		},
		data() {
			return {
				top: -99999,
				left: -99999,
				isBlack: false, // 是否黑白
				StatusBar: this.StatusBar,
				canvas: { //upx
					width: 0,
					height: 0,
					origin_width: 0,
					origin_height: 0,
				},
				render_src: '',
				render_image: { //px
					width: 0,
					height: 0,
					rotate_width: 0,
					rotate_height: 0,
					max_width: 375,
					max_height: 0
				},
				src: null,
				ctx: null,
				selectActive: -1,
				id: '',
				width: 0,
				height: 0,
				colorRgb: {
					r: 255,
					g: 0,
					b: 0,
					a: 0.6
				},
				colorRgbThree: {
					r: 255,
					g: 0,
					b: 0,
					a: 0.6
				},
				colorValue: '#ff0000',
				thicknessValue: 3, // 线条粗细
				contrastRatio: 50, // 对比度
				isSliderMove: false,

			}
		},
		onLoad(options) {
			helper = '';
			strokes = [];
			initImageData = {}
			uni.getSystemInfo({
				success: (res) => {
					this.render_image.max_height = res.windowHeight
					this.width = res.windowWidth;
					this.height = res.windowHeight;
					if (options.url) {
						uni.showLoading({
							title: '加载中'
						})
						uni.downloadFile({
							url: decodeURIComponent(options.url),
							success: (res) => {
								this.src = res.tempFilePath
								this.render_src = res.tempFilePath;
								this.init_image()
							}
						})


					}
				}
			});

		},
		watch: {
			contrastRatio(val) {
				if (!this.isSliderMove) {
					let imageData = strokes.length > 0 ? strokes[strokes.length - 1].imageData : initImageData
					let filtered = ImageFilters.BrightnessContrastPhotoshop(imageData, this.contrastRatio - 50, 13)
					helper.putImageData(filtered, (tempFilePath) => {
						this.render_src = tempFilePath;
						if (strokes.length > 0) {
							if (strokes[strokes.length - 1].type === 2) {
								strokes[strokes.length - 1].imageData = imageData
							} else {
								strokes.push({
									type: 2,
									imageData: imageData,
								})
							}
						} else {
							strokes.push({
								type: 2,
								imageData: imageData,
							})
						}

						this.isSliderMove = false;
					})
				}
			}
		},
		methods: {
			init_image() {
				uni.getImageInfo({
					src: this.src,
					success: (image) => {
						const query = uni.createSelectorQuery().in(this);
						query.select('.canvas').boundingClientRect(data => {
							let img_res = this.$mHelper.imgFit(data.width, data.height, image.width,
								image.height);
							if (image.width >= image.height) {
								//初始化canvas尺寸
								this.canvas.width = img_res.width / (uni.upx2px(100) /
									100)
								this.canvas.height = img_res.height / (uni.upx2px(100) /
									100)
								this.canvas.origin_height = this.canvas.height
								this.canvas.origin_width = this.canvas.width

								//初始化预览图尺寸
								this.render_image.width = this.canvas.width;
								this.render_image.height = this.canvas.height;

							} else {
								//初始化canvas尺寸
								// this.canvas.height = this.height / (uni.upx2px(100) /
								// 	100)
								// this.canvas.width = this.width / (uni.upx2px(100) /
								// 	100)
								this.canvas.width = img_res.width / (uni.upx2px(100) /
									100)
								this.canvas.height = img_res.height / (uni.upx2px(100) /
									100)
								// parseInt(this.canvas.height * image.width / image.height);
								this.canvas.origin_width = this.canvas.width;
								this.canvas.origin_height = this.canvas.height
								//初始化预览图尺寸
								this.render_image.width = this.canvas.width
								this.render_image.height = this.canvas.height;
							}

							helper = new Helper({
								canvasId: 'canvas',
								width: this.upx2px(this.canvas.width),
								height: this.upx2px(this.canvas.height)
							})

							// this.ctx = uni.createCanvasContext('canvas');
							helper.initCanvas(image.path, () => {
								// initImageData = {
								// 	data: helper.originalImageData,
								// 	width: helper.canvasInfo.width,
								// 	height: helper.canvasInfo.height,
								// }

								this.ctx = helper.ctx;
								// strokes.push({
								// 	imageData: image.path,
								// 	type: 'image',
								// })

								this.ctx.beginPath();
								this.ctx.setLineCap('round')
								this.ctx.setStrokeStyle('rgba(0,0,0,0)');
								this.ctx.setLineWidth(1);
								this.ctx.moveTo(0, 0);
								this.ctx.lineTo(100, 100);
								this.ctx.stroke();
								// helper.ctx.draw(true);
								this.ctx.draw(true, () => {
									// helper.saveImageData()

									helper.saveImageData(() => {
										initImageData = {
											data: helper.originalImageData,
											width: helper.canvasInfo.width,
											height: helper.canvasInfo
												.height,
										}
										helper.putImageData(initImageData, (
											tempFilePath) => {
											this.render_src =
												tempFilePath;
										})
									})
								})
								uni.hideLoading();
							})
						}).exec();
					},
					fail: (e) => {
						console.log(e);
					}
				})
			},
			upx2px(value) {
				if (!value) {
					return 0;
				}
				return uni.upx2px(value);
			},
			submitTap() {
				let _this = this;
				uni.showToast({
					icon: 'loading',
					title: '保存中...'
				})
				helper.getImageTempFilePath((tempFilePath) => {
					uni.saveImageToPhotosAlbum({
						filePath: tempFilePath,
						success: function() {
							_this.$mHelper.toast('保存成功')
						},
						fail: function() {
							if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err
								.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg ===
								"saveImageToPhotosAlbum:fail authorize no response") {
								_this.$mHelper.getAuth()
							} else {
								_this.$mHelper.toast('保存失败')
							}
						}
					});
					uni.hideToast();
				})
			},
			revoke() { //撤销上一步
				if (!strokes.length) {
					return
				}
				let isZero = false;
				strokes.map(item => {
					if (item.type === 0) {
						isZero = true;

					}
				})
				if (isZero) {
					this.isBlack = false
				}
				strokes.pop();
				this.drawCanves();
			},
			sliderStart() {
				this.isSliderMove = true;
			},
			// 对比度滑动结束
			sliderEnd(e) {
				this.isSliderMove = false;
				let imageData = strokes.length > 0 ? strokes[strokes.length - 1].imageData : initImageData
				let filtered = ImageFilters.BrightnessContrastPhotoshop(imageData, this.contrastRatio - 50, 13)
				helper.putImageData(filtered, (tempFilePath) => {
					this.render_src = tempFilePath;
					if (strokes.length > 0) {
						if (strokes[strokes.length - 1].type === 2) {
							strokes[strokes.length - 1].imageData = imageData
						} else {
							strokes.push({
								type: 2,
								imageData: filtered,
							})
						}
					} else {
						strokes.push({
							type: 2,
							imageData: filtered,
						})
					}
				})
			},
			drawCanves() {
				let findIndex = strokes.findIndex(item => item.type === 0);
				this.isBlack = findIndex !== -1;
				let imageData = strokes.length > 0 ? strokes[strokes.length - 1].imageData : initImageData;
				helper.putImageData(imageData, (tempFilePath) => {
					this.render_src = tempFilePath;
				})
			},
			startPen() {
				if (this.selectActive !== 1) return
				this.top = 0;
				this.left = 0
			},
			touchstart(e) {
				if (this.selectActive !== 1) return

				this.top = 0;
				this.left = 0
				strokes.push({
					imageData: null,
					type: 1,
					style: {
						color: this.colorValue,
						lineWidth: parseInt((18 / 100 * this.thicknessValue) < 3 ? 3 : (18 / 100 * this
							.thicknessValue)),
					},
					points: [{
						x: e.touches[0].x,
						y: e.touches[0].y,
						type: e.type,
					}]
				})
				this.drawLine(strokes[strokes.length - 1], e.type);
			},
			touchmove(e) {
				if (this.selectActive !== 1) return
				strokes[strokes.length - 1].points.push({
					x: e.touches[0].x,
					y: e.touches[0].y,
					type: e.type,
				})
				this.drawLine(strokes[strokes.length - 1], e.type);
			},
			touchend(e) {
				if (this.selectActive !== 1) return
				helper.saveImageData(() => {
					strokes[strokes.length - 1].imageData = {
						data: helper.originalImageData,
						width: helper.canvasInfo.width,
						height: helper.canvasInfo.height,
					}
					helper.putImageData(strokes[strokes.length - 1].imageData, (tempFilePath) => {
						this.render_src = tempFilePath;
						this.top = -99999;
						this.left = -99999;
					})
					// strokes.[strokes.length - 1].imageData = helper.originalImageData;
					if (strokes[strokes.length - 1].points.length < 2) { //当此路径只有一个点的时候
						strokes.pop();
						helper.putImageData(strokes[strokes.length - 1].imageData, (tempFilePath) => {
							this.render_src = tempFilePath;
							this.top = -99999;
							this.left = -99999;
						})
					}
				})
			},
			drawLine(StrokesItem, type) {
				if (StrokesItem.points.length > 1) {
					this.ctx.beginPath();
					this.ctx.setLineCap('round')
					this.ctx.setStrokeStyle(StrokesItem.style.color);
					this.ctx.setLineWidth(StrokesItem.style.lineWidth);
					this.ctx.moveTo(StrokesItem.points[StrokesItem.points.length - 2].x, StrokesItem.points[StrokesItem
						.points.length -
						2].y);
					this.ctx.lineTo(StrokesItem.points[StrokesItem.points.length - 1].x, StrokesItem.points[StrokesItem
						.points.length -
						1].y);
					this.ctx.stroke();
					// helper.ctx.draw(true);
					this.ctx.draw(true, () => {
						// helper.saveImageData()
					})
				}
			},
			selectHandle(index) {
				switch (index) {
					case 0:
						try {
							if (this.isBlack) {
								helper.putImageData(initImageData, (tempFilePath) => {
									this.render_src = tempFilePath;
									strokes.push({
										type: 0,
										imageData: initImageData
									})
								})
							} else {
								let imageData = imageData = strokes.length > 0 ? strokes[strokes.length - 1].imageData :
									initImageData
								let filtered = ImageFilters.GrayScale(imageData)
								helper.putImageData(filtered, (tempFilePath) => {
									this.render_src = tempFilePath;
									strokes.push({
										type: 0,
										imageData: filtered
									})

								})
							}
							this.isBlack = !this.isBlack;

							return
							// let isGrayScale = false,
							// 	isGrayScaleIndex = -1;
							// strokes.map((item, index) => {
							// 	if (item.type === 0) {
							// 		isGrayScale = true
							// 		isGrayScaleIndex = index
							// 	}
							// })
							// if (isGrayScale) {
							// 	console.log(isGrayScale+ '======')
							// 	console.log(this.isBlack+ '======')


							// 	if(this.isBlack) {
							// 		let imageData = strokes.length > 0 ? strokes[strokes.length - 1].imageData : helper.originalImageData;
							// 		helper.putImageData(imageData, (tempFilePath) => {
							// 			this.render_src = tempFilePath;
							// 			if (isGrayScaleIndex >= 0) strokes.splice(isGrayScaleIndex, 1)
							// 		})
							// 	} else {
							// 		let imageData = strokes[isGrayScaleIndex].imageData;
							// 		helper.putImageData(imageData, (tempFilePath) => {
							// 			this.render_src = tempFilePath;
							// 			if (isGrayScaleIndex >= 0) strokes.splice(isGrayScaleIndex, 1)
							// 		})
							// 	}
							// } else {

							// }
						} catch (err) {
							console.log(err)
						}
						break;
				}

				if (this.selectActive === index) {
					this.selectActive = -1;
				} else {
					this.selectActive = index;
				}

			},
			// 选择颜色
			colorConfirm(e) {
				console.log(e)
				this.colorRgb = e.rgba
				this.colorValue = e.hex
			},
			// 色调选择颜色
			colorThreeConfirm(e) {
				this.colorRgbThree = e.rgba
				this.setTone();
			},
			// 色调改变
			setTone(bool) {
				// ImageFilters.ColorTransformFilter (srcImageData, redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset)
				if (bool) {
					if (strokes.length === 0) return
					if (strokes[strokes.length - 1].type === 3) {
						let imageData = strokes[strokes.length - 1].imageData
						strokes.splice(strokes.length - 1, 1)
						helper.putImageData(imageData, (tempFilePath) => {
							this.render_src = tempFilePath;
						})
					}
					return
				}
				let imageData = strokes.length > 0 ? strokes[strokes.length - 1].imageData : initImageData
				let filtered = ImageFilters.ColorTransformFilter(imageData, 1, 1, 1, 5, this.colorRgbThree.r, this
					.colorRgbThree.g, this.colorRgbThree.b, 255)
				helper.putImageData(filtered, (tempFilePath) => {
					this.render_src = tempFilePath;
					if (strokes.length > 0) {
						if (strokes[strokes.length - 1].type === 3) {
							strokes[strokes.length - 1].imageData = imageData
						} else {
							strokes.push({
								type: 3,
								imageData,
							})
						}
					} else {
						strokes.push({
							type: 3,
							imageData
						})
					}

				})
			},
			// 重置对比度
			resetTap(type) {
				switch (type) {
					case 2:
						this.resetImage(2)
						this.isSliderMove = true;
						this.contrastRatio = 50;
						break;

					case 3:
						// this.colorRgbThree = {
						// 	r: 255,
						// 	g: 0,
						// 	b: 0,
						// 	a: 0.6
						// }
						// this.setTone(true);
						this.resetImage(3)
						break;
				}
			},
			resetImage(type) {
				let imageData = initImageData;
				helper.putImageData(imageData, (tempFilePath) => {
					this.render_src = tempFilePath;
					strokes.push({
						type,
						imageData,
					})
				})
			},
			toBack() {
				this.$mRouter.back()
			}
		},
		onUnload() {
			helper = '';
			strokes = [];
			initImageData = {}
		}
	}
</script>

<style scoped lang="scss">
	.drawingBoard-body {
		height: 100vh;
		background-color: #F3F3F3;
	}


	.back {
		position: fixed;
		z-index: 20;
		left: 36rpx;
		width: 62rpx;
		height: 62rpx;
		border-radius: 50%;
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;

		image {
			width: 32rpx;
			height: 32rpx;
		}

	}

	.drawingBoard-body canvas {
		width: 100%;
		height: 100%;
	}

	.drawingBoard-fixed-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		text-align: center;
		z-index: 11;
		border-radius: 40rpx 40rpx 0px 0px;
		padding: 34rpx 0 14rpx;
		padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
		background-color: #fff;
	}

	.drawingBoard-fixed-bottom .drawingBoard-fixed-bottom-item {
		padding: 12rpx;
	}

	.drawingBoard-fixed-bottom view.submit {
		-webkit-box-flex: 1;
		-webkit-flex-grow: 1;
		flex-grow: 1;
		color: #fff;
	}

	.drawingBoard-tools {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
	}

	.drawingBoard-tools-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;

		image {
			width: 48rpx;
			height: 48rpx;
		}

		&.two {
			image {
				width: 46rpx;
				height: 46rpx;
			}
		}

		&.three {
			image {
				width: 48rpx;
				height: 46rpx;
			}
		}

		&.four {
			image {
				width: 42rpx;
				height: 44rpx;
			}
		}


		text {
			display: inline-block;
			margin-top: 8rpx;
			font-size: 28rpx;
			color: #3A3D71;

			&.active {
				color: $u-type-primary;
			}
		}

	}


	.drawingBoard-color-main {
		position: fixed;
		bottom: 120rpx;
		left: 0;
		width: 710rpx;
		/* height: 75rpx; */
		z-index: 11;
		padding: 25rpx 20rpx;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		flex-wrap: wrap;
		background-color: #fff;
		border-top: 1px dashed #d9d9d9;
		transition: display 2s;
		-moz-transition: display 2s;
		/* Firefox 4 */
		-webkit-transition: display 2s;
		/* Safari 和 Chrome */
		-o-transition: display 2s;
	}

	.drawingBoard-color-item {
		width: 80rpx;
		height: 80rpx;
		background-color: #000000;
		border-radius: 100px;
		margin: 5px;
		position: relative;
	}

	.drawingBoard-lineWidth-item {
		width: 80rpx;
		height: 80rpx;
		background-color: #fff;
		border-radius: 100px;
		margin: 5px;
		position: relative;
	}

	.drawingBoard-lineWidth-item.on {
		border: 1px solid #d4a39e;
	}

	.drawingBoard-color-item .drawingBoard-color-item-icon {
		display: none;
	}

	.drawingBoard-color-item.on .drawingBoard-color-item-icon {
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		width: 50rpx;
		height: 50rpx;
		margin-top: -25rpx;
		margin-left: -25rpx;
	}

	.black {
		background-color: #000000 !important;
	}


	// 操作面板

	.drawingBoard-fixed-bottom-handle {

		padding-top: 20rpx;
		height: 128rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		// 按钮
		.drawingBoard-btn {
			width: 324rpx;
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background: $u-type-primary;
			border-radius: 44rpx;

			image {
				width: 52rpx;
				height: 36rpx;
			}

			text {
				margin-left: 10rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #FFFFFF;
			}
		}

		// 颜色
		.drawingBoard-text {
			width: 100%;

			.drawingBoard-color {
				padding: 0 40rpx 0 50rpx;
			}

			.thickness {
				padding: 40rpx 40rpx 0 22rpx;

				text {
					font-size: 24rpx;
					font-weight: 500;
					color: #909399;
				}

				.slider {
					margin: 0 26rpx;
					flex: 1;
				}
			}
		}
	}

	// 重置
	.refresh {
		image {
			width: 22rpx;
			height: 22rpx;
		}

		text {
			margin-left: 6rpx;
			color: #909399;
		}
	}


	// 下一步

	.drawingBoard-next {
		padding: 24rpx 48rpx 0;

		.drawingBoard-btn {
			flex: 1;
			height: 80rpx;
			line-height: 80rpx;
			background: $u-type-primary;
			border-radius: 44rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #FFFFFF;
		}
	}

	.canvas {
		display: flex;
		// flex-direction: column;
		justify-content: center;
		height: calc(100vh - 395rpx - constant(safe-area-inset-bottom));
		height: calc(100vh - 395rpx - env(safe-area-inset-bottom));
		align-items: center;
	}

	.scroll-view_H {
		position: fixed;
		white-space: nowrap;
		width: 100%;
		height: calc(100vh - 200rpx);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.render-area {
		width: 750rpx;
		height: calc(100vh - 200rpx);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
