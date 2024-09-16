// login.html
function togglePassword() {
  var x = document.getElementById("password");
  if (x) {
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  } else {
    console.error("Password input element not found.");
  }
}

// home_mahasiswa.html
document.addEventListener("DOMContentLoaded", function () {
  var popup = document.getElementById("loginSuccessPopup");
  if (popup) {
    setTimeout(function () {
      popup.style.opacity = "1";
      popup.style.visibility = "visible";
    }, 100);

    setTimeout(function () {
      popup.style.opacity = "0";
      popup.style.visibility = "hidden";
    }, 2000);
  }
});

// QR code modal logic
var modal = document.getElementById("myModal");
var img = document.getElementById("qrCode");
var modalImg = document.getElementById("imgPopup");

function openPopupQR() {
  modal.style.display = "block";
  modalImg.src = img.src;
}

function closePopupQR() {
  modal.classList.add("fade-out");

  setTimeout(() => {
    modal.style.display = "none";
    modal.classList.remove("fade-out");
  }, 600);
}

// Toggle mobile menu
function toggleMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  if (!mobileMenu) {
    console.error("Element with ID 'mobileMenu' not found.");
    return;
  }
  const isMenuOpen = mobileMenu.style.transform === "translateX(0%)";
  mobileMenu.style.transform = isMenuOpen
    ? "translateX(100%)"
    : "translateX(0%)";
}

//profil_mahasiswa.html profil_mentor.html profil_dosen.html
document.addEventListener("DOMContentLoaded", function () {
  var popup = document.getElementById("logoutSuccessPopup");
  if (popup) {
    setTimeout(function () {
      popup.style.opacity = "1";
      popup.style.visibility = "visible";
    }, 100);

    setTimeout(function () {
      popup.style.opacity = "0";
      popup.style.visibility = "hidden";
    }, 2000);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const profile = document.querySelector(".profile");
  const profileIcon = document.getElementById("profileIcon");
  const dropdownContent = document.getElementById("dropdownContent");

  profileIcon.addEventListener("click", function (event) {
    profile.classList.toggle("active");
    dropdownContent.style.display =
      dropdownContent.style.display === "block" ? "none" : "block";
    event.stopPropagation(); // Prevent click from bubbling up to the document
  });

  document.addEventListener("click", function (event) {
    if (!profile.contains(event.target)) {
      profile.classList.remove("active");
      dropdownContent.style.display = "none";
    }
  });
});

//presensi_mahasiswa.html
let editorInstance; // Membuat variabel untuk menyimpan instance CKEditor

function openEditor(id) {
  const modal = document.getElementById("editorModal");
  const textarea = document.getElementById("modalUraianTugas");
  const saveButton = document.getElementById("saveModalButton");

  let existingText = "";

  // Cek apakah elemen uraian-tugas-content ada atau tidak
  const taskElement = document.querySelector(
    `.uraian-tugas-content[data-id='${id}'] span`
  );

  if (taskElement) {
    existingText = taskElement.innerHTML; // Ambil teks HTML yang ada di elemen
  }

  // Buka modal
  modal.style.display = "block";

  // Cek apakah editor sudah ada, jika belum, baru inisialisasi
  if (!editorInstance) {
    ClassicEditor.create(textarea, {
      ckfinder: {
        uploadUrl: "/upload_image",
      },
      toolbar: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "blockQuote",
        "|",
        "insertTable",
        "mediaEmbed",
        "imageUpload",
        "undo",
        "redo",
      ],
      image: {
        toolbar: [
          "imageTextAlternative",
          "imageStyle:full",
          "imageStyle:side",
          "removeImage",
        ],
      },
    })
      .then((editor) => {
        editorInstance = editor; // Simpan instance CKEditor
        editorInstance.setData(existingText); // Setel teks HTML yang ada ke CKEditor

        // Simpan tombol ketika klik "Simpan"
        saveButton.onclick = function () {
          const data = editorInstance.getData();
          saveUraianTugas(id, data);
        };
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    // Jika editor sudah ada, cukup setel data baru
    editorInstance.setData(existingText);
  }

  // Tutup modal ketika klik di luar area modal
  window.onclick = function (event) {
    if (event.target == modal) {
      closeEditor();
    }
  };
}

function closeEditor() {
  const modal = document.getElementById("editorModal");
  modal.style.display = "none";

  // Hapus inisialisasi CKEditor dan hapus instance setelah modal ditutup
  if (editorInstance) {
    editorInstance
      .destroy()
      .then(() => {
        editorInstance = null; // Reset instance ke null
        console.log("CKEditor destroyed");
      })
      .catch((error) => {
        console.error("Error destroying CKEditor:", error);
      });
  }
}

function saveUraianTugas(id, data) {
  fetch(`/update_uraian_tugas/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uraian_tugas: data }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.status === "success") {
        // Seleksi elemen yang benar-benar menampung konten dan memperbarui DOM secara dinamis
        let taskCell = document.querySelector(
          `.uraian-tugas-content[data-id='${id}']`
        );

        if (taskCell) {
          // Jika elemen sudah ada, update kontennya
          taskCell.innerHTML = `
                        <span>${data}</span>
                        <span class="edit-icon" onclick="openEditor('${id}')">&#x270E;</span>
                    `;
        } else {
          // Jika elemen belum ada, kita buat elemen baru
          taskCell = document.querySelector(`#tambahButton${id}`).closest("td");
          taskCell.innerHTML = `
                        <div class="uraian-tugas-content" data-id="${id}">
                            <span>${data}</span>
                            <span class="edit-icon" onclick="openEditor('${id}')">&#x270E;</span>
                        </div>
                    `;
        }
        // Menampilkan alert setelah data berhasil disimpan
        alert("Great! Data berhasil disimpan dan Task Description di-update");
      }
      closeEditor(); // Tutup modal setelah menyimpan
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Hmm, ada masalah saat menyimpan data. Coba lagi nanti ya.");
    });
}

