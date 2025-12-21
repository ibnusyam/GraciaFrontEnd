// src/config/menuConfig.js

import { hrdMenu } from "../modules/HRD/menu";
import { produksiMenu } from "../modules/Produksi/menu";
import { itMenu } from "../modules/IT/menu";
// import { csMenu } from "../modules/CS/menu";

// 🔥 PASTIKAN ADA KATA KUNCI 'export' DI SINI
export const appMenus = [hrdMenu, produksiMenu, itMenu];

// Pastikan Anda tidak menggunakan 'export default appMenus;'
// karena di Sidebar.jsx Anda mengimpornya sebagai named export:
// import { appMenus } from "../../config/menuConfig";
