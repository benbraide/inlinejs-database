export function DispatchEvent(el, event, detail) {
    el.dispatchEvent(new CustomEvent(`db.${event}`, { detail }));
    el.dispatchEvent(new CustomEvent(`database.${event}`, { detail }));
}
