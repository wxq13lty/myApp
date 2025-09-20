import {ref} from 'vue'
import { defineStore } from 'pinia'
export const useThemStore = defineStore('them',()=>{
    const them = ref<boolean>(false);
    const changeThem = (color?:'white'|'black'|never):boolean =>{
        console.log(color)
        if (color){
            if (color === 'white') {
                document.documentElement.style.setProperty('--system-them--', '#ffffff');
                document.documentElement.style.setProperty('--system-them-color--', ' #3e3e3e');
            } else {
                document.documentElement.style.setProperty('--system-them--', ' #3e3e3e');
                document.documentElement.style.setProperty('--system-them-color--', '#ffffff');
            }
            them.value = color === 'white';
            return color === 'white';
        }
        them.value ? document.documentElement.style.setProperty('--system-them--', '#ffffff') :
                     document.documentElement.style.setProperty('--system-them--', ' #3e3e3e')
        them.value ? document.documentElement.style.setProperty('--system-them-color--', ' #3e3e3e') :
                     document.documentElement.style.setProperty('--system-them-color--', '#ffffff')
        return them.value = !them.value
    }
    return {
        changeThem
    }
})