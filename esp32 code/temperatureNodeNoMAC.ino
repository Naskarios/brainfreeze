#include <esp_now.h>
#include <WiFi.h>
#include <Wire.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS 14
int ID=0;
int sensorNum=16;
float tempC= 6969;
int TIME_TO_SLEEP= 3600;// in secs
unsigned long long uS_TO_S_FACTOR=1000000;
uint8_t broadcastAddress[] = {xxx};

DeviceAddress tempDeviceAddress; // We'll use this variable to store a found device address
// Setup a oneWire instance to communicate with any OneWire devices
// Pass our oneWire reference to Dallas Temperature sensor 
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
int numberOfDevices; // Number of temperature devices found

// Structure example to send data
typedef struct espData {
  int nodeID;
  int sensorID;
  float tempC;
} espData;

// Create a struct_message called myData
espData myData;
esp_now_peer_info_t peerInfo;

// callback when data is sent
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  Serial.print("\r\nLast Packet Send Status:\t");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Success" : "Delivery Fail");
}
 
void setup() {
  Serial.begin(115200);
  
  // while(!Serial);
  Serial.print("hii ");

  // Start up the DS18b20
  sensors.begin();

  // Grab a count of devices on the wire
  numberOfDevices = sensors.getDeviceCount();
  
  // locate devices on the bus
  Serial.print("Locating devices...");
  Serial.print("Found ");
  Serial.print(numberOfDevices, DEC);
  Serial.println(" devices.");

  // Loop through each device, print out address
  for(int i=0;i<numberOfDevices; i++) {
    // Search the wire for address
    if(sensors.getAddress(tempDeviceAddress, i)) {
      Serial.print("Found device ");
      Serial.print(i, DEC);
      Serial.print(" with address: ");
      printAddress(tempDeviceAddress);
		} else {
		  Serial.print("Found ghost device at ");
		  Serial.print(i, DEC);
		  Serial.print(" but could not detect address. Check power and cabling");
		}
  }
  sensors.requestTemperatures(); // Send the command to get temperatures
  
  // Loop through each device, print out temperature data
  for(int i=0;i<numberOfDevices; i++) {
    // Search the wire for address
    if(sensors.getAddress(tempDeviceAddress, i)){
		
      // Output the device ID
      Serial.print("Temperature for device: ");
      Serial.println(i,DEC);

      // Print the data
      tempC = sensors.getTempC(tempDeviceAddress);
      Serial.print("For Device: ");
      Serial.print(i);
      Serial.print(" Temp C : ");
      Serial.println(tempC);

      // In my case the refridgerators I was collecting data from
      // were already enumerated beforehand 
      // So depending on the node I would change the sensorNum to fit 
      // the corresponding fridge (A cumbersome task may I add)
          if( i == 0){
      sensorNum =1;  
        }
              if( i == 1){
      sensorNum = 3; 
        }
              if( i == 2){
      sensorNum=2; 
        }
              // if( i == 3){
      // sensorNum=13; 
      //   }

      // ESP-NOW PREPARATIONS

      // initianlizing  struct
      myData.nodeID = ID;
      myData.sensorID = sensorNum; 
      myData.tempC = tempC; 
      Serial.println("node,sensor,tempC");
      Serial.println(myData.nodeID);
      Serial.println(myData.sensorID);
      Serial.println(myData.tempC);

      // Set device as a Wi-Fi Station
      WiFi.mode(WIFI_STA);
      WiFi.setTxPower(WIFI_POWER_8_5dBm);
      

        // Init ESP-NOW
      if (esp_now_init() != ESP_OK) {
        Serial.println("Error initializing ESP-NOW");
        return;
      }

      // Register peer
      memcpy(peerInfo.peer_addr, broadcastAddress, 6);
      peerInfo.channel = 0;  
      peerInfo.encrypt = false;
      
      // Add peer        
      if (esp_now_add_peer(&peerInfo) != ESP_OK){
        Serial.println("Failed to add peer");
        // return;
      }
      // Once ESPNow is successfully Init, we will register for Send CB to
      // get the status of Trasnmitted packet
      esp_now_register_send_cb(OnDataSent);
      
      // Send message via ESP-NOW
      esp_err_t result = esp_now_send(broadcastAddress, (uint8_t *) &myData, sizeof(myData));
      
      if (result == ESP_OK) {
        Serial.println("Sent with success");
      }
      else {
        Serial.println("Error sending the data");
      }
      delay(2000);
    }
  }

  ////////////////////////////////////////
//////////////  QUICK DEBUG CODE     ////////////////////////////
  ///////////////////////////////////////////


  //  myData.nodeID = ID;
  //       myData.sensorID = sensorNum; 
  //       myData.tempC = 0; 
  //       Serial.println();
  //       Serial.println(myData.nodeID);
  //       Serial.println(myData.sensorID);
  //       Serial.println(myData.tempC);


  //   // Set device as a Wi-Fi Station
  //   WiFi.mode(WIFI_STA);


  //   // Set values to send
  //     // Init ESP-NOW
  //   if (esp_now_init() != ESP_OK) {
  //     Serial.println("Error initializing ESP-NOW");
  //     return;
  //   }

  //   // Register peer
  //   memcpy(peerInfo.peer_addr, broadcastAddress, 6);
  //   peerInfo.channel = 0;  
  //   peerInfo.encrypt = false;
    
  //   // Add peer        
  //   if (esp_now_add_peer(&peerInfo) != ESP_OK){
  //     Serial.println("Failed to add peer");
  //     return;
  //   }
  //   // Once ESPNow is successfully Init, we will register for Send CB to
  //   // get the status of Trasnmitted packet
  //   esp_now_register_send_cb(OnDataSent);    
  //   // Send message via ESP-NOW
  //   esp_err_t result = esp_now_send(broadcastAddress, (uint8_t *) &myData, sizeof(myData));
  //   if (result == ESP_OK) {
  //     Serial.println("Sent with success");
  //   }
  //   else {
  //     Serial.println("Error sending the data");
  //   }
  //   delay(2000);

 /////////////////////////////////////////////////////////////////

 
  Serial.print("SLEEEP TIME");
  esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP * uS_TO_S_FACTOR);
  Serial.flush();
  WiFi.mode(WIFI_OFF);
  esp_deep_sleep_start();
}

void loop(){
}

// function to print a device address 
void printAddress(DeviceAddress deviceAddress) {
  for (uint8_t i = 0; i < 8; i++) {
    if (deviceAddress[i] < 16) Serial.print("0");
      Serial.print(deviceAddress[i], HEX);
  }
}

