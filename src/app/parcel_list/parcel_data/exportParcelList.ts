import * as XLSX from 'xlsx';

// Define the shape of the data used for Excel
interface User {
  id: string;
  token: any;
  receipt_no: string;
  from_state_name: string;
  to_state_name: string;
  from_city_name: string;
  to_city_name: string;
  sender_name: string;
  rec_name: string;
  dispatch_date: string;
  added_by_name: string;
  booking_date: string;
  payment_method: string;
  send_add: string;
  send_mob: string;
  rec_add: string;
  rec_mob: string;
  particulars: string;
  sender_proof_type: string;
  reciver_proof_type: string;
  sender_proof_detail: string;
  reciver_proof_detail: string;
  pic_charge: number;
  dis_charge: number;
  total_print_rate: string;
  actual_total: string;
  print_total: string;
  gst_amount: string;
  print_gst_amount: string;
  bilty_charge: number;
  is_demurrage: boolean;
  actual_payable_amount: number;
  print_payable_amount: number;
  lr_no: number;
  print_paid_amount: number;
  actual_bal_amount: number;
  print_bal_amount: number;
  total_demurrage_charges: number;
  demurrage_days: number;
  demurrage_charges: number;
  bill_detail: { e_way_bill_no: string; p_o_no: string; invoice_no: string; invoice_amount: string }[];
  parcel_detail: {
    parcel_type: string;
    weight: number;
    qty: number;
    rate: number;
    total_amount: number;
    print_rate: number;
    total_print_rate: number;
    QTYtotal: number;
  }[];
}

export const exportParcelToExcel = (data: User[]) => {
  // Format data for Excel
  const formattedData = data.map(row => ({
    'ID': row.id,
    'Token': row.token,
    'Receipt No': row.receipt_no,
    'From State': row.from_state_name,
    'To State': row.to_state_name,
    'From City': row.from_city_name,
    'To City': row.to_city_name,
    'Sender Name': row.sender_name,
    'Receiver Name': row.rec_name,
    'Dispatch Date': row.dispatch_date,
    'Added By': row.added_by_name,
    'Booking Date': row.booking_date,
    'Payment Method': row.payment_method,
    'Sender Address': row.send_add,
    'Sender Mobile': row.send_mob,
    'Receiver Address': row.rec_add,
    'Receiver Mobile': row.rec_mob,
    'Particulars': row.particulars,
    'Sender Proof Type': row.sender_proof_type,
    'Receiver Proof Type': row.reciver_proof_type,
    'Sender Proof Detail': row.sender_proof_detail,
    'Receiver Proof Detail': row.reciver_proof_detail,
    'Pic Charge': row.pic_charge,
    'Discount Charge': row.dis_charge,
    'Total Print Rate': row.total_print_rate,
    'Actual Total': row.actual_total,
    'Print Total': row.print_total,
    'GST Amount': row.gst_amount,
    'Print GST Amount': row.print_gst_amount,
    'Bilty Charge': row.bilty_charge,
    'Demurrage': row.is_demurrage ? 'Yes' : 'No',
    'Actual Payable Amount': row.actual_payable_amount,
    'Print Payable Amount': row.print_payable_amount,
    'LR No': row.lr_no,
    'Print Paid Amount': row.print_paid_amount,
    'Actual Balance Amount': row.actual_bal_amount,
    'Print Balance Amount': row.print_bal_amount,
    'Total Demurrage Charges': row.total_demurrage_charges,
    'Demurrage Days': row.demurrage_days,
    'Demurrage Charges': row.demurrage_charges
  }));

  // Create a new workbook and add the formatted data
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Parcel Booking List');
  
  // Save the Excel file
  XLSX.writeFile(workbook, 'parcel_booking_list.xlsx');
};
