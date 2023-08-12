"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.static('public'));
const users = {
    'revou': 'tim6'
};
app.use((0, express_basic_auth_1.default)({
    users: users,
    challenge: true,
    unauthorizedResponse: 'Access Denied'
}));
app.use('/api', routes_1.default);
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