// project_mahasiswa.html
$(document).ready(function () {
  $(".status-dropdown").change(function () {
    var projectId = $(this).data("project-id");
    var newStatus = $(this).val();

    $.ajax({
      url: "/update_project_status/" + projectId,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ status: newStatus }),
      success: function (response) {
        console.log("Status updated successfully");
        location.reload(); // Refresh halaman untuk update status
      },
    });
  });
});

function updateStatus(projectId, newStatus) {
  fetch(`/update_project_status/${projectId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        alert("Woohoo! Status project berhasil di-update!");
        // Update status box without reloading the page
        document.querySelector(".status.ongoing h3").textContent =
          data.total_ongoing;
        document.querySelector(".status.completed h3").textContent =
          data.total_completed;
      } else {
        alert("Oops, gagal update status project, coba lagi ya.");
      }
    })
    .catch((error) => {
      console.error("Error updating status:", error);
      alert("Hmm, ada masalah saat update status. Coba lagi nanti ya.");
    });
}

// home_mentor.html
// search fitur
function searchPresensiMentor() {
  let input = document
    .getElementById("searchPresensiInputMentor")
    .value.toLowerCase();
  let table = document.querySelector("table tbody");
  let rows = table.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    let cells = rows[i].getElementsByTagName("td");
    let match = false;

    for (let j = 0; j < cells.length; j++) {
      if (cells[j]) {
        if (cells[j].textContent.toLowerCase().indexOf(input) > -1) {
          match = true;
          break;
        }
      }
    }

    rows[i].style.display = match ? "" : "none";
  }
}

function updateApproval(checkbox, presensiId) {
  const isChecked = checkbox.checked ? 1 : 0;

  fetch(`/update_approval_mentor/${presensiId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ approval_mentor: isChecked }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        console.log("Approval updated successfully");
        alert("Woohoo! Status approval mentor berhasil di-update!");
      } else {
        console.log("Failed to update approval");
        alert("Oops, gagal update approval, coba lagi ya.");
      }
    })
    .catch((error) => {
      console.error("Error updating approval:", error);
      alert("Oops, ada masalah saat update approval. Coba lagi nanti.");
    });
}

function exportToExcel(type) {
  window.location.href = "/export_excel?type=" + type;
}

