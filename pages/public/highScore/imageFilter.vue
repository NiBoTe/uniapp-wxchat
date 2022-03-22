<template>
	<view class="drawingBoard-body">

		<scroll-view :style="{top: top+'px', left: left+'px'}" class="scroll-view_H" scroll-x="true">
			<canvas canvas-id="canvas" class="canvas"
				:style="{width: upx2px(canvas.width)+ 'px', height: upx2px(canvas.height) +'px'}"
				@touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"></canvas>
		</scroll-view>
		<view class="drawingBoard-fixed-bottom">

			<view class="drawingBoard-fixed-bottom-handle" v-if="selectActive === 2">
				<view class="drawingBoard-text">
					<view class="drawingBoard-color">
						<color-picker ref="colorPicker" :color="colorRgb" @confirm="colorConfirm"></color-picker>
					</view>
				</view>
			</view>
			<view class="drawingBoard-fixed-bottom-item drawingBoard-tools">
				<view class="drawingBoard-tools-item" @click="selectHandle(0)">
					<image :src="setSrc('highScore/icon01.png')"></image>
					<text>黑白</text>
				</view>

				<view class="drawingBoard-tools-item" @click="selectHandle(1)">
					<image v-if="selectActive === 1" :src="setSrc('highScore/icon02_active.png')"></image>
					<image v-else :src="setSrc('highScore/icon02.png')"></image>
					<text>画笔</text>
				</view>
				<view class="drawingBoard-tools-item" @click="selectHandle(2)">
					<image v-if="selectActive === 2" :src="setSrc('highScore/icon03_active.png')"></image>
					<image v-else :src="setSrc('highScore/icon03.png')"></image>
					<text>对比度</text>
				</view>
				<view class="drawingBoard-tools-item" @click="selectHandle(3)">
					<image v-if="selectActive === 3" :src="setSrc('highScore/icon04_active.png')"></image>
					<image v-else :src="setSrc('highScore/icon04.png')"></image>
					<text>色调</text>
				</view>
				<view class="drawingBoard-tools-item" @click="revoke">
					<image :src="setSrc('highScore/icon05.png')"></image>
					<text>撤销</text>
				</view>
				<!-- <view class="drawingBoard-tools-item" @click="clear">
					<image src="../../static/drawingBoard/qingkong_1.png"></image>
				</view> -->
			</view>

			<view class="drawingBoard-next" @click="sumbit()">
				<view class="drawingBoard-btn">下一步</view>
			</view>
			<!-- <view class="drawingBoard-fixed-bottom-item sumbit" @click="sumbit">提交</view> -->
		</view>

		<!-- <cover-view class="drawingBoard-color-main" v-if="colorShow">
			<cover-view @click="selColor(index)"
				:class="index==colorIndex?'drawingBoard-color-item on ':'drawingBoard-color-item '"
				:style="'background-color:'+item.value" v-for="(item,index) in colorData" :key="index">
				<cover-image class="drawingBoard-color-item-icon" src="../../static/drawingBoard/on.png">
				</cover-image>
			</cover-view>
		</cover-view> -->
		<cover-view class="drawingBoard-color-main" v-if="lineWidthShow">
			<cover-view @click="selLineWidth(index)"
				:class="index==lineWidthIndex?'drawingBoard-lineWidth-item on':'drawingBoard-lineWidth-item'"
				v-for="(item,index) in lineWidthData" :key="index">
				<cover-view
					:style="'width:60%;height:'+item+'px;background-color:#000000;position: absolute;top: 50%;left: 20%;margin-top:-'+item/2+'px'">
				</cover-view>
			</cover-view>
		</cover-view>
	</view>
</template>

