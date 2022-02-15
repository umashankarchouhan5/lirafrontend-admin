import Ajax from "Utils/ajax";

export const fetchMonthlyConversions = () => Ajax.post('admin/fetchMonthlyConversions');

export const saveMonthlyConversion = (data) => Ajax.post('admin/saveMonthlyConversion', data);

export const saveMonthlyConversionByDate = (data) => Ajax.post('admin/saveMonthlyConversionByDate', data);

export const fetchMonthlyConversionByDate = (data) => Ajax.post('admin/fetchMonthlyConversionByDate', data);