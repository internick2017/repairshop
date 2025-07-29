export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: { key: string; header: string }[]
) {
  if (data.length === 0) return;

  // Get headers
  let headers: string[];
  let keys: string[];

  if (columns) {
    headers = columns.map(col => col.header);
    keys = columns.map(col => col.key);
  } else {
    // Use all keys from the first object
    keys = Object.keys(data[0]);
    headers = keys;
  }

  // Create CSV content
  const csvContent = [
    // Headers
    headers.map(h => `"${h}"`).join(','),
    // Data rows
    ...data.map(row => 
      keys.map(key => {
        const value = row[key];
        if (value === null || value === undefined) return '""';
        if (typeof value === 'object') return `"${JSON.stringify(value)}"`;
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON<T extends Record<string, unknown>>(
  data: T[],
  filename: string
) {
  const jsonContent = JSON.stringify(data, null, 2);
  
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: { key: string; header: string }[]
) {
  // For now, we'll export as CSV with .xls extension
  // For true Excel export, you'd need a library like xlsx
  if (data.length === 0) return;

  // Get headers
  let headers: string[];
  let keys: string[];

  if (columns) {
    headers = columns.map(col => col.header);
    keys = columns.map(col => col.key);
  } else {
    keys = Object.keys(data[0]);
    headers = keys;
  }

  // Create TSV content (Tab-separated values work better with Excel)
  const tsvContent = [
    // Headers
    headers.join('\t'),
    // Data rows
    ...data.map(row => 
      keys.map(key => {
        const value = row[key];
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value).replace(/\t/g, ' ');
      }).join('\t')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob(['\ufeff' + tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.xls`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}