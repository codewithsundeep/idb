// selecting form and table
const form = document.querySelector("form");
const table = document.querySelector(".data");
const submit = document.querySelector(".submit");
const update = document.querySelector(".update");
let updateKey;
// this form return object to store in indexeddb
function dataReturn() {
    return {
        name: form[0].value,
        email: form[1].value,
        phone: form[2].value
    }
}

function saveDataInDb() {
    let request = indexedDB.open('crud', 1);
    request.onsuccess = () => {
        let result = request.result;
        let transaction = result.transaction('data', 'readwrite')
        let store = transaction.objectStore('data');
        store.put(dataReturn());
        form.reset()
        alert("Data has been added!");
        readDataFromDb();
    }
}

function doDelete(key) {
    let request = indexedDB.open('crud', 1);
    request.onsuccess = () => {
        let result = request.result;
        let transaction = result.transaction('data', 'readwrite')
        let store = transaction.objectStore('data');
        let confm = confirm("Are you sure to delete data of id " + key)
        if (confm) {
            store.delete(key);
            alert("Data has been deleted succesfully!");
            readDataFromDb();
        }

    }
}

function doUpdate(key) {
    form[0].value = document.querySelector(`.name${key}`).innerText;
    form[1].value = document.querySelector(`.email${key}`).innerText;
    form[2].value = document.querySelector(`.phone${key}`).innerText;
    submit.value = "Update Data";
    document.querySelector(".formnavigate").click();
    updateKey = key;
}

function readDataFromDb() {
    // table body
    let tbody = "";
    // table headings
    let thead = `
<table>
<thead>
<tr>
<th>Id</th>
<th>Name</th>
<th>Email</th>
<th>Phone</th>
<th>Edit</th>
<th>Delete</th>
</tr>
</thead>
`;
    // indexeddb open request
    let request = indexedDB.open("crud", 1);
    request.onupgradeneeded = () => {
        let result = request.result;
        result.createObjectStore("data", { autoIncrement: true })
    }
    request.onsuccess = () => {
        let result = request.result;
        let transaction = result.transaction("data", "readonly");
        let store = transaction.objectStore('data');
        let cursor = store.openCursor();
        cursor.onsuccess = () => {
            let cursorResult = cursor.result;
            if (cursorResult) {
                tbody += `
            <tr>
            <td>${cursorResult.key}</td>
            <td class="name${cursorResult.key}">
            ${cursorResult.value.name}
            </td>
            <td class="email${cursorResult.key}">
            ${cursorResult.value.email}
            </td>
            <td class="phone${cursorResult.key}">
            ${cursorResult.value.phone}
            </td>
            <td onclick="doUpdate(${cursorResult.key})">
            Edit
            </td>
            <td onclick="doDelete(${cursorResult.key})">
            Delete
            </td>
            </tr>
            `;
                cursorResult.continue()
            } else {
                if (tbody != "") {
                    thead += `<tbody>${tbody}</tbody></table>`;
                    table.innerHTML = thead;
                } else {
                    table.innerHTML = ``;
                }
            }

            // console.log(thead);
        }
    }

    request.onerror = (err) => {
        console.log(err.error.message);
    }
}
readDataFromDb()

form.addEventListener('submit', function submitForm(e) {
    e.preventDefault();
    if (submit.value != "Save Data") {
        let request = indexedDB.open('crud', 1);
        request.onsuccess = () => {
            let result = request.result;
            let transaction = result.transaction('data', 'readwrite')
            let store = transaction.objectStore('data');
            store.put(dataReturn(), updateKey)
            form.reset();
            submit.value = "Save Data";
            alert("Data has been updated!")
            readDataFromDb();


        }
    } else {
        saveDataInDb();
    }
})

// loader end
window.addEventListener('DOMContentLoaded', () => {
    document.querySelector(".loader").remove();
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./serviceworker.js").then(() => {
            console.log("service worker registered");
        }).catch(err => {
            console.log("Registration Failed", err);
        })
    }
})