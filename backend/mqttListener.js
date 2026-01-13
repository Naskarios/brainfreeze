import mqtt from "mqtt";

function apiCall(sensorID, nodeID, temperature) {
  console.log("CALLING...");
  fetch("http://localhost:3000/api/new-reading", {
    method: "POST",
    body: JSON.stringify({
      sensorID: sensorID,
      nodeID: nodeID,
      temperature: temperature,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function mqttListener() {
  // MQTT Broker Connection
  // const mqttClient = mqtt.connect('mqtt://localhost'); // Adjust if MQTT is running on a different IP
  // 192.168.1.115
  const mqttClient = mqtt.connect("mqtt://localhost:1883", {
    username: "mqtt_username",
    password: "mqtt_password",
  });
  const topic = "/home/sensors";

  // Subscribe to MQTT Topic
  mqttClient.on("connect", () => {
    mqttClient.subscribe(topic, (err) => {
      if (err) throw err;
      console.log(`Subscribed to topic: ${topic}`);
    });
  });

  // Handle Incoming Messages
  mqttClient.on("message", (topic, message) => {
    // Parse message and extract data
    console.log(`Message received on topic ${topic}: ${message}`);
//    const [sensorID] = message.toString().split(",");
  //  const [nodeID] = message.toString().split(",");
    //const [temperature] = message.toString().split(",");
const doc=	 JSON.parse(message)
    // Log the extracted values
    console.log("sensorID:", doc.sensorID);
    console.log("nodeID:", doc.nodeID);
    console.log("temperature:", doc.t);
    apiCall(doc.sensorID, doc.nodeID, doc.t);
  });
}
mqttListener();
