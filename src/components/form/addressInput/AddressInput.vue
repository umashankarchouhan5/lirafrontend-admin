<template>
    <div style="position: relative;">
        <ValidationProvider :vid="vid" :rules="rules" mode="passive" :name="name || label" v-slot="{ errors }">
            <InputText @focus="handleFocus"
                    :placeholder="placeholder"
                    :readonly="readonly"
                    :label="label"
                    :name="name"
                    :vid="vid"
                    :rules="rules"
                    :title="stringifyAddress"
                    :value="stringifyAddress">
            </InputText>
            <div :class="$style.error" v-if="errors[0]">
                {{ errors[0] }} 
            </div>
        </ValidationProvider>
        <AddressModal :addressId="value"
                      :isModalVisible="isModalVisible"
                      v-model="address"
                      @onAddressSave="onAddressSave" @close="closeModal"/>
    </div>
</template>

<script>

    import { getAddressById } from 'Pages/master/masterActions'
    import AddressModal from './AddressModal'
    import validationMixin from 'Mixins/validationMixin'

    export default {
        name: "AddressInput",
        mixins: [validationMixin],
        components: {
            AddressModal,
        },
        props: {
            value: [String, Number],
            label: [String],
            placeholder: [String],
            name: String,
            readonly: {
                type: Boolean,
                default: false
            },
            vid: String,
            rules: [String, Object],
            country_id: {
                type: Number,
                default: null
            }
        },
        data() {
            return {
                isModalVisible: false,
                address: {
                    address1: '',
                    address2: '',
                    city: '',
                    state: '',
                    zip: '',
                    country_id: this.country_id,
                    countryname: ''
                }
            }
        },
        computed: {
            stringifyAddress() {
                return this.address ? Object.keys(this.address).reduce((acc, current) => {
                    if (this.address[current] && this.address[current] !== ' ' && current !== 'caddress' && current !== 'address_id' && current !== 'country_id' && this.address.address_id) {
                        if (acc) {
                            return `${acc}, ${this.address[current]}`
                        }
                        return `${this.address[current]}`
                    }
                    return `${acc}`
                }, '') : null
            }
        },
        watch: {
            value(newValue) {
                this.address =  {
                    address1: '',
                    address2: '',
                    city: '',
                    state: '',
                    zip: '',
                    country_id: this.country_id,
                    countryname: ''
                };
                this.getAddress(newValue);
            }
        },
        created() {
            this.getAddress(this.value)
        },
        methods: {
            getAddress(addressId) {
                if (addressId) {
                    getAddressById(addressId).then(this.handleRequest);
                }
            },
            handleFocus() {
                !this.readonly && (this.isModalVisible = true);
            },
            closeModal() {
                this.isModalVisible = false;
            },
            onAddressSave(addressId) {
                this.$emit('input', addressId);
            },
            handleRequest(response) {
                this.address = response.data[0];
            },
        }
    }
</script>
<style lang="scss" module>
    
    .error {
        color: #ff3547;
        position: absolute;
        left: 0;
        font-size: 11px;
        line-height: 13px;
        top: calc(100% + 2px);
        font-weight: 400;
    }
</style>