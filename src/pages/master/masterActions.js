import Ajax from "Utils/ajax";

export const getCountries = () => Ajax.get("public/fetchAllCountriesforSignup");

export const uploadFile = (data) => Ajax.post(`webuser/file/upload`, data, { 'Content-Type': 'multipart/form-data' });

export const getAddressById = (address_id) => Ajax.post(`webuser/getaddress`, { address_id });

export const addUpdateAddressRequest = (data) => Ajax.post('webuser/addUpdateAddress', data);

export const getIdentificationTypes = () => Ajax.get('list/getIdentificationTypes');

export const getQualificationTypes = () => Ajax.get('list/getQualificationTypes');

export const refreshToken = () => Ajax.get("list/refreshToken");

export const logoutRequest = data => Ajax.post("admin/logout", data);

export const getCurrencies = () => Ajax.get("list/fetchCurrencies");
