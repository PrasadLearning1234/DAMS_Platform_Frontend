import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axios from "axios";
import { Ripple } from "primereact/ripple";
import { Card } from "primereact/card";

const Product = () => {
  const [selectedCustomers, setSelectedCustomers] = useState(null);
  const [bookmark, setBookmark] = useState([]);
  const toast = useRef(null);
  const [createdBy, setLoginUser] = useState();
  const [loading, setLoading] = useState(true);
  const [rows1, setRows1] = useState(10);
  const [first1, setFirst1] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInputTooltip, setPageInputTooltip] = useState(
    "Press 'Enter' key to go to this page."
  );

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    sectionName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },

    description: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },

    reviwer: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    date: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    balance: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },

    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  // const statuses = [
  //   "Updated",
  //   "Review Pending",
  //   "Issue Marked",
  //   "Saved as Draft",
  // ];

  useEffect(() => {
    setLoginUser(sessionStorage.getItem("emailId"));

    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(
          `${
            process.env.REACT_APP_API_KEY
          }/document/SectionBookmarksList/${sessionStorage.getItem("emailId")}`
        );

        const bookmark = response.sort((a, b) => {
          const nameA = a.sectionName.toLowerCase();
          const nameB = b.sectionName.toLowerCase();

          // Check if both names are numeric
          const isANumeric = !isNaN(parseFloat(nameA)) && isFinite(nameA);
          const isBNumeric = !isNaN(parseFloat(nameB)) && isFinite(nameB);

          // If both are numeric, compare as numbers
          if (isANumeric && isBNumeric) {
            return parseFloat(nameA) - parseFloat(nameB);
          }

          // If only one is numeric, it comes after
          if (isANumeric && !isBNumeric) {
            return 1;
          }
          if (!isANumeric && isBNumeric) {
            return -1;
          }

          // If both are non-numeric, compare as strings
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0; // names must be equal
        });

        setBookmark(bookmark);
        // console.log('bookmark',bookmark);

        // setBookmark(response.reverse());
        if (response.length > 0) {
          setCurrentPage(1);
        }
      } catch (error) {
        // console.error(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  ////BOOKMARK DOCUMENT DOWNLOAD
  const downloadFileAtURL = (rowData) => {
    const url = `${process.env.REACT_APP_API_KEY}/document/downloadSec/${
      rowData.secId
    }/${sessionStorage.getItem("emailId")}`;
    // console.log(rowData, " file to be download");
    const fileName = url.split("/").pop();
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  const BookmarkTemplate = (rowData) => {
    const showSuccess4 = () => {
      toast.current.show({
        severity: "success",
        summary: "Section Download Successfully",
        detail: "Section Download",
        life: 3000,
      });
    };

    return (
      <Button
        style={{
          marginLeft: "10px",
          boxShadow:"none",
          height: "13px",
          width: "13px",
          color: "#D04A02",
          alignContent:"center"
        }}
        icon="pi pi-download"
        onClick={() => {
          downloadFileAtURL(rowData);
        }}
        onMouseDown={showSuccess4}
        tooltip="Download "
        tooltipOptions={{ className: "teal-tooltip", position: "bottom" }}
        className="p-button-raised  p-button-text"
      />
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder=" Search"
            className="p-inputtext-sm"
          />
        </span>
      </div>
    );
  };

  const countryTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span>{rowData.reviwer}</span>
      </React.Fragment>
    );
  };

  const header = renderHeader();

  const dateBodyTemplate = (bookmarkBy) => {
    return (
      <div>
        {new Intl.DateTimeFormat("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }).format(bookmarkBy.bookmarkBy)}
      </div>
    );
  };

  const onPageInputKeyDown = (event, options) => {
    if (event.key === "Enter") {
      const page = parseInt(currentPage);
      if (page < 1 || page > options.totalPages) {
        setPageInputTooltip(
          `Value must be between 1 and ${options.totalPages}.`
        );
      } else {
        const first = currentPage ? options.rows * (page - 1) : 0;

        setFirst1(first);
        setPageInputTooltip("Press 'Enter' key to go to this page.");
      }
    }
  };

  const onPageInputChange = (event) => {
    setCurrentPage(event.target.value);
  };

  const tooltip = (rowData) => {
    // console.log("rowData: ",rowData);

    return (
      <React.Fragment>
        <div>
   
          <div className={`custom-tooltip-btn-${rowData.id}`}>
            {rowData.sectionName.split('.docx')}
          </div>
          
        </div>
      </React.Fragment>
    );
  };

  
  const onCustomPage1 = (event) => {
    // console.log(event, "event");
    setFirst1(event.first);
    setRows1(event.rows);

    setCurrentPage(event.page + 1);
  };

  const template1 = {
    layout: "PrevPageLink CurrentPageReport NextPageLink",
    PrevPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="pi pi-chevron-left"></span>
          <Ripple />
        </button>
      );
    },

    NextPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="pi pi-chevron-right"></span>
          <Ripple />
        </button>
      );
    },

    CurrentPageReport: (options) => {
      // console.log(options, "options");
      return (
        <div>
          <span
            className="mx-1"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            <InputText
              size="1"
              style={{ textAlign: "center" }}
              className="ml-1"
              value={currentPage}
              tooltip={pageInputTooltip}
              onKeyDown={(e) => onPageInputKeyDown(e, options)}
              onChange={onPageInputChange}
            />
          </span>

          <span
            style={{
              color: "var(--text-color)",
              userSelect: "none",
              width: "120px",
              textAlign: "center",
            }}
          >
            of {options.totalPages}
          </span>
        </div>
      );
    },
  };

  return (
    <div className="datatable-doc-demo" style={{ marginTop: "1rem" }}>
      <Toast ref={toast} />

      <div className="card" style={{ padding: "10px" }}>
        <DataTable
          value={bookmark}
          // paginator
          stripedRows
          className="p-datatable-customers"
          header={header}
          // rows={6}
          style={{ borderRadius: "10px", border: "1px solid #FFB601" }}
          loading={loading}
          rows={rows1}
          paginator
          paginatorTemplate={template1}
          first={first1}
          onPage={onCustomPage1}
          // paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          dataKey="id"
          rowHover
          showGridlines
          selection={selectedCustomers}
          onSelectionChange={(e) => setSelectedCustomers(e.value)}
          filters={filters}
          filterDisplay="menu"
          responsiveLayout="scroll"
          globalFilterFields={[
            "sectionName",
            "description",
            "reviwer",
            "balance",
            "status",
          ]}
          emptyMessage="No documents found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          <Column
            // field={(rowData) => rowData.sectionName.replace(".docx", "")}
            field="sectionName"
            header="Section name"
            sortable
            style={{
              maxWidth: "200px",
              minWidth: "15rem",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            body={tooltip}
            filter
            filterPlaceholder="Search by Name"
          />
          {/* <Column
              field="reviwer"
              header="Reviewer"
              sortable
              filterField="reviwer"
              style={{ minWidth: "10rem" }}
              body={countryTemplate}
              filter
              filterPlaceholder="Search by Reviewer"
            /> */}

          <Column
            field="createOn"
            header="Bookmarked on"
            sortable
            dataType="date"
            body={dateBodyTemplate}
            style={{ minWidth: "10rem" }}
          />

          <Column
            header="Action"
            style={{ minWidth: "4rem" }}
            body={BookmarkTemplate}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default Product;
