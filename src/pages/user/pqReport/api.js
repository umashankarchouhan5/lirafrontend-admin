import Ajax from "Utils/ajax";

export const fetchPQSearchbyAdmin = (data) => Ajax.post('pqform/fetchPQSearchbyAdmin', data);

export const getPQFormData = (data) => Ajax.post('pqform/getPQFormData', data);

export const getPQList = (data) => Ajax.post('pqform/getPQList', data);

export const getCompanyStatus = (data) => Ajax.post('list/fetchAdminFilterStatusList', data);

export const getCompany = (data) => Ajax.post('list/getcompanysearch', data);

export const updatePQStatusByAdmin = (data) => Ajax.post('admin/updatePQStatusByAdmin', data);

export const getCompanyRegName = (data) => Ajax.post('company/getCompanyRegName', data);