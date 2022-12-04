"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchEvent = void 0;
function DispatchEvent(el, event, detail) {
    el.dispatchEvent(new CustomEvent(`db.${event}`, { detail }));
    el.dispatchEvent(new CustomEvent(`database.${event}`, { detail }));
}
exports.DispatchEvent = DispatchEvent;
