import {createRouter,createWebHistory} from "vue-router";
const router = createRouter({
    history:createWebHistory(),
    routes:[
        {
            name:"login",
            path:"/login",
            component:()=>import('../LoginView.vue'),
            meta:{
                title:"登录"
            }
        },
        {
            name:"index",
            path:"/",
            component:()=>import('../view/indexView.vue'),
            meta:{
                title:"首页"
            }
        }
    ]
})
export default router