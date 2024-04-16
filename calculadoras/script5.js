var entry = document.getElementById("entry")
entry.addEventListener("click", setValues)

let cor1 = 'rgba(0, 223, 45, 1)'
let cor2 = 'rgba(28, 42, 92,1)'
let corTransparente1 = 'rgba(0, 223, 45, 0.2)'
let corTransparente2 = 'rgba(28, 42, 92, 0.2)'

const ctx = document.getElementById('myChart').getContext("2d");
let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: meses = ['Meses'],
        datasets: [{
            label: 'Acumulo do mês',
            data: [0],
            backgroundColor: [
                corTransparente1
            ],
            borderColor: [
                cor1
            ],
            borderWidth: 1
        }]
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
    let jurosAnual = Number(document.getElementById('juros').value);
    let meses = Number(document.getElementById('meses').value);
    let anos = Number(document.getElementById('anos').value);
    let valorTotal = document.getElementById('valorTotal');
    let valorInvestido = document.getElementById('valorInvestido');
    let jurosTotais = document.getElementById('jurosTotais');

    // Converta o número de anos em meses
    let mesesTotais = anos * 12 + meses;

    calcular(valorInicial, jurosAnual, mesesTotais, valorTotal, valorInvestido, jurosTotais);
}

function calcular(valorInicial, jurosAnual, meses, valorTotal, valorInvestido, jurosTotais) {
    let acumuloTotal = valorInicial;
    let totalInvestido = valorInicial;
    let totalJuros = Number();
    let dividendo = Number();
    let jurosAcumuladoArr = [];
    let acumuloTotalArr = [];
    let totalInvestidoArr = [];
    let dividendoMesArr = [];
    let jurosMensal = jurosAnual / 12 / 100;

    if (document.getElementById('meses').value == '') {
        resetTable(false);
    } else {
        resetTable(true);
    }

    for (let i = 0; i < meses; i++) {
        dividendo = acumuloTotal * jurosMensal;
        dividendoMesArr[i] = dividendo.toFixed(2);

        if (jurosAcumuladoArr.length < 1) {
            jurosAcumuladoArr[i] = dividendo;
        } else {
            jurosAcumuladoArr[i] = dividendo + jurosAcumuladoArr[i - 1];
        }

        acumuloTotal += dividendo;
        acumuloTotalArr[i] = acumuloTotal.toFixed(2);

        totalInvestido += 0; // No monthly contributions
        totalInvestidoArr[i] = totalInvestido.toFixed(2);

        totalJuros += dividendo;
    }

    valorTotal.innerHTML = "€" + acumuloTotal.toFixed(2);
    valorInvestido.innerHTML = "€" + totalInvestido.toFixed(2);
    jurosTotais.innerHTML = "€" + totalJuros.toFixed(2);

    lista();
    grafico(acumuloTotalArr, meses);

    function lista() {
        let linha = 1;

        for (let i = 0; i < meses; i++) {
            let display = document.getElementById('display');

            let novaLinha = display.insertRow(linha);

            let cell1 = novaLinha.insertCell(0);
            let cell2 = novaLinha.insertCell(1);
            let cell3 = novaLinha.insertCell(2);
            let cell4 = novaLinha.insertCell(3);
            let cell5 = novaLinha.insertCell(4);

            cell1.innerHTML = i + 1;
            cell2.innerHTML = "€" + dividendoMesArr[i];
            cell3.innerHTML = "€" + jurosAcumuladoArr[i].toFixed(2);
            cell4.innerHTML = "€" + totalInvestidoArr[i];
            cell5.innerHTML = "€" + acumuloTotalArr[i];

            linha++;
        }
    }
}

