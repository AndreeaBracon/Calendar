import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Box, Popover, Button, Grid } from '@mui/material';
import ColorBox from './ColorBox';

const colors = [
  '#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#673ab7', '#ff3d00', '#87103f', '#ffeb3b'
  // Add MUI color palette here
  // ...more colors
];

export default function ColorPicker({ value, onChange, error, helperText }) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setDisplayColorPicker((prevState) => !prevState);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
    setAnchorEl(null);
  };

  const handleChangeColor = (color) => {
    onChange({ hex: color });
    handleClose();
  };

  return (
    <div>
      <TextField
        fullWidth
        autoComplete="off"
        id="color"
        label="Color"
        onClick={handleClick}
        value={value}
        InputProps={{
          startAdornment: value ? <ColorBox color={value} /> : null,
        }}
        error={error}
        helperText={helperText}
      />

      <Popover
        open={displayColorPicker}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Grid container spacing={1} sx={{ padding: 1 }}>
          {colors.map((color) => (
            <Grid item xs={3} key={color}>
              <Button
                sx={{
                  backgroundColor: color,
                  width: 30,
                  height: 30,
                  padding: 0,
                  minWidth: 0,
                  "&:hover": {
                    backgroundColor: color,
                    opacity: 0.9,
                  },
                }}
                onClick={() => handleChangeColor(color)}
              />
            </Grid>
          ))}
        </Grid>
      </Popover>
    </div>
  );
}

ColorPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};
