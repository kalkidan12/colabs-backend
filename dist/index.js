"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatIo = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const passport_1 = __importDefault(require("./config/passport"));
const express_session_1 = __importDefault(require("express-session"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const messaging_1 = require("./controllers/messaging");
const user_1 = __importDefault(require("./routes/user"));
const upload_1 = __importDefault(require("./routes/upload"));
const workspace_1 = __importDefault(require("./routes/workspace"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const profile_1 = __importDefault(require("./routes/profile"));
const social_1 = __importDefault(require("./routes/social"));
const messaging_2 = __importDefault(require("./routes/messaging"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config");
const passport_2 = __importDefault(require("passport"));
const envExample_1 = __importDefault(require("./utils/envExample"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
(0, envExample_1.default)();
(0, passport_1.default)(passport_2.default);
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const chatIo = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
    },
});
exports.chatIo = chatIo;
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
app.use((0, morgan_1.default)('dev'));
(0, db_1.default)();
chatIo.on('connection', messaging_1.messagingSocket);
app.get('/', (_req, res) => {
    res.send('API IS RUNNING...');
});
app.use('/api/v1/users', user_1.default);
app.use('/api/v1/upload', upload_1.default);
app.use('/api/v1/workspaces', workspace_1.default);
app.use('/api/v1/jobs', jobs_1.default);
app.use('/api/v1/profile', profile_1.default);
app.use('/api/v1/social', social_1.default);
app.use('/api/v1/messaging', messaging_2.default);
app.use('/uploads', express_1.default.static(path_1.default.join(path_1.default.resolve(), 'uploads')));
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorHandler);
httpServer.listen(PORT, () => {
    console.log(`Server running in ${config_1.nodeEnv} mode on port ${PORT}`);
});
//# sourceMappingURL=index.js.map