import Ajax from "Utils/ajax";

export const fetchFormFields = (data) => Ajax.post('admin/fetchFormFields', data);

export const saveForm = (data) => Ajax.post('admin/saveForm', data);

export const saveFormFields = (data) => Ajax.post('admin/saveFormFields', data);

export const fetchForms = (data) => Ajax.post('admin/fetchForms', data);