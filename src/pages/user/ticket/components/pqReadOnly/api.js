
import Ajax from "Utils/ajax";

export const getTicketData = (data) => Ajax.post('pqform/getPQFormData ', data);