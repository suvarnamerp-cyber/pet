module.exports = [
"[project]/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPet",
    ()=>createPet,
    "deletePetByPublicUrl",
    ()=>deletePetByPublicUrl,
    "fetchPetByPublicUrl",
    ()=>fetchPetByPublicUrl,
    "fetchPetInventory",
    ()=>fetchPetInventory,
    "login",
    ()=>login,
    "resolveImageUrl",
    ()=>resolveImageUrl,
    "signup",
    ()=>signup
]);
const API_BASE = ("TURBOPACK compile-time value", "https:///petpaw-0dbw.onrender.com") || "http://192.168.1.34:8088";
function authHeaders(token) {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
}
function normalizePets(data) {
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object" && "petName" in data) return [
        data
    ];
    return [];
}
async function signup(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Signup failed");
    return res.text();
}
async function login(data) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
}
async function createPet(payload, token) {
    const formData = new FormData();
    const dto = {
        petName: payload.petName,
        ownerName: payload.ownerName,
        phone: payload.phone
    };
    formData.append("userInfoDTO", new Blob([
        JSON.stringify(dto)
    ], {
        type: "application/json"
    }));
    if (payload.photo) {
        formData.append("photo", payload.photo);
    }
    const res = await fetch(`${API_BASE}/info/create`, {
        method: "POST",
        headers: authHeaders(token),
        body: formData
    });
    if (!res.ok) throw new Error("Failed to create pet");
    return res.text();
}
async function fetchPetInventory(token) {
    const res = await fetch(`${API_BASE}/info`, {
        method: "GET",
        headers: authHeaders(token),
        cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch pets");
    const data = await res.json();
    return normalizePets(data);
}
async function fetchPetByPublicUrl(publicUrl) {
    const res = await fetch(`${API_BASE}/info/get/${encodeURIComponent(publicUrl)}`, {
        method: "GET",
        cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch pet details");
    return res.json();
}
async function deletePetByPublicUrl(publicUrl, token) {
    const res = await fetch(`${API_BASE}/info/${encodeURIComponent(publicUrl)}`, {
        method: "DELETE",
        headers: authHeaders(token)
    });
    const message = await res.text();
    const looksDeleted = message.toLowerCase().includes("deleted");
    // Some backend versions return non-2xx while still deleting successfully.
    if (!res.ok && !looksDeleted) {
        throw new Error("Failed to delete pet");
    }
    return message;
}
function resolveImageUrl(imagePath) {
    if (!imagePath) return "/pet-placeholder.svg";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
        return imagePath;
    }
    return `${API_BASE}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}
}),
"[project]/lib/auth-session.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearSession",
    ()=>clearSession,
    "getSession",
    ()=>getSession,
    "setSession",
    ()=>setSession
]);
const COOKIE_USER = "pettag_user";
const COOKIE_TOKEN = "pettag_token";
const MAX_AGE = 60 * 60 * 24 * 7;
function readCookie(name) {
    if (typeof document === "undefined") return "";
    const cookie = document.cookie.split(";").map((item)=>item.trim()).find((item)=>item.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}
function writeCookie(name, value, maxAge = MAX_AGE) {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
function setSession(session) {
    writeCookie(COOKIE_USER, session.userName);
    writeCookie(COOKIE_TOKEN, session.token);
}
function getSession() {
    const userName = readCookie(COOKIE_USER);
    const token = readCookie(COOKIE_TOKEN);
    if (!userName || !token) return null;
    return {
        userName,
        token
    };
}
function clearSession() {
    writeCookie(COOKIE_USER, "", 0);
    writeCookie(COOKIE_TOKEN, "", 0);
}
}),
"[project]/components/AuthCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AuthCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-ssr] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-ssr] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$session$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-session.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
function AuthCard() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("signup");
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        userName: "",
        password: ""
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    async function handleSubmit(event) {
        event.preventDefault();
        if (loading) return;
        const payload = {
            userName: form.userName.trim(),
            password: form.password.trim()
        };
        if (!payload.userName || !payload.password) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error("Username and password are required");
            return;
        }
        setLoading(true);
        try {
            if (mode === "signup") {
                const message = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signup"])(payload);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success(message || "Account created");
                setMode("login");
            } else {
                const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["login"])(payload);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$session$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setSession"])(session);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success(`Welcome ${session.userName}`);
                router.push("/dashboard");
            }
        } catch  {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error("Authentication failed");
        } finally{
            setLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full max-w-xl rounded-2xl bg-white/90 p-4 shadow-soft",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-semibold uppercase tracking-wide text-brand-500",
                        children: "Pet owner access"
                    }, void 0, false, {
                        fileName: "[project]/components/AuthCard.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1 rounded-full bg-brand-100 px-3 py-2 text-sm font-medium text-brand-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                size: 16
                            }, void 0, false, {
                                fileName: "[project]/components/AuthCard.tsx",
                                lineNumber: 58,
                                columnNumber: 11
                            }, this),
                            "Secure tags"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AuthCard.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AuthCard.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-3xl font-semibold text-ink-900",
                children: "Welcome back"
            }, void 0, false, {
                fileName: "[project]/components/AuthCard.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative mb-6 mt-4 grid grid-cols-2 gap-2 rounded-full bg-amber-100 p-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-full bg-white shadow transition-transform duration-200 ease-out ${mode === "login" ? "translate-x-full" : "translate-x-0"}`
                    }, void 0, false, {
                        fileName: "[project]/components/AuthCard.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        disabled: loading,
                        className: `relative z-10 rounded-full px-4 py-2 text-sm font-semibold ${mode === "signup" ? "text-ink-900" : "text-ink-600"} disabled:cursor-not-allowed disabled:opacity-50`,
                        onClick: ()=>setMode("signup"),
                        children: "Sign up"
                    }, void 0, false, {
                        fileName: "[project]/components/AuthCard.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        disabled: loading,
                        className: `relative z-10 rounded-full px-4 py-2 text-sm font-semibold ${mode === "login" ? "text-ink-900" : "text-ink-600"} disabled:cursor-not-allowed disabled:opacity-50`,
                        onClick: ()=>setMode("login"),
                        children: "Log in"
                    }, void 0, false, {
                        fileName: "[project]/components/AuthCard.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AuthCard.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium text-ink-700",
                        children: [
                            "User name",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                required: true,
                                type: "text",
                                value: form.userName,
                                onChange: (event)=>setForm({
                                        ...form,
                                        userName: event.target.value.replace(/\s+/g, "")
                                    }),
                                placeholder: "Enter your user name",
                                disabled: loading,
                                className: "mt-2 w-full rounded-xl border border-amber-100 bg-white px-4 py-3 text-ink-900 focus:border-brand-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                            }, void 0, false, {
                                fileName: "[project]/components/AuthCard.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AuthCard.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium text-ink-700",
                        children: [
                            "Password",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                required: true,
                                type: "password",
                                value: form.password,
                                onChange: (event)=>setForm({
                                        ...form,
                                        password: event.target.value
                                    }),
                                onBlur: ()=>setForm((prev)=>({
                                            ...prev,
                                            password: prev.password.trim()
                                        })),
                                placeholder: "Enter your password",
                                disabled: loading,
                                className: "mt-2 w-full rounded-xl border border-amber-100 bg-white px-4 py-3 text-ink-900 focus:border-brand-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                            }, void 0, false, {
                                fileName: "[project]/components/AuthCard.tsx",
                                lineNumber: 111,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AuthCard.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex w-full justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            disabled: loading,
                            className: "flex items-center gap-2 rounded-full border border-amber-200 bg-white px-5 py-3 text-sm font-semibold text-ink-700 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60",
                            children: [
                                loading ? "Please wait..." : mode === "signup" ? "Create account" : "Enter dashboard",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/components/AuthCard.tsx",
                                    lineNumber: 130,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AuthCard.tsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/AuthCard.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AuthCard.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-6 text-sm text-ink-600",
                children: "By continuing, you agree to share your pet details only with verified finders."
            }, void 0, false, {
                fileName: "[project]/components/AuthCard.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AuthCard.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_2f8001b7._.js.map