export default [
    {
        path: "/dashboard1",
        name: "dashboard",
        meta: {
            title: "Dashboard",
            auth: true,
        },
        component: () => import("../../pages/user/dashboard"),
    },
    {
        path: "/tasks",
        name: "tasks",
        meta: {
            title: "Tasks",
            auth: true,
        },
        component: () => import("../../pages/user/tasks"),
    },
    {
        path: "/tasks/:process/:subProcess",
        name: "tasks incorporation",
        meta: {
            title: "Tasks Incorporation",
            auth: true,
        },
        component: () => import("../../pages/user/tasks"),
    },
    {
        path: "/tasks/:id",
        name: "task",
        meta: {
            title: "Tasks",
            auth: true,
        },
        component: () => import("../../pages/user/ticket"),
    },
    {
        path: "/tasks/:ticketReference/finalDecision/:signee_id",
        name: "tasksFinalDecision",
        meta: {
            title: "Final Decision",
            auth: true,
        },
        component: () => import("../../pages/user/finalDecisionView"),
    },
    {
        path: "/DocumentMasters",
        name: "DocumentMasters",
        meta: {
            title: "Document Masters",
            auth: true,
        },
        component: () => import("../../pages/user/documentMasters/List"),
    },
    {
        path: "/DocumentMasters/add",
        name: "Add Document Master",
        meta: {
            title: "Add Document Master",
            auth: true,
        },
        component: () => import("../../pages/user/documentMasters/Single"),
    },
    {
        path: "/DocumentMasters/:mode/:id",
        name: "Update Document Master",
        meta: {
            title: "Update Document Masters",
            auth: true,
        },
        component: () => import("../../pages/user/documentMasters/Single"),
    },
    {
        path: "/Users",
        name: "Users",
        meta: {
            title: "User Management",
            auth: true,
        },
        component: () => import("../../pages/user/users/List"),
    },
    {
        path: "/Users/add",
        name: "AddUsers",
        meta: {
            title: "Add User",
            auth: true,
        },
        component: () => import("../../pages/user/users/Single"),
    },
    {
        path: "/Users/:mode/:id",
        name: "UsersMode",
        meta: {
            title: "Update User",
            auth: true,
        },
        component: () => import("../../pages/user/users/Single"),
    },
    {
        path: "/correspondence",
        name: "Correspondence",
        meta: {
            title: "Correspondence List",
            auth: true,
        },
        component: () => import("../../pages/user/correspondence/List"),
    },
    {
        path: "/correspondence/:entityReg/:company_id",
        name: "CorrespondenceById",
        meta: {
            title: "Correspondence List",
            auth: true,
        },
        component: () => import("../../pages/user/correspondence/List"),
    },
    {
        path: "/etemplates",
        name: "EmailTemplates",
        meta: {
            title: "Email Templates List",
            auth: true,
        },
        component: () => import("../../pages/user/emailTemplates/List"),
    },
    {
        path: "/etemplates/add",
        name: "AddEmailTemplate",
        meta: {
            title: "Email Template",
            auth: true,
        },
        component: () => import("../../pages/user/emailTemplates/Single"),
    },
    {
        path: "/etemplates/:mode/:id",
        name: "SingleEmailTemplate",
        meta: {
            title: "Email Template",
            auth: true,
        },
        component: () => import("../../pages/user/emailTemplates/Single"),
    },
    {
        path: "/printqueue",
        name: "PrintQueue",
        meta: {
            title: "Print Queue",
            auth: true,
        },
        component: () => import("../../pages/user/printqueue/List"),
    },
    
    {
        path: "/certificates",
        name: "Certificated",
        meta: {
            title: "Certificates",
            auth: true,
        },
        component: () => import("../../pages/user/masters/certificates/List"),
    },
    {
        path: "/certificates/add",
        name: "Certificate Add",
        meta: {
            title: "Certificate Add",
            auth: true,
        },
        component: () => import("../../pages/user/masters/certificates/Single"),
    },
    {
        path: "/certificates/:mode/:id",
        name: "Certificate Action",
        meta: {
            title: "Certificate Action",
            auth: true,
        },
        component: () => import("../../pages/user/masters/certificates/Single"),
    },
    {
        path: "/subTask/:ticket/:reference",
        name: "SubTask",
        meta: {
            title: "Sub Tasks",
            auth: true,
        },
        component: () => import("../../pages/user/subTask"),
    },
    
    {
        path: "/company",
        name: "Company",
        meta: {
            title: "Company List",
            auth: true,
        },
        component: () => import("../../pages/user/company/List"),
    },
    {
        path: "/company/companyLog/:id",
        name: "CompanyLogTemplate",
        meta: {
            title: "View Company Log",
            auth: true,
        },
        component: () => import("../../pages/user/company/Log/Log.vue"),
    },
    {
        path: "/company/companyDirectors/:id",
        name: "CompanyDiretorsTemplate",
        meta: {
            title: "View Company Directors",
            auth: true,
        },
        component: () => import("../../pages/user/company/Directors/Directors.vue"),
    },
    {
        path: "/company/compliance/:id",
        name: "CompanyComplianceTemplate",
        meta: {
            title: "View Company Compliances",
            auth: true,
        },
        component: () => import("../../pages/user/company/Compliance/Compliances.vue"),
    },
    {
        path: "/company/compliance/dossier/:id",
        name: "CompanyComplianceFromDossier",
        meta: {
            title: "Company Compliances",
            auth: true,
        },
        component: () => import("../../pages/user/company/Compliance/Compliances.vue"),
    },
    {
        path: "/company/compliance/add/:company_id",
        name: "CompanyComplianceAdd",
        meta: {
            title: "Add Company Compliance",
            auth: true,
        },
        component: () => import("../../pages/user/company/Compliance/Save.vue"),
    },
    {
        path: "/company/compliance/edit/:company_id/:id",
        name: "CompanyComplianceEdit",
        meta: {
            title: "Edit Company Compliance",
            auth: true,
        },
        component: () => import("../../pages/user/company/Compliance/Save.vue"),
    },
    {
        path: "/documents",
        name: "Documents",
        meta: {
            title: "View Company Documents",
            auth: true,
        },
        props: true,
        component: () => import("../../pages/user/documents/List"),
    },
    {
        path: "/documents/:entity/:entityReg/:company_id",
        name: "DocumentsById",
        meta: {
            title: "View Company Documents",
            auth: true,
        },
        props: true,
        component: () => import("../../pages/user/documents/List"),
    },
    {
        path: "/documents/add/:type",
        name: "DocumentsAdd",
        meta: {
            title: "Add Documents",
            auth: true,
        },
        props: true,
        component: () => import("../../pages/user/documents/uploadsNew"),
    },
    {
        path: "/rra",
        name: "RRA",
        meta: {
            title: "Resignation as RA report",
            auth: true,
        },
        component: () => import("../../pages/user/rraReports/List"),
    },
    
    {
        path: "/documentUpload",
        name: "DocumentUploads",
        meta: {
            title: "Document Uploads",
            auth: true,
        },
        component: () => import("../../pages/user/documents/uploads"),
    },
    
    {
        path: "/holidays",
        name: "Holidays",
        meta: {
            title: "Holidays",
            auth: true,
        },
        component: () => import("../../pages/user/holidays"),
    },

    {
        path: "/complaint",
        name: "Complaint",
        meta: {
            title: "Complaint",
            auth: true,
        },
        component: () => import("../../pages/user/complaint/List"),
    },
    {
        path: "/complaintForm",
        name: "ComplaintForm",
        meta: {
            title: "Complaint Form",
            auth: true,
        },
        component: () => import("../../pages/user/complaint/Single"),
    },
    {
        path: "/complaintForm/:id",
        name: "EditComplaintForm",
        meta: {
            title: "Edit Complaint Form",
            auth: true,
        },
        component: () => import("../../pages/user/complaint/Single"),
    },
    {
        path: "/complaintView/:id",
        name: "complaintView",
        meta: {
            title: "Complaint View",
            auth: true,
        },
        component: () => import("../../pages/user/complaint/Single/ViewComplaint"),

    },
    {
        path: "/riskMatrix",
        name: "RiskMatrix",
        meta: {
            title: "Risk Matrix",
            auth: true,
        },
        component: () => import("../../pages/user/riskMatrix"),
    },
    {
        path: "/riskMatrixByID/:id",
        name: "RiskMatrixByID",
        meta: {
            title: "Risk Matrix By ID",
            auth: true,
        },
        component: () => import("../../pages/user/riskMatrix/RiskMatrixForm"),
    },
    {
        path: "/roleMaster",
        name: "RoleMaster",
        meta: {
            title: "Role Master",
            auth: true,
        },
        component: () => import("../../pages/user/masters/roleMaster/List"),
    },
    {
        path: "/menuMaster",
        name: "AdminMenuMaster",
        meta: {
            title: "Admin Menu Master",
            auth: true,
        },
        component: () => import("../../pages/user/masters/adminMenuMaster/List"),
    },
    {
        path: "/nameReservation",
        name: "NameReservation",
        meta: {
            title: "Name Reservation Batch Listing",
            auth: true,
        },
        component: () => import("../../pages/user/nameReservation/BatchListing"),
    },
    {
        path: "/nameReservation/batch/:batchId",
        name: "NameReservationByBatch",
        meta: {
            title: "Name Reservation",
            auth: true,
        },
        component: () => import("../../pages/user/nameReservation/NamesListing"),
    },
    {
        path: "/nameTransfer",
        name: "NameTransfer",
        meta: {
            title: "Name Transfer",
            auth: true,
        },
        component: () => import("../../pages/user/nameReservation/NameTransfer"),
    },
    {
        path: "/AllotRegNo",
        name: "AllotRegNo",
        meta: {
            title: "Allot IBC Registration Number",
            auth: true,
        },
        component: () => import("../../pages/user/allotUnique/List"),
    },
    {
        path: "/notifications",
        name: "Notifications",
        meta: {
            title: "Notifications",
            auth: true,
        },
        component: () => import("../../pages/user/notification"),

    },
    
    {
        path: "/formEditor/:process_id",
        name: "FormEditor",
        meta: {
            title: "Form Editor",
            auth: true,
        },
        component: () => import("../../pages/user/formBuilder/Editor"),

    },
    {
        path: "/formBuilder",
        name: "FormBuilder",
        meta: {
            title: "Form Builder",
            auth: true,
        },
        component: () => import("../../pages/user/formBuilder/List1"),

    },
    {
        path: "/complaintRegister",
        name: "ComplaintRegister",
        meta: {
            title: "Complaint Register",
            auth: true,
        },
        component: () => import("../../pages/user/complaintRegister"),

    },
    
    {
        path: "/portfolio",
        name: "Portfolio",
        meta: {
            title: "Portfolio",
            auth: true,
        },
        component: () => import("../../pages/user/portfolios/portfolio/List"),
    },
    
    {
        path: "/changePassword",
        name: "Change Password",
        meta: {
            title: "Change Password",
            auth: true,
        },
        component: () => import("../../pages/user/changePassword"),
    },
    
    {
        path: "/licenseeList",
        name: "LicenseeList",
        meta: {
            title: "LicenseeList",
            auth: true,
        },
        component: () => import("../../pages/user/licenseeList/List"),
    },
    {
        path: "/dossier",
        name: "DossierReport",
        meta: {
            title: "Dossier Report",
            auth: true,
        },
        component: () => import("../../pages/user/dossierReport/List"),
    },
    {
        path: "/dossier/:licenseType/:CompanyRegNo/:id",
        name: "DossierReportByID",
        meta: {
            title: "Dossier Report",
            auth: true,
        },
        component: () => import("../../pages/user/dossierReport/List"),
    },
    {
        path: "/PQReport",
        name: "PQReport",
        meta: {
            title: "PQ Report",
            auth: true,
        },
        component: () => import("../../pages/user/pqReport/List"),
    },
    {
        path: "/PQReport/:company_id",
        name: "PQReportByCompany",
        meta: {
            title: "PQ Report",
            auth: true,
        },
        component: () => import("../../pages/user/pqReport/List"),
    },
    
    {
        path: "/inspection",
        name: "Inspection",
        meta: {
            title: "Inspection",
            auth: true,
        },
        component: () => import("../../pages/user/inspection/List"),
    },
    {
        path: "/inspectionForm",
        name: "InspectionForm",
        meta: {
            title: "Inspection Form",
            auth: true,
        },
        component: () => import("../../pages/user/inspection/Form"),
    },
    {
        path: "/inspectionForm/:id",
        name: "InspectionFormByID",
        meta: {
            title: "Inspection Form",
            auth: true,
        },
        component: () => import("../../pages/user/inspection/Form"),
    },
    {
        path: "/viewInspectionForm/:id",
        name: "ViewInspectionFormByID",
        meta: {
            title: "View Inspection Form",
            auth: true,
        },
        component: () => import("../../pages/user/inspection/Form"),
    },
    {
        path: "/recordOutcome/:id",
        name: "RecordOutcomeList",
        meta: {
            title: "Record Outcome",
            auth: true,
        },
        component: () => import("../../pages/user/inspection/recordOutcome/List"),
    },
    
    {
        path: "/recordOutcome/single/:id/:company_id",
        name: "RecordOutcomeForm",
        meta: {
            title: "Record Outcome",
            auth: true,
        },
        component: () => import("../../pages/user/inspection/recordOutcome/RecordForm"),
    },
    {
        path: "/recordOutcome/multi/:id",
        name: "RecordOutcomeFormMultiple",
        meta: {
            title: "Record Outcome",
            auth: true,
        },
        component: () => import("../../pages/user/inspection/recordOutcome/RecordForm"),
    },
    
    {
        path: "/reinspectionList/:id",
        name: "ReinspectionList",
        meta: {
            title: "Record Outcome Reinspection",
            auth: true,
        },
        component: () => import("../../pages/user/inspection/recordOutcome/List"),
    },
    {
        path: "/reinspectionOutcome/single/:id/:company_id",
        name: "ReinspectionOutcomeForm",
        meta: {
            title: "Reinspection Outcome",
            auth: true,
        },
        component: () => import("../../pages/user/inspection/recordOutcome/RecordForm"),
    },
    {
        path: "/announcement/:inspection_id",
        name: "Announcement",
        meta: {
            title: "Announcement",
            auth: true,
        },
        component: () => import("../../pages/user/inspection/Announcement"),
    },
    {
        path: "/penalty/:inspection_id",
        name: "Penalty",
        meta: {
            title: "Penalty",
            auth: true,
        },
        component: () => import("../../pages/user/inspection/Penalty"),
    },
    {
        path: "/generateSample",
        name: "GenerateSample",
        meta: {
            title: "Generate Sample",
            auth: true,
        },
        component: () => import("../../pages/user/inspection/GenerateSample"),
    },
    {
        path: "/govtEntity",
        name: "Govt Entity",
        meta: {
            title: "Govt Entity",
            auth: true,
        },
        component: () => import("../../pages/user/govtEntities/govtEntity/List"),
    },
    {
        path: "/govtEntityCreation",
        name: "Govt Entity Creation",
        meta: {
            title: "Govt Entity",
            auth: true,
        },
        component: () => import("../../pages/user/govtEntities/govtEntity/Single"),
    },
    {
        path: "/govtEntityUpdate/:id",
        name: 'GovtEntityUpdate',
        meta: {
            title: 'Govt Entity Update',
            auth: true      
        },
        component: () => import("../../pages/user/govtEntities/govtEntity/Single"),
    },
    {
        path: "/govtEntityUsers/:entity_id",
        name: "Govt Entity Users",
        meta: {
            title: "Govt Entity Users",
            auth: true,
        },
        component: () => import("../../pages/user/govtEntities/govtUsers/List"),
    },
    {
        path: "/govtEntityUserCreation/:entity_id",
        name: "Entity User Creation",
        meta: {
            title: "Entity User Creation",
            auth: true,
        },
        component: () => import("../../pages/user/govtEntities/govtUsers/Single"),
    },
    
    {
        path: "/govtEntityUserUpdate/:entity_id/:id",
        name: "Entity User Edit",
        meta: {
            title: "Entity User Edit",
            auth: true,
        },
        component: () => import("../../pages/user/govtEntities/govtUsers/Single"),
    },
    {
        path: "/intlClients",
        name: "International Clients",
        meta: {
            title: "International Clients",
            auth: true,
        },
        component: () => import("../../pages/user/internationalClients/clients/List"),
    },
    {
        path: "/intlClientCreation",
        name: "Internation Client Creation",
        meta: {
            title: "International Client",
            auth: true,
        },
        component: () => import("../../pages/user/internationalClients/clients/Single"),
    },
    {
        path: "/intlClientUpdate/:id",
        name: 'IntlClientUpdate',
        meta: {
            title: 'International Client Update',
            auth: true      
        },
        component: () => import("../../pages/user/internationalClients/clients/Single"),
    },
    {
        path: "/intlClientUsers/:client_id",
        name: "International Client Users",
        meta: {
            title: "International Client Users",
            auth: true,
        },
        component: () => import("../../pages/user/internationalClients/clientUsers/List"),
    },
    {
        path: "/intlClientUserCreation/:client_id",
        name: "Client User Creation",
        meta: {
            title: "Client User Creation",
            auth: true,
        },
        component: () => import("../../pages/user/internationalClients/clientUsers/Single"),
    },
    {
        path: "/intlClientUserUpdate/:client_id/:id",
        name: "Client User Edit",
        meta: {
            title: "Client User Edit",
            auth: true,
        },
        component: () => import("../../pages/user/internationalClients/clientUsers/Single"),
    },
    {
        path: "/clientBalances",
        name: "ClientBalances",
        meta: {
            title: "Client Balances",
            auth: true,
        },
        component: () => import("../../pages/user/clientBalances/List"),
    },
    {
        path: "/clientLedger/:walletCode",
        name: "ClientLedger",
        meta: {
            title: "Client Ledger",
            auth: true,
        },
        component: () => import("../../pages/user/clientBalances/ClientLedger"),
    },
    {
        path: "/directive",
        name: "Directive",
        meta: {
            title: "Directive",
            auth: true,
        },
        component: () => import("../../pages/user/enforcement/List"),
    },
    {
        path: "/directiveForm/:processId",
        name: "DirectiveForm",
        meta: {
            title: "Directive Form",
            auth: true,
        },
        component: () => import("../../pages/user/enforcement/Form"),
    },
    {
        path: "/directiveForm/:processId/:id",
        name: "DirectiveFormByID",
        meta: {
            title: "Directive Form",
            auth: true,
        },
        component: () => import("../../pages/user/enforcement/Form"),
    },
    {
        path: "/directiveFormFollowup/:processId/:id",
        name: "DirectiveFormFollowUpByID",
        meta: {
            title: "Directive Form",
            auth: true,
        },
        component: () => import("../../pages/user/enforcement/Form"),
    },
    {
        path: "/query",
        name: "Query",
        meta: {
            title: "Query",
            auth: true,
        },
        component: () => import("../../pages/user/query"),
    },
    {
        path: "/suspension",
        name: "Suspension",
        meta: {
            title: "Suspension List",
            auth: true,
        },
        component: () => import("../../pages/user/cessation/List"),
    },
    {
        path: "/suspension/:processId",
        name: "suspension",
        meta: {
            title: "Suspension Request",
            auth: true,
        },
        component: () => import("../../pages/user/cessation/Form"),
    },
    {
        path: "/strikeOff",
        name: "StrikeOff",
        meta: {
            title: "Strike Off",
            auth: true,
        },
        component: () => import("../../pages/user/strikeOff/List"),
    },
    {
        path: "/strikeOffForm",
        name: "StrikeOffForm",
        meta: {
            title: "Strike Off",
            auth: true,
        },
        component: () => import("../../pages/user/strikeOff/StrikeOff"),
    },
    {
        path: "/strikeOff/:id",
        name: "StrikeOffEdit",
        meta: {
            title: "Strike Off Edit",
            auth: true,
        },
        component: () => import("../../pages/user/strikeOff/StrikeOff"),
    },
    {
        path: "/invoices",
        name: "invoices",
        meta: {
            title: "Invoice",
            auth: true,
        },
        component: () => import("../../pages/user/invoice/List"),
    },
    {
        path: "/receipts",
        name: "receipts",
        meta: {
            title: "Receipt",
            auth: true,
        },
        component: () => import("../../pages/user/receipt/List"),
    },
    {
        path: "/userActivity",
        name: "useractivity",
        meta: {
            title: "User Activity",
            auth: true,
        },
        component: () => import("../../pages/user/userActivity/List"),
    },
    {
        path: "/adminActivity",
        name: "adminactivity",
        meta: {
            title: "Admin Activity",
            auth: true,
        },
        component: () => import("../../pages/user/adminActivity/List"),
    },
    {
        path: "/notice",
        name: "Notice",
        meta: {
            title: "Notice",
            auth: true,
        },
        component: () => import("../../pages/user/notice/List"),
    },
    {
        path: "/noticeForm",
        name: "NoticeForm",
        meta: {
            title: "Notice Form",
            auth: true,
        },
        component: () => import("../../pages/user/notice/Form"),
    },
    {
        path: "/monthlyConversions",
        name: "MonthlyConversions",
        meta: {
            title: "Monthly Conversions",
            auth: true,
        },
        component: () => import("../../pages/user/monthlyConversion/List"),
    },
    {
        path: "/addConversion",
        name: "AddConversion",
        meta: {
            title: "Add Conversion",
            auth: true,
        },
        component: () => import("../../pages/user/monthlyConversion/AddConversion"),
    },
    {
        path: "/editConversion/:date",
        name: "EditConversion",
        meta: {
            title: "Edit Conversion",
            auth: true,
        },
        component: () => import("../../pages/user/monthlyConversion/AddConversion"),
    },
    {
        path: "/nameReservationBatch",
        name: "NameReservationBatch",
        meta: {
            title: "Name Reservation Batch Response",
            auth: true,
        },
        component: () => import("../../pages/user/nameBatchListing"),
    },
    {
        path: "/directorsReport",
        name: "DirectorsReport",
        meta: {
            title: "Directors Report",
            auth: true,
        },
        component: () => import("../../pages/user/directorsReport"),
    },
    {
        path: "/jurisdictionMasters",
        name: "JurisdictionMasters",
        meta: {
            title: "Jurisdiction Masters",
            auth: true,
        },
        component: () => import("../../pages/user/jurisdictionMasters/List"),
    },
    {
        path: "/jurisdictionMasters/edit/:id",
        name: "JurisdictionMastersEdit",
        meta: {
            title: "Jurisdiction Masters",
            auth: true,
        },
        component: () => import("../../pages/user/jurisdictionMasters/Single"),
    },
    {
        path: "/jurisdictionMasters/add",
        name: "JurisdictionMastersAdd",
        meta: {
            title: "Jurisdiction Masters",
            auth: true,
        },
        component: () => import("../../pages/user/jurisdictionMasters/Single"),
    },
    {
        path: "/currencyMasters",
        name: "CurrencyMasters",
        meta: {
            title: "Currency Masters",
            auth: true,
        },
        component: () => import("../../pages/user/currencyMasters/List"),
    },
    {
        path: "/currencyMasters/edit/:code",
        name: "CurrencyMastersEdit",
        meta: {
            title: "Currency Masters",
            auth: true,
        },
        component: () => import("../../pages/user/currencyMasters/Single"),
    },
    {
        path: "/currencyMasters/add",
        name: "CurrencyMastersAdd",
        meta: {
            title: "Currency Masters",
            auth: true,
        },
        component: () => import("../../pages/user/currencyMasters/Single"),
    },
    {
        path: "/inspectionQuesMasters",
        name: "InspectionQuesMasters",
        meta: {
            title: "Inspection Question Masters",
            auth: true,
        },
        component: () => import("../../pages/user/inspectionQuesMasters/List"),
    },
    {
        path: "/inspectionQuesMasters/questions/:inspection_id",
        name: "QuesMasters",
        meta: {
            title: "Question Masters",
            auth: true,
        },
        component: () => import("../../pages/user/inspectionQuesMasters/Questions/List"),
    },
    {
        path: "/inspectionQuesMasters/questions/add/:inspection_id",
        name: "QuesMastersAdd",
        meta: {
            title: "Question Masters Add",
            auth: true,
        },
        component: () => import("../../pages/user/inspectionQuesMasters/Questions/Single"),
    },
    {
        path: "/inspectionQuesMasters/questions/edit/:inspection_id/:question_id",
        name: "QuesMastersEdit",
        meta: {
            title: "Question Masters edit",
            auth: true,
        },
        component: () => import("../../pages/user/inspectionQuesMasters/Questions/Single"),
    },
    {
        path: "/inspectionQuesMasters/add",
        name: "InspectionMastersAdd",
        meta: {
            title: "Inspection Masters Add",
            auth: true,
        },
        component: () => import("../../pages/user/inspectionQuesMasters/Single"),
    },
    {
        path: "/inspectionQuesMasters/edit/:inspection_id",
        name: "InspectionMastersEdit",
        meta: {
            title: "Inspection Masters Edit",
            auth: true,
        },
        component: () => import("../../pages/user/inspectionQuesMasters/Single"),
    },
    {
        path: "/reports",
        name: "Reports",
        meta: {
            title: "Reports",
            auth: true,
        },
        component: () => import("../../pages/user/reports"),
    },
    {
        path: "/INS001",
        name: "INS001",
        meta: {
            title: "INS001",
            auth: true,
        },
        component: () => import("../../pages/user/inspection/reports/INS001"),
    },
    {
        path: "/INS002",
        name: "INS002",
        meta: {
            title: "INS002",
            auth: true,
        },
        component: () => import("../../pages/user/inspection/reports/INS002"),
    },
    {
        path: "/insNC",
        name: "INS006",
        meta: {
            title: "INS006",
            auth: true,
        },
        component: () => import("../../pages/user/inspection/reports/INS006"),
    },
    {
        path: "/insNCPenalty",
        name: "INS007",
        meta: {
            title: "INS007",
            auth: true,
        },
        component: () => import("../../pages/user/inspection/reports/INS007"),
    },
    {
        path: "/AllStats",
        name: "AllStats",
        meta: {
            title: "All Statistics",
            auth: true,
        },
        component: () => import("../../pages/user/generalReports/AllStats"),
    },
    {
        path: "/companyCalendar",
        name: "CompanyCalendar",
        meta: {
            title: "Company Calendar",
            auth: true,
        },
        component: () => import("../../pages/user/companyCalendar/List"),
    },
    {
        path: "/companyCalendar/:company_id",
        name: "CompanyCalendarById",
        meta: {
            title: "Company Calendar",
            auth: true,
        },
        component: () => import("../../pages/user/companyCalendar/List"),
    },
    {
        path: "/licenseeUsers",
        name: "LicenseeUsers",
        meta: {
            title: "Licensee Users",
            auth: true,
        },
        component: () => import("../../pages/user/licenseeUsers/List"),
    },
    {
        path: "/blockUsers",
        name: "BlockUsers",
        meta: {
            title: "Licensee Users",
            auth: true,
        },
        component: () => import("../../pages/user/blockUser"),
    },
    {
        path: "/rfiRegister",
        name: "RFIRegister",
        meta: {
            title: "RFI Register",
            auth: true,
        },
        component: () => import("../../pages/user/rfiRegister"),
    },
    {
        path: "/generateInvoice",
        name: "GenerateInvoice",
        meta: {
            title: "Generate Invoice",
            auth: true,
        },
        component: () => import("../../pages/user/generateInvoices"),
    },
    
    {
        path: "/portfolioRules",
        name: "PortfolioRules",
        meta: {
            title: "Portfolio Rules",
            auth: true,
        },
        component: () => import("../../pages/user/portfolioNew/List"),
    },
    {
        path: "/portfolioCreate",
        name: "PortfolioCreateRule",
        meta: {
            title: "Portfolio Create Rule",
            auth: true,
        },
        component: () => import("../../pages/user/portfolioNew/Form"),
    },
    {
        path: "/portfolioEdit/:ID",
        name: "PortfolioEditRule",
        meta: {
            title: "Portfolio Edit Rule",
            auth: true,
        },
        component: () => import("../../pages/user/portfolioNew/Form"),
    },
    {
        path: "/notificationGroup",
        name: "NotificationGroup",
        meta: {
            title: "Notification Group",
            auth: true,
        },
        component: () => import("../../pages/user/notificationGroup/List"),
    },
    {
        path: "/notificationGroup/:mode",
        name: "NotificationGroupAdd",
        meta: {
            title: "Notification Group Add",
            auth: true,
        },
        component: () => import("../../pages/user/notificationGroup/Single"),
    },
    {
        path: "/notificationGroup/:mode/:id",
        name: "NotificationGroupMode",
        meta: {
            title: "Notification Group Mode",
            auth: true,
        },
        component: () => import("../../pages/user/notificationGroup/Single"),
    },
    {
        path: "/splitUtility",
        name: "SplitUtility",
        meta: {
            title: "Split Utility",
            auth: true,
        },
        component: () => import("../../pages/user/utility/split"),
    },
    {
        path: "/mergeUtility",
        name: "MergeUtility",
        meta: {
            title: "Merge Utility",
            auth: true,
        },
        component: () => import("../../pages/user/utility/merge"),
    },
    {
        path: "/stampUtility",
        name: "Stamp Utility",
        meta: {
            title: "Stamp Utility",
            auth: true,
        },
        component: () => import("../../pages/user/utility/stamping"),
    },
    {
        path: "/PdfUtility",
        name: "PDFUtility",
        meta: {
            title: "PDF Utility",
            auth: true,
        },
        component: () => import("../../pages/user/utility/pdfEditor"),
    },
    {
        path: "/requestedDocList",
        name: "RequestedDocList",
        meta: {
            title: "Requested Document",
            auth: true,
        },
        component: () => import("../../pages/user/requestedDocuments/List"),
    },
    
    {
        path: "/requestedDoc/:ticketReference",
        name: "RequestedDocByTicket",
        meta: {
            title: "Requested Documents",
            auth: true,
        },
        component: () => import("../../pages/user/requestedDocuments/RequestedDocs"),
    },
    
    {
        path: "/pdfToHtml",
        name: "PdfToHtml",
        meta: {
            title: "Pdf to Html",
            auth: true,
        },
        component: () => import("../../pages/user/utility/pdfToHtml/PdfToHtml"),
    },
    
    // {
    //     path: "/calendar",
    //     name: "Calendar",
    //     meta: {
    //         title: "Calendar",
    //         auth: true,
    //     },
    //     component: () => import("../../pages/user/calendar"),
    // },
];
