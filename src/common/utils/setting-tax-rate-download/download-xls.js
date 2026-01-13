import * as XLSX from 'xlsx';
import downloadBlob from '../document-file-download/download-blob';

const handleDownloadXls = ({ data, module }) => {
  // Create an array to store the worksheet data
  const worksheetData = [['Tax Rate', 'Set as default']];

  data?.forEach((item) => {
    const rowDataHeader = [item?.taxRate, item?.defaultTaxRate];

    // Include an empty row for offers with no partial payments
    const emptyRow = [...rowDataHeader, '', '', '', ''];
    worksheetData.push(emptyRow);
  });

  const ws = XLSX.utils.json_to_sheet(worksheetData, { skipHeader: true });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  function execelData(data) {
    const buffer = new ArrayBuffer(data.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < data.length; i++) {
      view[i] = data.charCodeAt(i) & 0xff;
    }
    return buffer;
  }

  // Create a Blob from the Excel data
  const blob = new Blob(
    [execelData(XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }))],
    {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  );

  downloadBlob(blob, `${module}.xlsx`, 'XLS');
};

export default handleDownloadXls;
