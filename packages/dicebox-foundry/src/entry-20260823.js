// Foundry module cache-buster for the reviewed Foundry 14 renderer repair.
// Import only this entry from the manifest. Every runtime adapter receives the
// same explicit versioned URL so a bounded GM reload cannot silently mix old
// bridge/installer code with a new entry module.
import "./ascendancy-installer.js?dbx=0.1.2";
import "./foundry-live-bridge.js?dbx=0.1.2";
import "./module.js?dbx=0.1.2";
