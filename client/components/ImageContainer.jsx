import { forwardRef } from "react";
import Box from "@mui/material/Box";

const Placeholder = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className="AsyncImage-root"
      style={{
        display: "flex",
        overflow: "hidden",
        backgroundRepeat: "no-repeat",
        boxSizing: "border-box",
        backgroundSize: "cover",
        position: "relative",
        justifyContent: "center",
      }}
    />
  );
});

export default function ImageContainer({ ref, children }) {
  return (
    <Placeholder ref={ref}>
      <Box
        sx={{
          marginBottom: { xs: 2, sm: 3 },
          minHeight: { xs: 200, sm: 400, md: 200 },
        }}
      >
        <Box
          boxShadow={1}
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 2,
            "&:hover": {
              "& img": { transform: "scale(1.2)" },
              // "& .portfolio-massonry__main-item": { bottom: 0 },
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Placeholder>
  );
}
