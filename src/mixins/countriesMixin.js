import { getCountries } from 'Pages/master/masterActions'

export default {
    computed: {
        countriesList() {
            return this.$store.state.common.countries
        }
    },
    created() {
        if (this.countriesList.length === 0) {
            this.fetchCountries()
        }
    },
    methods: {
        fetchCountries() {
            getCountries().then(this.handleSuccess)
        },
        handleSuccess(response) {
            this.$store.commit('setCountries', response.data)
        }
    }
};



