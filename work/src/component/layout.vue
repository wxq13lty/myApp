<script setup lang="ts">
import {useThemStore} from "@/stores/thme.ts";
import {onMounted, ref} from "vue";
const store = useThemStore()
const currentTime = ref('')
const updateCurrentTime = () =>{
	const date = new Date();
	const year = `${date.getFullYear()}/${date.getMonth()+1 >= 10 ? date.getMonth()+1 : `0${date.getMonth()+1}`}/${date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`}`;
	const day = `${date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`}:${date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`}:${date.getSeconds()>=10 ? date.getSeconds() : `0${date.getSeconds()}`}`;
	currentTime.value = `${year} ${day}`
}
onMounted(() =>{
	updateCurrentTime()
	setInterval(updateCurrentTime,1000)
})
</script>

<template>
	<section class="them body">
		<div class="container">
			<header>
				<ul>
					<li>首页</li>
					<li>关于</li>
				</ul>
				<button type="button" class="them-color" @click="store.changeThem()">切换主题</button>
				<div class="text-color">{{currentTime}}</div>
			</header>
			<main>
				<ul class="content-box">
					<li class="item" v-for="item in 15">
						<img src="" alt="图片" class="img">
						<div class="content">
							<h2>标题</h2>
							<p>内容</p>
							<p>2025-09-19 标签 xxx</p>
						</div>
					</li>
				</ul>
			</main>
		</div>
	</section>
</template>

<style scoped>
.body {
	width: 100vw;
	height: 100vh;
	.container {
		max-width: 1080px;
		height: 100vh;
		margin:  0 auto;
		overflow-y: auto;
		header {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 20px;
			border: 1px solid #598ff3;
			border-top: none;
			border-radius: 5px;
			background:  rgba(91, 144, 243, 0.1);

			ul {
				width: 100%;
				height: 60px;
				display: flex;
				align-items: center;
				li {
					margin-right: 10px;
					cursor: pointer;
				}
				li:last-child{
					margin-right: 0;
				}
			}
			button {
				width: 100px;
				background-color: transparent;
				outline: none;
				border-style: none;
			}
			.text-color {
				flex: 2;
				text-wrap: nowrap;
				background-image: linear-gradient(to right, #598ff3 0%, #8c59f3 100%);
				background-clip: text;
				--webkit-background-clip:text;
				color: transparent;
			}
		}
		main {
			height: calc(100vh - 120px - 12px);

			margin-top: 20px;
			width: 100%;
			border-radius: 5px;
			background-color: rgba(91, 144, 243, 0.1);
			.content-box {
				width: 100%;
				height: 100%;
				padding: 20px;
				overflow-y: auto;
				.item {
					display: flex;
					align-items: center;
					gap: 20px;
					margin-bottom: 10px;
					.img {
						width: 100px;
						height: 100%;
						object-fit: cover;
					}
					.content {
						flex: 1;
						padding: 10px;
						background-color: rgba(91, 144, 243, 0.1);
						border-radius: 5px;
					}
				}
			}
		}
		/* 整个滚动条 */
		::-webkit-scrollbar {
			display: none;
			width: 12px; /* 垂直滚动条宽度 */
			height: 12px; /* 水平滚动条高度 */
		}

	}
}
</style>