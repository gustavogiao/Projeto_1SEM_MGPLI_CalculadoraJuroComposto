let charts = [];
let simulatorCount = 1;

function addSimulator() {
  if (simulatorCount <= 5) {
      const container = document.getElementById("simulators-container");

      const newSimulator = document.createElement("div");
      newSimulator.className = "calculator";
      newSimulator.id = `calculator${simulatorCount}`;

      newSimulator.innerHTML = `
          <h2>Simulação ${simulatorCount}</h2>
          <label for="principal${simulatorCount}">Capital Inicial:</label>
          <input type="number" id="principal${simulatorCount}" value="1000"><br>

          <label for="interestRate${simulatorCount}">Taxa de Juros Mensal (%):</label>
          <input type="number" id="interestRate${simulatorCount}" value="1"><br>

          <label for="months${simulatorCount}">Número de Meses:</label>
          <input type="number" id="months${simulatorCount}" value="12"><br>

          <label for="monthlyContribution${simulatorCount}">Contribuição Mensal:</label>
          <input type="number" id="monthlyContribution${simulatorCount}" value="100"><br>

          <button onclick="calculate(${simulatorCount})" style="background-color: rgb(0, 0, 0); border: none; color: white; height: 3rem; margin-top: 1rem; border-radius: .5rem; position: relative; z-index: 0; transition: .3s;">Calcular</button>
          <button onclick="removeSimulator(${simulatorCount})" style="background-color: rgb(0, 0, 0); border: none; color: white; height: 3rem; margin-top: 1rem; border-radius: .5rem; position: relative; z-index: 0; transition: .3s;">Remover</button>

          <div class="result-message" id="resultMessage${simulatorCount}"></div>

          <canvas id="chart${simulatorCount}" width="400" height="200"></canvas>
      `;

      container.appendChild(newSimulator);
      simulatorCount++;
  } else {
      alert("Limite de 5 simuladores atingido!");
  }
}

function removeSimulator(simulatorId) {
    const container = document.getElementById("simulators-container");
    const simulatorToRemove = document.getElementById(`calculator${simulatorId}`);

    if (simulatorToRemove) {
        container.removeChild(simulatorToRemove);
        simulatorCount--;
    }
}


function calculate(calculatorId) {
  // Obtenha os valores dos inputs
  const principal = parseFloat(document.getElementById(`principal${calculatorId}`).value);
  const interestRate = parseFloat(document.getElementById(`interestRate${calculatorId}`).value) / 100;
  const months = parseInt(document.getElementById(`months${calculatorId}`).value);
  const monthlyContribution = parseFloat(document.getElementById(`monthlyContribution${calculatorId}`).value);

  // Calcula o montante acumulado
  let totalAmount = principal;
  const interestFactor = 1 + interestRate;
  const data = [totalAmount];

  for (let i = 1; i <= months; i++) {
    totalAmount = (totalAmount + monthlyContribution) * interestFactor;
    data.push(totalAmount);
  }

  // Atualize o gráfico
  const ctx = document.getElementById(`chart${calculatorId}`).getContext('2d');

  // Encontre o índice do gráfico para este calculador
  const chartIndex = charts.findIndex(chart => chart.calculatorId === calculatorId);

  // Destrua o gráfico existente se houver um
  if (chartIndex !== -1) {
    charts[chartIndex].chart.destroy();
    charts.splice(chartIndex, 1);
  }

  // Crie um novo gráfico
  const newChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: months + 1 }, (_, i) => i),
      datasets: [{
        label: 'Montante Acumulado',
        data: data,
        borderColor: 'blue',
        fill: false
      }]
    },
    options: {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom'
        },
        y: {
          type: 'linear',
          position: 'left'
        }
      }
    }
  });

  // Armazene o novo gráfico na lista global
  charts.push({ calculatorId: calculatorId, chart: newChart });

  // Atualize a mensagem de resultado
  const resultMessage = document.getElementById(`resultMessage${calculatorId}`);
  resultMessage.innerText = `Resultado Final: Montante Acumulado = ${data[data.length - 1].toFixed(2)}`;
}


  