document.addEventListener("DOMContentLoaded", function () {

    const coresInvertidas = localStorage.getItem("inverterCores") === "true";

    document.documentElement.classList.toggle(
        "cores-invertidas",
        coresInvertidas
    );

    const inverterCheckbox = document.getElementById("inverter-cores");

    if (inverterCheckbox) {

        inverterCheckbox.checked = coresInvertidas;
        inverterCheckbox.addEventListener("change", function () {
            const ativado = this.checked;
            document.documentElement.classList.toggle(
                "cores-invertidas",
                ativado
            );
            localStorage.setItem("inverterCores", ativado);
        });
    }
});