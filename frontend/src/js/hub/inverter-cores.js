function inverterCores() {
    document.documentElement.classList.toggle("cores-invertidas");
}

document.addEventListener("DOMContentLoaded", function () {

    const inverterCores = document.getElementById("inverter-cores");

    inverterCores.addEventListener("change", function () {

        document.documentElement.classList.toggle(
            "cores-invertidas",
            inverterCores.checked
        );

    });

});