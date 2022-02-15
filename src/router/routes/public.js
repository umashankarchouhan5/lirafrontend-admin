export default [
    {
        path: "/forgotPassword",
        name: "forgotPassword",
        meta: {
            title: "Forgot Password"
        },
        component: () => import("../../pages/public/forgotPassword/ForgotPassword.vue")
    },
];
