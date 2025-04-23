const express = require("express");
const cors = require("cors")
const helmet = require("helmet");
const errorHandler = require("./middleware/errorLogMiddleware");
require('dotenv').config({ path: './src/.env' });
const { validateToken } = require("../src/middleware/authMiddleware");
const proxy = require("express-http-proxy");
const app = express();
const PORT = process.env.PORT || 4000
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
    res.send('Server is working!');
});
app.use(errorHandler);
const proxyOptions = {
    proxyReqPathResolver: (req) => {
        return req.originalUrl.replace(/^\/v1/, "/api");
    },
    proxyErrorHandler: (err, res, next) => {
        res.status(500).json({
            message: `Internal server error`,
            error: err.message,
        });
    },
};
app.use("/v1/auth", proxy(process.env.USER_SERVICE_URL,
    {
        ...proxyOptions,
        proxyReqPathResolver: req => {
            return `${req.url}`; 
        },
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
          //  console.log(srcReq,"")
            proxyReqOpts.headers["Content-Type"] = "application/json";
            return proxyReqOpts;
        },
        userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
            console.log(
                `Response received from Identity service: ${proxyRes.statusCode}`
            );
            return proxyResData;
        }
    })
);


app.use("/v1/chat", validateToken,  proxy(process.env.CHAT_SERVICE_URL,
    { 
        ...proxyOptions,
        proxyReqPathResolver: req => {
            return `${req.url}`; 
        },
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            proxyReqOpts.headers["Content-Type"] = "application/json";
            if (srcReq.user && srcReq.user) {
                proxyReqOpts.headers["x-user"] = JSON.stringify(srcReq.user);
            }
            return proxyReqOpts;
        },
        userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
            console.log(
                `Response received from Identity service: ${proxyRes.statusCode}`
            );
            return proxyResData;
        }
    })
);

app.listen(PORT, () => {
    console.log(`Server listening at ${PORT} `)

})