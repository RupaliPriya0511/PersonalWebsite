const BASE_URL = 'http://localhost:5000';

function openForm() {
  document.getElementById("certificate-form").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

function closeForm() {
  document.getElementById("certificate-form").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

async function addCertificate() {

    const deleteKey = prompt("Enter the secret key to submit this certificate:");
    if (deleteKey !== "Rupali@0511") {
    alert("Incorrect key! certificate not submitted.");
    return;
  }
    let title = document.getElementById("title").value;
    let date = document.getElementById("date").value;
    let org = document.getElementById("org").value;
    let description = document.getElementById("description").value;
    let link = document.getElementById("link").value;

    if (!title || !date || !org || !description || !link) {
        alert("All fields are required!");
        return;
    }

    const certificate = { title, date, org, description, link };

    try {
        const res = await fetch(`${BASE_URL}/certificates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(certificate)
        });

        const savedCertificate = await res.json();
        addCertificateToUI(savedCertificate);
        closeForm();

        // Clear form fields
        document.getElementById("title").value = "";
        document.getElementById("date").value = "";
        document.getElementById("org").value = "";
        document.getElementById("description").value = "";
        document.getElementById("link").value = "";

    } catch (err) {
        console.error("Failed to add certificate:", err);
    }
}

async function loadCertificates() {
    try {
        const res = await fetch(`${BASE_URL}/certificates`);
        const certificates = await res.json();
        const list = document.getElementById("certificate-list");
        list.innerHTML = "";
        certificates.forEach(certificate => {
            let card = document.createElement("div");
            card.classList.add("certificate-card");
            card.setAttribute("data-id", certificate._id);
            card.innerHTML = `
                <h3>${certificate.title}</h3>
                <p><strong>Issued By:</strong> ${certificate.org}</p>
                <p><strong>Issued On:</strong> ${formatDate(certificate.date)}</p>
                <p>${certificate.description}</p>
                <a href="${certificate.link}" target="_blank" class="view-btn">View Certificate</a>
                <button class="remove-btn" onclick="requestDelete(this)">Remove</button>
            `;
            list.appendChild(card);
        });
    } catch (err) {
        console.error("Error fetching certificates:", err);
    }
}

function addCertificateToUI(certificate) {
    let card = document.createElement("div");
    card.classList.add("certificate-card");
    card.setAttribute("data-id", certificate._id); // for deletion
    card.innerHTML = `
        <h3>${certificate.title}</h3>
        <p><strong>Issued By:</strong> ${certificate.org}</p>
        <p><strong>Issued On:</strong> ${formatDate(certificate.date)}</p>
        <p>${certificate.description}</p>
        <a href="${certificate.link}" target="_blank" class="view-btn">View Certificate</a>
        <button class="remove-btn" onclick="requestDelete(this)">Remove</button>
    `;
    document.getElementById("certificate-list").prepend(card);
}

async function requestDelete(button) {
    let key = prompt("Enter the delete key to remove this certificate:");
    if (key !== "Rupali@0511") {
        alert("Incorrect key!");
        return;
    }

    const card = button.parentElement;
    const id = card.getAttribute("data-id");

    try {
        await fetch(`${BASE_URL}/certificates/${id}`, { method: 'DELETE' });
        card.remove();
    } catch (err) {
        console.error("Failed to delete certificate:", err);
    }
}

window.onload = loadCertificates;
