class Process {
    constructor(name, arrivalTime, burstTime) {
        this.name = name;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.startTime = null;
        this.completionTime = null;
        this.waitingTime = 0;
    }
}

function generateRandomProcesses() {
    const processes = [];
    const arrivalTimes = shuffleArray([0, 1, 2, 3, 4]);
    for (let i = 1; i <= 5; i++) {
        const arrivalTime = arrivalTimes[i - 1]; // Get a unique arrival time from the shuffled array
        const burstTime = Math.floor(Math.random() * 10) + 1; // Burst times between 1 and 10
        processes.push(new Process(`P${i}`, arrivalTime, burstTime));
    }
    return processes;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function srtfScheduling(processes) {
    let time = 0;
    let completed = 0;
    const n = processes.length;
    const result = [];

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (completed !== n) {
        let idx = -1;
        let minRemainingTime = Number.MAX_SAFE_INTEGER;

        for (let i = 0; i < n; i++) {
            if (processes[i].arrivalTime <= time && processes[i].remainingTime > 0 && processes[i].remainingTime < minRemainingTime) {
                minRemainingTime = processes[i].remainingTime;
                idx = i;
            }
        }

        if (idx !== -1) {
            result.push(processes[idx].name);
            if (processes[idx].startTime === null) {
                processes[idx].startTime = time;
            }
            processes[idx].remainingTime -= 1;

            if (processes[idx].remainingTime === 0) {
                processes[idx].completionTime = time + 1;
                processes[idx].waitingTime = processes[idx].completionTime - processes[idx].arrivalTime - processes[idx].burstTime;
                completed++;
            }
        } else {
            result.push('Idle');
        }

        time++;
    }

    return result;
}

function calculateAverageWaitingTime(processes) {
    const totalWaitingTime = processes.reduce((total, process) => total + process.waitingTime, 0);
    return totalWaitingTime / processes.length;
}

function renderGanttChart(schedule) {
    const chart = document.createElement('div');
    chart.id = 'chart';
    schedule.forEach(process => {
        const div = document.createElement('div');
        div.className = `process ${process.toLowerCase()}`;
        div.textContent = process;
        chart.appendChild(div);
    });
    return chart;
}

function renderProcessTable(processes) {
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th onclick="sortTable(0)">Process</th>
                <th onclick="sortTable(1)">Arrival Time</th>
                <th onclick="sortTable(2)">Burst Time</th>
                <th onclick="sortTable(3)">Waiting Time</th>
            </tr>
        </thead>
        <tbody>
            ${processes.map(process => `
                <tr>
                    <td>${process.name}</td>
                    <td>${process.arrivalTime}</td>
                    <td>${process.burstTime}</td>
                    <td>${process.waitingTime}</td>
                </tr>`).join('')}
        </tbody>
    `;
    return table;
}

function sortTable(columnIndex) {
    const table = document.querySelector('table tbody');
    const rows = Array.from(table.rows);
    const sortedRows = rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent;
        const bText = b.cells[columnIndex].textContent;
        return aText.localeCompare(bText, undefined, { numeric: true });
    });
    table.innerHTML = '';
    sortedRows.forEach(row => table.appendChild(row));
}

function runSimulation() {
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = ''; // Clear previous results
    
    const processes = generateRandomProcesses();
    const schedule = srtfScheduling(processes);
    const processTable = renderProcessTable(processes);
    const ganttChart = renderGanttChart(schedule);
    const averageWaitingTime = calculateAverageWaitingTime(processes);
    
    const averageWaitingTimeDiv = document.createElement('div');
    averageWaitingTimeDiv.textContent = `Average Waiting Time: ${averageWaitingTime.toFixed(2)}`;
    
    resultDiv.appendChild(processTable);
    resultDiv.appendChild(ganttChart);
    resultDiv.appendChild(averageWaitingTimeDiv);
}
