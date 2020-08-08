import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import {IconButton} from "@material-ui/core";
import DeletePopup from "./DeletePopup";

export default function DeleteButton() {
    const [isPopupOpen, setPopupOpen] = React.useState(false);
    const openPopup = () => {
        setPopupOpen(true);
    };

    return <>
        <IconButton aria-label="close" onClick={openPopup}>
            <DeleteIcon />
        </IconButton>
        <DeletePopup open={isPopupOpen} onClose={() => {
            setPopupOpen(false);
        }} />
    </>;
}