// project_mentor.html
// search fitur
function searchProjectMentor() {
  let input = document
    .getElementById("searchProjectInputMentor")
    .value.toLowerCase();
  let table = document.querySelector("table tbody");
  let rows = table.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    let cells = rows[i].getElementsByTagName("td");
    let match = false;

    for (let j = 0; j < cells.length; j++) {
      if (cells[j]) {
        if (cells[j].textContent.toLowerCase().indexOf(input) > -1) {
          match = true;
          break;
        }
      }
    }

    rows[i].style.display = match ? "" : "none";
  }
}

function resetTambahProjectModal() {
  // Reset input field
  document.getElementById("judul_project").value = "";
  document.getElementById("deadline").value = "";

  // Uncheck all checkboxes
  const mahasiswaCheckboxes = document.querySelectorAll(
    "#mahasiswa-checkboxes input[type='checkbox']"
  );
  mahasiswaCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  // Set action form kembali ke 'tambah_project'
  document.getElementById("tambahProjectForm").action = "/tambah_project";
}

function showTambahProjectModal() {
  // Panggil fungsi reset sebelum menampilkan modal
  resetTambahProjectModal();
  document.getElementById("tambahProjectModal").style.display = "block";

  // Add event listener to the form submission for the alert
  document.getElementById("tambahProjectForm").onsubmit = function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Show the alert
    alert("Yeay! Data project berhasil di-update.");

    // Proceed with form submission
    this.submit();
  };
}

function showEditProjectModal(projectId) {
  fetch(`/edit_project_data/${projectId}`)
    .then((response) => response.json())
    .then((data) => {
      // Isi form dalam modal dengan data yang diterima dari server
      document.getElementById("judul_project").value = data.judul_project;
      document.getElementById("deadline").value = data.deadline;

      // Set nilai dari checkbox mahasiswa yang terlibat
      const mahasiswaCheckboxes = document.querySelectorAll(
        "#mahasiswa-checkboxes input[type='checkbox']"
      );
      mahasiswaCheckboxes.forEach((checkbox) => {
        checkbox.checked = data.mahasiswa_ids.includes(checkbox.value);
      });

      // Ubah action form untuk menyimpan update
      document.getElementById(
        "tambahProjectForm"
      ).action = `/update_project/${projectId}`;

      // Tampilkan modal
      document.getElementById("tambahProjectModal").style.display = "block";
      // Add event listener to form submit for the alert
      document.getElementById("tambahProjectForm").onsubmit = function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Show the alert
        alert("Yes! Data Project berhasil di-update.");

        // Proceed with form submission
        this.submit();
      };
    })
    .catch((error) => console.error("Error:", error));
}

function closeTambahProjectModal() {
  document.getElementById("tambahProjectModal").style.display = "none";
  resetTambahProjectModal();
}

// home_dosen.html
function fetchKehadiranData() {
  fetch("/kehadiran_hari_ini")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      drawKehadiranPieChart(data);
    })
    .catch((error) => {
      console.error("Error fetching kehadiran data:", error);
    });
}

function drawKehadiranPieChart(data) {
  const ctx = document.getElementById("kehadiranChart").getContext("2d");

  const hadir = data.Hadir;
  const sakit = data.Sakit;
  const izin = data.Izin;
  const alpha = data.Alpha;

  const chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: [
        "Hadir" + " : " + hadir,
        "Sakit" + " : " + sakit,
        "Izin" + " : " + izin,
        "Alpha" + " : " + alpha,
      ],
      datasets: [
        {
          label: "Kehadiran Hari Ini",
          data: [hadir, sakit, izin, alpha],
          backgroundColor: ["#81e5f4", "#53bef3", "#377dc2", "#0c3b73"],
          borderColor: ["#81e5f4", "#53bef3", "#377dc2", "#0c3b73"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'left', // Position legend on the right side
          align: 'start',   // Align the labels from the top
        },
        tooltip: {
          callbacks: {
            label: function () {
              return "Mahasiswa";
            },
          },
        },
      },
    },
  });
}

