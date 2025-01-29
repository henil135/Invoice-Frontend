import React from "react";
import { Route, Router, Routes } from "react-router-dom";
import { DashBoard } from "./DashBoard/DashBoard";
import CustomerTable from "./Customer/CustomerTable";
import CustomerForm from "./Customer/CustomerForm";
import CustomerView from "./Customer/CustomerView";

import CreditForm from "./CreditNote/CreditForm";
import CreditView from "./CreditNote/CreditView";
import PaymentPage from "./PaymentPage/PaymentPage";
import ViewPaymentPage from "./PaymentPage/ViewPaymentPage";
import { ProfilePage } from "./Profile/ProfilePage";
import { ProfileDashboard } from "../ProfileDashboard";
import ChangePassword from "./Profile/ChangePassword";
import Expenses from "./Expenses/Expenses";
import ExpenseForm from "./Expenses/ExpenseForm";
import ViewExpense from "./Expenses/ViewExpense";
import { Items } from "./Item/Items";
import { ItemsDetails } from "./Item/ItemsDetails";
import { ItemForm } from "./Item/ItemForm";
import Invoice from "./Invoice/Invoice";
import InvoiceForm from "./Invoice/InvoiceForm";
import ViewInvoice from "./Invoice/ViewInvoice";
import { PurchaseInvoice } from "./Item/PurchaseInvoice";
import { PurchaseForm } from "./Item/PurchaseForm";
import { PurchaseView } from "./Item/PurchaseView";
import Templete1 from "./Invoice/Templete1";
import { ReportingAndAnalytics } from "./Reporting And Analytics/ReportingAndAnalytics";
import BusinessInformationForm from "../../components/BussinessInfomration";
import { TermsandCondition } from "./Profile/TermsandCondition";
import Invoicetemplet from "./Invoice/Invoicetemplet";
import Template3 from "./Invoice/Templete3";
import Template2 from "./Invoice/Templete2";
import CreditTable from "./CreditNote/CreditTable";
import { Complain } from "./Complain/Complain";
import { ItemReport } from "./Item/ItemReport";
import InvoiceReport from "./Invoice/InvoiceReport";
import ViewItemReport from "./Item/ViewItemReport";
import ViewItemReportByAmount from "./Item/ViewItemReportByamount";



export const UserPanel = () => {
  return (
    <Routes>
      <Route path="/" element={<DashBoard />} />
      <Route path="/customers" element={<CustomerTable />} />
      <Route path="/customers/customer-form" element={<CustomerForm />} />
      <Route path="/customers/customer-form/:id" element={<CustomerForm />} />
      <Route path="/customers/view/:id" element={<CustomerView />} />
      <Route path="/credits" element={<CreditTable />} />
      <Route path="/credits/credit-form" element={<CreditForm />} />
      <Route path="/credits/credit-form/:id" element={<CreditForm />} />
      <Route path="/credits/view/:id" element={<CreditView />} />
      <Route path="/payment-requests" element={<PaymentPage />} />
      <Route path="/view-payment/:id" element={<ViewPaymentPage />} />
      <Route path="/userprofilepage" element={<ProfilePage />}>
        <Route index path="" element={<ProfileDashboard />} />
        <Route index path="chngepasword" element={<ChangePassword />} />
        <Route
          index
          path="businessInformation"
          element={<BusinessInformationForm />}
        />
        <Route
          index
          path="TermsAndConditions"
          element={<TermsandCondition />}
        />
      </Route>
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/expenses/expense-form" element={<ExpenseForm />} />
      <Route path="/expenses/expense-form/:id" element={<ExpenseForm />} />
      <Route path="/expenses/viewexpense/:id" element={<ViewExpense />} />
      <Route path="/items" element={<Items />} />
      <Route path="/itemsDetails/:id" element={<ItemsDetails />} />
      <Route path="/itemsForm" element={<ItemForm />} />
      <Route path="/itemsForm/:id" element={<ItemForm />} />
      <Route path="/itemreport" element={<ItemReport />} />
      <Route path="/viewitemreport/:id" element={< ViewItemReport/>} />
      <Route path="/viewitemreportbyamount" element={<ViewItemReportByAmount/>}/>
      <Route path="/invoice" element={<Invoice />} />
      <Route path="/invoiceForm" element={<InvoiceForm />} />
      <Route path="/invoiceForm/:id" element={<InvoiceForm />} />
      <Route path="/view-invoice/:id" element={<ViewInvoice />} />
      <Route path="/purchaseinvoice" element={<PurchaseInvoice />} />
      <Route path="/purchaseForm" element={<PurchaseForm />} />
      <Route path="/purchaseForm/:id" element={<PurchaseForm />} />
      <Route path="/purchaseView/:id" element={<PurchaseView />} />
      <Route path="/invoicereport" element={<InvoiceReport/>}/>
      <Route path="/templete3" element={<Template3 />} />
      <Route path="/templete2" element={<Template2 />} />
      <Route path="/templete1" element={<Templete1 />} />
      <Route path="/invoicetemp" element={<Invoicetemplet />} />
      <Route path="/complain" element={<Complain />} />
      <Route path="/reportsandanalytics" element={<ReportingAndAnalytics />} />
    </Routes>
  );
};
