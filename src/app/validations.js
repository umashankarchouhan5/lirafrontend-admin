import { extend, localize } from "vee-validate";
import { min, required, email, confirmed, numeric, ext, regex, max, alpha_num, min_value, max_value, between } from "vee-validate/dist/rules";
import en from "vee-validate/dist/locale/en.json";

// Install rules
extend("required", required);
extend("min", min);
extend("email", email);
extend("confirmed", confirmed);
extend("numeric", numeric);
extend("ext", ext);
extend('regex', regex);
extend("max", max);
extend('alpha_num',alpha_num);
extend('min_value',min_value);
extend('max_value',max_value);
extend('between',between);

// Install messages
localize({
    en
});

localize({
    en: {
        messages: {
            email: 'Email should have a valid format',
            required: 'Required.'
        },
        fields: {
            'Confirm Your Email ID': {
                confirmed: 'Try not having Confirm Email the same as previous email',
            },
            'nameReservationBulkExcel': {
                ext: 'Upload file with .xsl or .xlsx extension please',
                required: 'Provide file please',
            },
            'nameReservationBulkFiles': {
                ext: 'Use allowed extensions please.',
            },
            register_accept_terms: {
                required: 'Please accept the Terms of use & privacy policy.'
            }
        }
    }
});

extend('nameReservation_IBC', {
    validate: (value) => {
        return (value.toUpperCase().endsWith("LIMITED") ||
            value.toUpperCase().endsWith("CORPORATION") ||
            value.toUpperCase().endsWith("INCORPORATED") ||
            value.toUpperCase().endsWith("LTD") ||
            value.toUpperCase().endsWith("CORP") ||
            value.toUpperCase().endsWith("INC") ||
            value.toUpperCase().endsWith("LTD.") ||
            value.toUpperCase().endsWith("CORP.") ||
            value.toUpperCase().endsWith("INC.") ||
            value.toUpperCase().endsWith("PCC")
        )
    },
    message: 'Proposed name should end with “Limited”, “Corporation”, “Incorporated”, “Ltd.”, “Corp.”, “Inc.”, “Ltd”, “Corp” or “Inc” or “PCC”.'
});

extend('nameReservation_LP', {
    validate: (value) => {
        return (value.toUpperCase().endsWith("LIMITED PARTNERSHIP") ||
            value.toUpperCase().endsWith("L.P.") ||
            value.toUpperCase().endsWith("LP"))
    },
    message: 'Proposed name should end with “Limited Partnership”, “L.P.”, “LP”.'
});

extend('nameReservation_Foundation', {
    validate: (value) => {
        return value.toUpperCase().endsWith("FOUNDATION")
    },
    message: 'Proposed name should end with “Foundation”.'
});

extend('nameReservation_Trust', {
    validate: (value) => {
        return value.toUpperCase().endsWith("TRUST")
    },
    message: 'Proposed name should end with “Trust”.'
});

extend('editorRequired', {
    validate: (value) => {
        return value != "<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n\n</body>\n</html>" && value !== '' && value !== ' ';
    },
    message: 'The Message field is required'
});
extend('checkFileRegex',{
    validate: (fieldValue) =>{
        if(fieldValue.length > 0){
            var fileVar = fieldValue[0].name.split('.');
            if(fileVar.length > 2){
                return false
            }
            else{
                var matchRegex = false;
                const regexp = /^(?!.*[<>'"/;`%+=~!@#$^&\[\]}{])/;
                matchRegex = fileVar[0].match(regexp);
                return matchRegex !== null ? true: false;
            }
        }
        return true;
    },
    message:() => 'Filename should not contain (<>\';\"/\`%+=~!@#$^&\[\]}{).'
})
extend('docCheck', {
    validate: (fieldValue, ext) =>{
        if(fieldValue.length > 0){
            var docExtArr = fieldValue[0].name.split('.');
            var docExt = docExtArr[docExtArr.length - 1]
            var d,doTheyMatch = false;
            if(ext[0].includes(',')){
                ext= ext[0].split(',');
            }
            for(d=0; d < ext.length; d++){
                if(docExt.toUpperCase() === ext[d].toUpperCase()){
                    doTheyMatch = true;
                }
            }
            return doTheyMatch;
        }
        return true;
    },
    message:(data,args) => 'Allowed file type(s): ' +args[0]
})
extend('alphaNumCustom', {
    validate: (fieldValue) =>{
        if(fieldValue.length > 0){
            if(fieldValue.trim().match("^[a-zA-Z0-9]*$")){
                return true
            }
            return false
        }
        return true;
    },
    message:() => 'Only alphanumerical value allowed '
})

