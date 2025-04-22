/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [new URL('https://i.scdn.co/image/*')]
    }
};

export default nextConfig;
