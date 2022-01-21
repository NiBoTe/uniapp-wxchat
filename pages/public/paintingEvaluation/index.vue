<template>
	<view class="container">
		<drawing-board cid="drawingBoard"></drawing-board>
	</view>
</template>

<script>
	import DrawingBoard from '@/components/drawingBoard/drawingBoard.vue'
	export default {
		components:{
			DrawingBoard
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">

</style>
