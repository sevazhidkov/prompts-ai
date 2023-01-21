import React from "react";
import { Grid, Button } from "@material-ui/core";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import WorkspaceSelector from "./workspaceSelector/WorkspaceSelector";
import { makeStyles } from "@material-ui/styles";
import { toggleTemplateDialog } from "../slices/editorSlice";
import { useDispatch } from "react-redux";
import DownloadButton from "./fileExport/DownloadButton";
import UploadButton from "./fileExport/UploadButton";

const useStyles = makeStyles({
  fileExportButton: {
    width: "125px",
  },
  templateButton: {
    width: "100%",
  },
});

export default function WorkspaceForm() {
  const styles = useStyles();
  const dispatch = useDispatch();

  const handleTemplateDialogOpen = () => {
    dispatch(toggleTemplateDialog(true));
  };

  return (
    <>
      <Grid container direction={"column"} spacing={2}>
        <Grid item>
          <WorkspaceSelector />
        </Grid>
        <Grid item>
          <Grid container spacing={1}>
            <Grid item>
              <DownloadButton className={styles.fileExportButton} />
            </Grid>
            <Grid item>
              <UploadButton className={styles.fileExportButton} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            className={styles.templateButton}
            startIcon={<LibraryBooksIcon />}
            onClick={handleTemplateDialogOpen}
          >
            Explore templates
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
