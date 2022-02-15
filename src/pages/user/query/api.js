import Ajax from "Utils/ajax";

export const tempQuery = (data) => Ajax.post('admin/tempQuery', data);
