import { ValidationProvider } from "vee-validate";

export default {
    data() {
        return {
            innerValue: null
        };
    },
    created() {
        if (this.value !== undefined) {
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
        isRequired() {
            if (typeof this.rules === 'string') {
                return this.rules.indexOf('required') !== -1;
            }
            if (this.rules && typeof this.rules === 'object') {
                return this.rules.required;
            }
        }
    },
    components: {
        ValidationProvider
    },
    props: {
        vid: String,
        rules: {
            type: [Object, String],
            default: ""
        },
        value: [String, Array, Object, Number, null, File]
    }
}


