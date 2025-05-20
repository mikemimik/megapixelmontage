import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

import { useTheme } from "@mui/material/styles";

import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

import { useRouteContext } from "@fastify/react/client";

export const serverOnly = true;

export async function getData(ctx) {
  console.group("getData");
  if (ctx.server) {
    console.log("ctx:", ctx);

    const bucket = ctx.server.getEnvs().DO_SPACE_BUCKET;

    if (ctx.state.all) {
      const data = {};

      // TODO: add caching using `@fastify/caching`
      // this will provide a `ctx.server.cache` object to interact with
      for (const item of ctx.state.all) {
        const command = new GetObjectCommand({
          Bucket: bucket,
          Key: item.name,
        });
        const response = await ctx.server.s3Client.send(command);

        const { Metadata } = response;
        console.log("metadata:", Metadata);

        const { title = "Image Title", description = "Image Description" } =
          Metadata;

        data[item.name] = { title, description };
      }

      console.groupEnd();
      return data;
    }

    console.groupEnd();
    return {};
  }
}

export function getMeta() {
  return {
    title: "Megapixel Montage",
  };
}

// INFO: components/container.js
const Container = ({ children, ...rest }) => (
  <Box
    maxWidth={{ sm: 720, md: 1236 }}
    width={1}
    margin={"0 auto"}
    paddingX={2}
    paddingY={{ xs: 4, sm: 6, md: 8 }}
    {...rest}
  >
    {children}
  </Box>
);

// INFO: components/partners.js

const Partners = () => {
  const mock = [
    "https://assets.maccarianagency.com/svg/logos/airbnb-original.svg",
    "https://assets.maccarianagency.com/svg/logos/amazon-original.svg",
    "https://assets.maccarianagency.com/svg/logos/fitbit-original.svg",
    "https://assets.maccarianagency.com/svg/logos/google-original.svg",
    "https://assets.maccarianagency.com/svg/logos/hubspot-original.svg",
    "https://assets.maccarianagency.com/svg/logos/mapbox-original.svg",
    "https://assets.maccarianagency.com/svg/logos/netflix-original.svg",
    "https://assets.maccarianagency.com/svg/logos/paypal-original.svg",
    "https://assets.maccarianagency.com/svg/logos/slack-original.svg",
  ];
  return (
    <Box display="flex" flexWrap="wrap" justifyContent={"center"}>
      {mock.map((item, i) => (
        <Box
          maxWidth={{ xs: 80, sm: 90 }}
          marginTop={{ xs: 1 }}
          marginRight={{ xs: 3, sm: 6, md: 12 }}
          key={i}
        >
          <Box
            component="img"
            height={1}
            width={1}
            src={item}
            alt="..."
            sx={{
              filter: "contrast(0)",
            }}
          />
        </Box>
      ))}
    </Box>
  );
};
// INFO: components/hero.js
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

// INFO: "main section"
const Column = ({ data }) => {
  const theme = useTheme();
  return (
    <Box>
      {data.map((item, i) => (
        <Box
          key={i}
          sx={{
            marginBottom: { xs: 2, sm: 3 },
            "&:last-child": { marginBottom: 0 },
          }}
        >
          <Box
            boxShadow={1}
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 2,
              "&:hover": {
                "& img": {
                  transform: "scale(1.2)",
                },
                "& .portfolio-massonry__main-item": {
                  bottom: 0,
                },
              },
            }}
          >
            <Box
              onClick={(event) => {
                const innerEvent = event;
                console.log("hello world");
                console.log("event:", event);
                console.log("innerEvent:", innerEvent);
              }}
              component={"img"}
              loading="lazy"
              height={1}
              width={1}
              src={item.image}
              alt="..."
              maxHeight={{ xs: 400, sm: 600, md: 1 }}
              sx={{
                transition: "transform .7s ease !important",
                transform: "scale(1.0)",
                objectFit: "cover",
                filter:
                  theme.palette.mode === "dark" ? "brightness(0.7)" : "none",
              }}
            />
            <Box
              onClick={() => {
                console.log("click2");
              }}
              position={"absolute"}
              bottom={"-100%"}
              left={0}
              right={0}
              padding={4}
              bgcolor={"background.paper"}
              className={"portfolio-massonry__main-item"}
              sx={{ transition: "bottom 0.3s ease 0s" }}
            >
              <Box
                component={"svg"}
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 1920 100.1"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  transform: "translateY(-90%)",
                  zIndex: 2,
                  width: 1,
                }}
              >
                <path
                  fill={theme.palette.background.paper}
                  d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
                ></path>
              </Box>
              <Typography variant={"h6"} fontWeight={700} gutterBottom>
                {item.title}
              </Typography>
              <Typography>{item.description}</Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const MainSection = () => {
  const { state, data } = useRouteContext();

  console.group("MainSection");
  console.log("state.groups:", state.groups);
  console.log("data:", data);
  console.groupEnd();

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

// INFO: DEFAULT EXPORT
export default function Index() {
  const theme = useTheme();
  return (
    <main>
      <Hero
        url={
          "https://megapixelmontage.ca/content/images/size/w1920/2025/03/DSC03061.jpg"
        }
      />
      <Container>
        <Partners />
      </Container>
      <Container>
        <MainSection />
      </Container>
      <Box
        position={"relative"}
        marginTop={{ xs: 4, md: 6 }}
        sx={{
          backgroundColor: theme.palette.alternate.main,
        }}
      >
        <Box
          component={"svg"}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 1920 100.1"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            transform: "translateY(-50%)",
            zIndex: 2,
            width: 1,
          }}
        >
          <path
            fill={theme.palette.alternate.main}
            d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
          ></path>
        </Box>
        <Container>
          <p>"Contact"</p>
        </Container>
      </Box>
      <Divider />
      <Container>
        <p>"Footer"</p>
      </Container>
    </main>
  );
}
