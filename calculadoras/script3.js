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
    // Obtenha os dados da tabela
    var table = document.getElementById('display');
    var csv = [];

    // Adicione o cabeçalho
    var header = [];
    for (var i = 0; i < table.rows[0].cells.length; i++) {
        header.push(table.rows[0].cells[i].innerText);
    }
    csv.push(header.join(','));

    // Adicione os dados
    for (var i = 1; i < table.rows.length; i++) {
        var row = [];
        for (var j = 0; j < table.rows[i].cells.length; j++) {
            row.push(table.rows[i].cells[j].innerText);
        }
        csv.push(row.join(','));
    }

    // Crie um Blob com os dados CSV
    var blob = new Blob([csv.join('\n')], { type: 'text/csv' });

    // Crie um elemento de link para baixar o arquivo CSV
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'dados.csv';

    // Adicione o link ao corpo do documento
    document.body.appendChild(link);

    // Acione o clique no link para iniciar o download
    link.click();

    // Remova o link do corpo do documento
    document.body.removeChild(link);
}

function exportToJSON() {
    // Obtenha os dados da tabela
    var table = document.getElementById('display');
    var data = [];

    for (var i = 1; i < table.rows.length; i++) {
        var rowData = {};
        var row = table.rows[i];

        for (var j = 0; j < row.cells.length; j++) {
            var columnHeader = table.rows[0].cells[j].innerText.toLowerCase().replace(' ', '_');
            rowData[columnHeader] = row.cells[j].innerText;
        }

        data.push(rowData);
    }

    var jsonData = JSON.stringify(data, null, 2);

    var blob = new Blob([jsonData], { type: 'application/json' });

    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'dados.json';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}

function exportToPDF() {
    var table = document.getElementById('display');
    var pdf = new jsPDF();

    pdf.autoTable({
        head: [getHeader()],
        body: getBody(table),
    });

    pdf.save('dados.pdf');
}

function getHeader() {
    var header = [];
    var table = document.getElementById('display');
    for (var i = 0; i < table.rows[0].cells.length; i++) {
        header.push(table.rows[0].cells[i].innerText);
    }
    return header;
}

function getBody(table) {
    var body = [];
    for (var i = 1; i < table.rows.length; i++) {
        var row = [];
        for (var j = 0; j < table.rows[i].cells.length; j++) {
            row.push(table.rows[i].cells[j].innerText);
        }
        body.push(row);
    }
    return body;
}

function setValues() {
    let q = Number(document.getElementById('valorInicial').value)
    let w = Number(document.getElementById('investimentoMensal').value)
    let eAnual = Number(document.getElementById('juros').value)
    let r = Number(document.getElementById('valorDesejado').value);
    let t = document.getElementById('valorTotal')
    let y = document.getElementById('valorInvestido')
    let u = document.getElementById('jurosTotais')
    let v = document.getElementById('anos')
    calcular(q, w, eAnual, r, t, y, u, v)
}

