"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/audit-logs/route";
exports.ids = ["app/api/audit-logs/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Faudit-logs%2Froute&page=%2Fapi%2Faudit-logs%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Faudit-logs%2Froute.ts&appDir=%2FUsers%2Fpranavtyagi%2FDesktop%2Fstudent-attendance-system%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fpranavtyagi%2FDesktop%2Fstudent-attendance-system&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Faudit-logs%2Froute&page=%2Fapi%2Faudit-logs%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Faudit-logs%2Froute.ts&appDir=%2FUsers%2Fpranavtyagi%2FDesktop%2Fstudent-attendance-system%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fpranavtyagi%2FDesktop%2Fstudent-attendance-system&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_pranavtyagi_Desktop_student_attendance_system_src_app_api_audit_logs_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/audit-logs/route.ts */ \"(rsc)/./src/app/api/audit-logs/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/audit-logs/route\",\n        pathname: \"/api/audit-logs\",\n        filename: \"route\",\n        bundlePath: \"app/api/audit-logs/route\"\n    },\n    resolvedPagePath: \"/Users/pranavtyagi/Desktop/student-attendance-system/src/app/api/audit-logs/route.ts\",\n    nextConfigOutput,\n    userland: _Users_pranavtyagi_Desktop_student_attendance_system_src_app_api_audit_logs_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/audit-logs/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdWRpdC1sb2dzJTJGcm91dGUmcGFnZT0lMkZhcGklMkZhdWRpdC1sb2dzJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGYXVkaXQtbG9ncyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRnByYW5hdnR5YWdpJTJGRGVza3RvcCUyRnN0dWRlbnQtYXR0ZW5kYW5jZS1zeXN0ZW0lMkZzcmMlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGcHJhbmF2dHlhZ2klMkZEZXNrdG9wJTJGc3R1ZGVudC1hdHRlbmRhbmNlLXN5c3RlbSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDb0M7QUFDakg7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zdHVkZW50LWF0dGVuZGFuY2Utc3lzdGVtLz9jNWVjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9wcmFuYXZ0eWFnaS9EZXNrdG9wL3N0dWRlbnQtYXR0ZW5kYW5jZS1zeXN0ZW0vc3JjL2FwcC9hcGkvYXVkaXQtbG9ncy9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXVkaXQtbG9ncy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1ZGl0LWxvZ3NcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2F1ZGl0LWxvZ3Mvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvcHJhbmF2dHlhZ2kvRGVza3RvcC9zdHVkZW50LWF0dGVuZGFuY2Utc3lzdGVtL3NyYy9hcHAvYXBpL2F1ZGl0LWxvZ3Mvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL2F1ZGl0LWxvZ3Mvcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Faudit-logs%2Froute&page=%2Fapi%2Faudit-logs%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Faudit-logs%2Froute.ts&appDir=%2FUsers%2Fpranavtyagi%2FDesktop%2Fstudent-attendance-system%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fpranavtyagi%2FDesktop%2Fstudent-attendance-system&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/audit-logs/route.ts":
/*!*****************************************!*\
  !*** ./src/app/api/audit-logs/route.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   dynamic: () => (/* binding */ dynamic)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n\n\n\nconst dynamic = \"force-dynamic\";\nasync function GET(req) {\n    try {\n        const session = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.getSession)(req);\n        if (!session || session.role !== \"ADMIN\") {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Forbidden: Admin access required\"\n            }, {\n                status: 403\n            });\n        }\n        const { searchParams } = new URL(req.url);\n        const limit = Number(searchParams.get(\"limit\")) || 50;\n        const logs = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.auditLog.findMany({\n            orderBy: {\n                createdAt: \"desc\"\n            },\n            take: limit,\n            include: {\n                user: {\n                    select: {\n                        username: true,\n                        email: true,\n                        role: true\n                    }\n                }\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            logs,\n            total: logs.length\n        });\n    } catch (error) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error.message\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdWRpdC1sb2dzL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQXdEO0FBQ2xCO0FBQ0U7QUFFakMsTUFBTUcsVUFBVSxnQkFBZ0I7QUFFaEMsZUFBZUMsSUFBSUMsR0FBZ0I7SUFDeEMsSUFBSTtRQUNGLE1BQU1DLFVBQVUsTUFBTUoscURBQVVBLENBQUNHO1FBQ2pDLElBQUksQ0FBQ0MsV0FBV0EsUUFBUUMsSUFBSSxLQUFLLFNBQVM7WUFDeEMsT0FBT1AscURBQVlBLENBQUNRLElBQUksQ0FBQztnQkFBRUMsT0FBTztZQUFtQyxHQUFHO2dCQUFFQyxRQUFRO1lBQUk7UUFDeEY7UUFFQSxNQUFNLEVBQUVDLFlBQVksRUFBRSxHQUFHLElBQUlDLElBQUlQLElBQUlRLEdBQUc7UUFDeEMsTUFBTUMsUUFBUUMsT0FBT0osYUFBYUssR0FBRyxDQUFDLGFBQWE7UUFFbkQsTUFBTUMsT0FBTyxNQUFNaEIsK0NBQU1BLENBQUNpQixRQUFRLENBQUNDLFFBQVEsQ0FBQztZQUMxQ0MsU0FBUztnQkFBRUMsV0FBVztZQUFPO1lBQzdCQyxNQUFNUjtZQUNOUyxTQUFTO2dCQUNQQyxNQUFNO29CQUNKQyxRQUFRO3dCQUNOQyxVQUFVO3dCQUNWQyxPQUFPO3dCQUNQcEIsTUFBTTtvQkFDUjtnQkFDRjtZQUNGO1FBQ0Y7UUFFQSxPQUFPUCxxREFBWUEsQ0FBQ1EsSUFBSSxDQUFDO1lBQ3ZCb0IsU0FBUztZQUNUWDtZQUNBWSxPQUFPWixLQUFLYSxNQUFNO1FBQ3BCO0lBQ0YsRUFBRSxPQUFPckIsT0FBWTtRQUNuQixPQUFPVCxxREFBWUEsQ0FBQ1EsSUFBSSxDQUFDO1lBQUVDLE9BQU9BLE1BQU1zQixPQUFPO1FBQUMsR0FBRztZQUFFckIsUUFBUTtRQUFJO0lBQ25FO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zdHVkZW50LWF0dGVuZGFuY2Utc3lzdGVtLy4vc3JjL2FwcC9hcGkvYXVkaXQtbG9ncy9yb3V0ZS50cz8yOTk4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gXCJAL2xpYi9wcmlzbWFcIjtcbmltcG9ydCB7IGdldFNlc3Npb24gfSBmcm9tIFwiQC9saWIvYXV0aFwiO1xuXG5leHBvcnQgY29uc3QgZHluYW1pYyA9IFwiZm9yY2UtZHluYW1pY1wiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcTogTmV4dFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2Vzc2lvbihyZXEpO1xuICAgIGlmICghc2Vzc2lvbiB8fCBzZXNzaW9uLnJvbGUgIT09IFwiQURNSU5cIikge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiRm9yYmlkZGVuOiBBZG1pbiBhY2Nlc3MgcmVxdWlyZWRcIiB9LCB7IHN0YXR1czogNDAzIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHsgc2VhcmNoUGFyYW1zIH0gPSBuZXcgVVJMKHJlcS51cmwpO1xuICAgIGNvbnN0IGxpbWl0ID0gTnVtYmVyKHNlYXJjaFBhcmFtcy5nZXQoXCJsaW1pdFwiKSkgfHwgNTA7XG5cbiAgICBjb25zdCBsb2dzID0gYXdhaXQgcHJpc21hLmF1ZGl0TG9nLmZpbmRNYW55KHtcbiAgICAgIG9yZGVyQnk6IHsgY3JlYXRlZEF0OiBcImRlc2NcIiB9LFxuICAgICAgdGFrZTogbGltaXQsXG4gICAgICBpbmNsdWRlOiB7XG4gICAgICAgIHVzZXI6IHtcbiAgICAgICAgICBzZWxlY3Q6IHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiB0cnVlLFxuICAgICAgICAgICAgZW1haWw6IHRydWUsXG4gICAgICAgICAgICByb2xlOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICBsb2dzLFxuICAgICAgdG90YWw6IGxvZ3MubGVuZ3RoLFxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInByaXNtYSIsImdldFNlc3Npb24iLCJkeW5hbWljIiwiR0VUIiwicmVxIiwic2Vzc2lvbiIsInJvbGUiLCJqc29uIiwiZXJyb3IiLCJzdGF0dXMiLCJzZWFyY2hQYXJhbXMiLCJVUkwiLCJ1cmwiLCJsaW1pdCIsIk51bWJlciIsImdldCIsImxvZ3MiLCJhdWRpdExvZyIsImZpbmRNYW55Iiwib3JkZXJCeSIsImNyZWF0ZWRBdCIsInRha2UiLCJpbmNsdWRlIiwidXNlciIsInNlbGVjdCIsInVzZXJuYW1lIiwiZW1haWwiLCJzdWNjZXNzIiwidG90YWwiLCJsZW5ndGgiLCJtZXNzYWdlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/audit-logs/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth.ts":
