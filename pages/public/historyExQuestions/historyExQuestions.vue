<template>
	<view class="historyExQuestions">
		<view class="tab-bar background-one" :class="tabNumber === 'one'? 'background-one': 'background-two'">
			<view class="left" :class="tabNumber === 'one'? 'active': ''" @click="handleTab('one')">
				高考
			</view>
			<view class="right" :class="tabNumber === 'two'? 'active': ''" @click="handleTab('two')">
				模考
			</view>
		</view>
		<view class="content">
			<view class="c-left">
				<view class="item" v-for="(item, index) in leftData" :key="item.id">
					<view class="item-title" :class="leftNum === index?'item-title-active':''" @click="handleLeftClick(index)">
						{{ item.name }}
						<u-icon v-if="leftNum === index" name="arrow-down" size="24" class="arrow"></u-icon>
						<u-icon v-else name="arrow-right" size="24" class="arrow"></u-icon>
						
					</view>
				
					<view class="item-list" @click="handleItemListClick(items)" :class="leftItemNum === items.id? 'item-list-active':''" v-show="leftNum === index" v-for="items in item.children" :key="items.id">
						 {{ items.name }}
					</view>
				
				</view>
			</view>
			<view class="c-right">
				<view class="title">
					主办方与选中侧边栏二级菜单一致
				</view>
				<view class="date">
				<!-- 	<view class="date-list">
						<view class="date-item" v-for="item in 20">
							2020
						</view>
					</view> -->
					<drawingColumn></drawingColumn>
				</view>

				<scroll-view class="r-tab" :scroll-x="true">
					<view class="tab-list">
						<view class="tab-item" @click="handleRTab(item)" :class="rightTabNum === item.id ? 'tab-item-active':''" v-for="item in rightTabList" :key="item.id">
							{{ item.name }}
						</view>
					</view>
				</scroll-view>
				
				<view class="r-content">
					<view class="test-list">
						<view class="test-name">考试名称</view>
						<view class="subjects-item">
							<view class="subjects-name">
								科目
							</view>
							<view class="item">
								<view class="name">
									考试题目
								</view>
								<view class="item-b">
									<view class="text">
										人物半身像随意创作性别年龄大小种族不限，西方人物室外风景色彩赏析，试的师傅说
									</view>
									<view class="time">
										<view class="t-l">
											<view class="l">考试时间</view>
											<view class="r">2019.12.26</view>
										</view>
										<view class="t-r">
											查看详情<u-icon name="arrow-right" size="24" class="arrow"></u-icon>
										</view>
									 </view>
									 <view class="line"></view>
									 <view class="bottom">
									 	<view class="left">
									 		<image class="img" src="../../../static/public/examinationPaper_icon.png" mode=""></image>
											高分试卷
									 	</view>
										<view class="right">
											<image class="route" src="../../../static/public/route.png" mode=""></image>
										</view>
									 </view>
								</view>
								
								
								
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import drawingColumn from '../../../components/drawingColumn/drawingColumn.vue'
	export default {
		components:{
			drawingColumn	
		},
		data() {
			return {
				tabNumber: 'one',
				leftData: [
					{name: '九大美院',id: 1,children: [{name: '中央美术学院',id: '1-1'},{name: '中国美术学院',id: '1-2'},{name: '四川美术学院',id: '1-3'}]},
					{name: '十大妓院',id: 2,children: [{name: '西安航空学院',id: '2-1'},{name: '华培学院',id: '2-2'},{name: '商洛学院',id: '2-3'}]}
				],
				leftNum: 0,
				leftItemNum: '1-1',
				rightTabList: [{id: 1,name: '设计师'},{id: 2,name: '产品设计'},{id: 3,name: '环境设计'},{id: 4,name: '平面设计'}],
				rightTabNum: 1
			}
		},
		methods: {
			handleTab(val){
				this.tabNumber = val
			},
			handleLeftClick(index){
				this.leftNum = index
			},
			handleItemListClick(item){
				this.leftItemNum = item.id
			},
			handleRTab(item){
				this.rightTabNum = item.id
			}
		}
	}
</script>

