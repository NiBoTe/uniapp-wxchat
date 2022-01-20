<template>
	<view class="htz-signature-body">
		<canvas :canvas-id="cid" :id="cid" @touchstart="touchstart" @touchmove="touchmove"
			@touchend="touchend"></canvas>
		<view class="htz-signature-fixed-bottom">
			<view class="htz-signature-fixed-bottom-item htz-signature-tools">
				<view class="htz-signature-tools-item" @click="lineWidth">
					<image src="../../static/htz-signature/bicuxi.png"></image>
					<view>线条</view>
				</view>
				<view class="htz-signature-tools-item" @click="color">
					<image src="../../static/htz-signature/color-plate-fill.png"></image>
					<view>颜色</view>
				</view>
				<view class="htz-signature-tools-item" @click="revoke">
					<image src="../../static/htz-signature/chehuinormal.png"></image>
					<view>撤回</view>
				</view>
				<view class="htz-signature-tools-item" @click="clear">
					<image src="../../static/htz-signature/qingkong_1.png"></image>
					<view>清空</view>
				</view>
			</view>
			<view class="htz-signature-fixed-bottom-item sumbit" @click="sumbit">提交</view>
		</view>

		<cover-view class="htz-signature-color-main" v-if="colorShow">
			<cover-view @click="selColor(index)"
				:class="index==colorIndex?'htz-signature-color-item on ':'htz-signature-color-item '"
				:style="'background-color:'+item.value" v-for="(item,index) in colorData" :key="index">
				<cover-image class="htz-signature-color-item-icon" src="../../static/htz-signature/on.png">
				</cover-image>
			</cover-view>
		</cover-view>
		<cover-view class="htz-signature-color-main" v-if="lineWidthShow">
			<cover-view @click="selLineWidth(index)"
				:class="index==lineWidthIndex?'htz-signature-lineWidth-item on':'htz-signature-lineWidth-item'"
				v-for="(item,index) in lineWidthData" :key="index">
				<cover-view
					:style="'width:60%;height:'+item+'px;background-color:#000000;position: absolute;top: 50%;left: 20%;margin-top:-'+item/2+'px'">
				</cover-view>
			</cover-view>
		</cover-view>
	</view>
</template>

<script>
	export default {
		name: 'DrawingBoard',
		props: {
			cid: {
				type: String,
				default: '',
			},
		},
		data() {
			return {
				id: '',
				Strokes: [],
				dom: null,
				width: 0,
				height: 0,
				colorShow: false,
				colorIndex: 0,
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
		mounted: function() {
			this.$nextTick(function() {
				uni.getSystemInfo({
					success: (res) => {
						this.width = res.windowWidth;
						this.height = res.windowHeight;
					}
				});

				this.dom = uni.createCanvasContext(this.cid, this);

			});
		},
		methods: {
			touchmoveEnd(e) {
				e.preventDefault();
				e.stopPropagation();
			},
			sumbit() {

				uni.canvasToTempFilePath({
					canvasId: this.cid,
					success: (res) => {
						//console.log('success', res)
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
					let StrokesItem = item;
					//console.log(index, this.Strokes.length)
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
						color: this.colorData[this.colorIndex].value,
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
			}
		}
	}
</script>

<style>
	.htz-signature-body {
		position: fixed;
		top: 0;
		bottom: 120rpx;
		left: 0;
		width: 100%;
	}

	.htz-signature-body canvas {
		width: 100%;
		height: 100%;
	}

	.htz-signature-fixed-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 120rpx;
		line-height: 120rpx;
		text-align: center;
		color: #000;
		z-index: 11;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		background-color: #fff;
	}

	.htz-signature-fixed-bottom .htz-signature-fixed-bottom-item {
		-webkit-box-flex: 3;
		-webkit-flex-grow: 3;
		flex-grow: 3;
		border-top: 1px solid #1890ff;
		color: #1890ff;
	}

	.htz-signature-fixed-bottom view.sumbit {
		-webkit-box-flex: 1;
		-webkit-flex-grow: 1;
		flex-grow: 1;
		background-color: #1890ff;
		color: #fff;
	}

	.htz-signature-tools {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
	}

	.htz-signature-tools-item {
		text-align: center;
		-webkit-box-flex: 1;
		-webkit-flex-grow: 1;
		flex-grow: 1;
		line-height: 35rpx;

	}

	.htz-signature-fixed-bottom-item view image {
		width: 50rpx;
		height: 50rpx;
		padding-top: 10rpx;
	}

	.htz-signature-tools-item view {
		font-size: 22rpx;
	}

	.htz-signature-color-main {
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

	.htz-signature-color-item {
		width: 80rpx;
		height: 80rpx;
		background-color: #000000;
		border-radius: 100px;
		margin: 5px;
		position: relative;
	}

	.htz-signature-lineWidth-item {
		width: 80rpx;
		height: 80rpx;
		background-color: #fff;
		border-radius: 100px;
		margin: 5px;
		position: relative;
	}

	.htz-signature-lineWidth-item.on {
		border: 1px solid #d4a39e;
	}

	.htz-signature-color-item .htz-signature-color-item-icon {
		display: none;
	}

	.htz-signature-color-item.on .htz-signature-color-item-icon {
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
</style>
