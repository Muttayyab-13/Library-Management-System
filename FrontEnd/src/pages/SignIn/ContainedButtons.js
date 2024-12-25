import * as React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { createTheme,ThemeProvider } from "@mui/material";

export default function ContainedButtons({Name,onClick}) {

  const theme = createTheme({
    palette: {
      customColor: {
        main: '#FF5733',
        contrastText: '#FFFFFF',
      },
    },
  });

  return (
    <Stack direction="row" spacing={2}>

<ThemeProvider theme={theme}>
      <Button  color="customColor" variant="contained" onClick={onClick}>{Name}</Button>
      </ThemeProvider>
      {/* <Button variant="contained" disabled>
        Disabled
      </Button>
      <Button variant="contained" href="#contained-buttons">
        Link
      </Button> */}
    </Stack>
  );
}
