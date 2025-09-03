"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkModel = exports.contentModel = exports.tagModel = exports.userModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
    throw new Error("MONGO_URL environment variable is required");
}
mongoose_1.default.connect(MONGO_URL)
    .then(() => console.log("Connected to database"))
    .catch((err) => console.error("DB connection error:", err));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const tagSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, unique: true }
});
const contentTypes = ['image', 'video', 'article', 'audio'];
const contentSchema = new mongoose_1.Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true },
    // REMOVED: contentId field - use _id instead (automatic MongoDB field)
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
});
const linkSchema = new mongoose_1.default.Schema({
    hash: { type: String, required: true },
    contentId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Content', required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});
exports.userModel = mongoose_1.default.model("User", userSchema);
exports.tagModel = mongoose_1.default.model("Tag", tagSchema);
exports.contentModel = mongoose_1.default.model("Content", contentSchema);
exports.linkModel = mongoose_1.default.model("Link", linkSchema);
//# sourceMappingURL=db.js.map