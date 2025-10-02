<script setup lang="ts">
import {nextTick, onMounted, reactive, ref} from "vue";
import type {LoginInterface} from "@/types/login.ts";
import {useCounterStore} from "@/stores";
import {useRouter} from "vue-router";
import request from "@/utils/axios.ts"
import dialog from "@/utils/dialog";
const router = useRouter()
const store = useCounterStore()

const form = reactive<LoginInterface>(store.getForm() ? store.getForm() : {
	username:"",
	password:""
})
const submitRef = ref<HTMLFormElement|null>(null)
onMounted(()=>{
	nextTick(()=>{
		submitRef.value!.addEventListener('submit',()=>{
			request.post('/login', form).then(res=>{
				if(res.data.code===200){
					store.setForm(form)
					// alert('登录成功')
					// router.push('/')
				}else{
					dialog(res.data.message).show()
				}
			})
			// router.push('/')
		})
	})
})
</script>

<template>
<section class="login">
	<form action="javascript:" type="submit" ref="submitRef" method="post">
		<h1>登录</h1>
		<label id="username">
			<input type="text" v-model="form.username" id="username" required placeholder="账号/手机号">
		</label>
		<label id="password">
			<input type="password" v-model="form.password" id="password" required placeholder="密码">
		</label>
		<input type="submit" value="登录"  id="submit">
	</form>
</section>
</template>

<style scoped>
.login {
	width: 100%;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #8c59f3;
	form {
		width: 260px;
		height: 350px;
		padding: 0 20px;
		border: 1px solid #f3f3f3;
		background: #ffffff;
		h1 {
			margin-top: 30px;
			margin-bottom: 20px;
		}
		label {
			display: block;
		}
		input {
			display: block;
			width: 100%;
			height: 35px;
			outline: none;
			text-indent: 16px;
		}
		input[type=text],
		input[type=password]{
			height: 30px;
			outline: none;
			border: 1px solid #598ff3;
			margin-bottom: 30px;
		}
		input[type=submit]{
			width: 100%;
			text-align: center;
			border: none;
			background: #598ff3;
			color: #f3f3f3;
			text-indent: 0;
		}
	}
}
</style>