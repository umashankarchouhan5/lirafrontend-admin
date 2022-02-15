import Ajax from "Utils/ajax";

export const getFSATicket = (data) => Ajax.post('admin/tasks/fsaticket', data);

export const fsaaction = (data) => Ajax.post('admin/tasks/actions/fsaaction', data);


export const uploadFile = (data) => Ajax.post('admin/adminfile/upload', data);