<script>
	import ColorPicker from '@/components/color-picker/color-picker.vue'
	const transverse_canvas_width = 1000;
	const lengthways_canvas_height = 1000;
	import ImageFilters from '@/utils/weImageFilters.js';
	import Helper from '@/utils/weImageFiltersHelper.js';
	let helper = '';
	export default {
		components: {
			ColorPicker
		},
		data() {
			return {
				top: -99999,
				left: -99999,
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
				src: 'https://img1.baidu.com/it/u=147756509,42215431&fm=253&fmt=auto&app=120&f=JPEG?w=801&h=800',
				selectActive: 0,
				id: '',
				Strokes: [],
				dom: null,
				width: 0,
				height: 0,
				colorShow: false,
				colorIndex: 0,
				colorRgb: {
					r: 255,
					g: 0,
					b: 0,
					a: 0.6
				},
				colorValue: {
					r: 255,
					g: 0,
					b: 0,
					a: 0.6
				},
				lineColor: '#000000',
				colorData: [{
					name: 'black',
					value: '#000000'
				}, {
					name: 'red',
					value: '#f34336',
				}, {
					name: 'blue',
					value: '#0238d0',
				}, {
					name: 'green',
					value: '#8bc24b',
				}, {
					name: 'yellow',
					value: '#ffeb3c',
				}, {
					name: 'purple',
					value: '#a603d0',
				}, {
					name: 'grey',
					value: '#a5a5a5',
				}],

				lineWidthShow: false,
				lineWidthIndex: 0,
				lineWidthData: ['3', '6', '9', '12', '15', '18']
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.width = res.windowWidth;
					this.height = res.windowHeight;
				}
			});

			this.init_image()

		},

		onReady() {
			this.dom = uni.createCanvasContext('canvas', this);
		},
		methods: {
			init_image() {
				uni.getImageInfo({
					src: this.src,
					success: (image) => {
						console.log(image);
						if (image.width >= image.height) {
							//初始化canvas尺寸
							this.canvas.width = image.width > transverse_canvas_width ?
								transverse_canvas_width : image.width
							this.canvas.height = parseInt(this.canvas.width * image.height / image.width);
							this.canvas.origin_height = this.canvas.height
							this.canvas.origin_width = this.canvas.width

							//初始化预览图尺寸
							this.render_image.width = this.render_image.max_width;
							this.render_image.height = parseInt(this.render_image.width * image.height / image
								.width);

						} else {
							//初始化canvas尺寸
							this.canvas.height = image.height > lengthways_canvas_height ?
								lengthways_canvas_height : image.height
							this.canvas.width = parseInt(this.canvas.height * image.width / image.height);
							this.canvas.origin_width = this.canvas.width;
							this.canvas.origin_height = this.canvas.height

							//初始化预览图尺寸
							this.render_image.width = this.render_image.max_width
							this.render_image.height = parseInt(this.render_image.width * image.height / image
								.width);
							if (this.render_image.height > this.render_image.max_height) {
								this.render_image.height = this.render_image.max_height
								this.render_image.width = parseInt(this.render_image.height * image.width /
									image.height);
							}
						}


						console.log(this.canvas);
						console.log(this.render_image);
						helper = new Helper({
							canvasId: 'canvas',
							width: this.upx2px(this.canvas.width),
							height: this.upx2px(this.canvas.height)
						})
						// this.ctx = uni.createCanvasContext('canvas');
						helper.initCanvas(image.path, () => {
							console.log('initCanvas');
							this.Strokes.push({
								imageData: image.path,
								type: 'image',
							})
							uni.hideLoading();
						})

						// this.ctx.drawImage(this.src, 0, 0, this.px_width, this.px_height);
						// this.ctx.draw();
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
			touchmoveEnd(e) {
				e.preventDefault();
				e.stopPropagation();
			},
			sumbit() {
				uni.canvasToTempFilePath({
					canvasId: this.cid,
					success: (res) => {
						this.$emit('sumbit', res)
					},
					fail: (err) => {
						//console.log('fail', err)
						this.$emit('fail', err)
					}
				}, this)
			},
			clear() { //清空
				this.Strokes = [];
				this.dom.clearRect(0, 0, this.width, this.height)
				this.dom.draw();
			},
			lineWidth() {
				this.lineWidthShow = !this.lineWidthShow;
				this.colorShow = false;
			},
			selLineWidth(index) {
				this.lineWidthIndex = index;
				this.lineWidthShow = false;
			},
			color() {
				this.colorShow = !this.colorShow;
				this.lineWidthShow = false;
			},
			selColor(index) {
				this.colorIndex = index;
				this.colorShow = false;
			},
			revoke() { //撤销上一步

				console.log(this.Strokes)

				if (this.Strokes.length <= 1) return
				var delItem = this.Strokes.pop();
				// if (delItem) {
				// 	delItem.points.forEach((item, index) => {
				// 		if (index < (delItem.points.length - 1)) {
				// 			this.dom.setStrokeStyle('#FFFFFF')
				// 			this.dom.moveTo(delItem.points[index].x, delItem.points[index].y);
				// 			this.dom.lineTo(delItem.points[index + 1].x, delItem.points[index + 1].y);
				// 			this.dom.stroke();
				// 			this.dom.draw(true);
				// 			// this.dom.clearRect(delItem.points[index].x, delItem.points[index].y, 10, 10);
				// 			// this.dom.draw(true)
				// 		}
				// 	})

				// }



				// this.dom.draw();
				// if(this.Strokes.length>0){
				// 	var lastItem = this.Strokes[this.Strokes.length - 1];
				// 	uni.canvasPutImageData({
				// 		canvasId: this.cid,
				// 		data: lastItem.imageData.data,
				// 		x: 0,
				// 		y: 0,
				// 		width: lastItem.imageData.width,
				// 		height: lastItem.imageData.height,
				// 		success:(res)=> {
				// 			console.log('success',res)
				// 		}
				// 	},this)
				// }

				//console.log('delItem', delItem)
				//this.dom.drawImage(delItem.x, delItem.y, 0, 0)
				this.drawCanves();
			},
			drawCanves() {
				//this.dom.draw();
				this.Strokes.forEach((item, index) => {

					if (!item.type) {
						let StrokesItem = item;
						if (StrokesItem.points.length > 1) {
							this.dom.beginPath();
							this.dom.setLineCap('round');
							this.dom.setStrokeStyle(item.style.color);
							this.dom.setLineWidth(item.style.lineWidth);
							StrokesItem.points.forEach((sitem, sindex) => {
								if (sitem.type == "touchstart") {
									this.dom.moveTo(sitem.x, sitem.y)
								} else {
									this.dom.lineTo(sitem.x, sitem.y)
								}
								//console.log('dom', sitem)
							})
							this.dom.stroke();

						}
					} else {
						console.log(item)
						this.dom.drawImage(item.imageData, 0, 0, this.render_image.width, this.render_image
							.height)
						// helper.ctx.draw(false, () => {
						// 	helper.saveImageData()
						// })
					}
				})
				this.dom.draw();
			},
			createId() {
				var d = new Date();
				return 'can' + d.getTime();
			},
			touchstart(e) {

				this.Strokes.push({
					imageData: null,
					style: {
						color: this.colorValue,
						lineWidth: this.lineWidthData[this.lineWidthIndex],
					},
					points: [{
						x: e.touches[0].x,
						y: e.touches[0].y,
						type: e.type,
					}]
				})
				this.drawLine(this.Strokes[this.Strokes.length - 1], e.type);
			},
			touchmove(e) {
				this.Strokes[this.Strokes.length - 1].points.push({
					x: e.touches[0].x,
					y: e.touches[0].y,
					type: e.type,
				})
				this.drawLine(this.Strokes[this.Strokes.length - 1], e.type);
			},
			touchend(e) {
				if (this.Strokes[this.Strokes.length - 1].points.length < 2) { //当此路径只有一个点的时候
					this.Strokes.pop();
				}
				//this.drawLine(this.Strokes[this.Strokes.length - 1], e.type);
				// uni.canvasGetImageData({
				// 	canvasId: this.cid,
				// 	x: 0,
				// 	y: 0,
				// 	width: this.width,
				// 	height: this.height,
				// 	success: (res) => {
				// 		 console.log(res.width) // 100
				// 		// console.log(res.height) // 100
				// 		// console.log(res.data instanceof Uint8ClampedArray) // true
				// 		// console.log(res.data.length) // 100 * 100 * 4
				// 		this.Strokes[this.Strokes.length - 1].imageData = res;
				// 	}
				// },this)
				//this.drawCanves();
			},
			drawLine(StrokesItem, type) {
				if (StrokesItem.points.length > 1) {
					this.dom.beginPath();
					this.dom.setLineCap('round')
					this.dom.setStrokeStyle(StrokesItem.style.color);
					this.dom.setLineWidth(StrokesItem.style.lineWidth);
					this.dom.moveTo(StrokesItem.points[StrokesItem.points.length - 2].x, StrokesItem.points[StrokesItem
						.points.length -
						2].y);
					this.dom.lineTo(StrokesItem.points[StrokesItem.points.length - 1].x, StrokesItem.points[StrokesItem
						.points.length -
						1].y);
					this.dom.stroke();
					this.dom.draw(true);
				}
			},
			selectHandle(index) {
				switch (index) {
					case 0:
						let imageData = helper.createImageData()
						let filtered = ImageFilters.GrayScale(imageData)
						helper.putImageData(filtered, (tempFilePath) => {
							this.render_src = tempFilePath;
						})
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
			}
		}
	}
</script>

<style scoped lang="scss">
	.drawingBoard-body {
		height: 100vh;
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
		color: #000;
		z-index: 11;
		display: flex;
		flex-direction: column;
		background-color: #fff;
	}

	.drawingBoard-fixed-bottom .drawingBoard-fixed-bottom-item {
		padding: 12rpx;
	}

	.drawingBoard-fixed-bottom view.sumbit {
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

		text {
			font-size: 28rpx;
			color: #3A3D71;
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
		height: 128rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #F3F3F3;


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
			padding: 0 40rpx;

			.drawingBoard-color {}
		}
	}


	// 下一步

	.drawingBoard-next {
		padding: 24rpx 48rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.drawingBoard-btn {
			height: 80rpx;
			line-height: 80rpx;
			background: $u-type-primary;
			border-radius: 44rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #FFFFFF;
		}
	}
</style>
