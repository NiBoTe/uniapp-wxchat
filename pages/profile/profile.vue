<template>
	<view class="container">
		<tab-bar :selected="4"></tab-bar>
	</view>
	
</template>
<script>
	import tabBar from '@/components/tabbar/tabbar.vue'
	export default {
		components: {
			tabBar
		},
		data() {
			return {

			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #4A99F8;
		position: relative;
		height: 100vh;
		overflow: hidden;
	}
</style>
