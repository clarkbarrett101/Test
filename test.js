const element = document.body;
const canvas = document.createElement("canvas");
canvas.width = 500;
canvas.height = 500;
element.appendChild(canvas);
const ctx = canvas.getContext("2d");
//BLE
let service = "590d65c7-3a0a-4023-a05a-6aaf2f22441c";
let characteristics = [0x0001, 0x0002, 0x0003];
let byteLength = 8;
let connected = false;
let gyro = [180.0, 180.0, 180.0];

window.onload = () => {
  element.onclick = connectBLE;
  setInterval(draw, 100);
};
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
const functions = [gyroXChanged, gyroYChanged, gyroZChanged];
function connectBLE() {
  navigator.bluetooth
    .requestDevice({ filters: [{ services: [service] }] })
    .then((device) => device.gatt.connect())
    .then((server) => server.getPrimaryService(service))
    .then((service) => {
      for (let i = 0; i < characteristics.length; i++) {
        service.getCharacteristic(characteristics[i]).then((characteristic) => {
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
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.fillRect(canvas.width / 2, 10, gyro[0], 40);
  ctx.stroke();
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.fillRect(canvas.width / 2, 60, gyro[1], 40);
  ctx.stroke();
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.fillRect(canvas.width / 2, 110, gyro[2], 40);
  ctx.stroke();
}
