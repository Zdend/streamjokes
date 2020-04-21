export function pushData(data) {
    if (window.dataLayer && window.dataLayer.push) {
        window.dataLayer.push(data);
    }
}