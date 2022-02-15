import Ajax from "Utils/ajax";

export const fetchAllJurisdiction = (data) => Ajax.post('list/fetchAllJurisdiction', data);

export const getJurisdictionDataById = (data) => Ajax.post('admin/getJurisdictionDataById', data);

export const addJurisdiction = (data) => Ajax.post("admin/addJurisdiction", data);

