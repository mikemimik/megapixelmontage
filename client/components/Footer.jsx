import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

import { useTheme } from "@mui/material/styles";

const Footer = () => {
  const theme = useTheme();
  const { mode } = theme.palette;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width={1}
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <Box
            display={"flex"}
            component="a"
            href="/"
            title="theFront"
            width={80}
          >
            <Box
              component={"img"}
              src={
                mode === "light"
                  ? "https://assets.maccarianagency.com/the-front/logos/logo.svg"
                  : "https://assets.maccarianagency.com/the-front/logos/logo-negative.svg"
              }
              height={1}
              width={1}
            />
          </Box>
          <Box display="flex" flexWrap={"wrap"} alignItems={"center"}>
            <Box marginTop={1} marginRight={2}>
              <Link
                underline="none"
                component="a"
                href="/"
                color="text.primary"
                variant={"subtitle2"}
              >
                Home
              </Link>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography
          align={"center"}
          variant={"subtitle2"}
          color="text.secondary"
          gutterBottom
        >
          &copy; megapixelmontage. 2025, OrionsBelt. All rights reserved
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Footer;
