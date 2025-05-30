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

1. Clone the repository locally
2. `nvm use` in the directory to gain the correct version of `node` and `npm`
3. `npm install` to install dependencies
4. Run the `npm run dev` script to run the development server

### Environment Variables

| Name                   | Description                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| PORT                   | Port value the server will listen on when run. Defaults to `3002`. |
| DO_SPACE_ACCESS_KEY_ID | The DigitalOcean access key ID for the Space provisioned.          |
| DO_SPACE_SECRET_KEY    | The DigitalOcean secret key for the Space provisioned.             |
| DO_SPACE_BUCKET        | The name of the DigitalOcean Space provisioned.                    |

### Production Instance locally

> [!NOTE]
> Run steps 1. through 3. above

1. Run the `npm run preview` script to generate a production server

> [!IMPORTANT]
> There is no hot reloading with this experience.
