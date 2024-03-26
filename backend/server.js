const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'qrproject'
})

app.get("/", (request, response) => {
    response.send("From Backend side");
})

app.post("/login", (request, response) => {
    const sqlQuery = "SELECT * FROM login WHERE username = ? AND password = ?";
    const values = [
        request.body.username,
        request.body.password
    ]
    db.query(sqlQuery, values, (err, data) => {
        if(err) return response.send({"msg": "Login Failed 😩"});
        if(data.length > 0) {
            const payload = {
                username: request.body.username
            };
            const jwtToken = jwt.sign(payload, "I love node.js");
            return response.send({"msg": "Login Success 😀", "jwt": jwtToken});
        }
        else {
            return response.send({"msg": "Invalid Credentials 🧐"});
        }
    })
})

app.get("/api/get" , (request, response) => {
    const sqlQuery = "SELECT * FROM asset";
    db.query(sqlQuery, (err, data) => {
        if(err) return response.send(err);
        return response.send(data);
    })
})

app.post("/api/post", (request, response) => {
    const {block_num, room_num, item_type, sub_type, date_of_purchase, brand, ame_date, warranty_exp_date, vendor_details, customer_care_num, issued_to} = request.body;
    const sqlQuery = "INSERT INTO asset (block_num, room_num, item_type, sub_type, date_of_purchase, brand, ame_date, warranty_exp_date, vendor_details, customer_care_num, issued_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sqlQuery, [block_num, room_num, item_type, sub_type, date_of_purchase, brand, ame_date, warranty_exp_date, vendor_details, customer_care_num, issued_to], (err, data) => {
        if(err) return response.send(err);
        return response.send(data);
    })
})

app.delete("/api/remove/:id", (request, response) => {
    const {id} = request.params;
    const sqlQuery = "DELETE FROM asset WHERE sl_no = ?";
    db.query(sqlQuery, id, (err, data) => {
        if(err) return response.send(err);
        return response.send(data);
    })
})

app.get("/api/get/:id" , (request, response) => {
    const {id} = request.params;
    const sqlQuery = "SELECT * FROM asset WHERE sl_no = ?";
    db.query(sqlQuery, id,(err, data) => {
        if(err) return response.send(err);
        return response.send(data);
    })
})

app.put("/api/update/:id" , (request, response) => {
    const {id} = request.params;
    const {block_num, room_num, item_type, sub_type, date_of_purchase, brand, ame_date, warranty_exp_date, vendor_details, customer_care_num, issued_to} = request.body;
    const sqlQuery = "UPDATE asset SET block_num = ?, room_num = ?, item_type = ?, sub_type = ?, date_of_purchase = ?, brand = ?, ame_date = ?, warranty_exp_date = ?, vendor_details = ?, customer_care_num = ?, issued_to = ? WHERE sl_no = ?";
    db.query(sqlQuery, [block_num, room_num, item_type, sub_type, date_of_purchase, brand, ame_date, warranty_exp_date, vendor_details, customer_care_num, issued_to, id],(err, data) => {
        if(err) return response.send(err);
        return response.send(data);
    })
})

app.listen(8081, () => {
    console.log("Server Running at http://localhost:8081/");
});

