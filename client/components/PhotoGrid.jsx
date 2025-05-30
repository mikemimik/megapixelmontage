import { useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { PhotoProvider } from "react-photo-view";

import AsyncImage from "./AsyncImage";
import Container from "./Container";
import Collections from "./Collections";

import { useRouteContext } from "@fastify/react/client";

import "react-photo-view/dist/react-photo-view.css";

const Overlay = ({ photo }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        p: 2,
        width: 1,
        top: "auto",
        bottom: 0,
        zIndex: "modal",
      }}
    >
      <Box sx={{ color: "white" }}>
        <Typography variant="h5" component="h5">
          {photo.title}
        </Typography>
      </Box>
      <Box sx={{ color: "white" }}>
        <Typography variant="h6" component="h6">
          {photo.description}
        </Typography>
      </Box>
    </Box>
  );
};

export default function PhotoGrid() {
  const { state, data, domain } = useRouteContext();
  const [selectedCollection, setSelectedCollection] = useState("all");

  const collection = useMemo(() => {
    switch (selectedCollection) {
      case "all":
        return state.all;
      default:
        return state.groups[selectedCollection];
    }
  }, [selectedCollection]);

  const [leftPhotos, middlePhotos, rightPhotos] = useMemo(() => {
    return collection.reduce((acc, item, index) => {
      const left = acc[0] ?? [];
      const middle = acc[1] ?? [];
      const right = acc[2] ?? [];

      const imageData = {
        src: `https://cdn.${domain}/${item.name}`,
        description: data[item.name].description,
        title: data[item.name].title,
      };
      const sort = index % 3;
      if (sort === 0) {
        left.push(imageData);
      } else if (sort === 1) {
        middle.push(imageData);
      } else if (sort === 2) {
        right.push(imageData);
      }

      return [left, middle, right];
    }, []);
  }, [collection]);

  return (
    <Box>
      <Container paddingY="" sx={{ paddingBottom: { xs: 4, sm: 6, md: 8 } }}>
        <Collections
          collections={["all", ...Object.keys(state.groups)]}
          onChange={(value) => {
            setSelectedCollection(value);
          }}
        />
      </Container>
      <PhotoProvider
        overlayRender={({ overlay }) => {
          return <Overlay photo={overlay} />;
        }}
      >
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <AsyncImage photo={leftPhotos[0]} initialInView={true} />
            {leftPhotos.length
              ? leftPhotos
                  .slice(1)
                  .map((photo, index) => (
                    <AsyncImage key={index} photo={photo} />
                  ))
              : null}
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            {middlePhotos[0] && (
              <AsyncImage photo={middlePhotos[0]} initialInView={true} />
            )}
            {middlePhotos.length
              ? middlePhotos
                  .slice(1)
                  .map((photo, index) => (
                    <AsyncImage key={index} photo={photo} />
                  ))
              : null}
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            {rightPhotos[0] && (
              <AsyncImage photo={rightPhotos[0]} initialInView={true} />
            )}
            {rightPhotos.length
              ? rightPhotos
                  .slice(1)
                  .map((photo, index) => (
                    <AsyncImage key={index} photo={photo} />
                  ))
              : null}
          </Grid>
        </Grid>
      </PhotoProvider>
    </Box>
  );
}
