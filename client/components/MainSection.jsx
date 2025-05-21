import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";

import Column from "./Column";

import { useRouteContext } from "@fastify/react/client";

const MainSection = () => {
  const { state, data } = useRouteContext();

  const [leftGrid, middleGrid, rightGrid] = state.all.reduce(
    (acc, item, index) => {
      const left = acc[0] ?? [];
      const middle = acc[1] ?? [];
      const right = acc[2] ?? [];

      const imageData = {
        image: `https://cdn.megapixelmontage.ca/${item.name}`,
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
    },
    [],
  );

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Column data={leftGrid} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Column data={middleGrid} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Column data={rightGrid} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainSection;
