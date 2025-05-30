import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import Footer from "../components/Footer";
import Contact from "../components/Contact";
import Hero from "../components/Hero";
import Container from "../components/Container";
import PhotoGrid from "../components/PhotoGrid";

import { useTheme } from "@mui/material/styles";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Suspense } from "react";

// INFO: can't use `serverOnly=true` because then the scroll to lazy load images
// doesn't kick in because the server doesn't sent javascript in this mode.
// export const serverOnly = true;

// INFO: when the client receives the javascript the whole page rerenders
// TODO: figure out how to stop whole rerender of page
export const streaming = true;

export async function getData(ctx) {
  console.group("pages/index.jsx::getData");
  console.log("ctx.server", !!ctx.server);
  console.groupEnd();

  if (ctx.server) {
    const { log } = ctx.server;

    if (ctx.state.all) {
      const data = {};

      for (const item of ctx.state.all) {
        try {
          const value = ctx.server.cache.get(item.name);
          if (value) {
            log.info(`cache hit: ${item.name}`);
            data[item.name] = value;
          } else {
            log.warn(`cache miss: ${item.name}`);
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
          log.error(err.message);
          throw err;
        }
      }

      return data;
    }

    return {};
  }
}

export function getMeta() {
  return {
    title: "Megapixel Montage",
    meta: [
      {
        name: "description",
        content:
          "Photography website for Megapixel Montage; street style photography images.",
      },
      {
        name: "image",
        content: "https://cdn.megapixelmontage.ca/_hero-header-min.jpg",
      },
      { name: "type", content: "website" },
      { name: "url", content: "https://megapixelmontage.ca" },
    ],
  };
}

export default function Index() {
  const theme = useTheme();

  return (
    <main>
      <Hero url={"https://cdn.megapixelmontage.ca/_hero-header.jpg"} />
      <Container>
        <Suspense fallback={<p>Loading...</p>}>
          <PhotoGrid />
        </Suspense>
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
