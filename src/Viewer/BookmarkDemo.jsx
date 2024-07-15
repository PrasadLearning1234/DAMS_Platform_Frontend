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
import DOMPurify from 'dompurify';
const Product = () => {
  const [selectedCustomers, setSelectedCustomers] = useState(null);
  const [bookmark, setBookmark] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);
  const [createdBy, setLoginUser] = useState();
  const [rows1, setRows1] = useState(10);
  const [first1, setFirst1] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInputTooltip, setPageInputTooltip] = useState(
    "Press 'Enter' key to go to this page."
  );

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    documentName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },

    description: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },

    reviewer: {
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

  useEffect(() => {
    setLoginUser(sessionStorage.getItem("emailId"));

    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(
          `${
            process.env.REACT_APP_API_KEY
          }/document/list/${sessionStorage.getItem("emailId")}`
        );
        setBookmark(response.reverse());
        // console.log(response,'response');
        if(response.length>0){
          setCurrentPage(1)
        }
      } catch (error) {
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  ////BOOKMARK DOCUMENT DOWNLOAD
  const version = "version1";
  const downloadFileAtURL = (rowData) => {
    const url = `${process.env.REACT_APP_API_KEY}/document/downloadFile/${
      rowData.docId
    }/${version}/${sessionStorage.getItem("emailId")}`;
    // console.log(rowData, " file to be download");
    const fileName = url.split("/").pop();
    const aTag = document.createElement("a");
    const sanitizedUrl = DOMPurify.sanitize(url);
    aTag.href = sanitizedUrl;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  const docDownload = () => {
    toast.current.show({
      severity: "success",
      summary: "Document Download Successfully",
      detail: "Document Download",
      life: 6000,
    });
  };

  const BookmarkTemplate = (rowData) => {
    return (
      <Button
        style={{
          backgroundColor: "white",
          height: "30px",
          width: "30px",
          color: "#203570",
        }}
        icon="pi pi-download"
        onClick={() => {
          downloadFileAtURL(rowData);
        }}
        onMouseDown={docDownload}
        tooltip="Download "
        tooltipOptions={{ className: "teal-tooltip", position: "bottom" }}
        className="p-button-raised  p-button-text"
      />
    );
  };

  const dateBodyTemplate = (createdOn) => {
    return (
      <div>
        {new Intl.DateTimeFormat("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }).format(createdOn.createdOn)}
      </div>
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
        <span>{rowData.reviewer}</span>
      </React.Fragment>
    );
  };

  const header = renderHeader();

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

  const onCustomPage1 = (event) => {
    // console.log(event, "event");
    setFirst1(event.first);
    setRows1(event.rows);

    setCurrentPage(event.page + 1);
  };

  const template1 = {
    layout:
      "PrevPageLink CurrentPageReport NextPageLink ",
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
    <>
      <Toast ref={toast} />

      <div className="datatable-doc-demo" style={{marginTop:'1rem'}}>
        <Card>
          <div className="card">
            <DataTable
              value={bookmark}
              className="p-datatable-customers"
              header={header}
              // rows={6}
              showGridlines
              loading={loading}
              stripedRows
              rows={rows1}
              paginator
              paginatorTemplate={template1}
              first={first1}
              onPage={onCustomPage1}
              dataKey="id"
              rowHover
              selection={selectedCustomers}
              onSelectionChange={(e) => setSelectedCustomers(e.value)}
              filters={filters}
              filterDisplay="menu"
              globalFilterFields={[
                "documentName",
                "description",
                "reviewer",
                "balance",
                "status",
              ]}
              emptyMessage="No documents found."
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            >
              <Column
                field="documentName"
                header="Document name"
                sortable
                filter
                style={{
                  maxWidth: "200px",
                  minWidth: "15rem",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
                filterPlaceholder="Search by Name"
              />

              {/* <Column
                field="Reviewer"
                header="Reviewer"
                sortable
                filterField="reviewer"
                style={{ minWidth: "8rem" }}
                body={countryTemplate}
                filter
                filterPlaceholder="Search by Reviewer"
              /> */}

              <Column
                field="createdOn"
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
        </Card>
      </div>
    </>
  );
};

export default Product;
