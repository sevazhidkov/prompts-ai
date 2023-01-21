import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import { IconButton } from "@material-ui/core";
import EditPopup from "./EditPopup";

export default function EditButton() {
  const [isPopupOpen, setPopupOpen] = React.useState(false);
  const openPopup = () => {
    setPopupOpen(true);
  };

  return (
    <>
      <IconButton aria-label="close" onClick={openPopup} size={"small"}>
        <EditIcon />
      </IconButton>
      <EditPopup
        open={isPopupOpen}
        onClose={() => {
          setPopupOpen(false);
        }}
      />
    </>
  );
}
