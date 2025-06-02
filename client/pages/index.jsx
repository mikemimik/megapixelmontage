import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import Footer from "../components/Footer";
import Contact from "../components/Contact";
import Hero from "../components/Hero";
import Container from "../components/Container";
import PhotoGrid from "../components/PhotoGrid";

import { useRouteContext } from "@fastify/react/client";
import { useTheme } from "@mui/material/styles";

import { Suspense } from "react";

// INFO: can't use `serverOnly=true` because then the scroll to lazy load images
// doesn't kick in because the server doesn't sent javascript in this mode.
// export const serverOnly = true;

// INFO: when the client receives the javascript the whole page rerenders
// TODO: figure out how to stop whole rerender of page
export const streaming = true;

export async function getData(ctx) {
  if (ctx.server) {
    const { log, cache } = ctx.server;
    log.info({ "ctx.server": !!ctx.server }, "pages/index.jsx::getData");

    // INFO: context executes first, populating `ctx.state.all`
    // https://fastify-vite.dev/react/route-context#execution-order
    if (ctx.state.all) {
      const data = {};

      for (const item of ctx.state.all) {
        const value = cache.get(item.name);
        if (value) {
          log.debug(`cache hit: ${item.name}`);
          data[item.name] = value;
        } else {
          log.warn(`cache miss: ${item.name}`);

          data[item.name] = {
            title: "Image Title",
            description: "Image Description",
          };
        }
      }

      return data;
    }

    return {};
  }
}

export function getMeta(ctx) {
  return {
    title: "Megapixel Montage",
    meta: [
      {
        name: "description",
        property: "og:description",
        content:
          "Photography website for Megapixel Montage; street style photography images.",
      },
      {
        name: "image",
        property: "og:image",
        content: `https://cdn.${ctx.domain}/_hero-header-min.jpg`,
      },
      { name: "type", property: "og:type", content: "website" },
      { name: "url", property: "og:url", content: `https://${ctx.domain}` },
    ],
  };
}

export default function Index() {
  const theme = useTheme();
  const { domain } = useRouteContext();

  return (
    <main>
      <Hero url={`https://cdn.${domain}/_hero-header-min.jpg`} />
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