/*!*************************!*\
  !*** ./src/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AUTH_COOKIE_NAME: () => (/* binding */ AUTH_COOKIE_NAME),\n/* harmony export */   comparePassword: () => (/* binding */ comparePassword),\n/* harmony export */   getSession: () => (/* binding */ getSession),\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   signToken: () => (/* binding */ signToken),\n/* harmony export */   verifyToken: () => (/* binding */ verifyToken)\n/* harmony export */ });\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n/* harmony import */ var _prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./prisma */ \"(rsc)/./src/lib/prisma.ts\");\n\n\n\n\nconst AUTH_COOKIE_NAME = \"attendance_session_token\";\nconst JWT_SECRET = process.env.JWT_SECRET || \"student-attendance-super-secret-jwt-key-2026-production-ready\";\nasync function hashPassword(plainText) {\n    const salt = await bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().genSalt(10);\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().hash(plainText, salt);\n}\nasync function comparePassword(plainText, hash) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().compare(plainText, hash);\n}\nfunction signToken(payload) {\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().sign(payload, JWT_SECRET, {\n        expiresIn: \"7d\"\n    });\n}\nfunction verifyToken(token) {\n    try {\n        return jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().verify(token, JWT_SECRET);\n    } catch  {\n        return null;\n    }\n}\n/**\n * Extracts and verifies the current session from NextRequest or next/headers cookies.\n */ async function getSession(req) {\n    let token;\n    if (req) {\n        token = req.cookies.get(AUTH_COOKIE_NAME)?.value;\n        if (!token) {\n            const authHeader = req.headers.get(\"authorization\");\n            if (authHeader && authHeader.startsWith(\"Bearer \")) {\n                token = authHeader.substring(7);\n            }\n        }\n    } else {\n        try {\n            const cookieStore = (0,next_headers__WEBPACK_IMPORTED_MODULE_2__.cookies)();\n            token = cookieStore.get(AUTH_COOKIE_NAME)?.value;\n        } catch  {\n            return null;\n        }\n    }\n    if (!token) return null;\n    const decoded = verifyToken(token);\n    if (!decoded) return null;\n    // Verify that the user still exists in the database\n    const user = await _prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.user.findUnique({\n        where: {\n            id: decoded.userId\n        },\n        include: {\n            student: true\n        }\n    });\n    if (!user) return null;\n    return {\n        userId: user.id,\n        email: user.email,\n        username: user.username,\n        role: user.role,\n        studentId: user.student?.id,\n        fullName: user.student?.fullName || user.username\n    };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2F1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQThCO0FBQ0M7QUFDUTtBQUVMO0FBRTNCLE1BQU1JLG1CQUFtQiwyQkFBMkI7QUFDM0QsTUFBTUMsYUFBYUMsUUFBUUMsR0FBRyxDQUFDRixVQUFVLElBQUk7QUFXdEMsZUFBZUcsYUFBYUMsU0FBaUI7SUFDbEQsTUFBTUMsT0FBTyxNQUFNVix1REFBYyxDQUFDO0lBQ2xDLE9BQU9BLG9EQUFXLENBQUNTLFdBQVdDO0FBQ2hDO0FBRU8sZUFBZUcsZ0JBQWdCSixTQUFpQixFQUFFRyxJQUFZO0lBQ25FLE9BQU9aLHVEQUFjLENBQUNTLFdBQVdHO0FBQ25DO0FBRU8sU0FBU0csVUFBVUMsT0FBcUI7SUFDN0MsT0FBT2Ysd0RBQVEsQ0FBQ2UsU0FBU1gsWUFBWTtRQUFFYSxXQUFXO0lBQUs7QUFDekQ7QUFFTyxTQUFTQyxZQUFZQyxLQUFhO0lBQ3ZDLElBQUk7UUFDRixPQUFPbkIsMERBQVUsQ0FBQ21CLE9BQU9mO0lBQzNCLEVBQUUsT0FBTTtRQUNOLE9BQU87SUFDVDtBQUNGO0FBRUE7O0NBRUMsR0FDTSxlQUFlaUIsV0FBV0MsR0FBaUI7SUFDaEQsSUFBSUg7SUFFSixJQUFJRyxLQUFLO1FBQ1BILFFBQVFHLElBQUlyQixPQUFPLENBQUNzQixHQUFHLENBQUNwQixtQkFBbUJxQjtRQUMzQyxJQUFJLENBQUNMLE9BQU87WUFDVixNQUFNTSxhQUFhSCxJQUFJSSxPQUFPLENBQUNILEdBQUcsQ0FBQztZQUNuQyxJQUFJRSxjQUFjQSxXQUFXRSxVQUFVLENBQUMsWUFBWTtnQkFDbERSLFFBQVFNLFdBQVdHLFNBQVMsQ0FBQztZQUMvQjtRQUNGO0lBQ0YsT0FBTztRQUNMLElBQUk7WUFDRixNQUFNQyxjQUFjNUIscURBQU9BO1lBQzNCa0IsUUFBUVUsWUFBWU4sR0FBRyxDQUFDcEIsbUJBQW1CcUI7UUFDN0MsRUFBRSxPQUFNO1lBQ04sT0FBTztRQUNUO0lBQ0Y7SUFFQSxJQUFJLENBQUNMLE9BQU8sT0FBTztJQUNuQixNQUFNVyxVQUFVWixZQUFZQztJQUM1QixJQUFJLENBQUNXLFNBQVMsT0FBTztJQUVyQixvREFBb0Q7SUFDcEQsTUFBTUMsT0FBTyxNQUFNN0IsMkNBQU1BLENBQUM2QixJQUFJLENBQUNDLFVBQVUsQ0FBQztRQUN4Q0MsT0FBTztZQUFFQyxJQUFJSixRQUFRSyxNQUFNO1FBQUM7UUFDNUJDLFNBQVM7WUFBRUMsU0FBUztRQUFLO0lBQzNCO0lBRUEsSUFBSSxDQUFDTixNQUFNLE9BQU87SUFFbEIsT0FBTztRQUNMSSxRQUFRSixLQUFLRyxFQUFFO1FBQ2ZJLE9BQU9QLEtBQUtPLEtBQUs7UUFDakJDLFVBQVVSLEtBQUtRLFFBQVE7UUFDdkJDLE1BQU1ULEtBQUtTLElBQUk7UUFDZkMsV0FBV1YsS0FBS00sT0FBTyxFQUFFSDtRQUN6QlEsVUFBVVgsS0FBS00sT0FBTyxFQUFFSyxZQUFZWCxLQUFLUSxRQUFRO0lBQ25EO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zdHVkZW50LWF0dGVuZGFuY2Utc3lzdGVtLy4vc3JjL2xpYi9hdXRoLnRzPzY2OTIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJjcnlwdCBmcm9tIFwiYmNyeXB0anNcIjtcbmltcG9ydCBqd3QgZnJvbSBcImpzb253ZWJ0b2tlblwiO1xuaW1wb3J0IHsgY29va2llcyB9IGZyb20gXCJuZXh0L2hlYWRlcnNcIjtcbmltcG9ydCB7IE5leHRSZXF1ZXN0IH0gZnJvbSBcIm5leHQvc2VydmVyXCI7XG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tIFwiLi9wcmlzbWFcIjtcblxuZXhwb3J0IGNvbnN0IEFVVEhfQ09PS0lFX05BTUUgPSBcImF0dGVuZGFuY2Vfc2Vzc2lvbl90b2tlblwiO1xuY29uc3QgSldUX1NFQ1JFVCA9IHByb2Nlc3MuZW52LkpXVF9TRUNSRVQgfHwgXCJzdHVkZW50LWF0dGVuZGFuY2Utc3VwZXItc2VjcmV0LWp3dC1rZXktMjAyNi1wcm9kdWN0aW9uLXJlYWR5XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVG9rZW5QYXlsb2FkIHtcbiAgdXNlcklkOiBzdHJpbmc7XG4gIGVtYWlsOiBzdHJpbmc7XG4gIHVzZXJuYW1lOiBzdHJpbmc7XG4gIHJvbGU6IFwiQURNSU5cIiB8IFwiU1RVREVOVFwiO1xuICBzdHVkZW50SWQ/OiBzdHJpbmc7XG4gIGZ1bGxOYW1lPzogc3RyaW5nO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFzaFBhc3N3b3JkKHBsYWluVGV4dDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3Qgc2FsdCA9IGF3YWl0IGJjcnlwdC5nZW5TYWx0KDEwKTtcbiAgcmV0dXJuIGJjcnlwdC5oYXNoKHBsYWluVGV4dCwgc2FsdCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21wYXJlUGFzc3dvcmQocGxhaW5UZXh0OiBzdHJpbmcsIGhhc2g6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICByZXR1cm4gYmNyeXB0LmNvbXBhcmUocGxhaW5UZXh0LCBoYXNoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNpZ25Ub2tlbihwYXlsb2FkOiBUb2tlblBheWxvYWQpOiBzdHJpbmcge1xuICByZXR1cm4gand0LnNpZ24ocGF5bG9hZCwgSldUX1NFQ1JFVCwgeyBleHBpcmVzSW46IFwiN2RcIiB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmeVRva2VuKHRva2VuOiBzdHJpbmcpOiBUb2tlblBheWxvYWQgfCBudWxsIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gand0LnZlcmlmeSh0b2tlbiwgSldUX1NFQ1JFVCkgYXMgVG9rZW5QYXlsb2FkO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIEV4dHJhY3RzIGFuZCB2ZXJpZmllcyB0aGUgY3VycmVudCBzZXNzaW9uIGZyb20gTmV4dFJlcXVlc3Qgb3IgbmV4dC9oZWFkZXJzIGNvb2tpZXMuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTZXNzaW9uKHJlcT86IE5leHRSZXF1ZXN0KTogUHJvbWlzZTxUb2tlblBheWxvYWQgfCBudWxsPiB7XG4gIGxldCB0b2tlbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIGlmIChyZXEpIHtcbiAgICB0b2tlbiA9IHJlcS5jb29raWVzLmdldChBVVRIX0NPT0tJRV9OQU1FKT8udmFsdWU7XG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgY29uc3QgYXV0aEhlYWRlciA9IHJlcS5oZWFkZXJzLmdldChcImF1dGhvcml6YXRpb25cIik7XG4gICAgICBpZiAoYXV0aEhlYWRlciAmJiBhdXRoSGVhZGVyLnN0YXJ0c1dpdGgoXCJCZWFyZXIgXCIpKSB7XG4gICAgICAgIHRva2VuID0gYXV0aEhlYWRlci5zdWJzdHJpbmcoNyk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjb29raWVTdG9yZSA9IGNvb2tpZXMoKTtcbiAgICAgIHRva2VuID0gY29va2llU3RvcmUuZ2V0KEFVVEhfQ09PS0lFX05BTUUpPy52YWx1ZTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGlmICghdG9rZW4pIHJldHVybiBudWxsO1xuICBjb25zdCBkZWNvZGVkID0gdmVyaWZ5VG9rZW4odG9rZW4pO1xuICBpZiAoIWRlY29kZWQpIHJldHVybiBudWxsO1xuXG4gIC8vIFZlcmlmeSB0aGF0IHRoZSB1c2VyIHN0aWxsIGV4aXN0cyBpbiB0aGUgZGF0YWJhc2VcbiAgY29uc3QgdXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmZpbmRVbmlxdWUoe1xuICAgIHdoZXJlOiB7IGlkOiBkZWNvZGVkLnVzZXJJZCB9LFxuICAgIGluY2x1ZGU6IHsgc3R1ZGVudDogdHJ1ZSB9LFxuICB9KTtcblxuICBpZiAoIXVzZXIpIHJldHVybiBudWxsO1xuXG4gIHJldHVybiB7XG4gICAgdXNlcklkOiB1c2VyLmlkLFxuICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgIHVzZXJuYW1lOiB1c2VyLnVzZXJuYW1lLFxuICAgIHJvbGU6IHVzZXIucm9sZSBhcyBcIkFETUlOXCIgfCBcIlNUVURFTlRcIixcbiAgICBzdHVkZW50SWQ6IHVzZXIuc3R1ZGVudD8uaWQsXG4gICAgZnVsbE5hbWU6IHVzZXIuc3R1ZGVudD8uZnVsbE5hbWUgfHwgdXNlci51c2VybmFtZSxcbiAgfTtcbn1cbiJdLCJuYW1lcyI6WyJiY3J5cHQiLCJqd3QiLCJjb29raWVzIiwicHJpc21hIiwiQVVUSF9DT09LSUVfTkFNRSIsIkpXVF9TRUNSRVQiLCJwcm9jZXNzIiwiZW52IiwiaGFzaFBhc3N3b3JkIiwicGxhaW5UZXh0Iiwic2FsdCIsImdlblNhbHQiLCJoYXNoIiwiY29tcGFyZVBhc3N3b3JkIiwiY29tcGFyZSIsInNpZ25Ub2tlbiIsInBheWxvYWQiLCJzaWduIiwiZXhwaXJlc0luIiwidmVyaWZ5VG9rZW4iLCJ0b2tlbiIsInZlcmlmeSIsImdldFNlc3Npb24iLCJyZXEiLCJnZXQiLCJ2YWx1ZSIsImF1dGhIZWFkZXIiLCJoZWFkZXJzIiwic3RhcnRzV2l0aCIsInN1YnN0cmluZyIsImNvb2tpZVN0b3JlIiwiZGVjb2RlZCIsInVzZXIiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJpZCIsInVzZXJJZCIsImluY2x1ZGUiLCJzdHVkZW50IiwiZW1haWwiLCJ1c2VybmFtZSIsInJvbGUiLCJzdHVkZW50SWQiLCJmdWxsTmFtZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/prisma.ts":
