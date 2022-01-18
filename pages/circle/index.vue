<template>
	<view class="container">
		<tab-bar :selected="1"></tab-bar>
	</view>
</template>

<script>
	import tabBar from '@/components/tabbar/tabbar.vue'
	export default {
		components:{
			tabBar
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">

</style>
