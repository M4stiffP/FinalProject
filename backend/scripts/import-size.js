"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@nestjs/core");
var app_module_1 = require("../src/app.module");
var mongoose_1 = require("mongoose");
var mongoose_2 = require("@nestjs/mongoose");
var fs = require("fs");
var path = require("path");
// Helper function to convert MongoDB ObjectId format and remove size_id
function convertObjectId(obj) {
    if (obj && typeof obj === 'object') {
        if (obj.$oid) {
            return new mongoose_1.Types.ObjectId(obj.$oid);
        }
        if (Array.isArray(obj)) {
            return obj.map(convertObjectId);
        }
        var converted = {};
        for (var key in obj) {
            if (key === '_id' && obj[key].$oid) {
                // Don't include _id, let MongoDB generate new ones
                continue;
            }
            if (key === 'size_id') {
                // Skip size_id field - we don't need it anymore
                continue;
            }
            converted[key] = convertObjectId(obj[key]);
        }
        return converted;
    }
    return obj;
}
function importSize() {
    return __awaiter(this, void 0, void 0, function () {
        var app, sizeModel, filePath, sizeData, fileContent, defaultFilePath, fileContent, convertedSizes, count, samples, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, core_1.NestFactory.createApplicationContext(app_module_1.AppModule)];
                case 1:
                    app = _a.sent();
                    sizeModel = app.get((0, mongoose_2.getModelToken)('Size'));
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, 8, 10]);
                    filePath = path.join(process.cwd(), 'data', 'FinalDB.size.json');
                    console.log("Checking file: ".concat(filePath));
                    sizeData = void 0;
                    if (fs.existsSync(filePath)) {
                        console.log('Reading FinalDB.size.json...');
                        fileContent = fs.readFileSync(filePath, 'utf8');
                        sizeData = JSON.parse(fileContent);
                    }
                    else {
                        console.log('FinalDB.size.json not found, using default size.json...');
                        defaultFilePath = path.join(process.cwd(), 'data', 'size.json');
                        fileContent = fs.readFileSync(defaultFilePath, 'utf8');
                        sizeData = JSON.parse(fileContent);
                    }
                    console.log("Found ".concat(sizeData.length, " size records to import"));
                    // ล้างข้อมูล size เก่า
                    console.log('Clearing existing size data...');
                    return [4 /*yield*/, sizeModel.deleteMany({})];
                case 3:
                    _a.sent();
                    // แปลงข้อมูลและ import (ลบ size_id ออก)
                    console.log('Converting and importing size data...');
                    convertedSizes = sizeData.map(convertObjectId);
                    // ตรวจสอบโครงสร้างข้อมูล
                    console.log('Sample data structure:', JSON.stringify(convertedSizes[0], null, 2));
                    return [4 /*yield*/, sizeModel.insertMany(convertedSizes)];
                case 4:
                    _a.sent();
                    console.log("Successfully imported ".concat(convertedSizes.length, " size records!"));
                    return [4 /*yield*/, sizeModel.countDocuments()];
                case 5:
                    count = _a.sent();
                    console.log("Total size records in database: ".concat(count));
                    return [4 /*yield*/, sizeModel.find().limit(3)];
                case 6:
                    samples = _a.sent();
                    console.log('\nSample records:');
                    samples.forEach(function (record, index) {
                        console.log("".concat(index + 1, ". _id: ").concat(record._id, ", product_id: ").concat(record.product_id, ", color_id: ").concat(record.color_id, ", size: ").concat(record.size, ", stock: ").concat(record.stock_in - record.stock_out));
                    });
                    return [3 /*break*/, 10];
                case 7:
                    error_1 = _a.sent();
                    console.error('Error importing size data:', error_1);
                    if (error_1.code === 11000) {
                        console.error('Duplicate key error - some records may already exist');
                        console.error('Try clearing the database first with: npm run clear-db');
                    }
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, app.close()];
                case 9:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
importSize();
