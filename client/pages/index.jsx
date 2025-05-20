import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { useTheme } from "@mui/material/styles";

import { GetObjectCommand } from "@aws-sdk/client-s3";

import { useRouteContext } from "@fastify/react/client";

import Footer from "../components/Footer";
import Contact from "../components/Contact";
import MainSection from "../components/MainSection";
import Hero from "../components/Hero";
import Container from "../components/Container";
import Partners from "../components/Partners";

export const serverOnly = true;

export async function getData(ctx) {
  console.group("getData");
  if (ctx.server) {
    if (ctx.state.all) {
      const data = {};

      for (const item of ctx.state.all) {
        try {
          const value = ctx.server.cache.get(item.name);
          if (value) {
            console.log("cache hit:", item.name, value);
            data[item.name] = value;
          } else {
            console.log("cache miss:", item.name);
            const bucket = ctx.server.getEnvs().DO_SPACE_BUCKET;
            const command = new GetObjectCommand({
              Bucket: bucket,
              Key: item.name,
            });
            const response = await ctx.server.s3Client.send(command);

            const { Metadata } = response;

            const { title = "Image Title", description = "Image Description" } =
              Metadata;

            ctx.server.cache.set(item.name, { title, description });
            data[item.name] = { title, description };
          }
        } catch (err) {
          console.error(err);
          console.groupEnd();
          throw err;
        }
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

// INFO: DEFAULT EXPORT
export default function Index() {
  const theme = useTheme();
  return (
    <main>
      <Hero url={"https://cdn.megapixelmontage.ca/_hero-header.jpg"} />
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
          <Contact />
        </Container>
      </Box>
      <Divider />
      <Container>
        <Footer />
      </Container>
    </main>
  );
}