// Panggil fungsi untuk menggambar chart setelah halaman dimuat
function fetchProjectStatusData() {
  fetch("/get_project_status_data")
    .then((response) => response.json())
    .then((data) => {
      drawProjectStatusPieChart(data);
    })
    .catch((error) => {
      console.error("Error fetching project status data:", error);
    });
}

function drawProjectStatusPieChart(data) {
  const ctx = document.getElementById("statusProjectChart").getContext("2d");

  const totalOngoing = data.total_ongoing;
  const totalCompleted = data.total_completed;

  const chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: [
        "On Going" + " : " + totalOngoing,
        "Completed" + " : " + totalCompleted,
      ],
      datasets: [
        {
          label: "Status Project",
          data: [totalOngoing, totalCompleted],
          backgroundColor: ["#377dc2", "#0c3b73"],
          borderColor: ["#377dc2", "#0c3b73"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'left', // Position legend on the right side
          align: 'start',   // Align the labels from the top
        },
        tooltip: {
          callbacks: {
            label: function () {
              return "Project";
            },
          },
        },
      },
    },
  });
}

// Panggil fungsi untuk menggambar chart setelah halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  fetchKehadiranData();
  fetchProjectStatusData();
});

// detail_presensi.html & detail_project.html
// search fitur
function searchPresensiDosen() {
  // Ambil input dari user
  let input = document
    .getElementById("searchPresensiInputDosen")
    .value.toLowerCase();
  let table = document.querySelector("table tbody");
  let rows = table.getElementsByTagName("tr");

  // Loop melalui semua baris dalam tabel
  for (let i = 0; i < rows.length; i++) {
    let cells = rows[i].getElementsByTagName("td");
    let match = false;

    // Loop melalui semua sel dalam baris
    for (let j = 0; j < cells.length; j++) {
      if (cells[j]) {
        // Jika ada teks yang cocok, set match menjadi true
        if (cells[j].textContent.toLowerCase().indexOf(input) > -1) {
          match = true;
          break;
        }
      }
    }

    // Tampilkan atau sembunyikan baris berdasarkan kecocokan
    rows[i].style.display = match ? "" : "none";
  }
}

function searchProjectDosen() {
  let input = document
    .getElementById("searchProjectInputDosen")
    .value.toLowerCase();
  let table = document.querySelector("table tbody");
  let rows = table.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    let cells = rows[i].getElementsByTagName("td");
    let match = false;

    for (let j = 0; j < cells.length; j++) {
      if (cells[j]) {
        // Match against the displayed text (e.g., student names, project title)
        if (cells[j].textContent.toLowerCase().indexOf(input) > -1) {
          match = true;
          break;
        }
      }
    }

    rows[i].style.display = match ? "" : "none";
  }
}

// pagination
// Global Variables
let currentPages = {}; // Dictionary to store the current page for each table
const rowsPerPage = 10; // Number of rows per page for all tables

// Initialize the current page for each table
function initPagination(tableId) {
  currentPages[tableId] = 1; // Start at page 1 for each table
  displayTablePage(tableId, currentPages[tableId]);
}

// Function to display the page of the table
function displayTablePage(tableId, page) {
  const tableBody = document.querySelector(`#${tableId} tbody`); // Select tbody only
  if (!tableBody) {
    console.error("Table body element not found for table:", tableId);
    return;
  }

  const rows = tableBody.getElementsByTagName("tr");
  const totalRows = rows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  // Loop through all rows in tbody and show only those that match the current page
  for (let i = 0; i < totalRows; i++) {
    rows[i].style.display =
      i >= (page - 1) * rowsPerPage && i < page * rowsPerPage ? "" : "none";
  }

  // Update page number display
  document.getElementById(
    "pageNumber-" + tableId
  ).textContent = `Page ${page} of ${totalPages}`;

  // Disable or enable buttons based on the current page
  document.getElementById("btnPrev").disabled = page === 1;
  document.getElementById("btnNext").disabled = page === totalPages;
}

// Go to the previous page
function prevPage(tableId) {
  if (currentPages[tableId] > 1) {
    currentPages[tableId]--;
    displayTablePage(tableId, currentPages[tableId]);
  }
}

