export function DispatchEvent(el: Element, event: string, detail?: any){
    el.dispatchEvent(new CustomEvent(`db.${event}`, { detail }));
    el.dispatchEvent(new CustomEvent(`database.${event}`, { detail }));
}