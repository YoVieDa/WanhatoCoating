$(document).ready(function () {
    let arrItem = Array();
    let totalBayar = 0;
    let arrPotongan = Array();
    let totalPotongan = 0;

    function alertError(error, $timer = null) {
        if ($timer == null) {
            $timer = "2000";
        }
        Swal.fire({
            title: 'Error',
            text: error,
            icon: 'error',
            timer: $timer,
            confirmButtonColor: '#8CD4F5',
        })
    }

    function replaceDotInNumber(number) {
        return number.toString().replace(/\./g, '');
    }

    function addDotInNumber(number) {
        if(number == null){
            return 0;
        } else {
            return number.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1.");
        }
    }

    function closeModalForm() {
        $("#formModal").css("display", "none");
        $("#modal-pembelian")[0].reset();
    }

    function closeModalFormPotongan() {
        $("#formModalPotongan").css("display", "none");
        $("#modal-pembelian-potongan")[0].reset();
    }

    function closeModalStruk() {
        $("#printStrukModal").css("display", "none");
    }

    function refreshTableItem() {
        dTableItem = new $('#dTableItem').DataTable( {
            data: arrItem,
            destroy: true,
            paging: false,
            searching: false,
            columns: [ 
                { data : null, render: function(data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }}, 
                { data: "produk" },
                { data: "qty" },
                { data: "hrg" },
                { data: "total" },
                { data: "produk", render: function(data, type, row, meta) {
                    return "<button class='btn-small' id='btn-edit-item' value='"+data+"'><i class='fa fa-pen'></i> Edit</button> "+
                            "<button class='btn-small' id='btn-delete-item' value='"+data+"'><i class='fa fa-trash'></i> Delete</button>";
                }},
            ]
        });
        $("#dTableItem_info").prop("hidden", true);

        
        totalBayar = 0;
        arrItem.forEach(element => {
            totalBayar += parseInt(replaceDotInNumber(element.total));
        });

        $("#input-total-bayar").val("RP" + addDotInNumber(totalBayar));
    }

    function refreshTablePotongan() {
        if ( arrPotongan.length === 0 ) {
            $("#dTablePotongan").prop("hidden", true);
            return;
        }
        $("#dTablePotongan").prop("hidden", false);

        dTablePotongan = new $('#dTablePotongan').DataTable( {
            data: arrPotongan,
            destroy: true,
            paging: false,
            searching: false,
            columns: [ 
                { data : null, render: function(data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }}, 
                { data: "potongan" },
                { data: "total" },
                { data: "potongan", render: function(data, type, row, meta) {
                    return "<button class='btn-small' id='btn-edit-potongan' value='"+data+"'><i class='fa fa-pen'></i> Edit</button> "+
                            "<button class='btn-small' id='btn-delete-potongan' value='"+data+"'><i class='fa fa-trash'></i> Delete</button>";
                }},
            ]
        });
        $("#dTablePotongan_info").prop("hidden", true);
        
        totalPotongan = 0;
        arrPotongan.forEach(element => {
            totalPotongan += parseInt(replaceDotInNumber(element.total));
        });

        $("#input-total-bayar").val("RP" + addDotInNumber(totalBayar - totalPotongan));
    }

    function saveItem() {
        let isDuplicate = false;
        let tempArrItem = Array();

        let jumlah;
        let harga;

        if ($("#input-nama-produk").val() == "") {
            alertError("Nama Produk Masih Kosong!");
            return;
        }
        if ($("#input-jumlah-produk").val() == "") {
            alertError("Jumlah Produk Masih Kosong!");
            return;
        }
        else {
            jumlah = replaceDotInNumber($("#input-jumlah-produk").val());
            if (jumlah < 1) {
                alertError("Jumlah Produk Minimal 1!");
                return;
            }
        }
        if ($("#input-harga-produk").val() == "") {
            alertError("Harga Produk Masih Kosong!");
            return;
        }
        else {
            harga = replaceDotInNumber($("#input-harga-produk").val());
            if (harga < 0) {
                alertError("Harga Produk Minimal 0!");
                return;
            }
        }

        tempArrItem = ({
            "produk" : $("#input-nama-produk").val(),
            "qty" : addDotInNumber(jumlah),
            "hrg" : addDotInNumber(harga), 
            "total" : addDotInNumber(jumlah * harga)
        });

        arrItem.forEach(element => {
            if(element.produk == $("#input-nama-produk").val()) {
                arrItem[arrItem.indexOf(element)] = tempArrItem;
                isDuplicate = true;
            }
        });

        if (isDuplicate == false){
            arrItem.push({
                "produk" : $("#input-nama-produk").val(),
                "qty" : addDotInNumber(jumlah),
                "hrg" : addDotInNumber(harga), 
                "total" : addDotInNumber(jumlah * harga)
            });
        }

        refreshTableItem();
        closeModalForm();
    }

    function savePotongan() {
        let isDuplicate = false;
        let tempArrPotongan = Array();
        let potongan;

        if ($("#input-nama-potongan").val() == "") {
            alertError("Nama Promo Masih Kosong!");
            return;
        }
        if ($("#input-jumlah-potongan").val() == "") {
            alertError("Harga Promo Masih Kosong!");
            return;
        }
        else {
            potongan = replaceDotInNumber($("#input-jumlah-potongan").val());
            if (potongan < 0) {
                alertError("Harga Promo Minimal 0!");
                return;
            }
        }

        tempArrPotongan = ({
            "potongan" : $("#input-nama-potongan").val(),
            "total" : addDotInNumber(potongan)
        });

        arrPotongan.forEach(element => {
            if(element.produk == $("#input-nama-potongan").val()) {
                arrPotongan[arrPotongan.indexOf(element)] = tempArrPotongan;
                isDuplicate = true;
            }
        });

        if (isDuplicate == false){
            arrPotongan.push({
                "potongan" : $("#input-nama-potongan").val(),
                "total" : addDotInNumber(potongan)
            });
        }

        refreshTablePotongan();
        closeModalFormPotongan();
    }

    refreshTableItem();
    refreshTablePotongan();
    $("#input-tanggal").val(new Date().toISOString().split('T')[0]);

    $("#input-jumlah-produk,"+"#input-harga-produk,"+"#input-jumlah-potongan").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl/cmd+A
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+C
            (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+X
            (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    // Mengatur Field yang Number Only supaya ada titiknya
    $("#input-jumlah-produk,"+"#input-harga-produk,"+"#input-jumlah-potongan").keyup(function (e) {
        $(this).val(addDotInNumber(replaceDotInNumber($(this).val())));
    });

    $("#btn-toggle-date").click(function (e) { 
        e.preventDefault();
        if ($("#input-tanggal").is(":disabled")) {
            $("#input-tanggal").prop("disabled", false);
        }
        else {
            $("#input-tanggal").val(new Date().toISOString().split('T')[0]);
            $("#input-tanggal").prop("disabled", true);
        }
    });

    $("#cb-nomer-rekening-apply").click( function(e) {
        if ($("#cb-nomer-rekening-apply").is(":checked")) {
            $("#no-rek").prop("hidden", true);
        } else {
            $("#no-rek").prop("hidden", false);
        }
    })

    // Item
    $("#btn-add-item").click(function (e) { 
        e.preventDefault();
        $("#formModal").css("display", "block");
        $("#input-nama-produk").prop("disabled", false);
        $('#input-nama-produk').focus();
    });
    
    $("#close-modal-form").click(function (e) { 
        e.preventDefault();
        closeModalForm();
    });

    $("#input-nama-produk").keydown(function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            $("#input-jumlah-produk").focus();
        }
    });

    $("#input-jumlah-produk").keydown(function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            $("#input-harga-produk").focus();
        }
    });

    $("#input-harga-produk").keydown(function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            saveItem();
        }
    });

    $("#btn-save-form").click(function (e) {
        e.preventDefault();
        saveItem();
    });

    $(document).on("click", "#btn-edit-item", function(e) {
        e.preventDefault();
        let item = $(this).val();
        let indexItem;
        
        arrItem.forEach(element => {
            if(element.produk == item) {
                indexItem = arrItem.indexOf(element);
            }
        });

        $("#formModal").css("display", "block");
        $("#input-nama-produk").prop("disabled", true);
        $("#input-nama-produk").val(arrItem[indexItem].produk);
        $("#input-jumlah-produk").val(arrItem[indexItem].qty);
        $("#input-harga-produk").val(arrItem[indexItem].hrg);
    });

    $(document).on("click", "#btn-delete-item", function(e) {
        e.preventDefault();
        let item = $(this).val();
        let indexItem;
        
        arrItem.forEach(element => {
            if(element.produk == item) {
                indexItem = arrItem.indexOf(element);
                arrItem.splice(indexItem, 1);
            }
        });
        refreshTableItem();
    });
    // Item - End

    // Potongan
    $("#btn-add-potongan").click(function (e) { 
        e.preventDefault();
        $("#formModalPotongan").css("display", "block");
        $("#input-nama-potongan").prop("disabled", false);
        $('#input-nama-potongan').focus();
    });

    $("#close-modal-form-potongan").click(function (e) { 
        e.preventDefault();
        closeModalFormPotongan();
    });

    $("#btn-save-form-potongan").click(function (e) {
        e.preventDefault();
        savePotongan();
    });

    $(document).on("click", "#btn-edit-potongan", function(e) {
        e.preventDefault();
        let potongan = $(this).val();
        let index;
        
        arrPotongan.forEach(element => {
            if(element.potongan == potongan) {
                index = arrPotongan.indexOf(element);
            }
        });

        $("#formModalPotongan").css("display", "block");
        $("#input-nama-potongan").prop("disabled", true);
        $("#input-nama-potongan").val(arrPotongan[index].potongan);
        $("#input-jumlah-potongan").val(arrPotongan[index].total);
    });

    $(document).on("click", "#btn-delete-potongan", function(e) {
        e.preventDefault();
        let potongan = $(this).val();
        let index;
        
        arrPotongan.forEach(element => {
            if(element.potongan == potongan) {
                index = arrPotongan.indexOf(element);
                arrPotongan.splice(index, 1);
            }
        });
        refreshTablePotongan();
    });
    // Potongan - End

    $("#btn-show-modal-print").click(function (e) {
        e.preventDefault();
        
        if ($("#input-nama").val() == "") {
            alertError("Input Nama Belum Diisi!");
            return;
        }
        if ($("#input-alamat").val() == "") {
            alertError("Input Alamat Belum Diisi!");
            return;
        }

        let date = $("#input-tanggal").val().split("-");
        
        $("#printStrukModal").css("display", "block");
        $("#tgl-transaksi").text("Date: " + date[2] + "/" + date[1] + "/" + date[0]);
        $("#nama-konsumen").text("To: " + $("#input-nama").val());
        $("#alamat-konsumen").text("Address: " + $("#input-alamat").val());

        dTableItem = new $('#dTableItemStruk').DataTable( {
            data: arrItem,
            destroy: true,
            paging: false,
            searching: false,
            columns: [ 
                { data : null, render: function(data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }}, 
                { data: "produk" },
                { data: "qty" },
                {   data: "hrg", 
                    render: function(data, type, row) {
                        return "IDR " + data.toLocaleString();  // Menambahkan "IDR" pada harga
                    },
                    className: 'text-right'  // Menambahkan class untuk perataan kanan
                },
                {   data: "total", 
                    render: function(data, type, row) {
                        return "IDR " + data.toLocaleString();  // Menambahkan "IDR" pada total
                    },
                    className: 'text-right'  // Menambahkan class untuk perataan kanan
                }
            ]
        });
        $("#dTableItemStruk_info").prop("hidden", true);

        if (arrPotongan.length > 0) {
            $("#list-potongan-print").attr("hidden", false);
            let str = "Voucher Discount\n";
            arrPotongan.forEach(element => {
                str += element.potongan + " Rp " + addDotInNumber(element.total) + "\n";
            });
            $("#list-potongan-print").html(str.replace(/\n/g, "<br>"));
        } 
        else {
            $("#list-potongan-print").attr("hidden", true);
        }
        
        $("#total-bayar-struk").text("Total : Rp" + addDotInNumber(totalBayar - totalPotongan));
    });

    $("#close-modal-struk").click(function (e) {
        e.preventDefault();
        closeModalStruk();
    })


    $("#btn-print-struk").on('click', function() {
        element = document.getElementById('print-area');

        html2pdf()
        .set({
            margin: 0,
            filename: $("#input-tanggal").val() + "-WanhatoCoating-" + $("#input-nama").val() + ".pdf",
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a6", orientation: "portrait" }
        })
        .from(element)
        .save();
    });

    // Optional: Tutup modal jika klik di luar
    window.onclick = function(event) {
        const modal = document.getElementById("formModal");
        if (event.target == modal) {
            closeModal();
        }
    }

})

