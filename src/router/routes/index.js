import userRoutes from "./user";
import publicRoutes from "./public";

export default [
    {
        path: "/",
        name: "home",
        component: () => import("../../pages/master/Master"),
        meta: {
            title: "Home",
            auth: true,
        },
        children: [
            ...userRoutes,
            ...publicRoutes,
        ]
    },
    {
        path: "/login",
        name: "login",
        meta: {
            title: "LiRA2020 Admin Login"
        },
        component: () => import("Pages/public/login/Login.vue")
    },
    {
        path: "/companyPublic",
        name: "CompanyPublic",
        meta: {
            title: "Company List",
            auth: true,
        },
        component: () => import("../../pages/user/companyPublic/List"),
    },
    {
        path: "/companyPublic/log/:id",
        name: "CompanyPublicLogTemplate",
        meta: {
            title: "View Company Log",
            auth: true,
        },
        component: () => import("../../pages/user/companyPublic/Log/Log.vue"),
    },
    {
        path: "/companyPublic/doc/:id",
        name: "CompanyPublicDocumentTemplate",
        meta: {
            title: "View Company Documents",
            auth: true,
        },
        component: () => import("../../pages/user/companyPublic/Document/Document.vue"),
    },
    {
        path: "/pqReadonly/:id",
        name: "PQReadonly",
        meta: {
            title: "PQ ReadOnly",
            auth: true,
        },
        component: () => import("../../pages/user/ticket/components/pqReadOnly"),
    },
    {
        path: "/help/:id",
        name: "Help",
        meta: {
            title: "Help",
            auth: true,
        },
        component: () => import("../../pages/user/help"),
    },
    {
        path: "/unauthorize",
        name: "Unauthorize",
        meta: {
            title: "Unauthorized"
        },
        component: () => import("../../pages/errorPages/Unauthorized")
    },
    {
        path: "/pqLog/:pq_id",
        name: "PqLog",
        meta: {
            title: "PQ Change Log",
            auth: true,
        },
        component: () => import("../../pages/user/pqChangeLog"),

    },
    {
        path: "*",
        name: "NotFound",
        meta: {
            title: "Not Found"
        },
        component: () => import("../../pages/errorPages/NotFound")
    },

];
