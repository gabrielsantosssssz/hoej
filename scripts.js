document.addEventListener("DOMContentLoaded", () => {
    loadXML();
});

function loadXML() {
    fetch("alunos.xml")
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "application/xml");

            listarAlunos(xml);
            mostrarSituacao(xml);
            mostrarEstatisticas(xml);
        });
}

function mostrarSecao(secaoId) {
    document.querySelectorAll('.secao').forEach(secao => {
        secao.style.display = 'none';
    });
    document.getElementById(secaoId).style.display = 'block';
}

function listarAlunos(xml) {
    const cursos = xml.getElementsByTagName("curso");
    let output = "";

    Array.from(cursos).forEach(curso => {
        output += <h3>${curso.getAttribute("nome")}</h3>;
        const alunos = curso.getElementsByTagName("aluno");
        Array.from(alunos).forEach(aluno => {
            output += <p>${aluno.getElementsByTagName("nome")[0].textContent}</p>;
        });
    });

    document.getElementById("listagem-alunos").innerHTML = output;
}

function mostrarSituacao(xml) {
    const alunos = xml.getElementsByTagName("aluno");
    let output = "";

    Array.from(alunos).forEach(aluno => {
        const nome = aluno.getElementsByTagName("nome")[0].textContent;
        const notas = aluno.getElementsByTagName("materia")[0];
        const av1 = parseFloat(notas.getElementsByTagName("av1")[0].textContent);
        const av2 = parseFloat(notas.getElementsByTagName("av2")[0].textContent);
        const av3 = parseFloat(notas.getElementsByTagName("av3")[0].textContent);
        const av4 = parseFloat(notas.getElementsByTagName("av4")[0].textContent);

        const media = (av1 + av2 + av3 + av4) / 4;
        let situacao = "reprovado";
        if (media >= 7) situacao = "aprovado";
        else if (media >= 5) situacao = "recuperacao";

        output += <p class="${situacao}">${nome}: ${situacao.toUpperCase()} - Média: ${media.toFixed(2)}</p>;
    });

    document.getElementById("situacao-alunos").innerHTML = output;
}

function mostrarEstatisticas(xml) {
    const alunos = xml.getElementsByTagName("aluno");
    let somaMedias = 0;
    let totalAlunos = 0;
    let melhoresAlunos = [];

    Array.from(alunos).forEach(aluno => {
        const notas = aluno.getElementsByTagName("materia")[0];
        const av1 = parseFloat(notas.getElementsByTagName("av1")[0].textContent);
        const av2 = parseFloat(notas.getElementsByTagName("av2")[0].textContent);
        const av3 = parseFloat(notas.getElementsByTagName("av3")[0].textContent);
        const av4 = parseFloat(notas.getElementsByTagName("av4")[0].textContent);

        const media = (av1 + av2 + av3 + av4) / 4;
        somaMedias += media;
        totalAlunos++;

        if (media >= 7) {
            melhoresAlunos.push(aluno.getElementsByTagName("nome")[0].textContent);
        }
    });

    const mediaSala = (somaMedias / totalAlunos).toFixed(2);
    let output = <p>Média da Sala: ${mediaSala}</p>;
    output += <p>Melhores Alunos: ${melhoresAlunos.join(", ")}</p>;

    document.getElementById("estatisticas").innerHTML = output;
}