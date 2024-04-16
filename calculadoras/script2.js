var calcular = document.getElementById("calcular")
        calcular.addEventListener("click", setValues)

        let cor1 = 'rgba(0, 223, 45, 1)'
        let corTransparente1 = 'rgba(0, 223, 45, 0.2)'

        let myChart; // Declare the chart variable outside the function

        function setValues() {
            let objetivoFinal = Number(document.getElementById('objetivoFinal').value);
            let investimentoMensal = Number(document.getElementById('investimentoMensal').value);
            let taxaJurosAnual = Number(document.getElementById('taxaJuros').value);
            let numeroMeses = Number(document.getElementById('numeroMeses').value);
            let numeroAnos = Number(document.getElementById('numeroAnos').value); // Adicionado
            let montanteInicial = document.getElementById('montanteInicial');
            let objetivoFinalDisplay = document.getElementById('objetivoFinalDisplay');
            let acumuladoMensalDisplay = document.getElementById('acumuladoMensal');

            // Converta o número de anos em meses
            let periodos = numeroAnos * 12 + numeroMeses;

            calcularInvestimentoNecessario(objetivoFinal, investimentoMensal, taxaJurosAnual, periodos, montanteInicial, objetivoFinalDisplay, acumuladoMensalDisplay);
        }


        function calcularInvestimentoNecessario(objetivoFinal, investimentoMensal, taxaJurosAnual, numeroMeses, montanteInicial, objetivoFinalDisplay, acumuladoMensalDisplay) {
            let periodos = numeroMeses;
            let taxaMensal = taxaJurosAnual / 100 / 12;
            let dadosInvestimento = {
                valores: [],
                acumuladoMensal: [],
                jurosMensais: [],
                jurosAcumulados: []
            };

            let acumuloTotal = 0;
            let jurosAcumulado = 0;

            for (let i = 0; i <= periodos; i++) {
                let investimentoNecessario = (objetivoFinal - (investimentoMensal * (Math.pow(1 + taxaMensal, i) - 1) / taxaMensal)) *
                    Math.pow(1 + taxaMensal, -i);
                dadosInvestimento.valores.unshift(investimentoNecessario.toFixed(2));

                // Altere a fórmula do acumuloTotal para ser o investimentoMensal multiplicado por i (o mês atual)
                acumuloTotal = investimentoMensal * i;
                dadosInvestimento.acumuladoMensal.unshift(acumuloTotal.toFixed(2));

                // Cálculo dos juros mensais e acumulados
                let jurosMensais = acumuloTotal * taxaMensal;
                dadosInvestimento.jurosMensais.unshift(jurosMensais.toFixed(2));

                jurosAcumulado += jurosMensais;
                dadosInvestimento.jurosAcumulados.unshift(jurosAcumulado.toFixed(2));
            }

            montanteInicial.innerHTML = "€" + dadosInvestimento.valores[0];
            objetivoFinalDisplay.innerHTML = "€" + objetivoFinal.toFixed(2);

            // Exibindo a acumulação mensal no card correspondente
            acumuladoMensalDisplay.innerHTML = "€" + dadosInvestimento.acumuladoMensal[0];

            updateChart(dadosInvestimento.valores, periodos);
            updateTable(dadosInvestimento.valores, dadosInvestimento.acumuladoMensal, dadosInvestimento.jurosMensais, dadosInvestimento.jurosAcumulados, periodos, investimentoMensal);
        }

        function updateChart(data, periodos) {
            let tempo = [];
            for (let i = 0; i < periodos; i++) {
                tempo[i] = i + 1;
            }
            if (tempo.length === 0) {
                tempo[0] = 'Meses';
            }

            let ctx = document.getElementById('myChart').getContext("2d");

            // Check if the chart has been created
            if (!myChart) {
                myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: tempo,
                        datasets: [{
                            label: 'Montante Inicial',
                            data: data,
                            backgroundColor: corTransparente1,
                            borderColor: cor1,
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
            } else {
                // Update the existing chart
                myChart.data.labels = tempo;
                myChart.data.datasets[0].data = data;
                myChart.update();
            }
        }

        function updateTable(data, acumuladoMensalData, jurosMensais, jurosAcumulados, periodos, investimentoMensal) {
            let linha = 1;
            let display = document.getElementById('display');

            // Limpar a tabela antes de atualizar
            display.innerHTML = `
                    <tr>
                        <th class="table-th-1">Mês</th>
                        <th class="table-th-2">Montante Acumulado</th>
                        <th class="table-th-3">Investimento Mensal</th>
                    </tr>`;

            for (let i = 0; i <= periodos; i++) {
                let novaLinha = display.insertRow(linha);
                let cell1 = novaLinha.insertCell(0);
                let cell2 = novaLinha.insertCell(1);
                let cell3 = novaLinha.insertCell(2);

                cell1.innerHTML = i + 1;
                cell2.innerHTML = "€" + data[i];
                cell3.innerHTML = "€" + (investimentoMensal * i).toFixed(2);

                linha++;
            }
        }

        document.getElementById('reset').addEventListener('click', function () {
            document.getElementById('objetivoFinal').value = '';
            document.getElementById('investimentoMensal').value = '';
            document.getElementById('taxaJuros').value = '';
            document.getElementById('numeroMeses').value = '';
            document.getElementById('montanteInicial').innerText = '€0.00';
            document.getElementById('objetivoFinalDisplay').innerText = '€0.00';
            document.getElementById('acumuladoMensal').innerText = '€0.00';

            // Reset chart and table
            if (myChart) {
                myChart.destroy(); // Destroy the existing chart
            }
            myChart = null; // Set chart to null
            let ctx = document.getElementById('myChart').getContext("2d");
            myChart = createChart(ctx); // Recreate the chart

            let display = document.getElementById('display');
            display.innerHTML = `
                    <tr>
                        <th class="table-th-1">Mês</th>
                        <th class="table-th-2">Montante Acumulado</th>
                        <th class="table-th-3">Investimento Mensal</th>
                    </tr>
                    <tr>
                        <td> 0 </td>
                        <td> €0.00 </td>
                        <td> €0.00 </td>
                    </tr>`;
        });

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

        // Função para exportar como CSV
        function exportToCSV() {
            // Obtenha o elemento da tabela
            var table = document.getElementById('display');

            // Crie uma string CSV vazia
            var csv = '';

            // Itere pelas linhas e células da tabela
            for (var i = 0; i < table.rows.length; i++) {
                var row = table.rows[i];
                for (var j = 0; j < row.cells.length; j++) {
                    // Adicione o valor da célula à string CSV
                    csv += row.cells[j].innerText + ',';
                }
                // Adicione uma nova linha após cada linha
                csv += '\n';
            }

            // Crie um Blob com os dados CSV
            var blob = new Blob([csv], { type: 'text/csv' });
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

        // Função para exportar como JSON
        function exportToJSON() {
            // Obtenha os dados da tabela
            var table = document.getElementById('display');
            var data = [];

            // Itere pelas linhas da tabela (ignorando o cabeçalho)
            for (var i = 1; i < table.rows.length; i++) {
                var rowData = {};
                var row = table.rows[i];

                // Itere pelas células da linha
                for (var j = 0; j < row.cells.length; j++) {
                    // Use o cabeçalho da coluna como chave e o valor da célula como valor
                    var columnHeader = table.rows[0].cells[j].innerText.toLowerCase().replace(' ', '_');
                    rowData[columnHeader] = row.cells[j].innerText;
                }

                // Adicione os dados da linha ao array
                data.push(rowData);
            }

            // Converta os dados para uma string JSON formatada
            var jsonData = JSON.stringify(data, null, 2);

            // Crie um Blob com os dados JSON
            var blob = new Blob([jsonData], { type: 'application/json' });

            // Crie um elemento de link para baixar o arquivo JSON
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'dados.json';

            // Adicione o link ao corpo do documento
            document.body.appendChild(link);

            // Acione o clique no link para iniciar o download
            link.click();

            // Remova o link do corpo do documento
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
                'Montante Inicial: ' + document.getElementById('montanteInicial').innerText + '\n' +
                'Objetivo Final: ' + document.getElementById('objetivoFinalDisplay').innerText + '\n' +
                'Acumulado Mensal: ' + document.getElementById('acumuladoMensal').innerText + '\n' +
                'Tempo: ' + document.getElementById('numeroAnos').innerText);
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + urlToShare + '&quote=' + textToShare, '_blank');
        }

        function shareOnTwitter() {
            var montanteInicial = document.getElementById('montanteInicial').innerText;
            var objetivoFinal = document.getElementById('objetivoFinalDisplay').innerText;
            var acumuladoMensal = document.getElementById('acumuladoMensal').innerText;

            var textToShare = encodeURIComponent('Confira os resultados da minha simulação de investimento:\n' +
                'Montante Inicial: ' + montanteInicial + '\n' +
                'Objetivo Final: ' + objetivoFinal + '\n' +
                'Acumulado Mensal: ' + acumuladoMensal + '\n\n' +
                'Saiba mais: ');

            var urlToShare = encodeURIComponent(window.location.href);

            window.open('https://twitter.com/intent/tweet?text=' + textToShare + '&url=' + urlToShare, '_blank');
        }

        function shareOnWhatsApp() {
            var montanteInicial = document.getElementById('montanteInicial').innerText;
            var objetivoFinal = document.getElementById('objetivoFinalDisplay').innerText;
            var acumuladoMensal = document.getElementById('acumuladoMensal').innerText;

            var textToShare = encodeURIComponent('Confira os resultados da minha simulação de investimento:\n' +
                'Montante Inicial: ' + montanteInicial + '\n' +
                'Objetivo Final: ' + objetivoFinal + '\n' +
                'Acumulado Mensal: ' + acumuladoMensal + '\n\n' +
                'Saiba mais: ' + window.location.href);

            window.open('https://api.whatsapp.com/send?text=' + textToShare, '_blank');
        }

