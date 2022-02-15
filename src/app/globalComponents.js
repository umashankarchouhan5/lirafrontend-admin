import Vue from "vue";

import InputText from "Components/form/InputText";
import Loader from "Components/layout/Loader";
import InputTextArea from "Components/form/InputTextArea";
import InputFile from "Components/form/InputFile";
import InputMonth from 'Components/form/FormMonth';
import FormButton from "Components/form/FormButton";
import TableButton from "Components/form/TableButton";
import ButtonGroup from "Components/form/ButtonGroup";
import FormSelect from "Components/form/FormSelect";
import FormRow from "Components/form/FormRow";
import Popup from "Components/modal/Popup";
import FormCheckbox from "Components/form/FormCheckbox";
import RecordItem from "Components/layout/RecordItem";
import CenterBlock from "Components/layout/CenterBlock";
import YearSelect from "Components/YearSelect";
import InputAmount from "Components/form/InputAmount";
import FormYesNo from "Components/form/FormYesNo";
import InputYesNo from "Components/form/InputYesNo";
import TicketHeader from "Components/layout/TicketHeader";
import Toast from "Components/toast/Toast";
import SearchCompanyNew from "Components/companySearchRemastered/CompanySearchNew";
import EditorComponent from "Components/editor";
import Calendar from "Components/calendar";
import Histogram from "Components/charts/Histogram";
import LineChart from "Components/charts/LineChart";
import LineChartApex from "Components/charts/LineChartApex";
import ColumnChart from "Components/charts/ColumnChart";
import ErrorMessage from "Components/ErrorMessage";

import { Icon } from 'view-design'

Vue.component("Icon", Icon);
Vue.component("FormCheckbox", FormCheckbox);
Vue.component("RecordItem", RecordItem);
Vue.component("InputText", InputText);
Vue.component("InputTextArea", InputTextArea);
Vue.component("InputFile", InputFile);
Vue.component("InputMonth", InputMonth);
Vue.component("Popup", Popup);
Vue.component("FormButton", FormButton);
Vue.component("FormSelect", FormSelect);
Vue.component("TableButton", TableButton);
Vue.component("FormRow", FormRow);
Vue.component("ButtonGroup", ButtonGroup);
Vue.component("CenterBlock", CenterBlock);
Vue.component("Loader", Loader);
Vue.component("YearSelect", YearSelect);
Vue.component("InputAmount", InputAmount);
Vue.component("FormYesNo", FormYesNo);
Vue.component("InputYesNo", InputYesNo);
Vue.component("TicketHeader", TicketHeader);
Vue.component("Toast", Toast);
Vue.component("SearchCompanyNew", SearchCompanyNew);
Vue.component("EditorComponent", EditorComponent);
Vue.component("CalendarView", Calendar);
Vue.component("Histogram", Histogram);
Vue.component("LineChart", LineChart);
Vue.component("ColumnChart", ColumnChart);
Vue.component("LineChartApex", LineChartApex);
Vue.component("ErrorMessage", ErrorMessage);
