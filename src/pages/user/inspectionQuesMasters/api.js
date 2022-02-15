import Ajax from "Utils/ajax";

export const getEntityType = (data) => Ajax.post('list/entitytype', data);

export const getInspectionItems = (data) => Ajax.post('admin/getInspectionItems', data);

export const addInspectionItem = (data) => Ajax.post('admin/addInspectionItem', data);

export const getInspectionById = (data) => Ajax.post('admin/getInspectionById', data);
