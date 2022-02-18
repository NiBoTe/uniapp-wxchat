<template>
	<view class="top">
		<view class="navbar">
			<u-navbar title="成绩详情" back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>

		<view class="content">
			<qiun-data-charts type="column" :opts="opts" :chartData="chartsDataColumn" />
		</view>
		<view class="footer u-flex u-row-center">
			<image src="/static/public/logo.png"></image>
			<text>易考绘成绩查询系统</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: {
					backgroundImage: "url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png')",
					backgroundSize: 'cover',
				},
				opts: {
					fontSize: 14,
					color: '#3A3D71',
					"fontColor": '#3A3D71',
					xAxis: {
						disableGrid: true,
						"disabled": true,
						"axisLine": true,
						"axisLineColor": "#E9E9E9",

					},
					yAxis: {
						disableGrid: true,
						"axisLine": true,
						"axisLineColor": "#E9E9E9",
						textColor: "#3A3D71",
						textOffset: 30
					},
					legend: {
						show: false,
					},
					extra: {
						column: {
							linearType: 'custom',
							linearOpacity: 0.5,
							barBorderCircle: false,
							customColor: ['#FA7D8D', '#EB88E2']
						}
					}
				},
				chartsDataColumn: {
					"categories": [
						"2016",
						"2017",
						"2018",
						"2019",
						"2020",
						"2021"
					],
					"series": [{
						"name": "目标值",
						textOffset: -4,
						"data": [{
							value: 35,
							color: '#ffffff'
						}, {
							value: 35,
							color: '#ffffff'
						}]
					}]
				},
			};
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		.footer {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 14rpx 34rpx;
			padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
			padding-bottom: calc(14rpx + env(safe-area-inset-bottom));


			image {
				width: 34rpx;
				height: 34rpx;
			}

			text {
				margin-left: 8rpx;
				font-size: 24rpx;
				color: #3A3D71;
			}

		}
	}
</style>
