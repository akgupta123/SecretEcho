/** @type {import('next').NextConfig} */
const nextConfig = {
    env : {
        NEXT_BACKEND_API_URL : "http://localhost:5001/v1",
        NEXT_PUBLIC_SOCKET_URL : "http://localhost:5002"
    }
};

export default nextConfig;
