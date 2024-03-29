/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
    /**
     * Enable static exports for the App Router.
     *
     * @see https://nextjs.org/docs/pages/building-your-application/deploying/static-exports
     */
    output: "export",

    /**
     * Enable strict mode for React. This will help identify legacy code that
     *
     * @see https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
     */
    reactStrictMode: true,

    /**
     * Disable server-based image optimization. Next.js does not support
     * dynamic features with static exports.
     *
     * @see https://nextjs.org/docs/pages/api-reference/components/image#unoptimized
     */
    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;
