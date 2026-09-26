document.addEventListener("DOMContentLoaded", function () {

    const dateInput = document.getElementById("effectiveDate");

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    dateInput.value =
        `${year}-${month}-${day}`;

});


async function generateDocument() {

    const documentType =
        document.getElementById("documentType").value.trim();

    const parties =
        document.getElementById("parties").value.trim();

    const effectiveDate =
        document.getElementById("effectiveDate").value;

    const terms =
        document.getElementById("terms").value.trim();

    const button =
        document.getElementById("generateBtn");

    const loading =
        document.getElementById("loading");

    const result =
        document.getElementById("result");

    const error =
        document.getElementById("error");

    const output =
        document.getElementById("documentOutput");

    const download =
        document.getElementById("downloadBtn");


    error.classList.add("hidden");

    result.classList.add("hidden");


    if (!documentType) {

        showError(
            "Please enter document type."
        );

        return;
    }


    if (!parties) {

        showError(
            "Please enter parties."
        );

        return;
    }


    if (!effectiveDate) {

        showError(
            "Please select effective date."
        );

        return;
    }


    if (!terms) {

        showError(
            "Please enter terms and conditions."
        );

        return;
    }


    button.disabled = true;

    button.innerText =
        "Generating...";


    loading.classList.remove("hidden");


    try {

        const response = await fetch(
            "/api/generate",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    documentType:
                        documentType,

                    parties:
                        parties,

                    effectiveDate:
                        formatDate(effectiveDate),

                    terms:
                        terms
                })
            }
        );


        const data =
            await response.json();


        if (!response.ok ||
            !data.success) {

            throw new Error(
                data.error ||
                "Unable to generate document."
            );

        }


        output.textContent =
            data.document;


        download.href =
            data.download_url;


        result.classList.remove(
            "hidden"
        );


        result.scrollIntoView({
            behavior: "smooth"
        });


    } catch (err) {

        showError(
            err.message
        );

    } finally {

        loading.classList.add(
            "hidden"
        );

        button.disabled =
            false;

        button.innerText =
            "✨ Generate Legal Document";
    }

}


function formatDate(dateString) {

    const parts =
        dateString.split("-");

    if (parts.length !== 3) {
        return dateString;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}


function showError(message) {

    const error =
        document.getElementById("error");

    error.textContent =
        message;

    error.classList.remove(
        "hidden"
    );

}
