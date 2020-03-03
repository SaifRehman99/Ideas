const deleteBTN = document.querySelector(".delete");

document.body.addEventListener("click", e => {
    if (e.target.classList.contains("delete")) {
        // getting the id here
        let id = e.target.getAttribute("data-id");

        fetch(`/ideas/${id}`, {
                method: "DELETE"
            })
            .then(res => {
                console.log("Deleted!");
                window.location.href = "/ideas";
            })
            .catch(err => console.log(err));
    }
});

setTimeout(() => {
    document.querySelector(".alert").remove();
}, 2500);