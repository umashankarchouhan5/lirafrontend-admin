<template>
    <div>
        <FormCheckbox  :value="row[keyVal]" :true-value="1" :false-value="0" disabled>   </FormCheckbox>
    </div>
</template>

<script>

    export default {
        name: "CheckBoxCell",
        props: {
            row: Object,
            keyVal: String
        },
    }
</script>

