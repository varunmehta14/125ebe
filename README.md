# 🚀 Journey Builder - React Coding Challenge

This project implements a node-based UI to visualize and configure prefill mappings between forms using a **Directed Acyclic Graph (DAG)**. The app allows users to define **prefill relationships** between form fields dynamically.

---

## 📁 Project Structure
```bash
src/
├── components/
│ ├── Graph.tsx # DAG visualization using React Flow
│ ├── FormNode.tsx # Custom form node component
│ ├── PrefillPanel.tsx # Prefill mapping management panel
│ ├── PrefillModal.tsx # Source selection modal
├── types/
│ └── index.ts # TypeScript type definitions
├── App.tsx # Main application component
└── index.tsx # Root component
```
---

## 🏃 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/varunmehta14/125ebe.git
cd journey-builder
```
### 2️⃣ Install Dependencies
```bash
npm install
# or
yarn install
```

### 3️⃣ Run the Mock Server
Clone the mock server for API data:
```bash
git clone https://github.com/mosaic-avantos/frontendchallengeserver
cd frontendchallengeserver
npm install
npm start
```

## Ensure the API is accessible at:

```bash
http://localhost:3000/api/v1/namespace/actions/blueprints/blueprintId/graph
```

### 4️⃣ Start the React App
```bash
npm start
# or
yarn start
```
The app will run at:
http://localhost:3001

### 🎥 Implementation Video
Click here to watch the demo 
https://drive.google.com/file/d/1y3r55aT1bGefh69EFBU8rabj3Dn_fKbO/view?usp=sharing

<img width="1512" alt="image" src="https://github.com/user-attachments/assets/42d66308-b889-40f2-b1e9-db33b71dfc77" />
<img width="1512" alt="image" src="https://github.com/user-attachments/assets/3849ba28-5152-4eae-b70b-3b4f7d427b16" />
