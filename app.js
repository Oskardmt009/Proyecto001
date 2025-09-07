// Obtener elementos
const form = document.getElementById("habit-form");
const habitChartCanvas = document.getElementById("habitChart").getContext("2d");

// Cargar datos iniciales de LocalStorage
let habits = JSON.parse(localStorage.getItem("habits")) || [];

// Inicializar gráfico
let habitChart = new Chart(habitChartCanvas, {
  type: "bar",
  data: {
    labels: [],
    datasets: [{
      label: "Cantidad registrada",
      data: [],
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  }
});

// Función para actualizar gráfico
function updateChart() {
  const habitCounts = {};

  habits.forEach(h => {
    if (!habitCounts[h.habit]) {
      habitCounts[h.habit] = 0;
    }
    habitCounts[h.habit] += Number(h.cantidad);
  });

  habitChart.data.labels = Object.keys(habitCounts);
  habitChart.data.datasets[0].data = Object.values(habitCounts);
  habitChart.update();
    // 👉 actualizar estadísticas
  updateStats();

}

// Manejar formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const habit = document.getElementById("habit").value;
  const cantidad = document.getElementById("cantidad").value;
  const fecha = document.getElementById("fecha").value;

  if (habit && cantidad && fecha) {
    habits.push({ habit, cantidad, fecha });

    // Guardar en LocalStorage
    localStorage.setItem("habits", JSON.stringify(habits));

    // Actualizar gráfico
    function updateStats() {
    if (habits.length === 0) {
        document.getElementById("avg-study").textContent = "📚 Promedio Estudio: 0 h";
        document.getElementById("total-exercise").textContent = "🏋️ Ejercicio total: 0 h";
        document.getElementById("avg-sleep").textContent = "😴 Sueño promedio: 0 h";
        return;
    } 

  // Filtrar por hábito
  const study = habits.filter(h => h.habit === "Estudio").map(h => Number(h.cantidad));
  const exercise = habits.filter(h => h.habit === "Ejercicio").map(h => Number(h.cantidad));
  const sleep = habits.filter(h => h.habit === "Sueño").map(h => Number(h.cantidad));

  // Calcular promedios y totales
  const avgStudy = study.length ? (study.reduce((a,b) => a+b, 0) / study.length).toFixed(1) : 0;
  const totalExercise = exercise.length ? exercise.reduce((a,b) => a+b, 0) : 0;
  const avgSleep = sleep.length ? (sleep.reduce((a,b) => a+b, 0) / sleep.length).toFixed(1) : 0;

  // Actualizar tarjetas
  document.getElementById("avg-study").textContent = `📚 Promedio Estudio: ${avgStudy} h`;
  document.getElementById("total-exercise").textContent = `🏋️ Ejercicio total: ${totalExercise} h`;
  document.getElementById("avg-sleep").textContent = `😴 Sueño promedio: ${avgSleep} h`;
}

    updateChart();

    form.reset();
  }
});

// Inicializar gráfico al cargar
updateChart();

// Cambiar entre modo oscuro y claro
const toggleBtn = document.getElementById("toggle-theme");

// Guardar preferencia en LocalStorage
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggleBtn.textContent = "☀️ Modo claro";
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    toggleBtn.textContent = "☀️ Modo claro";
    localStorage.setItem("theme", "dark");
  } else {
    toggleBtn.textContent = "🌙 Modo oscuro";
    localStorage.setItem("theme", "light");
  }
});

// Exportar datos a CSV
document.getElementById("export-csv").addEventListener("click", () => {
  if (habits.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,Hábito,Cantidad,Fecha\n";
  habits.forEach(h => {
    csvContent += `${h.habit},${h.cantidad},${h.fecha}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "habitos.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Exportar datos a PDF
document.getElementById("export-pdf").addEventListener("click", () => {
  if (habits.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  // Título
  doc.setFontSize(16);
  doc.text("📊 Reporte de Hábitos", 10, 10);

  // Insertar gráfico
  const canvas = document.getElementById("habitChart");
  const imgData = canvas.toDataURL("image/png", 1.0);
  doc.addImage(imgData, "PNG", 10, 20, 180, 100);

  // 📌 Añadir estadísticas
  doc.setFontSize(12);
  let yPos = 130; // Posición vertical después del gráfico

  const stats = [
    document.getElementById("avg-study").textContent,
    document.getElementById("total-exercise").textContent,
    document.getElementById("avg-sleep").textContent
  ];

  stats.forEach(stat => {
    doc.text(stat, 10, yPos);
    yPos += 10;
  });

  // Guardar PDF
  doc.save("habitos.pdf");
});

// Exportar gráfico como imagen PNG
document.getElementById("export-png").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "grafico_habitos.png";
  link.href = habitChart.toBase64Image();
  link.click();
});

function updateStats() {
  if (habits.length === 0) return;

  // Filtrar por hábito
  const study = habits.filter(h => h.habit === "Estudio").map(h => Number(h.cantidad));
  const exercise = habits.filter(h => h.habit === "Ejercicio").map(h => Number(h.cantidad));
  const sleep = habits.filter(h => h.habit === "Sueño").map(h => Number(h.cantidad));

  // Calcular promedios y totales
  const avgStudy = study.length ? (study.reduce((a,b) => a+b, 0) / study.length).toFixed(1) : 0;
  const totalExercise = exercise.length ? exercise.reduce((a,b) => a+b, 0) : 0;
  const avgSleep = sleep.length ? (sleep.reduce((a,b) => a+b, 0) / sleep.length).toFixed(1) : 0;

  // Actualizar tarjetas
  document.getElementById("avg-study").textContent = `📚 Promedio Estudio: ${avgStudy} h`;
  document.getElementById("total-exercise").textContent = `🏋️ Ejercicio total: ${totalExercise} h`;
  document.getElementById("avg-sleep").textContent = `😴 Sueño promedio: ${avgSleep} h`;
}

// Llamar cada vez que se actualiza el gráfico
function updateChart() {
  const habitCounts = {};

  habits.forEach(h => {
    if (!habitCounts[h.habit]) {
      habitCounts[h.habit] = 0;
    }
    habitCounts[h.habit] += Number(h.cantidad);
  });

  habitChart.data.labels = Object.keys(habitCounts);
  habitChart.data.datasets[0].data = Object.values(habitCounts);
  habitChart.update();

  // 👉 también actualizar estadísticas
  updateStats();
}

// ==================== VARIABLES Y DATOS ====================
// (Este bloque ya lo tienes)
let habits = [];
let habitChart;

// ==================== FUNCIONES PRINCIPALES ====================
// (Estas ya las tienes en tu archivo)
function addHabit() {
  // código para agregar hábitos...
}

function updateChart() {
  // código para actualizar gráfico...
}

function calculateAverage(type) {
  // código para calcular promedio...
}

function calculateTotal(type) {
  // código para calcular total...
}