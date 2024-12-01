const midtransClient = require('midtrans-client');

// Buat konfigurasi Core API
let coreApi = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: 'Mid-server-Igu1ZDo-j_DKmdaGJrAq-d8G',
    clientKey: 'Mid-client-AhbWJjLsNnRGxuox'
});

// Buat konfigurasi Snap
let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: 'Mid-server-Igu1ZDo-j_DKmdaGJrAq-d8G',
    clientKey: 'Mid-client-AhbWJjLsNnRGxuox'
});

module.exports = { coreApi, snap };