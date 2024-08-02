import * as XLSX from 'xlsx';

// Define the shape of your data
interface User {
  tkt_no: string;
  name: string;
  from_state_name: string;
  from_city_name: string;
  to_state_name: string;
  to_city_name: string;
  bdate: string;
  jdate: string;
  final_total_amount: number;
  print_final_total_amount: number;
  added_by_name: string;
}

export const exportToExcel = (data: User[]) => {
  // Format data for Excel
  const formattedData = data.map(row => ({
    'Receipt No': row.tkt_no,
    'Customer Name': row.name,
    'From': `${row.from_state_name}, ${row.from_city_name}`,
    'To': `${row.to_state_name}, ${row.to_city_name}`,
    'Booking Date': row.bdate,
    'Journey Date': row.jdate,
    'Amount': row.final_total_amount,
    'Print Amount': row.print_final_total_amount,
    'Added By': row.added_by_name,
  }));

  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Create a new workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  // Save the file
  XLSX.writeFile(workbook, 'data.xlsx');
};
