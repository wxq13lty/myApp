<script setup lang="ts">
import {useThemStore} from "@/stores/thme.ts";
import {onMounted, onUnmounted, ref} from "vue";
const store = useThemStore()
const startTime = ref(0)
function autoChangThem(){
	// 获取当前事件
	const date = new Date();
	// 获取当前小时 24小时制
	const hours = date.getHours();
	if (hours >= 17) {
		store.changeThem('black') ;
		return;
	}
	store.changeThem('white')
}

onMounted(()=> {
	autoChangThem()
	startTime.value = setInterval(autoChangThem,1000 * 60 *60)
})
onUnmounted(()=>{
	clearInterval(startTime.value)
})
</script>

<template>
  <router-view />
</template>

<style scoped></style>
