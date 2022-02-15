export default {
    state: {
        countries: [],
        currencies: [],
        signUpPurposes: [],
        currentProcessId: null,
        identificationTypes: [],
        isMenuCollapsed: false,
        subTaskData: null,
        documentFilters: null,
        isLoading: false,
        additionalUploaded: false,

    },
    mutations: {
        collapseMenu(state, value) {
            state.isMenuCollapsed = value;
        },
        setCountries(state, countries) {
            state.countries = countries;
        },
        setSignUpPurposes(state, signUpPurposes) {
            state.signUpPurposes = signUpPurposes;
        },
        setProcessId(state, id) {
            state.currentProcessId = id;
        },
        setIdentificationType(state, identificationTypes) {
            state.identificationTypes = identificationTypes;
        },
        setQualificationTypes(state, qualificationTypes) {
            state.qualificationTypes = qualificationTypes;
        },
        setSubTaskData(state,data){
            state.subTaskData = data;
        },
        setDocumentFilter(state,data){
            state.documentFilters = data;
        },
        setIsLoading(state,val){
            state.isLoading = val;
        },
        checkAdditionalUploaded(state,val){
            state.additionalUploaded = val;
        },
        setCurrencies(state, currencies) {
            state.currencies = currencies;
        },
    }
}

