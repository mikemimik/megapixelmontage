import { cloneElement, useEffect, useState } from "react";
import { Fade } from "transitions-kit";
import Box from "@mui/material/Box";
import { PhotoView } from "react-photo-view";
import { useTheme } from "@mui/material/styles";

const Status = Object.freeze({
  LOADING: "loading",
  LOADED: "loaded",
  FAILED: "failed",
});

function FallbackLoader() {
  return (
    <div
      className="AsyncImage-loader"
      style={{
        backgroundColor: "#eee",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        position: "absolute",
        boxSizing: "border-box",
      }}
    />
  );
}

export const clientOnly = true;

export default function Image({ inView, photo }) {
  const theme = useTheme();

  const [status, setStatus] = useState(Status.LOADING);

  // useEffect(() => {
  //   console.group(`Image:${photo.src}`);
  //   console.log("inView:", inView);
  //   console.log("status:", status);
  //   console.log("photo.src:", photo.src);
  //   console.groupEnd();
  // }, [inView, status, photo]);

  return (
    <>
      <Fade
        appear={false}
        in={status === Status.LOADING}
        timeout={1000}
        unmountOnExit
      >
        <FallbackLoader />
      </Fade>
      {inView && (
        <Fade in={status === Status.LOADED} timeout={1000}>
          <PhotoView src={photo.src} overlay={photo}>
            <Box
              component={"img"}
              height={1}
              width={1}
              src={photo.src}
              alt="..."
              maxHeight={{ xs: 400, sm: 600, md: 1 }}
              loading="lazy"
              onLoad={(event) => {
                setStatus(Status.LOADED);
              }}
              onError={(event) => {
                setStatus(Status.FAILED);
              }}
              sx={{
                transition: "transform .7s ease !important",
                transform: "scale(1.0)",
                objectFit: "cover",
                filter:
                  theme.palette.mode === "dark" ? "brightness(0.7" : "none",
              }}
            />
          </PhotoView>
        </Fade>
      )}
    </>
  );
}
