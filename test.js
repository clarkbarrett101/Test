const element = document.body;
const canvas = document.createElement("canvas");
canvas.width = 100;
canvas.height = 300;
element.appendChild(canvas);
const ctx = canvas.getContext("2d");
//BLE
let service = "590d65c7-3a0a-4023-a05a-6aaf2f22441c";
let characteristics = [0x0004, 0x0005, 0x0006];
let byteLength = 8;
let connected = false;
let gyro = [0.0, 0.0, 0.0];
let gOffset = [0.0, 0.0, 0.0];
let accel = [0.0, 0.0, 0.0];
let aOffset = [0.0, 0.0, 0.0];
let battery = 0.0;

setInterval(draw, 50);

function gyroXChanged(event) {
  var value = event.target.value;
  var str = "";
  for (var i = 0; i < value.byteLength; i++) {
    str += String.fromCharCode(value.getUint8(i));
  }
  gyro[0] = parseFloat(str);
}
function gyroYChanged(event) {
  var value = event.target.value;
  var str = "";
  for (var i = 0; i < value.byteLength; i++) {
    str += String.fromCharCode(value.getUint8(i));
  }
  gyro[1] = parseFloat(str);
}
function gyroZChanged(event) {
  var value = event.target.value;
  var str = "";
  for (var i = 0; i < value.byteLength; i++) {
    str += String.fromCharCode(value.getUint8(i));
  }
  gyro[2] = parseFloat(str);
}
function accelXChanged(event) {
  var value = event.target.value;
  var str = "";
  for (var i = 0; i < value.byteLength; i++) {
    str += String.fromCharCode(value.getUint8(i));
  }
  accel[0] = parseFloat(str);
}
function accelYChanged(event) {
  var value = event.target.value;
  var str = "";
  for (var i = 0; i < value.byteLength; i++) {
    str += String.fromCharCode(value.getUint8(i));
  }
  accel[1] = parseFloat(str);
}
function accelZChanged(event) {
  var value = event.target.value;
  var str = "";
  for (var i = 0; i < value.byteLength; i++) {
    str += String.fromCharCode(value.getUint8(i));
  }
  accel[2] = parseFloat(str);
}
function batteryChanged(event) {
  var value = event.target.value;
  var str = "";
  for (var i = 0; i < value.byteLength; i++) {
    str += String.fromCharCode(value.getUint8(i));
  }
  battery = parseFloat(str);
}

const functions = [accelXChanged, accelYChanged, accelZChanged];
function connectBLE() {
  try {
    navigator.bluetooth
      .requestDevice({ filters: [{ services: [service] }] })
      .then((device) => device.gatt.connect())
      .then((server) => server.getPrimaryService(service))
      .then((service) => {
        for (let i = 0; i < characteristics.length; i++) {
          service
            .getCharacteristic(characteristics[i])
            .then((characteristic) => {
              console.log(characteristic);
              characteristic.startNotifications().then((_) => {
                characteristic.addEventListener(
                  "characteristicvaluechanged",
                  functions[i]
                );
              });
            });
        }
      })
      .then((connected = true));
  } catch (e) {
    window.alert("Connection failed. Please try again.");
  }
}

const node = document.body.appendChild(document.createElement("div"));
let max = 0;
let score = 0;
let bufferedScore = 0;
function draw() {
  const accelMag = Math.sqrt(
    accel[0] * accel[0] + accel[1] * accel[1] + accel[2] * accel[2]
  );
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  score = Math.log2(accelMag) * 2000;
  if (score >= 0) {
    bufferedScore += (score - bufferedScore) / 10;
  }
  const colorlvl = Math.abs(bufferedScore - 100);
  console.log(battery);
  ctx.fillStyle = "rgb(" + colorlvl + "," + (255 - colorlvl) + ", 0)";
  ctx.fillRect(0, canvas.height - bufferedScore, canvas.width, bufferedScore);
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(0, 50, canvas.width, canvas.height - 100);
  ctx.strokeRect(0, 100, canvas.width, canvas.height - 200);
}
