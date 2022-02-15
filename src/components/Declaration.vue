<template>
    <div :class="$style.declaration">
        <div :class="$style.declarationCheckbox">
            <FormCheckbox :disabled="readonly" :value="true"><span :class="$style.declarationText">{{ value.DeclarationMessage }}</span></FormCheckbox>
        </div>
        <div class="row">
            <div class="col-sm-2">
                <InputDate :readonly="readonly" label="Date" v-model="value.DeclarationDate"  />
            </div>
            <div class="col-sm-2">
                <InputText :readonly="readonly" label="Name" v-model="value.DeclarationName" />
            </div>
            <div class="col-sm-2">
                <InputText :readonly="readonly" label="Place" v-model="value.DeclarationPlace" />
            </div>
        </div>
    </div>
</template>

<script>

    import InputDate from 'Components/form/InputDate'

    export default {
        name: "Declaration",
        components: {
            InputDate
        },
        props: {
            value: {
                type: Object,
            },
            readonly: Boolean
        }
    }
</script>

<style lang="scss" module>
    .declaration {
        margin: 10px 0;
    }
    .declarationCheckbox {
        margin-bottom: 15px;
        text-align: justify;
    }
    .declarationText{
        font-size: 14px;
        color: #555;
    }
</style>
