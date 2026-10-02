// Fixture calibration cache-buster. Every runtime adapter is loaded through
// the same versioned URL so a client cannot combine old installers with this
// fixture-only coordinate adapter.
import "./ascendancy-installer.js?dbx=0.1.3";
import "./foundry-live-bridge.js?dbx=0.1.3";
import "./module.js?dbx=0.1.4";
