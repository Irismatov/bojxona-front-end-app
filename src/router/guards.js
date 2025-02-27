import router from "./index";
import { getActivePinia } from "pinia";


export default function setupRouteGuards() {
    router.beforeEach((to, from, next) => {
        const authPath = "/auth";



        next();

    })
}