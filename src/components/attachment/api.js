import Ajax from "Utils/ajax";

export const uploadFile = (data) => Ajax.post('admin/adminfile/upload', data);