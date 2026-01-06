import '@testing-library/jest-dom';

if (typeof global.structuredClone === "undefined") {
    global.structuredClone = (obj) =>
        obj === undefined ? undefined : JSON.parse(JSON.stringify(obj));
}