function grafico(acumuloTotalArr, meses) {
    let tempo = [];
    for (let i = -1; i < meses; i++) {
        tempo[i] = i + 1;
    }
    if (tempo.length == 0) {
        tempo[0] = 'Meses';
    }
    myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: tempo,
            datasets: [{
                label: 'Acumulo do mês',
                data: acumuloTotalArr,
                backgroundColor: [
                    corTransparente1,
                    corTransparente2
                ],
                borderColor: [
                    cor1,
                    cor2
                ],
                borderWidth: 1
            }]
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

document.getElementById('reset').addEventListener('click', function () {
    grafico(0, 0);
    resetTable(false);
    document.getElementById('valorInicial').value = '';
    document.getElementById('juros').value = '';
    document.getElementById('meses').value = '';
    document.getElementById('valorTotal').innerText = '€0.00';
    document.getElementById('valorInvestido').innerText = '€0.00';
    document.getElementById('jurosTotais').innerText = '€0.00';
});

function resetTable(cond) {
    let novoCalculo = cond;

    document.getElementById('display').innerHTML = `
<tr>
<th class="table-th-1">Mês</th>
<th class="table-th-2">Juros do mês</th>
<th class="table-th-3">Juros acumulado</th>
<th class="table-th-4">Total investido</th>
<th class="table-th-5">Total acumulado</th>
</tr>`;

    if (novoCalculo == false) {
        document.getElementById('display').innerHTML += `
<tr style="background-color: white;">
    <td> 0 </td>
    <td> 0 </td>
    <td> 0 </td>
    <td> 0 </td>
    <td> 0 </td>
</tr>
`;
    }
}
document.getElementById('exportButton').addEventListener('click', exportData);

function exportData() {
    var exportOption = document.getElementById('exportOptions').value;

    if (exportOption === 'csv') {
        exportToCSV();
    } else if (exportOption === 'json') {
        exportToJSON();
    } else if (exportOption === 'pdf') {
        exportToPDF();
    }
}

// Restante do seu código permanece o mesmo...

// Add this code after the existing script
document.getElementById('exportCSV').addEventListener('click', exportToCSV);

function exportToCSV() {
    // Get the table element
    var table = document.getElementById('display');

    // Create an empty CSV string
    var csv = '';

    // Iterate through table rows and cells
    for (var i = 0; i < table.rows.length; i++) {
        var row = table.rows[i];
        for (var j = 0; j < row.cells.length; j++) {
            // Add cell value to the CSV string
            csv += row.cells[j].innerText + ',';
        }
        // Add a new line after each row
        csv += '\n';
    }

    // Create a Blob with the CSV data
    var blob = new Blob([csv], { type: 'text/csv' });

    // Create a link element to download the CSV file
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'exported_data.csv';

    // Append the link to the body and trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Add this code after the existing script
document.getElementById('exportJSON').addEventListener('click', exportToJSON);

function exportToJSON() {
    // Get the table element
    var table = document.getElementById('display');

    // Create an array to hold JSON objects
    var jsonData = [];

    // Iterate through table rows and cells
    for (var i = 1; i < table.rows.length; i++) {
        var row = table.rows[i];
        var jsonObject = {
            Mes: row.cells[0].innerText,
            'Juros do mês': row.cells[1].innerText,
            'Juros acumulado': row.cells[2].innerText,
            'Total investido': row.cells[3].innerText,
            'Total acumulado': row.cells[4].innerText,
        };
        jsonData.push(jsonObject);
    }

    // Convert JSON array to JSON string
    var jsonString = JSON.stringify(jsonData, null, 2);

    // Create a Blob with the JSON data
    var blob = new Blob([jsonString], { type: 'application/json' });

    // Create a link element to download the JSON file
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'exported_data.json';

    // Append the link to the body and trigger the download
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
    var textToShare = encodeURIComponent('Confira os resultados do meu simulador de juros compostos:\n\n' +
        'Valor Total: ' + document.getElementById('valorTotal').innerText + '\n' +
        'Valor Investido: ' + document.getElementById('valorInvestido').innerText + '\n' +
        'Juros Totais: ' + document.getElementById('jurosTotais').innerText + '\n' +
        'Tempo: ' + document.getElementById('anos').innerText);
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + urlToShare + '&quote=' + textToShare, '_blank');
}

function shareOnTwitter() {
var textToShare = encodeURIComponent('Confira os resultados da minha simulação de juros compostos: \n' +
'Valor Total: ' + document.getElementById('valorTotal').innerText + '\n' +
'Valor Investido: ' + document.getElementById('valorInvestido').innerText + '\n' +
'Juros Totais: ' + document.getElementById('jurosTotais').innerText + '\n\n' +
'Saiba mais: ' + window.location.href);

window.open('https://twitter.com/intent/tweet?text=' + textToShare, '_blank');
}

function shareOnWhatsApp() {
var textToShare = encodeURIComponent('Confira os resultados da minha simulação de juros compostos:\n' +
'Valor Total: ' + document.getElementById('valorTotal').innerText + '\n' +
'Valor Investido: ' + document.getElementById('valorInvestido').innerText + '\n' +
'Juros Totais: ' + document.getElementById('jurosTotais').innerText + '\n\n' +
'Saiba mais: ' + window.location.href);

window.open('https://api.whatsapp.com/send?text=' + textToShare, '_blank');
}