import { TabView, TabPanel } from "primereact/tabview";
import Document from "./Document";
import Bookmark from "./Bookmark";
import Approved from "./Approved";
import SavedAsDraft from "./SavedAsDraft";
import { Button } from "primereact/button";
import document from "../Assets/document.png";
import Background from "../Assets/Background.png";

const DashboardMain = () => {
  return (
    <div>
      {/* <div className="imageStyle">

      <img
        style={{ height: "80px", float: "right" }}
        src={Background}
        alt=" Background "
      />
      </div> */}

      <b className="headerName">Document management</b>
      {/* <br />
      <br /> */}

      <div className="tabview-demo">
        <div className="card">
          <TabView className="tabviewmain" >
            <TabPanel header="Sent for review" leftIcon="pi pi-file">
              <Document></Document>
            </TabPanel>

            <TabPanel leftIcon="pi pi-verified" header="Approved ">
              <Approved></Approved>
            </TabPanel>

            <TabPanel header="Save as draft" leftIcon=" pi pi-file-edit">
              <SavedAsDraft className="innerTab"></SavedAsDraft>
            </TabPanel>

            <TabPanel header="Bookmarks" leftIcon=" pi pi-bookmark">
              <Bookmark className="innerTab"></Bookmark>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  );
};
export default DashboardMain;
