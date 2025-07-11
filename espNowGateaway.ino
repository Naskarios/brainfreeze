#include <ArduinoJson.h>
#include <ArduinoJson.hpp>
#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// communicate with the espNow receiver via serial
// connect to wifi and publish the data received from serial to the mqtt server

#define ONE_WIRE_BUS 14
#define LED_BUILTIN 38
#define RGB_BRIGHTNESS 64
const char* ssid = "xxx";
const char* password = "xxx";  
const char* mqtt_server = "xxx";
const char* mqtt_pass = "xxx";

WiFiClient espClient;
PubSubClient client(espClient);
HardwareSerial mySerial(1);
StaticJsonDocument<80> doc;
char output[80];

void setup() {
  // in some cases such as the c3 super mini adjusting the antenna power helps 
	// WiFi.setTxPower(WIFI_POWER_8_5dBm);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
  Serial.println("hi");
  mySerial.begin(9600,SERIAL_8N1,18,17);
  
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");

  }
  digitalWrite(LED_BUILTIN, HIGH);  // turn the LED on (HIGH is the voltage level)

  // purple when esp is connected to the wifi
  rgbLedWrite(RGB_BUILTIN, 0, RGB_BRIGHTNESS,64);  

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: > ");
  Serial.println(WiFi.localIP());

  client.setServer(mqtt_server, 1883);
  if (client.connect("node0","node0",mqtt_pass)) {
      Serial.println("connected");
  }
}

void loop() {  

  if(mySerial.available()){
    String msg=mySerial.readStringUntil('\n');
    Serial.print(msg);
  }

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  if (mySerial.available()){
    mySerial.println("Serial 2 exists");
    int ID = mySerial.parseInt();
    int sensorID = mySerial.parseInt();
    float tempC = mySerial.parseFloat();
    
    Serial.println(ID);
    Serial.println(sensorID);
    Serial.println(tempC);
    // if( ID!=sensorID){
      doc["sensorID"]=sensorID;//i + node
      doc["nodeID"]=ID;
      doc["t"] = tempC;
      serializeJson(doc, output);
      Serial.println(output);

      client.publish("/home/sensors", output);
        rgbLedWrite(RGB_BUILTIN, 0, 0, RGB_BRIGHTNESS);  // Blue = successfull publish
    // }
}

}


void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "node";
    clientId += "1";
    Serial.println(clientId.c_str());
    Serial.println(WiFi.RSSI());
    // Attempt to connect
    if (client.connect(clientId.c_str(),clientId.c_str(),mqtt_pass)) {
      Serial.println("connected");
      rgbLedWrite(RGB_BUILTIN, RGB_BRIGHTNESS, 0, 0);  // Green = connected to mqtt
    } else {
      Serial.println("failed, rc=");
      Serial.print(client.state());
      rgbLedWrite(RGB_BUILTIN, 0,RGB_BRIGHTNESS,  0);  // Red = not connected to mqtt
      delay(1000);
      rgbLedWrite(RGB_BUILTIN, 64,RGB_BRIGHTNESS,  0);  // yellow = not connected to mqtt
      // these two colors exist primarly just to indicate that we re trying to connect to the server
    }
  }
}

// function to print a device address
void printAddress(DeviceAddress deviceAddress) {
  for (uint8_t i = 0; i < 8; i++) {
    if (deviceAddress[i] < 16) Serial.print("0");
      Serial.print(deviceAddress[i], HEX);
  }
}
