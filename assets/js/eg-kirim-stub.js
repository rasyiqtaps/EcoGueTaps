/* Adapter PENGIRIMAN DEMO: menyimpan foto di IndexedDB browser, bukan server. */
window.EcoGueTaps = window.EcoGueTaps || {};
window.EcoGueTaps.kirimQuest = async function (quest, payload) {
    if (!window.EcoGueTapsStore) {
        return { ok: false, message: 'Penyimpanan demo belum tersedia.' };
    }
    try {
        await window.EcoGueTapsStore.submit(quest, payload && payload.file, payload && payload.catatan);
        return { ok: true, status: 'terkirim', message: 'Foto tersimpan di browser. Menunggu verifikasi demo.' };
    } catch (error) {
        return { ok: false, message: error.message || 'Bukti gagal disimpan.' };
    }
};