// Go to the next page
function nextPage(tableId) {
  const tableBody = document.querySelector(`#${tableId} tbody`);
  if (!tableBody) {
    console.error("Table body element not found for table:", tableId);
    return;
  }

  const totalRows = tableBody.getElementsByTagName("tr").length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  if (currentPages[tableId] < totalPages) {
    currentPages[tableId]++;
    displayTablePage(tableId, currentPages[tableId]);
  }
}

// Initialize pagination for all tables on document ready
document.addEventListener("DOMContentLoaded", function () {
  const tables = document.getElementsByClassName("table-pagination");
  for (let i = 0; i < tables.length; i++) {
    initPagination(tables[i].id); // Initialize pagination for each table
  }
});

// permission_mahasiswa.html
// membuka popup
function openPopup() {
  document.getElementById("permissionFormPopup").style.display = "flex";
}

// menutup popup
function closePopup() {
  document.getElementById("permissionFormPopup").style.display = "none";
}

// Tutup popup jika pengguna mengklik di luar form
window.onclick = function (event) {
  const popup = document.getElementById("permissionFormPopup");
  if (event.target === popup) {
    popup.style.display = "none";
  }
};

document.querySelector("form").onsubmit = function (event) {
  event.preventDefault(); // Menghentikan form dari submit secara default

  // Ambil data dari form
  let formData = new FormData(this);

  fetch("/submit_permission", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        // Ambil tabel dan tambahkan baris baru dengan data yang dimasukkan
        let table = document.querySelector("table tbody");
        let newRow = table.insertRow();

        // Tambahkan data ke dalam baris baru
        newRow.insertCell(0).innerText = table.rows.length; // NO
        newRow.insertCell(1).innerText = data.permission.nama; // Nama
        newRow.insertCell(2).innerText = data.permission.mulai; // Tanggal Mulai
        newRow.insertCell(3).innerText = data.permission.selesai; // Tanggal Selesai
        newRow.insertCell(4).innerText = data.permission.status; // Status

        let proofCell = newRow.insertCell(5);
        if (data.permission.bukti) {
          let proofLink = document.createElement("a");
          proofLink.href = "/static/uploads/proof/" + data.permission.bukti;
          proofLink.innerText = data.permission.bukti;
          proofLink.download = data.permission.bukti;
          proofCell.appendChild(proofLink);
        } else {
          proofCell.innerText = "No Proof";
        }

        newRow.insertCell(6).innerText = data.permission.keterangan; // Keterangan

        // Tutup popup setelah berhasil menambahkan data
        closePopup();

        // Tampilkan alert setelah submit berhasil
        alert("Woohoo! Data Permission berhasil di-update!");
      } else {
        alert("Oops! Ada yang salah: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

function toggleDropdown() {
  var dropdown = document.getElementById("dropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

// search table pada permission
function searchTable() {
  // Ambil input dari pengguna
  let input = document.getElementById("searchInput").value.toLowerCase();
  let table = document.querySelector("table tbody");
  let rows = table.getElementsByTagName("tr");

  // Loop untuk semua baris di dalam tabel
  for (let i = 0; i < rows.length; i++) {
    // Ambil teks dari setiap kolom yang perlu dicari
    let nama = rows[i].getElementsByTagName("td")[1].textContent.toLowerCase();
    let mulai = rows[i].getElementsByTagName("td")[2].textContent.toLowerCase();
    let selesai = rows[i]
      .getElementsByTagName("td")[3]
      .textContent.toLowerCase();
    let status = rows[i]
      .getElementsByTagName("td")[4]
      .textContent.toLowerCase();
    let keterangan = rows[i]
      .getElementsByTagName("td")[6]
      .textContent.toLowerCase();

    // Cek apakah input cocok dengan teks di salah satu kolom
    if (
      nama.includes(input) ||
      mulai.includes(input) ||
      selesai.includes(input) ||
      status.includes(input) ||
      keterangan.includes(input)
    ) {
      rows[i].style.display = ""; // Tampilkan baris jika cocok
    } else {
      rows[i].style.display = "none"; // Sembunyikan baris jika tidak cocok
    }
  }
}
