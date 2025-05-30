import { useCallback } from "react";

import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

export default function Collections({ collections, onChange }) {
  const handleClick = useCallback(
    (event) => {
      const value = event.target.textContent;
      onChange(value);
    },
    [onChange],
  );

  return (
    <Stack
      sx={{
        flexDirection: { xs: "column", sm: "row", md: "row" },
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {collections.map((item, index) => (
        <Chip
          key={index}
          label={item}
          sx={{ marginBottom: { xs: 0.5 }, margin: { sm: 0.5, md: 0.5 } }}
          onClick={handleClick}
        />
      ))}
    </Stack>
  );
}
