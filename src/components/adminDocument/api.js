import Ajax from "Utils/ajax";

export const uploadFile = (data) => Ajax.post('admin/adminStore', data);

export const fetchAdminDocuments = (data) => Ajax.post('admin/fetchAdminDocuments', data);