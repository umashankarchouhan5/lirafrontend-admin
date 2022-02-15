import Ajax from "Utils/ajax";

export const uploadDoc = (data) => Ajax.post('webuser/DynamicStore', data);