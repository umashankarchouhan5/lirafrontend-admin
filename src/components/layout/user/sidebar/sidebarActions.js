import Ajax from "Utils/ajax";

export const fetchMenu = data => Ajax.post("admin/adminsidemenu", data);
