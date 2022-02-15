<template>
    <div >
        <template v-if="row.Path">
            <div :class="$style.actions">
            <a :class="$style.name" :href="row.Path" target="_blank"> {{ row.Name }} </a>
                <FormButton :class="$style.eye" :prevent-default="false" size="small" type="text" :href="row.Path" target="_blank" tag="a" left-icon="md-eye"></FormButton>
            </div>
            
        </template>
    </div>
</template>

<script>

    export default {
        name: "ViewCell",
        props: {
            row: {
                type: Object,
                required: true,
            },
        }
    }
</script>

<style lang="scss" module>

    .accepted {
        color: #55a7a0;
        padding: 0 7px;
        min-width: 70px;
        height: 22px;
        line-height: 22px;
    }

    .actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        a,
        button {
            margin: 0 5px
        }
        div {
            margin: 0 5px;
            color: #55a7a0;
            display: inline-block;
            &:hover {
                color: #55a7a0;
            }
            &.error {
                color: #eac222;
                font-size: 19px;
                &:hover {
                    font-size: 19px;
                }
            }
        }
    }
    .eye{
        min-width: 20px !important;
    }
    .name{
        max-width: 223px !important;
    }
</style>

