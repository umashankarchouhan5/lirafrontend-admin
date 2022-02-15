import Ajax from "Utils/ajax";

export const getRFIRegister = (data) => Ajax.post('list/getRFIRegister', data);

export const getDepartmentList = () => Ajax.get('misc/departmentlist');

export const exportComplaintRfi = (data) => Ajax.post('admin/exportComplaintRfi', data);

export const generateComplaintRfi = (data) => Ajax.post('admin/generateComplaintRfi', data);

export const getCompanyStatusList = () => Ajax.get('list/getCompanyStatusList/3');