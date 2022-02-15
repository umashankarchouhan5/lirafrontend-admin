import Ajax from "Utils/ajax";

export const fetchAllCurrency = (data) => Ajax.post('list/fetchAllCurrency', data);

export const getCurrencyDataByCode = (data) => Ajax.post('admin/getCurrencyDataByCode', data);

export const addCurrency = (data) => Ajax.post("admin/addCurrency", data);

