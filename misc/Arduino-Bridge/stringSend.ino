#include <SoftwareSerial.h>

const int hm10TxPin = 2; // TX pin of Arduino connected to RX pin of HM10
const int hm10RxPin = 3; // RX pin of Arduino connected to TX pin of HM10
int baudRate = 9600;     // Make sure this matches the baud rate of your HM10

SoftwareSerial bluetooth(hm10RxPin, hm10TxPin);

void setup() {
  Serial.begin(baudRate);  // Open serial communication for debugging (optional)
  bluetooth.begin(baudRate); // Start communication with HM10 module
}

void loop() {
  // Generate a string of 6 random numbers (0-9)
  String randomString = "";
  for (int i = 0; i < 6; i++) {

    float randomFloat = random(1000.00) / 100.0;

    randomString += String(randomFloat, 2);
    if (i < 5){
      randomString += ",";
    }
  }

  // Send the string to the HM10 module
  bluetooth.println(randomString);

  // Optional: Add a delay between sending data (adjust as needed)
  delay(1000);
}
