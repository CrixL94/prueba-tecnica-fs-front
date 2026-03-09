import React from "react";
import { DataTable as PrimeDataTable } from "primereact/datatable";
import type { DataTableProps as PrimeProps } from "primereact/datatable";
import { Column as PrimeColumn } from "primereact/column";

interface Column {
  header: string;
  field?: string;
  sortable?: boolean;
  body?: (rowData: any, options?: any) => React.ReactNode;
  selectionMode?: "multiple" | "single"; 
  headerStyle?: React.CSSProperties;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  striped?: boolean;
  hover?: boolean;
  paginator?: boolean;
  rows?: number;
  selection?: any;
  onSelectionChange?: (e: any) => void;
  dataKey?: string;
  selectionMode?: "multiple" | "single";
  scrollable?: boolean;
  scrollHeight?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  striped = true,
  hover = true,
  paginator = false,
  rows = 10,
  selection,
  onSelectionChange,
  dataKey = "IdViaje",
  selectionMode,
  scrollable = true,
  scrollHeight = "flex"
}) => {

const dtProps: any = {
    value: data,
    stripedRows: striped,
    rowHover: hover,
    paginator,
    rows,
    selection,
    onSelectionChange,
    selectionMode,
    dataKey,
    scrollable,
    scrollHeight,
  };

  return (
    <div className="p-datatable-responsive-demo">
      <PrimeDataTable {...dtProps} className="p-datatable-sm">
        {columns.map((col, index) => (
          <PrimeColumn
            key={col.field ?? `col-${index}`}
            {...(col.field ? { field: col.field } : {})}
            header={col.header}
            sortable={col.sortable}
            body={col.body}
            selectionMode={col.selectionMode}
            headerStyle={col.headerStyle}
          />
        ))}
      </PrimeDataTable>
    </div>
  );
};

export default DataTable;