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
var mongoose_1 = require("@nestjs/mongoose");
function diagnoseSize() {
    return __awaiter(this, void 0, void 0, function () {
        var app, sizeModel, totalCount, sampleData, missingData, invalidTypes, duplicateCombinations, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, core_1.NestFactory.createApplicationContext(app_module_1.AppModule)];
                case 1:
                    app = _a.sent();
                    sizeModel = app.get((0, mongoose_1.getModelToken)('Size'));
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 8, 9, 11]);
                    console.log('🔍 Diagnosing Size Collection Issues...\n');
                    return [4 /*yield*/, sizeModel.countDocuments()];
                case 3:
                    totalCount = _a.sent();
                    console.log("\uD83D\uDCCA Total size records: ".concat(totalCount));
                    return [4 /*yield*/, sizeModel.find().limit(3)];
                case 4:
                    sampleData = _a.sent();
                    console.log('\n📝 Sample size data:');
                    sampleData.forEach(function (size, index) {
                        console.log("   ".concat(index + 1, ". _id: ").concat(size._id, ", product_id: ").concat(size.product_id, ", color_id: ").concat(size.color_id, ", size: ").concat(size.size, ", stock_in: ").concat(size.stock_in, ", stock_out: ").concat(size.stock_out));
                    });
                    // 3. ตรวจสอบ schema validation
                    console.log('\n🔧 Schema Validation:');
                    console.log('   Required fields: product_id, color_id, size, stock_in, stock_out');
                    return [4 /*yield*/, sizeModel.find({
                            $or: [
                                { product_id: { $exists: false } },
                                { color_id: { $exists: false } },
                                { size: { $exists: false } },
                                { stock_in: { $exists: false } },
                                { stock_out: { $exists: false } }
                            ]
                        })];
                case 5:
                    missingData = _a.sent();
                    if (missingData.length > 0) {
                        console.log("   \u274C Found ".concat(missingData.length, " records with missing required fields"));
                    }
                    else {
                        console.log('   ✅ All records have required fields');
                    }
                    return [4 /*yield*/, sizeModel.find({
                            $or: [
                                { product_id: { $not: { $type: 'number' } } },
                                { color_id: { $not: { $type: 'number' } } },
                                { size: { $not: { $type: 'number' } } },
                                { stock_in: { $not: { $type: 'number' } } },
                                { stock_out: { $not: { $type: 'number' } } }
                            ]
                        })];
                case 6:
                    invalidTypes = _a.sent();
                    if (invalidTypes.length > 0) {
                        console.log("   \u274C Found ".concat(invalidTypes.length, " records with invalid data types"));
                    }
                    else {
                        console.log('   ✅ All records have correct data types');
                    }
                    return [4 /*yield*/, sizeModel.aggregate([
                            {
                                $group: {
                                    _id: { product_id: '$product_id', color_id: '$color_id', size: '$size' },
                                    count: { $sum: 1 }
                                }
                            },
                            { $match: { count: { $gt: 1 } } }
                        ])];
                case 7:
                    duplicateCombinations = _a.sent();
                    if (duplicateCombinations.length > 0) {
                        console.log('\n❌ Duplicate combinations found:');
                        duplicateCombinations.forEach(function (dup) {
                            console.log("   product_id: ".concat(dup._id.product_id, ", color_id: ").concat(dup._id.color_id, ", size: ").concat(dup._id.size, " appears ").concat(dup.count, " times"));
                        });
                    }
                    else {
                        console.log('\n✅ No duplicate combinations found');
                    }
                    console.log('\n🎯 Recommendations:');
                    if (duplicateCombinations.length > 0) {
                        console.log('   1. Clear database and re-import with unique combinations');
                        console.log('   2. Use: npm run clear-db && npm run import-size');
                    }
                    if (totalCount === 0) {
                        console.log('   1. Import size data using: npm run import-size');
                        console.log('   2. Make sure your JSON file exists in data/ folder');
                    }
                    if (totalCount > 0 && duplicateCombinations.length === 0 && missingData.length === 0 && invalidTypes.length === 0) {
                        console.log('   ✅ Size collection looks healthy!');
                    }
                    return [3 /*break*/, 11];
                case 8:
                    error_1 = _a.sent();
                    console.error('❌ Error diagnosing size collection:', error_1);
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, app.close()];
                case 10:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
diagnoseSize();
