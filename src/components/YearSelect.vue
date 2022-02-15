<template>
    <FormSelect :disabled="readonly" :items="items" v-model="innerValue" :label="label" :rules="rules" />
</template>

<script>

    export default {
        name: "YearSelect",
        props: {
            value: [Number, String],
            minValue: {
                type: Number,
                default: 1960
            },
            label: String,
            readonly: Boolean,
            maxValue: {
                type: Number,
                default: () => {
                    return new Date().getFullYear();
                }
            },
            rules: {
                type: [Object, String],
                default: ""
            },
        },
        data() {
            return {
                innerValue: null
            };
        },
        created() {
            if (this.value) {
                this.innerValue = this.value;
            }
        },
        watch: {
            innerValue(newVal) {
                this.$emit("input", newVal);
            },
            value(newVal) {
                this.innerValue = newVal;
            }
        },
        computed: {
            items() {
                const items = [];
                for (let i = this.maxValue; i >= this.minValue; i--) {
                    items.push(i);
                }
                return items;
            }
        },
    }
</script>
