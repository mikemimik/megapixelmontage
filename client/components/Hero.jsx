import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Container from "./Container";

import { useTheme } from "@mui/material/styles";

const Hero = ({ url }) => {
  const theme = useTheme();

  const defaultHeroImageSource =
    "https://assets.maccarianagency.com/backgrounds/img1.jpg";
  const heroImageSource = url ?? defaultHeroImageSource;

  return (
    <Box
      position={"relative"}
      sx={{
        backgroundImage: `url("${heroImageSource}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        marginTop: -13,
        paddingTop: 13,
        "&:after": {
          position: "absolute",
          content: '" "',
          width: "100%",
          height: "100%",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 1,
          background: "#161c2d",
          opacity: 0.6,
        },
      }}
    >
      <Container
        zIndex={3}
        position={"relative"}
        minHeight={{ xs: 300, sm: 400, md: 600 }}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box>
          <Box marginBottom={2}>
            <Typography
              variant="h2"
              align={"center"}
              sx={{
                fontWeight: 700,
                color: theme.palette.common.white,
              }}
            >
              Megapixel Montage
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h4"
              align={"center"}
              sx={{
                fontWeight: 700,
                color: theme.palette.common.white,
              }}
            >
              Street Style Photography
            </Typography>
          </Box>
        </Box>
      </Container>
      <Box
        component={"svg"}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 1920 100.1"
        width={1}
        marginBottom={-1}
        position={"relative"}
        zIndex={2}
      >
        <path
          fill={theme.palette.background.paper}
          d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
        ></path>
      </Box>
    </Box>
  );
};

export default Hero;
