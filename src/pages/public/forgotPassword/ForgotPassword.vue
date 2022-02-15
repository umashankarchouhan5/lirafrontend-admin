<template>
    <div>
        <PageTitle title="Forgot Password"/>
        <div :class="$style.form">
            <h4>
                Please Enter your Email Address
            </h4>
            <InputText label="Registered Email ID"/>
            <div :class="$style.button">
                <FormButton type="info">Submit</FormButton>
            </div>
        </div>
    </div>
</template>

<script>

    import PageTitle from "Components/layout/PageTitle";

    export default {
        name: "ForgotPassword",
        components: {
            PageTitle
        }
    };
</script>

<style lang="scss" module>
    .form {
        width: 650px;
        padding: 150px 40px 40px 40px;
        margin: 0 auto;

        > h4 {
            margin: 10px 0 30px;
            font-weight: 400;
            font-size: 15px;
            text-align: center;
        }
    }

    .button {
        padding-top: 20px;
    }
</style>
