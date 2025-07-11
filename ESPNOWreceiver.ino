#include <ArduinoJson.h>
#include <ArduinoJson.hpp>
#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <OneWire.h>
#include <esp_now.h>
#include <WiFi.h>

// Struct example to receive data
//  Must match the sender structure
typedef struct espData {
  int nodeID;
  int sensorID;
  float tempC;
} espData;

// Create a struct_message called myData
espData myData;
HardwareSerial mySerial(2);
void setup() {
  // Initialize Serial Monitors
  Serial.begin(115200);
  mySerial.begin(9600,SERIAL_8N1,16,17);
  WiFi.mode(WIFI_STA);

  if (esp_now_init() != ESP_OK) {
    Serial.println("There was an error initializing ESP-NOW");
    return;
  }
  esp_now_register_recv_cb(esp_now_recv_cb_t(OnDataRecv));  
  
}
void loop() {
}

// callback function that will be executed when data is received via espNow
void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {
  memcpy(&myData, incomingData, sizeof(myData));
  Serial.print("Bytes received: ");
  mySerial.print("Bytes received: ");
  Serial.println(len);
  Serial.print("node ID : ");
  Serial.println(myData.nodeID);
  mySerial.println(myData.nodeID);
  Serial.print("SensorID: ");
  Serial.println(myData.sensorID);
  mySerial.println(myData.sensorID);
  Serial.print("Temperature: ");
  Serial.println(myData.tempC);
  mySerial.println(myData.tempC);
}
 