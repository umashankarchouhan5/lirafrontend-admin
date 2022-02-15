<template>
    <PageUser v-if="isUserLogged && $route.name !== 'home'">
        <router-view />
        <Footer auth/>
    </PageUser>
    <PagePublic v-else>
        <router-view />
        <Footer />
    </PagePublic>
</template>

<script>

    import Auth from 'Utils/auth'
    import PagePublic from "Components/layout/public/Page";
    import PageUser from "Components/layout/user/Page";
    import Footer from "Components/layout/Footer";

    export default {
        name: "Master",
        computed: {
            isUserLogged() {
                return Auth.isUserLogged();
            }
        },
        created(){
            
            if(this.$route.name === 'home' && localStorage.userData === undefined){
                this.$router.push('/login')
            }
            if(this.$route.name === 'home' && localStorage.userData){
                this.$router.push('/tasks')
            }
        },
        components: {
            PagePublic,
            PageUser,
            Footer
        }
    }
</script>