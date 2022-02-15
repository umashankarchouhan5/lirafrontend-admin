import Ajax from "Utils/ajax";

export const companyDirectors = (data) => Ajax.post('admin/companyDirectors', data);

export const getCompany = (data) => Ajax.post('list/getcompanysearch', data);

export const deleteDirector = (data) => Ajax.post('admin/deleteDirector', data);

export const exportDirectorsExcel = (data) => Ajax.post('list/exportDirectorsExcel', data);