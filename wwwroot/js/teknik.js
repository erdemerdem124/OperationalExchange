document.addEventListener('DOMContentLoaded', function() {
    var teknikBtn = document.getElementById('kaydetBtnTeknik');
    if (teknikBtn) {
        teknikBtn.addEventListener('click', function() {
            alert('Butona basıldı!');
            var table = document.getElementById('teknik-tablosu');
            var inputs = table.querySelectorAll('input');
            var values = {};
            inputs.forEach(function(input) {
                values[input.name] = input.value;
            });
            console.log('Teknik Tablosu:', values);
            // Burada AJAX ile sunucuya gönderebilirsin
        });
    }
});

function showDemoToast() {
    var toast = document.getElementById('demo-toast');
    toast.style.display = 'block';
    setTimeout(function() {
        toast.style.display = 'none';
    }, 1500); // 1.5 saniye göster
}

// Tüm kaydet butonlarını seç ve tıklanınca demo toast göster
document.querySelectorAll('.kucuk-kaydet-btn').forEach(function(btn) {
    btn.addEventListener('click', showDemoToast);
});
