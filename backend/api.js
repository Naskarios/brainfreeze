import express from "express";
import { request } from "http";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
app.use(express.json()); //populates the body so that you can use it
const PORT = 3000;
app.use(cors());

// SQLite Database Connection
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

const createTableSql = `
  CREATE TABLE IF NOT EXISTS temperature (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sensorID TEXT NOT NULL,
    nodeID TEXT NOT NULL,
    temperature REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;
db.run(createTableSql, (err) => {
  if (err) {
    console.error("Error creating table:", err);
  } else {
    console.log("Table created successfully");
  }
});

// view all rows
app.get("/api/view-all", (requset, response) => {
  db.all("SELECT * FROM temperature", (err, rows) => {
    if (err) {
      console.error("Error fetching data:", err);
      response.status(500).send("Error");
    } else {
      console.log("All temperature data requested");
      //   console.table(rows);
      response.status(200).send(rows);
    }
  });
});

// view a single row
//view an ARRAY OF CHOICES
app.get("/api/view-single/:sensorID", (request, response) => {
  const selectedSensorID = request.params.sensorID;
  console.log("selected sensor ------", selectedSensorID);
  console.log("selected sensor ------", typeof selectedSensorID);
  db.get(
    "SELECT * FROM temperature where sensorID=? ",
    [selectedSensorID],
    (err, row) => {
      if (err) {
        console.error("Error fetching data:", err);
        response.status(500).send("Error");
      } else {
        console.log("Row for sensor requested");
        console.log(row);
        response.status(200).send(row);
      }
    }
  );
});

app.get("/api/view-array", (request, response) => {
  const sensorIds = request.query.sensorIDs.split(",").map(Number);
  const results = [];
  let completed = 0;

  sensorIds.forEach((sensorId) => {
    db.get(
      "SELECT * FROM temperature WHERE sensorID = ? LIMIT 1",
      [sensorId],
      (err, row) => {
        if (err) {
          response.status(500).json({ error: err.message });
          return;
        }
        results.push(row);
        completed++;
        // When all queries finish, send the results
        if (completed === sensorIds.length) {
          response.json(results);
        }
      }
    );
  });
});

// insert a new row
app.post("/api/new-reading", (request, response) => {
  const { sensorID, nodeID, temperature } = request.body;

  // Insert temperature data into the database
  console.log("Headers:", request.headers);
  console.log("Body:", request.body);
  const insertSql = `
  INSERT INTO temperature (sensorID, nodeID, temperature)
  VALUES ( ?, ?, ?)`; // the  ? are placeholders

  db.run(insertSql, [sensorID, nodeID, temperature], function (err) {
    if (err) {
      console.error("Error inserting temperature:", err);
      response.status(500).send("Error");
    } else {
      console.log("sensorID:", sensorID);
      console.log("sensorID:", sensorID);
      console.log("temperature:", temperature);
      console.log("Temperature inserted successfully. Row ID:", this.lastID);
      response.status(201).send("Inserted new row\n");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
