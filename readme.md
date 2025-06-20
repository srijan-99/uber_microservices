# Uber_Microservices

## Overview

This project demonstrates a microservices architecture for an Uber-like system, focusing on practice and learning. It includes separate services for user, captain, gateway, and stress testing, with a dedicated folder for testing each service.

---

## Folder Structure

```
Uber_Microservices/
│
├── user/
│   ├── app.js
│   ├── index.service.js
│   ├── stress.service.js
│   ├── gateway.service.js
│   └── ... (controllers, models, etc.)
│
├── captain/
│   └── ... (if implemented)
│
├── ride/
│   └── ... (if implemented)
│
├── test/
│   ├── test.js
│   └── ... (other test files)
│
└── README.md
```

---

## Testing

- The `test` folder is **separate** and contains scripts to test:
  - `index.service.js`
  - `gateway.service.js`
  - `stress.service.js`
- You can use tools like [autocannon](https://github.com/mcollina/autocannon) for load testing each service individually.

---

## Development Flow

1. **Initial Monolith:**  
   - Routes with high computation were first defined in `user/app.js` for initial testing and development.

2. **Microservices Practice:**  
   - For practice, these routes were split into three separate microservices:
     - `index.service.js` (e.g., user or main service)
     - `stress.service.js` (for CPU-bound stress testing)
     - `gateway.service.js` (API gateway/proxy)
   - This is for learning purposes; a full production model would have more granular services (e.g., `user.service.js`, `captain.service.js`, `ride.service.js`, etc.).

---

## Notes

- **This structure is for practice and demonstration.**  
  In a real-world Uber-like system, you would have dedicated services for users, captains, rides, payments, etc., each with their own models, controllers, and endpoints.
- The gateway service acts as a single entry point, forwarding requests to the appropriate microservice.

---

## How to Run

1. Start each service (`index.service.js`, `stress.service.js`, `gateway.service.js`) in separate terminals.
2. Use the scripts in the `test` folder to benchmark or test each service.
3. For production-like structure, consider splitting into `user.service.js`, `captain.service.js`, `ride.service.js`, etc.

---

