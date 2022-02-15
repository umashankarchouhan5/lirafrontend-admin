import Ajax from "Utils/ajax";

export const generateFinalResponse  = (data) => Ajax.post('admin/generateFinalResponse ', data);
