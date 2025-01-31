# Birth & Death Registration System (Backend)

## 📌 Project Overview
This is a **Node.js backend** for a **Birth & Death Registration System**. It provides APIs for:
- Registering birth and death records
- Fetching pending and approved records
- Payment processing for certificates
- Managing user authentication
- Storing data in **MongoDB**

The backend is built with **Express.js** and **Mongoose**, and interacts with a frontend client.

---

## 🚀 Features
- **Birth Registration:** Store and manage birth records.
- **Death Registration:** Store and track death records.
- **Payment System:** Process payments for certificates.
- **District Management:** Maintain a list of districts.
- **Validation & Error Handling:** Ensures valid data input.
- **RESTful API:** JSON responses for easy integration.

---

## 🛠️ Tech Stack
| Technology | Purpose |
|------------|---------|
| **Node.js** | Backend runtime |
| **Express.js** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | ODM for MongoDB |
| **bcryptjs** | Password hashing (if used) |
| **jsonwebtoken** | Authentication (if used) |
| **dotenv** | Environment variable management |
| **cors** | Handling cross-origin requests |
| **nodemon** | Auto-restart during development |

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository
```sh
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2️⃣ Install dependencies
```sh
npm install
```

### 3️⃣ Set up environment variables
Create a `.env` file in the root directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key  # Only if using authentication
```

### 4️⃣ Run the backend server
```sh
npm start
```
The server will start on **http://localhost:9000**.

---

## 📡 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/birth` | Register a new birth record |
| **GET** | `/api/birth` | Get all birth records |
| **GET** | `/api/birth/:id` | Get birth record by ID |
| **PUT** | `/api/birth/:id` | Update birth record |
| **DELETE** | `/api/birth/:id` | Delete birth record |
| **POST** | `/api/death` | Register a new death record |
| **GET** | `/api/death` | Get all death records |
| **GET** | `/api/death/:id` | Get death record by ID |
| **PUT** | `/api/death/:id` | Update death record |
| **DELETE** | `/api/death/:id` | Delete death record |
| **GET** | `/api/districts` | Fetch all districts |
| **GET** | `/api/death/total-male` | Get total male deaths |
| **GET** | `/api/death/total-female` | Get total female deaths |

---

## 🗄 Database Schema

### **Birth Model**
```js
const birthSchema = new mongoose.Schema({
    dobId: { type: Number, required: true, unique: true },
    fullName: { type: String, required: true },
    placeOfBirth: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    motherName: { type: String, required: true },
    occupation: { type: String, required: true },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
    paymentStatus: { type: Number, default: 0 }
});
```

### **Death Model**
```js
const deathSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    birth: { type: mongoose.Schema.Types.ObjectId, ref: 'Birth' },
    dateOfDeath: { type: Date, required: true },
    causeOfDeath: { type: String, required: true },
    placeOfDeath: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
    paymentStatus: { type: Number, default: 0 }
});
```

---

## 🔒 Error Handling & Validation
- **400 Bad Request** → Missing or invalid fields.
- **404 Not Found** → Resource does not exist.
- **500 Internal Server Error** → Issues in server logic.

### Example error response:
```json
{
  "message": "Invalid district ID for placeOfDeath"
}
```

---

## 🚀 Deployment
To deploy on Render/Heroku, set up the **MONGO_URI** in environment variables.

Example deployment command:
```sh
git push heroku main
```

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 🤝 Contributing
Want to improve this project? Follow these steps:

1. **Fork** the repository.
2. **Create a feature branch** (`git checkout -b new-feature`).
3. **Commit changes** (`git commit -m "Add new feature"`).
4. **Push to branch** (`git push origin new-feature`).
5. **Open a Pull Request**.

---

## 📩 Contact
If you have any questions, reach out:

- **GitHub:** https://github.com/Group-6-Creative-Team



