var calcular = document.getElementById("calcular");
calcular.addEventListener("click", setValues);

let cor1 = 'rgba(0, 223, 45, 1)';
let cor2 = 'rgba(45, 0, 223, 1)';
let corTransparente1 = 'rgba(0, 223, 45, 0.2)';
let corTransparente2 = 'rgba(45, 0, 223, 0.2)';

const ctx = document.getElementById('myChart').getContext("2d");
let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Meses'],
        datasets: [{
            label: 'Reforço Mensal',
            data: [0],
            backgroundColor: corTransparente1,
            borderColor: cor1,
            borderWidth: 1
        },
        {
            label: 'Montante Acumulado',
            data: [0],
            backgroundColor: corTransparente2,
            borderColor: cor2,
            borderWidth: 1
        }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function setValues() {
    let valorInicial = Number(document.getElementById('valorInicial').value);
    let valorDesejado = Number(document.getElementById('valorDesejado').value);
    let taxaJurosAnual = Number(document.getElementById('juros').value) / 100;
    let numeroMeses = Number(document.getElementById('meses').value);
    let numeroAnos = Number(document.getElementById('anos').value) || 0;

    // Converta o número de anos em meses
    let periodos = numeroAnos * 12 + numeroMeses;

    calcularReforcosNecessarios(valorInicial, valorDesejado, taxaJurosAnual, periodos);
}


function calcularReforcosNecessarios(valorInicial, valorDesejado, taxaJurosAnual, numeroMeses) {
    let periodos = numeroMeses;
    let taxaMensal = taxaJurosAnual / 12;
    let dadosReforcos = {
        valores: [],
        montanteAcumulado: [],
        jurosMensais: [],
        juroAcumulado: []
    };

    let montanteAcumulado = valorInicial;
    let juroAcumulado = 0;

    let totalInvestido = 0;
    let jurosTotais = 0;

    for (let i = 0; i < periodos; i++) {
        let jurosMensais = montanteAcumulado * taxaMensal;
        let reforcoMensal = (valorDesejado - montanteAcumulado * Math.pow(1 + taxaMensal, periodos - i)) /
            ((Math.pow(1 + taxaMensal, periodos - i) - 1) / taxaMensal);

        dadosReforcos.valores.push(reforcoMensal.toFixed(2));
        dadosReforcos.jurosMensais.push(jurosMensais.toFixed(2));

        montanteAcumulado = montanteAcumulado * Math.pow(1 + taxaMensal, 1) + reforcoMensal;

        juroAcumulado += jurosMensais;
        dadosReforcos.juroAcumulado.push(juroAcumulado.toFixed(2));

        dadosReforcos.montanteAcumulado.push(montanteAcumulado.toFixed(2));

        totalInvestido += Number(dadosReforcos.valores[i]);
        jurosTotais = juroAcumulado;
    }

    document.getElementById('resultadoReforcos').innerHTML = `<b>€${dadosReforcos.valores[periodos - 1]}</b>`;
    document.getElementById('resultadoTotalInvestido').innerHTML = `<b>€${totalInvestido.toFixed(2)}</b>`; // Update Total Investido card
    document.getElementById('resutaldoTotalJuros').innerHTML = `<b>€${jurosTotais.toFixed(2)}</b>`; // Update Juros Totais card

    updateChart(dadosReforcos.valores, dadosReforcos.montanteAcumulado, periodos);
    updateTable(dadosReforcos.valores, dadosReforcos.montanteAcumulado, dadosReforcos.jurosMensais, dadosReforcos.juroAcumulado, periodos);
}

function updateChart(reforcos, montanteAcumulado, periodos) {
    let tempo = [];
    for (let i = 0; i < periodos; i++) {
        tempo[i] = i + 1;
    }
    if (tempo.length === 0) {
        tempo[0] = 'Meses';
    }

    myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: tempo,
            datasets: [{
                label: 'Reforço Mensal',
                data: reforcos,
                backgroundColor: corTransparente1,
                borderColor: cor1,
                borderWidth: 1
            },
            {
                label: 'Montante Acumulado',
                data: montanteAcumulado,
                backgroundColor: corTransparente2,
                borderColor: cor2,
                borderWidth: 1
            }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateTable(reforcos, montanteAcumulado, jurosMensais, juroAcumulado, periodos) {
    let linha = 1;
    let display = document.getElementById('display');

    // Limpar a tabela antes de atualizar
    display.innerHTML = `
        <tr>
            <th class="table-th-1">Mês</th>
            <th class="table-th-2">Reforço Mensal</th>
            <th class="table-th-3">Montante Acumulado</th>
            <th class="table-th-4">Juros Mensais</th>
            <th class="table-th-5">Juro Acumulado</th>
        </tr>`;

    for (let i = 0; i < periodos; i++) {
        let novaLinha = display.insertRow(linha);
        let cell1 = novaLinha.insertCell(0);
        let cell2 = novaLinha.insertCell(1);
        let cell3 = novaLinha.insertCell(2);
        let cell4 = novaLinha.insertCell(3);
        let cell5 = novaLinha.insertCell(4);

        cell1.innerHTML = i + 1;
        cell2.innerHTML = "€" + reforcos[i];
        cell3.innerHTML = "€" + montanteAcumulado[i];
        cell4.innerHTML = "€" + jurosMensais[i];
        cell5.innerHTML = "€" + juroAcumulado[i];

        linha++;
    }
}

document.getElementById('reset').addEventListener('click', function () {
    document.getElementById('valorInicial').value = '';
    document.getElementById('valorDesejado').value = '';
    document.getElementById('juros').value = '';
    document.getElementById('meses').value = '';
    document.getElementById('resultadoReforcos').innerHTML = '<b>€0.00</b>';

    // Reset chart and table
    myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Meses'],
            datasets: [{
                label: 'Reforço Mensal',
                data: [0],
                backgroundColor: [corTransparente1],
                borderColor: [cor1],
                borderWidth: 1
            },
            {
                label: 'Montante Acumulado',
                data: [0],
                backgroundColor: [corTransparente2],
                borderColor: [cor2],
                borderWidth: 1
            }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    let display = document.getElementById('display');
    display.innerHTML = `
        <tr>
            <th class="table-th-1">Mês</th>
            <th class="table-th-2">Reforço Mensal</th>
            <th class="table-th-3">Montante Acumulado</th>
            <th class="table-th-4">Juros Mensais</th>
            <th class="table-th-5">Juro Acumulado</th>
        </tr>
        <tr>
            <td> 0 </td>
            <td> €0.00 </td>
            <td> €0.00 </td>
            <td> €0.00 </td>
            <td> €0.00 </td>
        </tr>`;
});

document.getElementById('exportButton').addEventListener('click', exportData);

function exportData() {
    var selectedExportOption = document.getElementById('exportOptions').value;

    if (selectedExportOption === 'csv') {
        exportToCSV();
    } else if (selectedExportOption === 'json') {
        exportToJSON();
    } else if (selectedExportOption === 'pdf') {
        exportToPDF();
    }
}
function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Mês,Reforço Mensal,Montante Acumulado,Juros Mensais,Juro Acumulado\n";

    let tableRows = document.querySelectorAll("#display tr");
    tableRows.forEach((row) => {
        let rowData = Array.from(row.children).map((cell) => cell.innerText);
        csvContent += rowData.join(",") + "\n";
    });

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "juros_compostos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportToJSON() {
    let tableRows = document.querySelectorAll("#display tr");
    let jsonData = [];

    tableRows.forEach((row, index) => {
        if (index !== 0) { // Skip header row
            let rowData = {
                Mês: row.children[0].innerText,
                "Reforço Mensal": row.children[1].innerText,
                "Montante Acumulado": row.children[2].innerText,
                "Juros Mensais": row.children[3].innerText,
                "Juro Acumulado": row.children[4].innerText
            };
            jsonData.push(rowData);
        }
    });

    let jsonString = JSON.stringify(jsonData, null, 2);
    let blob = new Blob([jsonString], { type: "application/json" });
    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "juros_compostos.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.getElementById('exportButton').addEventListener('click', function () {
    var element = document.getElementById('exportOptions');
    var exportFormat = element.options[element.selectedIndex].value;

    if (exportFormat === 'pdf') {
        exportToPDF();
    }
});

function exportToPDF() {
    var element = document.getElementById('exportContent');

    // Set custom options, including page width and height
    var options = {
        margin: 10,
        filename: 'exported_document',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a2', orientation: 'portrait' }
    };

    // Export to PDF with custom options
    html2pdf(element, options);
}
function shareOnFacebook() {
    var urlToShare = encodeURIComponent(window.location.href);
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + urlToShare);
}

function shareOnTwitter() {
// Obter os dados do último mês diretamente dos elementos
var reforcoMensal = document.getElementById('resultadoReforcos').innerText;
var montanteAcumulado = document.getElementById('resultadoTotalInvestido').innerText;
var jurosTotais = document.getElementById('resutaldoTotalJuros').innerText;

// Adicionar informações específicas ao compartilhar no Twitter
var textToShare = encodeURIComponent(`Confira essa simulação de Juros Compostos! Veja como vou ficar rico! 💰📈\n` +
    `Último mês - Reforço: ${reforcoMensal}, Montante Acumulado: ${montanteAcumulado}, Juros Totais: ${jurosTotais}`);
var urlToShare = encodeURIComponent(window.location.href);
window.open('https://twitter.com/intent/tweet?text=' + textToShare + '&url=' + urlToShare, '_blank');
}

function shareOnWhatsApp() {
// Obter os dados do último mês diretamente dos elementos
var reforcoMensal = document.getElementById('resultadoReforcos').innerText;
var montanteAcumulado = document.getElementById('resultadoTotalInvestido').innerText;
var jurosTotais = document.getElementById('resutaldoTotalJuros').innerText;

// Adicionando informações específicas ao compartilhar no WhatsApp
var textToShare = encodeURIComponent('Cheka aí como vou ficar rico!\n' +
    `Último mês - Reforço: ${reforcoMensal}, Montante Acumulado: ${montanteAcumulado}, Juros Totais: ${jurosTotais}`);
window.open('https://api.whatsapp.com/send?text=' + textToShare, '_blank');
}