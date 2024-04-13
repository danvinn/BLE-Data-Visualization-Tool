/*

//Commented out due to compiler issues on VScode

#include <Wire.h>
#include <LIS3MDL.h>
#include <SoftwareSerial.h>

LIS3MDL mag;
SoftwareSerial BTSerial(2, 3); // RX, TX

const int maxDataSize = 25; // Maximum expected data size (adjust as needed)
char report[maxDataSize];

void setup() {
  Serial.begin(9600);
  BTSerial.begin(9600);
  Wire.begin();

  if (!mag.init()) {
    Serial.println("Failed to detect and initialize magnetometer!");
    while (1);
  }

  mag.enableDefault();
}

void loop() {
  mag.read();

  // Format data string (CSV format)
  snprintf(report, maxDataSize, "%6f,%6f,%6f", mag.m.x, mag.m.y, mag.m.z);

  // Print to serial monitor
  Serial.println(report);

  // Check for available space before sending to HM-10
  if (BTSerial.availableForWrite()) {
    BTSerial.println(report);
  } else {
    Serial.println("HM-10 buffer full, data dropped!");
  }

  delay(5000); // Control data transmission rate
}
*/