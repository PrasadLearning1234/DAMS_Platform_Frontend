import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";

import BookmarkDemo from "./BookmarkDemo";
import BookmarkSection from "./BookmarkSection";
import Bookmark from "../Assets/Bookmark.png";
import Background from "../Assets/Background.png";

const DashboardMain = () => {
  return (
    <div style={{marginTop:'1rem'}}>
      {/* <div className="card"> */}
      <TabView className="bookmarkTabview">
        <TabPanel header="Bookmark document " leftIcon=" pi pi-bookmark">
          <BookmarkDemo></BookmarkDemo>
        </TabPanel>
        <TabPanel header="Bookmark section" leftIcon=" pi pi-bookmark">
          <BookmarkSection></BookmarkSection>
        </TabPanel>
      </TabView>
    </div>
    // </div>
  );
};
export default DashboardMain;
