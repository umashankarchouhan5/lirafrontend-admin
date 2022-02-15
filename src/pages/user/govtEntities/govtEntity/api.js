import Ajax from "Utils/ajax";

export const getGovtEntitiesList = (data) => Ajax.post('admin/getGovtEntitiesList',data);

export const createEntity = (data) => Ajax.post('admin/createGovtEntity',data);

export const getAddressById = (data) => Ajax.post(`webuser/getaddress`,data);