<style lang="scss">
	.historyExQuestions {
		.tab-bar {
			width: 100%;
			display: flex;
			text-align: center;
			height: 108rpx;
			font-size: 36rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #FFFFFF;
			.left{
				flex: 1;
				line-height: 126rpx;
			}
			.right{
				flex: 1;
				line-height: 126rpx;
			}
			.active{
				color: #2C3AFF;
			}
		}
		.background-one{
			background: url(img/tabOne.png) no-repeat center;
			background-size: 100%;
		}
		.background-two{
			background: url(img/tabTwo.png) no-repeat center;
			background-size: 100%;
		}
		
		
		.content{
			display: flex;
			.c-left{
				flex: 0 0 174rpx;
				border-right: 1rpx solid #E9E9E9;
				.item{
					.item-title{
						width: 174rpx;
						height: 80rpx;
						line-height: 80rpx;
						text-align: center;
						font-size: 26rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #9E9E9E;
						background: #F2F2F2;
						.arrow{
							margin-left: 10rpx;
							font-size: 18rpx;
						}
					}
					.item-title-active{
						color: #2C3AFF;
						.arrow{
							color: #2C3AFF;
						}
					}
					// border-top: 1px solid #D2D5DE;
					border-bottom: 1px solid #D2D5DE;
					
					.item-list{
						// padding: 0 20rpx;
						height: 74rpx;
						font-size: 22rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #5E677A;
						line-height: 74rpx;
						text-align: center;
						position: relative;
						&:before{
							position: absolute;
							bottom: 0;
							left: 20rpx;
							content: '';
							width: 134rpx;
							height: 1rpx;
							background: #D2D5DE;
						}
					}
					.item-list-active{
						background: #8EA7F7;
						color: #FFFFFF;
					}
				}
			}
			.c-right{
				flex: 1;
				width: 0;
				.title{
					width: 100%;
					height: 80rpx;
					font-size: 26rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #3A3D71;
					line-height: 80rpx;
					text-align: center;
					border-top: 1rpx solid #E9E9E9;
					border-bottom: 1rpx solid #E9E9E9;
				}
				.date{
					width: 100%;
					overflow: auto;
					margin: 24rpx 0 0 0;
					padding-bottom: 20rpx;
					padding-left: 12rpx;
					.date-list{
						// position: absolute;
						display: flex;
						.date-item{
							padding: 0 24rpx;
							width: 100rpx;
							height: 52rpx;
							background: #F3F3F3;
							border-radius: 28rpx;
							font-size: 24rpx;
							font-family: PingFang-SC-Regular, PingFang-SC;
							font-weight: 400;
							color: #1B1B1B;
							line-height: 52rpx;
							margin-right: 62rpx;
						}
					}
				}
				
				.r-tab{
					// display: flex;
					// overflow-x: scroll;
					width: 100%;
					padding-left: 16rpx;
					padding-bottom: 16rpx;
					.tab-list{
						white-space: nowrap;
						.tab-item{
							display: inline-block;
							margin-right: 50rpx;
						}
						.tab-item-active{
							color: #2C3AFF;
						}
					}
					border-bottom: 2rpx solid #E9E9E9;
				}
				.r-content{
					padding: 16rpx 34rpx 0 16rpx;
					.test-list{
						.test-name{
							text-align: center;
							font-size: 30rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #3A3D71;
							line-height: 30rpx
						}
						.subjects-item{
							.subjects-name{
								text-align: center;
								font-size: 34rpx;
								font-family: PingFang-SC-Bold, PingFang-SC;
								font-weight: bold;
								color: #3A3D71;
								line-height: 34rpx;
								margin: 16rpx 0;
							}
							.item{
								// width: 526px;
								height: 314rpx;
								background: #FFFFFF;
								box-shadow: 0px 6rpx 16rpx 6rpx rgba(230, 230, 230, 0.5);
								border-radius: 16rpx;
								.name{
									width: 100%;
									height: 56rpx;
									background: linear-gradient(90deg, #FFFFFF 0%, #EFF2FF 100%);
									border-radius: 16rpx 16rpx 0rpx 0rpx;
									font-size: 28rpx;
									font-family: PingFangSC-Regular, PingFang SC;
									font-weight: 400;
									color: #3A3D71;
									line-height: 56rpx;
									padding-left: 24rpx
								}
								.item-b{
									padding: 0 24rpx 0 24rpx;
								}
								.text{
									margin-top: 14rpx;
									font-size: 26rpx;
									font-family: PingFang-SC-Regular, PingFang-SC;
									font-weight: 400;
									color: #3A3D71;
									line-height: 36rpx;
									 text-overflow: -o-ellipsis-lastline;
									  overflow: hidden;
									  text-overflow: ellipsis;
									  display: -webkit-box;
									  -webkit-line-clamp: 2;
									  line-clamp: 2;
									  -webkit-box-orient: vertical;
								}
								.time{
									margin-top: 14rpx;
									display: flex;
									.t-l{
										flex: 1;
										.l{
											display: inline;
											font-size: 24rpx;
											font-family: PingFang-SC-Regular, PingFang-SC;
											font-weight: 400;
											color: #888C90;
										}
										.r{
											margin-left: 20rpx;
											display: inline;
											font-size: 24rpx;
											font-family: PingFangSC-Regular, PingFang SC;
											font-weight: 400;
											color: #3A3D71;
											line-height: 24rpx;
										}
									}
									.t-r{
										flex: 1;
										text-align: right;
										font-size: 24rpx;
										font-family: PingFang-SC-Regular, PingFang-SC;
										font-weight: 400;
										color: #9E9E9E;
									}
								}
								.line{
									width: 100%;
									height: 2rpx;
									background: #E9E9E9;
									margin-top: 26rpx;
									margin-bottom: 24rpx;
								}
								.bottom{
									width: 100%;
									display: flex;
									// background: #DCDFE6;
									.left{
										flex: 1;
										.img{
											width: 44rpx;
											height: 44rpx;
											vertical-align: bottom;
											margin-right: 24rpx;
										}
									}
									.right{
										text-align: right;
										flex: 1;
										.route{
											width: 34rpx;
											height: 14rpx;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}

</style>
