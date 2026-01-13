/* eslint-disable react/forbid-prop-types */
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import SmDownloadIcon from "@/common/icons/sm-download.icon";
import LineIcon from "@/common/icons/lineIcon";
import useDownloadDropdown from "./use-download-dropdown.hook";

export default function DownloadDropdownBtn({
  text,
  dropdownoptions,
  setDownload,
  data = [],
}) {
  const {
    open,
    anchorRef,
    buttonDivRef,
    menuWidth,
    dropdownClose,
    dropdownToggle,
    dropdownListKeyDown,
  } = useDownloadDropdown({ text, setDownload });

  return (
    <Stack direction="row" spacing={2}>
      <div className="flex gap-[10px]" ref={buttonDivRef}>
        <Button
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? "composition-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={dropdownToggle}
          className="border-border-gray flex items-center gap-[10px]  rounded-md  border-[1.5px] border-solid  border-[#D0D5DD] font-dm text-sm font-medium normal-case leading-[17px] text-text-dark-gray"
        >
          <SmDownloadIcon />
          {text}
          <LineIcon />
          <KeyboardArrowDownIcon />
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper style={{ width: menuWidth }}>
                <ClickAwayListener onClickAway={dropdownClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={dropdownListKeyDown}
                    className="text-text-dark-semibold z-[11] mt-2 rounded-md p-3"
                  >
                    {dropdownoptions.map((option) => {
                      return (
                        <MenuItem
                          disabled={data && data.length === 0}
                          className="z-[11] p-0"
                          href={option.link}
                          key={option.id}
                          // onClick={dropdownClose}
                          onClick={() => option.onClick()}
                        >
                          <div
                            className="text-dark-semibold font-dm text-sm capitalize leading-5  text-black"
                            style={{
                              padding: "2px",
                              color: "#2C2E3E",
                              fontWeight: "500",
                            }}
                          >
                            {option.name}
                          </div>
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  );
}

DownloadDropdownBtn.propTypes = {
  text: PropTypes.string,
  dropdownoptions: PropTypes.arrayOf(PropTypes.object),
  setDownload: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.object),
};