function calcular(valorInicial, investimentoMensal, jurosAnual, valorDesejado, valorTotal, valorInvestido, jurosTotais, anos) {
    let acumuloTotal = valorInicial
    let totalInvestido = valorInicial
    let totalJuros = Number()
    let dividendo = Number()
    let jurosAcumuladoArr = []
    let acumuloTotalArr = []
    let totalInvestidoArr = []
    let dividendoMesArr = []
    let jurosMensal = jurosAnual / 12 / 100;

    if (document.getElementById('valorDesejado').value == '') {
        resetTable(false)
    } else {
        resetTable(true)
    }

    let meses = 0;

    while (acumuloTotal < valorDesejado) {
        dividendo = acumuloTotal * jurosMensal;
        dividendoMesArr[meses] = dividendo.toFixed(2)

        if (jurosAcumuladoArr.length < 1) {
            jurosAcumuladoArr[meses] = dividendo
        } else {
            jurosAcumuladoArr[meses] = dividendo + jurosAcumuladoArr[meses - 1]
        }

        acumuloTotal += dividendo + investimentoMensal
        acumuloTotalArr[meses] = acumuloTotal.toFixed(2)

        totalInvestido += investimentoMensal
        totalInvestidoArr[meses] = totalInvestido.toFixed(2)

        totalJuros += dividendo

        meses++;
    }

    valorTotal.innerHTML = "€" + acumuloTotal.toFixed(2)
    valorInvestido.innerHTML = "€" + totalInvestido.toFixed(2)
    jurosTotais.innerHTML = "€" + totalJuros.toFixed(2)
    anos.innerHTML = (meses / 12).toFixed(4) + " Anos";

    lista()
    grafico(acumuloTotalArr, meses)

    function lista() {
        let linha = 1

        for (i = 0; i < meses; i++) {
            let display = document.getElementById('display')

            let novaLinha = display.insertRow(linha)

            let cell1 = novaLinha.insertCell(0)
            let cell2 = novaLinha.insertCell(1)
            let cell3 = novaLinha.insertCell(2)
            let cell4 = novaLinha.insertCell(3)
            let cell5 = novaLinha.insertCell(4)

            cell1.innerHTML = i + 1
            cell2.innerHTML = "€" + dividendoMesArr[i]
            cell3.innerHTML = "€" + jurosAcumuladoArr[i].toFixed(2)
            cell4.innerHTML = "€" + totalInvestidoArr[i]
            cell5.innerHTML = "€" + acumuloTotalArr[i]

            linha++
        }
    }
}

function grafico(acumuloTotalArr, meses) {
    let tempo = []
    for (i = 0; i < meses; i++) {
        tempo[i] = i + 1
    }
    if (tempo.length == 0) {
        tempo[0] = 'Meses'
    }
    myChart
    myChart.destroy()
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
    grafico(0, 0)
    resetTable(false)
    document.getElementById('valorInicial').value = ''
    document.getElementById('investimentoMensal').value = ''
    document.getElementById('juros').value = ''
    document.getElementById('valorDesejado').value = ''
    document.getElementById('valorTotal').innerText = '€0.00'
    document.getElementById('valorInvestido').innerText = '€0.00'
    document.getElementById('jurosTotais').innerText = '€0.00'
    document.getElementById('anos').innerText = '0 Anos';
})

function resetTable(cond) {
    let novoCalculo = cond

    document.getElementById('display').innerHTML = `
<tr>
    <th class="table-th-1">Mês</th>
    <th class="table-th-2">Juros do mês</th>
    <th class="table-th-3">Juros acumulado</th>
    <th class="table-th-4">Total investido</th>
    <th class="table-th-5">Total acumulado</th>
</tr>`

    if (novoCalculo == false) {
        document.getElementById('display').innerHTML += `
    <tr style="background-color: white;">
        <td> 0 </td>
        <td> 0 </td>
        <td> 0 </td>
        <td> 0 </td>
        <td> 0 </td>
    </tr>
    `
    }
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
    var textToShare = encodeURIComponent('Confira os resultados do meu simulador de juros compostos:\n\n' +
        'Valor Total: ' + document.getElementById('valorTotal').innerText + '\n' +
        'Valor Investido: ' + document.getElementById('valorInvestido').innerText + '\n' +
        'Juros Totais: ' + document.getElementById('jurosTotais').innerText + '\n' +
        'Tempo: ' + document.getElementById('anos').innerText);
    var urlToShare = encodeURIComponent(window.location.href);
    window.open('https://twitter.com/intent/tweet?text=' + textToShare + '&url=' + urlToShare, '_blank');
}

function shareOnWhatsApp() {
    var textToShare = encodeURIComponent('Confira os resultados do meu simulador de juros compostos:\n\n' +
        'Valor Total: ' + document.getElementById('valorTotal').innerText + '\n' +
        'Valor Investido: ' + document.getElementById('valorInvestido').innerText + '\n' +
        'Juros Totais: ' + document.getElementById('jurosTotais').innerText + '\n' +
        'Tempo: ' + document.getElementById('anos').innerText + '\n\n' +
        'Clique para ver mais: ' + window.location.href);
    window.open('https://api.whatsapp.com/send?text=' + textToShare, '_blank');
}