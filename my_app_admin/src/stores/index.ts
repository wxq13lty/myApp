import {ref } from 'vue';
import { defineStore } from 'pinia';
import type {LoginInterface} from "../types/login.ts"

export const useCounterStore = defineStore('index', () => {
    const form = ref<LoginInterface>(
        JSON.parse(<string>window.localStorage.getItem('formLocalStorage')) ?
            JSON.parse(<string>window.localStorage.getItem('formLocalStorage'))
            :{
                username:"",
                password:""
            }
    )
    const setForm = (data:LoginInterface)=>{
        window.localStorage.setItem('formLocalStorage',JSON.stringify(data))
        form.value = data;
    }
    const getForm = ():LoginInterface =>{
        return form.value
    }
    return {
        setForm,getForm

    }
})
