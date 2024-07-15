import React, { useState, useEffect } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import axios from "axios";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "primereact/tooltip";
import { Ripple } from "primereact/ripple";
import { Card } from "primereact/card";

const Product = () => {
  const [selectedCustomers, setSelectedCustomers] = useState(null);
  const [posts, setPosts] = useState([]);
  const [allFilterData, setAllFilteredData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loginUser, setLoginUser] = useState("");
  const [rows1, setRows1] = useState(10);
  const [first1, setFirst1] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInputTooltip, setPageInputTooltip] = useState(
    "Press 'Enter' key to go to this page."
  );

  const statuses = [
    "Updated",
    "Review Pending",
    "Issue Marked",
    "Saved as Draft",
  ];
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    filename: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    description: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    uplodedBy: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    date: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const filterData = (allData) => {
    const emailId = sessionStorage.getItem("emailId");
    const filteredData = allData.filter((data) => data.reviewer[0] === emailId);
    filteredData.sort((a, b) => {
      const nameA =
        (a.documentname[0] && a.documentname[0].toLowerCase()) || "";
      const nameB =
        (b.documentname[0] && b.documentname[0].toLowerCase()) || "";
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
    setAllFilteredData(filteredData);
    // console.log('filteredData',filteredData);
    if (filteredData.length > 0) {
      setCurrentPage(1);
    }
  };
  // console.log(allFilterData,"filterdata...///")

  useEffect(() => {
    setLoginUser(sessionStorage.getItem("emailId"));

    axios
      .get(`${process.env.REACT_APP_API_KEY}/sample/getAllDisableDoc`)
      .then((res) => {
        // console.log(res.data, "All doc data...!!!");
        filterData(res.data.reverse());
        setLoading(false);
      });
  }, []);

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
            placeholder="Search"
            className="p-inputtext-sm"
          />
        </span>
      </div>
    );
  };

  const countryBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <div>
          <Tooltip target={`.custom-tooltip-btn-${rowData.id}`}>
            {rowData.description}
          </Tooltip>
          <div className={`custom-tooltip-btn-${rowData.id}`}>
            {rowData.description}
          </div>
        </div>
      </React.Fragment>
    );
  };

  const countryTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span>{rowData.uplodedBy}</span>
      </React.Fragment>
    );
  };

  const dateFilterTemplate = (options) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-folder-open"
          className="nextBtn p-button-sm"
          onClick={() => editProduct(rowData)}
          style={{
            backgroundColor: "#203570",
            height: 30,
            width: 30,
            borderRadius: "2px",
          }}
        />
      </React.Fragment>
    );
  };

  const editProduct = (product) => {
    navigate("/reviewerversion/" + product.id);
    // console.log(product, " document data by id.....");
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <span
        className={`customer-badge ${
          rowData.enable ? "status-pending" : "status-approved"
        }`}
      >
        {rowData.enable ? " Review Pending" : "Approved"}
      </span>
    );
  };

  const statusFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        itemTemplate={statusItemTemplate}
        placeholder="Select a Status"
        className="p-column-filter"
        showClear
      />
    );
  };

  const statusItemTemplate = (option) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>;
  };

  const dateBodyTemplate = (timestamp) => {
    // console.log("uploadedDate:",uploadedDate);

    return (
      <div>
        {new Intl.DateTimeFormat("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }).format(timestamp.timestamp[0])}
      </div>
    );
  };

  const header = renderHeader();
  const hyperlinkTemplate = (rowData) => {
    return (
      <React.Fragment>
        <a
          style={{ textDecoration: "underline", color: "#D04A01" , cursor: "pointer"}}
          onClick={() => editProduct(rowData)}
        >
          {rowData.filename}
        </a>
      </React.Fragment>
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

  const onCustomPage1 = (event) => {
    // console.log(event,"event");
    setFirst1(event.first);
    setRows1(event.rows);

    setCurrentPage(event.page + 1);
  };

  const template1 = {
    layout: "PrevPageLink CurrentPageReport NextPageLink ",
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
      // console.log(options,"options")
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
    <div style={{ marginTop: "1rem" }} className="datatable-doc-demo">
      <div className="card">
        <Card>
          <DataTable
            value={allFilterData}
            // paginator
            loading={loading}
            className="p-datatable-customers"
            header={header}
            style={{ borderRadius: "10px", border: "1px solid #FFB601" }}
            rows={rows1}
            paginator
            paginatorTemplate={template1}
            first={first1}
            onPage={onCustomPage1}
            // rows={7}
            // paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            dataKey="id"
            rowHover
            showGridlines
            size="small"
            selection={selectedCustomers}
            onSelectionChange={(e) => setSelectedCustomers(e.value)}
            filters={filters}
            filterDisplay="menu"
            globalFilterFields={[
              "filename",
              "description",
              "uplodedBy",
              "status",
            ]}
            emptyMessage="No documents found."
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          >
            <Column
              field="filename"
              header="Document name"
              sortable
              filter
              filterPlaceholder="Search by Name"
              style={{ minWidth: "10rem" }}
              body={hyperlinkTemplate}
            />

            <Column
              field="description"
              header="Description"
              sortable
              filterField="description"
              style={{
                maxWidth: "200px",
                minWidth: "70px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
              body={countryBodyTemplate}
              filter
              filterPlaceholder="Search by Description"
            />

            <Column
              field="status"
              header="Status"
              sortable
              // filterMenuStyle={{ width: "14rem" }}
              style={{ minWidth: "10rem" }}
              body={statusBodyTemplate}
              // filter
              // filterElement={statusFilterTemplate}
            />

            <Column
              field="uplodedBy"
              header="Sent by"
              sortable
              filterField="uplodedBy"
              style={{ minWidth: "10rem" }}
              body={countryTemplate}
              filter
              filterPlaceholder="Search by Name"
            />

            <Column
              field="timestamp"
              header="Sent on"
              sortable
              dataType="date"
              body={dateBodyTemplate}
              style={{ minWidth: "10rem" }}
            />
            {/* <Column
            header="View"
            body={actionBodyTemplate}
            exportable={false}
          ></Column> */}
          </DataTable>
        </Card>
      </div>
    </div>
  );
};

export default Product;
