import * as XLSX from 'xlsx';

// Define the shape of your data
interface User {
  id: string;
  token: number;
  tkt_no: string;
  from_state_name: string;
  to_state_name: string;
  from_city_name: string;
  to_city_name: string;
  bdate: string;
  jdate: string;
  print_final_total_amount: number;
  final_total_amount: number;
  added_by_name: string;
  name: string;
  mobile_no: string;
  cmp_mobile: string;
  bus_type: string;
  bus_name: string;
  payment_method: string;
  bus_no: string;
  st_no: string;
  sI_no: string;
  ticket_actual_total: number;
  boarding: string;
  rep_time: string;
  remarks: string;
  slr: number;
  st: number;
  ex: number;
  cmp_name: string;
  ex_rate: number;
  slr_rate: number;
  st_rate: number;
  paid_amount: number;
  remaining_amount: number;
  mobile: string;
}

export const exportToExcel = (data: User[]) => {
  // Format data for Excel
  const formattedData = data.map(row => ({
    'ID': row.id,
    'Token': row.token,
    'Ticket No': row.tkt_no,
    'From State': row.from_state_name,
    'To State': row.to_state_name,
    'From City': row.from_city_name,
    'To City': row.to_city_name,
    'Booking Date': row.bdate,
    'Journey Date': row.jdate,
    'Final Total Amount': row.final_total_amount,
    'Print Final Total Amount': row.print_final_total_amount,
    'Added By': row.added_by_name,
    'Name': row.name,
    'Mobile No': row.mobile_no,
    'Company Mobile': row.cmp_mobile,
    'Bus Type': row.bus_type,
    'Bus Name': row.bus_name,
    'Payment Method': row.payment_method,
    'Bus No': row.bus_no,
    'ST No': row.st_no,
    'SI No': row.sI_no,
    'Boarding': row.boarding,
    'Rep Time': row.rep_time,
    'Remarks': row.remarks,
    'SLR': row.slr,
    'ST': row.st,
    'EX': row.ex,
    'Company Name': row.cmp_name,
    'EX Rate': row.ex_rate,
    'SLR Rate': row.slr_rate,
    'ST Rate': row.st_rate,
    'Paid Amount': row.paid_amount,
    'Remaining Amount': row.remaining_amount,
    'Mobile': row.mobile
  }));

  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Create a new workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  // Save the file
  XLSX.writeFile(workbook, 'data.xlsx');
};
