// UI elements.
const deviceNameLabel = document.getElementById('device-name');
const connectButton = document.getElementById('connect');
const disconnectButton = document.getElementById('disconnect');
const terminalContainer = document.getElementById('terminal');
const sendForm = document.getElementById('send-form');
const inputField = document.getElementById('input');

// Helpers.
const defaultDeviceName = 'Terminal';
const terminalAutoScrollingLimit = terminalContainer.offsetHeight / 2;
let isTerminalAutoScrolling = true;
let isGeneratingData = true;
let updateInterval = null;

let tableData = [];

let currentDataPoint = 0;

const scrollElement = (element) => {
  const scrollTop = element.scrollHeight - element.offsetHeight;

  if (scrollTop > 0) {
    element.scrollTop = scrollTop;
  }
};

const logToTerminal = (message, type = '') => {
  terminalContainer.insertAdjacentHTML('beforeend',
      `<div${type && ` class="${type}"`}>${message}</div>`);

  if (isTerminalAutoScrolling) {
    scrollElement(terminalContainer);
  }
};

// Obtain configured instance.
const terminal = new BluetoothTerminal();

const canvas = document.getElementById('myChart');
canvas.height = 200;

const labels = [
  '0'
];

const data = {
  labels: labels,
  datasets: [
    {
    label: 'X-axis (mG)',
    backgroundColor: 'blue',
    borderColor: 'blue',
    data: [],
  },
  {
    label: 'Y-axis (mG)',
    backgroundColor: 'green',
    borderColor: 'green',
    data: [],
  },
  {
    label: 'Z-axis (mG)',
    backgroundColor: 'red',
    borderColor: 'red',
    data: [],
  },
  {
    label: 'X-accel (m/s^2)',
    backgroundColor: 'yellow',
    borderColor: 'yellow',
    data: [],
  },
  {
    label: 'Y-accel (m/s^2)',
    backgroundColor: 'pink',
    borderColor: 'pink',
    data: [],
  },
  {
    label: 'Z-accel (m/s^2)',
    backgroundColor: 'purple',
    borderColor: 'purple',
    data: [],
  }
]
};

const config = {
  type: 'line',
  data: data,
  options: {}
};

const myChart = new Chart(
  canvas,
  config
);

// function to update the chart and table
function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset,index) => {
    dataset.data.push(data[index]);
  });
  chart.update();

  tableData.push({label, ...data});

  if (tableData.length > 0) {
    showDataTable();
  }

}

function startDataGeneration() {

  if (!updateInterval) {
    updateInterval = setInterval(() => {
      runData();


    }, 1000);
  }
}

function stopDataGeneration(){
  clearInterval(updateInterval);
  updateInterval = null;
  isGeneratingData = false;
}

function runData(dataString) {
  
  if(isGeneratingData){

    currentDataPoint++;

    const values = dataString.split(','); // Split the string by commas
    if (values.length !== 6) {

      console.error("Invalid data format. Expected 3 comma-separated values.");
      return;

  }

  const newLabel = currentDataPoint; // Update label if needed

  const magX = parseFloat(values[0]);
  const magY = parseFloat(values[1]);
  const magZ = parseFloat(values[2]);

  const accelX = parseFloat(values[3]);
  const accelY = parseFloat(values[4]);
  const accelZ = parseFloat(values[5]);

  const newData = [magX,magY,magZ,accelX,accelY,accelZ]; // Array containing all six values
  
  addData(myChart, newLabel, newData);

  }

}

function showDataTable() {

  const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = '';

  if (tableData.length === 0){
    const newRow = tableBody.insertRow();
    const cell = newRow.insertCell();
    cell.colSpan = 7;
    cell.textContent = 'No data available yet';
  } else {

    tableData.forEach(data => {
      const newRow = tableBody.insertRow();

      newRow.insertCell().textContent = data.label;
      newRow.insertCell().textContent = data[0];
      newRow.insertCell().textContent = data[1];
      newRow.insertCell().textContent = data[2];
      newRow.insertCell().textContent = data[3];
      newRow.insertCell().textContent = data[4];
      newRow.insertCell().textContent = data[5];

  
    });
  }
}


// Override `receive` method to log incoming data to the terminal.
terminal.receive = function(data) {
  //logToTerminal(data, 'in');

  const receivedData = data;

  runData(receivedData);

};

// Override default log method to output messages to the terminal and console.
terminal._log = function(...messages) {
  // We can't use `super._log()` here.
  messages.forEach((message) => {
    logToTerminal(message);
    console.log(message); // eslint-disable-line no-console
  });
};

// Implement own send function to log outcoming data to the terminal.
const send = (data) => {
  
  terminal.send(data).
      then(() => logToTerminal(data, 'out')).
      catch((error) => logToTerminal(error));
};

// Bind event listeners to the UI elements.
connectButton.addEventListener('click', () => {
  terminal.connect().
      then(() => {
        deviceNameLabel.textContent = terminal.getDeviceName() ?
            terminal.getDeviceName() : defaultDeviceName;
      });
});

disconnectButton.addEventListener('click', () => {
  terminal.disconnect();
  deviceNameLabel.textContent = defaultDeviceName;
});

sendForm.addEventListener('submit', (event) => {
  event.preventDefault();

  send(inputField.value);

  inputField.value = '';
  inputField.focus();
});

// Switch terminal auto scrolling if it scrolls out of bottom.
terminalContainer.addEventListener('scroll', () => {
  const scrollTopOffset = terminalContainer.scrollHeight -
      terminalContainer.offsetHeight - terminalAutoScrollingLimit;

  isTerminalAutoScrolling = (scrollTopOffset < terminalContainer.scrollTop);
});
