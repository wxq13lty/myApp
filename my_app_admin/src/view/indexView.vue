<script setup lang="ts">
import Editor from "@/components/Editor.vue";
import { ref} from "vue";
import type {IndexTypes} from "@/types";

const form = ref<IndexTypes>({
	noticeContent:'',
	title:'',
	tag:'',
	image:null,
})
const update = (value:any) => {
	form.value.noticeContent = value
}
const uploadFile = (event: Event) => {
	const target = event.target as HTMLInputElement; // 类型断言为 HTMLInputElement
	const files = target.files; // 现在 files 属性可以正确访问
	if (files) {
		form.value.image = files[0]
	}
};
const submit = () =>{
	const {noticeContent,title,tag} = form.value
	if (!noticeContent){
		alert('输入正文')
		return
	}
	if (!tag){
		alert('输入标签')
		return;
	}
	if (!title){
		alert('输入标题')
		return;
	}

}
</script>

<template>
<section class="index-box">
	<header></header>
	<footer>
		<nav></nav>
		<main>
			<form action="javascript:">
				<div>
					<label id="file">图片</label>
					<input type="file" name="file" @change="uploadFile">
				</div>
				<div>
					<label id="title">标题</label>
					<input type="text" id="title" placeholder="标题" v-model="form.title">
				</div>
				<div>
					<label id="tag">标签</label>
					<input type="text" id="tag" placeholder="标签" v-model="form.tag">
				</div>
				<div>
					<Editor style="width: 100%;" @update:editorValue="update" ref="editorRef" v-model="form.noticeContent" :editorValue="form.noticeContent"></Editor>
				</div>
				<button type="button" @click="submit">提交</button>
			</form>
		</main>
	</footer>
</section>
</template>

<style scoped>
.index-box{
	width: 100vw;
	height: 100vh;
	header{
		height: 60px;
		width: 100%;
		background: #8c59f3;
	}
	footer {
		height: calc(100vh - 60px);
		width: 100vw;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		nav {
			width: 250px;
			height: 100%;
			background: aquamarine;
		}
		main {
			flex: 1;
			width: 100%;
			height: 100%;
			background: #598ff3;
			form {
				padding: 20px;
				div {
					label {
						color: #f3f3f3;
					}
					input {
						width: 100%;
						height: 35px;
						margin-bottom: 20px;
					}
				}
			}
		}
	}
}
</style>