/*!***************************!*\
  !*** ./src/lib/prisma.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log:  true ? [\n        \"warn\",\n        \"error\"\n    ] : 0\n});\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3ByaXNtYS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBOEM7QUFFOUMsTUFBTUMsa0JBQWtCQztBQUlqQixNQUFNQyxTQUNYRixnQkFBZ0JFLE1BQU0sSUFDdEIsSUFBSUgsd0RBQVlBLENBQUM7SUFDZkksS0FBS0MsS0FBc0MsR0FBRztRQUFDO1FBQVE7S0FBUSxHQUFHLENBQVM7QUFDN0UsR0FBRztBQUVMLElBQUlBLElBQXFDLEVBQUVKLGdCQUFnQkUsTUFBTSxHQUFHQSIsInNvdXJjZXMiOlsid2VicGFjazovL3N0dWRlbnQtYXR0ZW5kYW5jZS1zeXN0ZW0vLi9zcmMvbGliL3ByaXNtYS50cz8wMWQ3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiO1xuXG5jb25zdCBnbG9iYWxGb3JQcmlzbWEgPSBnbG9iYWxUaGlzIGFzIHVua25vd24gYXMge1xuICBwcmlzbWE6IFByaXNtYUNsaWVudCB8IHVuZGVmaW5lZDtcbn07XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPVxuICBnbG9iYWxGb3JQcmlzbWEucHJpc21hID8/XG4gIG5ldyBQcmlzbWFDbGllbnQoe1xuICAgIGxvZzogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwiZGV2ZWxvcG1lbnRcIiA/IFtcIndhcm5cIiwgXCJlcnJvclwiXSA6IFtcImVycm9yXCJdLFxuICB9KTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA9IHByaXNtYTtcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJnbG9iYWxGb3JQcmlzbWEiLCJnbG9iYWxUaGlzIiwicHJpc21hIiwibG9nIiwicHJvY2VzcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/semver","vendor-chunks/bcryptjs","vendor-chunks/jsonwebtoken","vendor-chunks/lodash.includes","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/lodash.isinteger","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/lodash.isplainobject","vendor-chunks/ms","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Faudit-logs%2Froute&page=%2Fapi%2Faudit-logs%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Faudit-logs%2Froute.ts&appDir=%2FUsers%2Fpranavtyagi%2FDesktop%2Fstudent-attendance-system%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fpranavtyagi%2FDesktop%2Fstudent-attendance-system&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();