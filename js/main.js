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

// function to update the chart 
function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.update();
}

function updateDataForChart(dataString) {

  const values = dataString.split(','); // Split the string by commas
  if (values.length !== 3) {
    console.error("Invalid data format. Expected 3 comma-separated values.");
    return;
  }

  const newLabel = updateDataForChart.dataPointNumber || 0; // Update label if needed
  updateDataForChart.dataPointNumber = newLabel + 1;

  const newX = parseFloat(values[0]);
  const newY = parseFloat(values[1]);
  const newZ = parseFloat(values[2]);

  /*
  chartConfig.data.labels.push(newLabel); // Add a timestamp for each data point
  chartConfig.data.datasets[0].data.push(parseFloat(values[0])); // Push X-axis value
  chartConfig.data.datasets[1].data.push(parseFloat(values[1])); // Push Y-axis value
  chartConfig.data.datasets[2].data.push(parseFloat(values[2])); // Push Z-axis value
  */

  const newData = [newX, newY, newZ]; 

  // Update the chart with the new data
  addData(myChart, newLabel, newData);

}

// below is used for one value parsing in

/*
  let dataPointNumber = updateDataForChart.dataPointNumber || 0;

  updateDataForChart.dataPointNumber = dataPointNumber + 1;

  const newLabel = dataPointNumber; // Update label if needed
  const newData = parseFloat(data); // Convert string to float
  addData(myChart, newLabel, newData);
  */

//updateDataForChart.dataPointNumber = 0;



// Override `receive` method to log incoming data to the terminal.
terminal.receive = function(data) {
  logToTerminal(data, 'in');
  const receivedData = data;
  //simulateData();
  updateDataForChart(receivedData);
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
