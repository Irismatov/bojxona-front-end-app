import router from "./index";
import { useAuth } from "@/stores";


export default function setupRouteGuards() {
    router.beforeEach((to, from, next) => {
        const authPath = "/auth";
        const auth = useAuth();
        const token = auth.token;

        if (token) {
            auth.fetchUserInfo();
        }
        

        const role = auth.user?.roleId;
        const roles = to.meta?.roles || [];
        const isAuthRequired = !!to.meta?.roles?.length > 0;

        if (isAuthRequired) {
            if (!token) {
                return next(authPath);
            } else {
                if (roles.includes(role)) {

                    return next();
                } else {
                    console.log(roles, "xzaxaa");
                    console.log(role);
                    console.log(auth.user.roleId)
                    return next("/error?message=Sizda ushbu sahifaga dostup yo\'q");
                }
            }
        }

        next();
    })
}