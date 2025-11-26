$(document).ready(function () {

    const STORAGE_KEY = "my_books_year";

    // Load books
    function loadBooks() {
        let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        $("#list").empty();

        if (books.length === 0) {
            $("#list").append(`
                <li class="list-group-item text-center text-muted">
                    No books added yet. Add your first one!
                </li>
            `);
            return;
        }

        books.forEach((book, i) => {
            let badgeClass =
                book.status === "read" ? "bg-dark" :
                    book.status === "reading" ? "bg-primary" :
                        "bg-secondary";

            let badgeText =
                book.status === "read" ? "Read" :
                    book.status === "reading" ? "Reading" :
                        "Want to read";

            $("#list").append(`
                <li class="list-group-item d-flex justify-content-between align-items-center">

                    <div>
                        <strong>${book.title}</strong> — <em>${book.author}</em><br>
                        <span class="badge ${badgeClass} mt-1">${badgeText}</span>
                        <span class="badge bg-info ms-2">${book.language?.toUpperCase() || "N/A"}</span>

                    </div>

                    <div style="display: flex;">
                        <button class="btn btn-sm btn-secondary edit" data-id="${i}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
</svg></button>
&nbsp
                        <button class="btn btn-sm btn-dark delete" data-id="${i}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
</svg></button>
                    </div>

                </li>
            `);
        });
    }


    // Add book
    $("#btnAdd").click(function () {
        let title = $("#book").val().trim();
        let author = $("#author").val().trim();
        let status = $("#status").val();
        let language = $("#language").val();

        if (!title || !author) {
            return alert("Please fill the book title and author.");
        }

        let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        books.push({ title, author, status, language });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));

        $("#book").val("");
        $("#author").val("");
        $("#status").val("want");

        loadBooks();
    });


    // Delete book
    $(document).on("click", ".delete", function () {
        let id = $(this).data("id");
        let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        books.splice(id, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
        loadBooks();
    });


    // Edit book
    let editId = null;

    $(document).on("click", ".edit", function () {
        editId = $(this).data("id");
        let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        let current = books[editId];

        // Preenche o modal com os valores atuais
        $("#editTitle").val(current.title);
        $("#editAuthor").val(current.author);
        $("#editLanguage").val(current.language);
        $("#editStatus").val(current.status);

        // Abre o modal
        const modal = new bootstrap.Modal(document.getElementById("editModal"));
        modal.show();
    });

    // Salvar alterações
    $("#saveEdit").click(function () {
        let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        books[editId] = {
            title: $("#editTitle").val().trim(),
            author: $("#editAuthor").val().trim(),
            language: $("#editLanguage").val(),
            status: $("#editStatus").val()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));

        loadBooks();
        $("#editModal").modal("hide");
    });



    // Load at start
    loadBooks();
});

// Save goals (robust)
$("#saveGoal").click(function () {
    // make sure element exists
    const $input = $("#goalNumber");
    if ($input.length === 0) {
        console.error("Element #goalNumber not found in DOM.");
        alert("Internal error: input not found.");
        return;
    }

    // parse value as integer
    const raw = $input.val();
    const parsed = parseInt(raw, 10);

    if (isNaN(parsed) || parsed <= 0) {
        alert("Please enter a valid positive number.");
        return;
    }

    // save as number (string is okay too, but keep it normalized)
    localStorage.setItem("year_goal", String(parsed));

    // update text on screen
    $("#yearGoalDisplay").text(parsed);

    // Close bootstrap modal safely (create instance if missing)
    const modalEl = document.getElementById("goalsModal");
    if (modalEl) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.hide();
    } else {
        console.warn("Modal element #goalsModal not found.");
    }

    console.log("Goal saved:", parsed);
});

function loadGoal() {
    const goal = localStorage.getItem("year_goal");
    if (goal) {
        $("#yearGoalDisplay").text(goal);
        // also set input value if modal opened later
        $("#goalNumber").val(goal);
    }
}
loadGoal();

// Yuki quotes
const yukiQuotes = [
    "The library is filled with countless books. <br>Choose one wisely… <br>Each choice says more about you than you think.",
    "The library is full of books. <br>Choose carefully… <br>Your selection will determine the path ahead.",
    "This library holds more books than one could read in a lifetime. <br>Choose wisely… <br>The story you pick may end up choosing you.",
    "A single book can shift your perspective. <br>Pick the one that challenges you, not the one that comforts you.",
    "Your next read will shape the way you think. <br>Don't underestimate the power of a choice."
];

// Seleciona o elemento onde o texto aparece
const quoteElement = document.getElementById("yukiQuote");

let index = 0;

// Função que troca o texto
function changeQuote() {
    quoteElement.innerHTML = yukiQuotes[index];
    index = (index + 1) % yukiQuotes.length; // volta ao início quando terminar
}

// Primeira frase ao carregar a página
changeQuote();

// Altera a frase a cada 10 segundos
setInterval(changeQuote, 10000);



