<template>
<div >
    <FormSelect
        :items="['Mr', 'Ms','Dr']"
        label="Title"
        :rules="rules" 
        :disabled="disabled || readonly"
        v-model="innerValue" />
</div>
</template>

<script>
    
    import validationMixin from 'Mixins/validationMixin';

    export default {
        name:'Salutation',
        mixins: [validationMixin],
        props:{
            value: String,
            disabled: Boolean,
            rules: String,
            label: String,
            readonly: Boolean,
        }
    }
</script>