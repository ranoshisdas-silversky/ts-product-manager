# TS Product Manager

A simple TypeScript-based Product Management application using `json-server` as a mock backend.

## Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* TypeScript

---

## 1. Create the Database File

Inside the project root, create a folder named `data` if it does not already exist.

Create a file named `db.json` inside the `data` folder.

Example structure:

```json
{
  "products": [],
  "orders": []
}
```

Project structure:

```text
project-root/
├── data/
│   └── db.json
├── src/
│   └── ...(Ts files)
├── dist/
│   └── ...(generated files)
├── index.html
├── style.css
└── tsconfig.json
```

---

## 2. Install json-server

Install `json-server` globally:

```bash
npm install -g json-server
```

Or as a development dependency:

```bash
npm install --save-dev json-server
```

---

## 3. Start the Mock API Server

Run the following command from the project root:

```bash
json-server --watch data/db.json --port 3000
```

or

```bash
json-server -w data/db.json -p 3000
```

The API will be available at:

```text
http://localhost:3000
http://localhost:3000/products
http://localhost:3000/orders
```

---

## 4. Compile TypeScript

Generate JavaScript files from TypeScript:

```bash
npx tsc
```

This will create the `dist` folder containing the compiled JavaScript files.

Example:

```text
dist/
├── product.js
├── order.js
├── dashboard.js
└── ...
```

---

## 5. Run the Application

Open the project in VS Code.

Navigate to `index.html`.

Start **Live Server** and open the application in your browser.

The application will communicate with the mock API running on:

```text
http://localhost:3000
```

---

## Development Workflow

1. Start the JSON Server

```bash
json-server --watch data/db.json --port 3000
```
or
```bash
json-server -w data/db.json -p 3000
```
2. Compile TypeScript

```bash
npx tsc
```

3. Open `index.html` using Live Server.

4. Test the application in the browser.

---

## Notes

* Ensure JSON Server is running before using the application.
* Re-run `npx tsc` whenever TypeScript files are modified.
* If you want automatic compilation during development, run:

```bash
npx tsc --watch
```
