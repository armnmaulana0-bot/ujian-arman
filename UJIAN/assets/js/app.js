/* =========================
   DATA HARGA MOBIL
========================= */

const daftarMobil = {
    "Toyota": 350000,
    "Honda CR-V": 500000,
    "Mobil Pilihan 3": 400000,
    "Mobil Pilihan 4": 450000,
    "Mobil Pilihan 5": 600000,
    "Toyota Cilegon": 550000
};


/* =========================
   FORMAT RUPIAH
========================= */

function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}


/* =========================
   MEMILIH MOBIL
========================= */

function pilihMobil(namaMobil, harga) {

    // Menyimpan pilihan mobil
    localStorage.setItem("mobilDipilih", namaMobil);
    localStorage.setItem("hargaMobil", harga);

    // Pindah ke halaman penyewaan
    window.location.href = "penyewaan.html";
}


/* =========================
   FORM PENYEWAAN
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("formPenyewaan");

    // Jika halaman bukan halaman formulir,
    // hentikan proses bagian formulir.
    if (!form) {
        return;
    }

    const inputNama = document.getElementById("nama");
    const inputTelepon = document.getElementById("telepon");
    const inputMobil = document.getElementById("mobil");
    const inputTanggal = document.getElementById("tanggal");
    const inputDurasi = document.getElementById("durasi");
    const inputHarga = document.getElementById("harga");
    const inputTotal = document.getElementById("total");
    const pesan = document.getElementById("pesan");

    // Mengambil pilihan mobil dari halaman produk
    const mobilTersimpan = localStorage.getItem("mobilDipilih");

    if (mobilTersimpan && daftarMobil[mobilTersimpan]) {
        inputMobil.value = mobilTersimpan;
    }

    // Mengatur tanggal minimum menjadi hari ini
    const hariIni = new Date();
    const tahun = hariIni.getFullYear();
    const bulan = String(hariIni.getMonth() + 1).padStart(2, "0");
    const tanggal = String(hariIni.getDate()).padStart(2, "0");



    /* =========================
       MENGHITUNG HARGA
    ========================= */

    function hitungTotal() {

        const namaMobil = inputMobil.value;
        const durasi = Number(inputDurasi.value);
        const harga = daftarMobil[namaMobil] || 0;
        const peringatan = document.getElementById("peringatanDurasi");

        inputHarga.value = harga ? formatRupiah(harga) : "";

        //validasi lama penyewaan
        if(
            inputDurasi.value !== "" &&
            (!Number.isInteger(durasi) || durasi < 1)
        ){
            peringatan.style.display = "block";
            inputDurasi.classList.add("input-error");
            inputTotal.value ="";
            return;
        }

        //jika durasi sudh benar
        peringatan.style.display = "none";
        inputDurasi.classList.remove("input-error");

        if (harga > 0 && durasi > 0) {
            const total = harga * durasi;
            inputTotal.value = formatRupiah(total);
        } else {
            inputTotal.value = "";
        }
    }

    // Hitung ulang ketika mobil atau durasi berubah
    inputMobil.addEventListener("change", hitungTotal);
    inputDurasi.addEventListener("input", hitungTotal);

    // Tampilkan harga awal jika mobil sudah dipilih
    hitungTotal();


    /* =========================
       MENGIRIM FORMULIR
    ========================= */

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const nama = inputNama.value.trim();
        const telepon = inputTelepon.value.trim();
        const mobil = inputMobil.value;
        const tanggalSewa = inputTanggal.value;
        const durasi = Number(inputDurasi.value);
        const harga = daftarMobil[mobil] || 0;

        //validasi nama


        // Validasi data wajib diisi
        if (!nama || !telepon || !mobil || !tanggalSewa || !inputDurasi.value) {
            pesan.textContent = "Mohon lengkapi semua data!";
            pesan.style.color = "red";
            return;
        }

        // Validasi nama harus diakhiri 007
        const polaNama = /^[a-zA-Z ]+007$/;

        if (!polaNama.test(nama)) {
            pesan.textContent = "Nama wajib diakhiri dengan 007!";
            pesan.style.color = "red";
            inputNama.focus();
            return;
        }

        // Validasi durasi penyewaan
        if (!Number.isInteger(durasi) || durasi < 1) {
            pesan.textContent = "Lama penyewaan tidak boleh kurang dari 1 hari!";
            pesan.style.color = "red";
            inputDurasi.focus();
            return;
        }

        // Validasi nomor telepon
        if (!/^[0-9+\-\s]{8,15}$/.test(telepon)) {
            pesan.textContent = "Nomor telepon tidak valid!";
            pesan.style.color = "red";
            return;
        }

        // Menghitung total pembayaran
        const total = harga * durasi;

        // Menampilkan hasil penyewaan
        pesan.innerHTML = `
            Penyewaan berhasil diproses!<br><br>
            Nama: ${nama.replace(/[&<>"']/g, "")}<br>
            Nomor Telepon: ${telepon}<br>
            Mobil: ${mobil}<br>
            Tanggal Sewa: ${tanggalSewa}<br>
            Lama Sewa: ${durasi} hari<br>
            Harga per Hari: ${formatRupiah(harga)}<br>
            <strong>Total Biaya: ${formatRupiah(total)}</strong>
        `;

        pesan.style.color = "green";

    });


    /* =========================
       RESET FORMULIR
    ========================= */

    form.addEventListener("reset", function () {

        setTimeout(function () {
            inputHarga.value = "";
            inputTotal.value = "";
            pesan.textContent = "";

            localStorage.removeItem("mobilDipilih");
            localStorage.removeItem("hargaMobil");
        }, 0);

    });

});