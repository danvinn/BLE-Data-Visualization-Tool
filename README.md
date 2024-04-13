# Web Bluetooth Terminal

  

**Hello!**

  

This BLE Webapp is a project built upon **[Loginov's Bluetooth Terminal.](https://github.com/loginov-rocks/bluetooth-terminal)**


Web Bluetooth Terminal is a website that can **connect** with the remote devices which support **Bluetooth Low Energy.**

My goal was to utilize this terminal and allow **any** compatible microcontroller and sensor to comunicate and transmit data. 

I have utilized Chart.js to preform real-time data representation. 

My project specifically uses an **[Arduino-Uno](https://en.wikipedia.org/wiki/Arduino_Uno)**, **[ HM-10 bluetooth module](https://store-usa.arduino.cc/products/bluetooth-low-energy-4-0-module-hm-10)** and a **[LI3SMDL triple-axis magnetometer.](https://www.adafruit.com/product/4479)**

This can be installed on your homescreen as an application and work offline.

Furthermore, this application establishes **serial communication** over BLE that is not provided by the specification, but needed if you want to make your own BLE IoT devices using affordable bluetooth modules.

  
The application utilises BLE service (`0xFFE0`) and characteristic (`0xFFE1`) available in low cost BLE modules.

 
### Bluetooth Low Energy (Smart) device

  

As mentioned, different BLE devices implement their own services and characteristics to communicate with, but you can build your own simple device: you just need a BLE module (e.g. HM-10, JDY-08, AT-09, CC41-A) and an Arduino Uno. 

Below is the circuit schematic of my implementation.

!["Circuit diagram"](https://github.com/danvinn/Web-Bluetooth-Terminal/blob/main/misc/Arduino-Bridge/circuitio.png){ width=50% }

  
Open Serial Monitor in Arduino IDE, switch baudrate to `9600` and line endings to `Both NL & CR`. Next, launch the terminal and be able to make a small talk between the Terminal and the Serial Monitor!

 
