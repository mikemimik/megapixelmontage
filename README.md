# megapixelmontage

Photography Website

## Description

Website is a fullstack application using `fastify` and `@fastify/vite` to do
server side rendering where needed. The purpose of creating it as a full stack
application was because of the end user experience desired for adding images to
this website. The desired experience was simple to upload an image to a cloud
location and for the image to _just appear_ on refresh of the site. The website
is built within DigitalOcean AppPlatform and the images are stored in a
DigitalOcean Space _(think AWS S3 bucket)_. Since we would need to read from the
bucket each time the page loads, which would require an API key, service side
rendering would be preferred to keep these secret values away from any client;
hence fullstack application.

## Development

> [!NOTE]
> You will need a properly configured `.env` file in order to run all the
> commands below. See `.env.example` for the required keys.

1. Clone the repository locally
2. `nvm use` in the directory to gain the correct version of `node` (>=24) and
   `npm` (>=11.4.2)
3. `npm install` to install dependencies
4. Run the `npm run dev` script to run the development server

### Environment Variables

| Name                   | Description                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| PORT                   | Port value the server will listen on when run. Defaults to `3002`. |
| DO_SPACE_ACCESS_KEY_ID | The DigitalOcean access key ID for the Space provisioned.          |
| DO_SPACE_SECRET_KEY    | The DigitalOcean secret key for the Space provisioned.             |
| DO_SPACE_BUCKET        | The name of the DigitalOcean Space provisioned.                    |
| AUTH0_DOMAIN           | The Auth0 tenant domain used to gate authenticated endpoints.      |
| AUTH0_CLIENT_ID        | The Auth0 application client ID.                                   |
| AUTH0_CLIENT_SECRET    | The Auth0 application client secret.                               |
| AUTH0_APP_BASE_URL     | The base URL of the running application (e.g. `http://localhost:3002`). |
| AUTH0_SESSION_SECRET   | Secret used to sign Auth0 session cookies.                         |

### Scripts

| Script            | Description                                                          |
| ----------------- | -------------------------------------------------------------------- |
| `npm run dev`     | Runs the server with Vite in development mode (hot reloading).       |
| `npm run build`   | Builds the client bundle with Vite.                                  |
| `npm run preview` | Builds the client and runs the server in production mode.            |
| `npm start`       | Runs the server (expects an existing build).                         |
| `npm test`        | Runs the unit tests using the built-in Node.js test runner.          |

### Endpoints

In addition to the server-rendered pages, the application exposes the following
operational endpoints:

| Method | Path                | Auth     | Description                                                       |
| ------ | ------------------- | -------- | ----------------------------------------------------------------- |
| GET    | `/healthcheck`      | Public   | Returns `200` when the server is ready, `503` otherwise.          |
| GET    | `/hydrate`          | Auth0    | Triggers a re-hydration of the image cache from the Space.        |
| GET    | `/invalidate-cache` | Auth0    | Clears the in-memory cache (a re-hydration is triggered).         |

Authenticated endpoints redirect unauthenticated requests to `/auth/login` and
are rate limited.

### Production Instance locally

> [!NOTE]
> Run steps 1. through 3. above

1. Run the `npm run preview` script to generate a production server

> [!IMPORTANT]
> There is no hot reloading with this experience.
