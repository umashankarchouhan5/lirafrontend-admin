import Ajax from "Utils/ajax";

export const getDepartmentList = () => Ajax.get('misc/departmentlist');

export const fetchEntityTypeByDepartment = (data) => Ajax.post('admin/fetchEntityTypeByDepartment', data);

export const fetchDossierReport = (data) => Ajax.post('company/fetchDossierReport', data);

export const getCompany = (data) => Ajax.post('list/getcompanysearch', data);

