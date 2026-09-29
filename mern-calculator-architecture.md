# MERN Calculator — Architecture & Coding Agent Specification

## 1. Project Goal

Build a simple calculator application using the MERN stack:

- **MongoDB** — optional persistence for calculation history
- **Express.js** — backend API
- **React** — frontend UI
- **Node.js** — backend runtime

The first version should allow a student to:

- Add
- Subtract
- Multiply
- Divide
- Calculate exponents
- Calculate percentages
- Combine multiple operations in one expression
- Use parentheses
- Clear the current expression
- Delete the last entered character
- See the calculation result
- See useful errors for invalid expressions

Example expressions:

```text
5 + 3
10 - 4
6 * 7
20 / 5
2 ^ 3
20%
5 + 3 * 2
(5 + 3) * 2
```

The project should be designed for a beginner programmer: simple naming, small modules, clear separation of responsibilities, and minimal unnecessary abstractions.

---

# 2. Recommended Architecture

Use a simple client/server architecture.

```text
                    Browser
                       |
                       v
              +----------------+
              | React Frontend |
              +----------------+
                       |
                  HTTP / JSON
                       |
                       v
              +----------------+
              | Express / Node |
              |    REST API    |
              +----------------+
                       |
              +--------+--------+
              |                 |
              v                 v
      Calculation Service     MongoDB
      / Expression Logic     (history)
```

## Responsibilities

### React frontend

Responsible for:

- Calculator display
- Number/operator buttons
- User input
- Calling backend APIs
- Showing results
- Showing errors
- Optional calculation history UI

The frontend should **not contain duplicated calculation logic** if the backend is responsible for evaluating expressions.

### Express/Node backend

Responsible for:

- REST API
- Input validation
- Expression evaluation
- Error handling
- Saving calculation history
- Returning calculation results

### MongoDB

Use MongoDB only for persistent calculation history.

Example history record:

```json
{
  "expression": "5 + 3 * 2",
  "result": 11,
  "createdAt": "2026-09-29T00:00:00.000Z"
}
```

For the first milestone, MongoDB history can be implemented after the basic calculator works.

---

# 3. Monorepo Structure

Use one repository with separate frontend and backend applications.

```text
mern-calculator/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Calculator.jsx
│   │   │   ├── Display.jsx
│   │   │   ├── Keypad.jsx
│   │   │   ├── Button.jsx
│   │   │   └── History.jsx
│   │   │
│   │   ├── services/
│   │   │   └── calculatorApi.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── .env.example
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── calculatorController.js
│   │   │
│   │   ├── routes/
│   │   │   └── calculatorRoutes.js
│   │   │
│   │   ├── services/
│   │   │   ├── calculatorService.js
│   │   │   └── expressionParser.js
│   │   │
│   │   ├── models/
│   │   │   └── Calculation.js
│   │   │
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   │
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env.example
│
├── README.md
├── .gitignore
└── package.json
```

---

# 4. Frontend Architecture

## Components

### `Calculator.jsx`

Main calculator component.

Responsibilities:

- Maintain current expression
- Handle calculator actions
- Coordinate display and keypad
- Request calculation from API

### `Display.jsx`

Displays:

- Current expression
- Current result
- Error message if applicable

Example:

```text
┌──────────────────────────┐
│ 5 + 3 * 2                │
│                      11  │
└──────────────────────────┘
```

### `Keypad.jsx`

Contains calculator buttons.

Suggested button groups:

```text
7  8  9  /
4  5  6  *
1  2  3  -
0  .  =  +
```

Additional:

```text
C   DEL   ^   %
(   )
```

### `Button.jsx`

Reusable button component.

It should receive simple props such as:

```js
<Button value="7" onClick={handleInput} />
```

### `History.jsx`

Displays previous calculations.

Example:

```text
5 + 3 * 2 = 11
10 / 2 = 5
2 ^ 4 = 16
```

History is optional for the first milestone.

---

# 5. Backend Architecture

## Route

Use:

```text
POST /api/calculator/calculate
```

Request:

```json
{
  "expression": "5 + 3 * 2"
}
```

Response:

```json
{
  "expression": "5 + 3 * 2",
  "result": 11
}
```

For an invalid expression:

```json
{
  "error": "Invalid expression"
}
```

Use appropriate HTTP status codes.

Suggested statuses:

- `200` — successful calculation
- `400` — invalid input/expression
- `500` — unexpected server error

---

# 6. Service Layer

Keep calculation logic out of the Express route.

Recommended flow:

```text
Route
  ↓
Controller
  ↓
Calculator Service
  ↓
Expression Parser
  ↓
Result
```

## `calculatorController.js`

Responsible for:

- Reading request body
- Calling calculator service
- Sending response
- Passing errors to error middleware

## `calculatorService.js`

Responsible for:

- Validating the expression
- Calling the parser
- Returning the result
- Optionally saving history

## `expressionParser.js`

Responsible for:

- Tokenizing the expression
- Handling numbers
- Handling operators
- Handling parentheses
- Applying operator precedence
- Returning a numeric result

Do not use JavaScript `eval()` for expression evaluation.

The parser should explicitly handle supported operators.

---

# 7. Supported Operators

Initial version:

| Operator | Meaning |
|---|---|
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `^` | Exponent |
| `%` | Percentage |

For version 1, define `%` as percentage conversion:

```text
20% = 0.2
```

More advanced calculator-specific percentage behavior can be added later.

---

# 8. Operator Precedence

The parser should follow:

```text
1. Parentheses
2. Exponentiation
3. Multiplication / Division
4. Addition / Subtraction
```

Example:

```text
5 + 3 * 2
```

Result:

```text
11
```

Not:

```text
16
```

Parentheses should override normal precedence:

```text
(5 + 3) * 2
```

Result:

```text
16
```

---

# 9. Data Structure

## Frontend state

Keep state minimal.

Example:

```js
{
  expression: "5 + 3 * 2",
  result: "11",
  error: null,
  isCalculating: false
}
```

The actual implementation can use separate React state variables if that is easier for a beginner.

## Backend calculation document

Mongoose model:

```js
{
  expression: String,
  result: Number,
  createdAt: Date
}
```

MongoDB history is not required for the first working calculator milestone.

---

# 10. API Design

## Calculate

```text
POST /api/calculator/calculate
```

Request:

```json
{
  "expression": "2 ^ 3 + 4"
}
```

Response:

```json
{
  "expression": "2 ^ 3 + 4",
  "result": 12
}
```

## Get History

Optional second endpoint:

```text
GET /api/calculator/history
```

Response:

```json
[
  {
    "_id": "...",
    "expression": "2 ^ 3 + 4",
    "result": 12,
    "createdAt": "2026-09-29T00:00:00.000Z"
  }
]
```

---

# 11. Edge Cases

The backend must safely handle:

### Empty expression

```text
""
```

Return a validation error.

### Division by zero

```text
10 / 0
```

Return:

```text
Cannot divide by zero
```

### Invalid operators

```text
5 + * 3
```

Return an invalid-expression error.

### Invalid decimals

```text
3.1.4
```

Reject the expression.

### Missing parentheses

```text
(5 + 3
```

Reject the expression.

### Extra parentheses

```text
5 + 3)
```

Reject the expression.

### Consecutive operators

```text
5 ** 3
```

Reject unless `**` is explicitly supported.

### Negative numbers

Support:

```text
-5 + 3
5 * -2
```

The parser should distinguish unary minus from subtraction.

### Very large values

Avoid crashing the application if a user enters an extremely large expression.

### Malicious input

Never pass raw user input to:

```js
eval()
```

or similar arbitrary-code execution mechanisms.

The parser must only support the explicitly allowed calculator syntax.

---

# 12. Error Handling

Use centralized Express error handling.

Expected error format:

```json
{
  "error": "Invalid expression"
}
```

The frontend should display friendly messages rather than raw server errors.

Example:

```text
Invalid expression
```

instead of:

```text
TypeError: Cannot read properties of undefined...
```

---

# 13. Environment Variables

Backend `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern_calculator
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Never commit real `.env` files or secrets.

Commit:

```text
.env.example
```

instead.

---

# 14. Development Order

Implement the application incrementally.

## Milestone 1 — Project setup

- Create React frontend
- Create Express backend
- Configure development scripts
- Add basic health endpoint

## Milestone 2 — Calculator UI

Build:

- Display
- Number buttons
- Operators
- Clear
- Delete
- Equals

At this stage, the UI can be functional without MongoDB.

## Milestone 3 — Calculation API

Implement:

```text
POST /api/calculator/calculate
```

Support:

- `+`
- `-`
- `*`
- `/`

## Milestone 4 — Expression parser

Add:

- Multiple operations
- Operator precedence
- Parentheses
- Exponents
- Percentages

## Milestone 5 — Error handling

Test invalid expressions and edge cases.

## Milestone 6 — MongoDB history

Add:

- Calculation model
- Save successful calculations
- Get history endpoint
- History UI

## Milestone 7 — Testing and cleanup

Add tests for:

- Parser
- Calculator service
- API
- Important React behavior

---

# 15. Coding Principles

Because this is a beginner project:

1. Prefer readable code over clever code.
2. Keep functions small.
3. Use descriptive variable names.
4. Avoid unnecessary design patterns.
5. Avoid unnecessary dependencies.
6. Keep frontend and backend responsibilities separate.
7. Do not use `eval()` for calculations.
8. Validate user input on the backend.
9. Add comments where the reasoning is not obvious.
10. Explain important architectural decisions in the README.

---

# 16. Initial Prompt for the Coding Agent

Use the following prompt as the initial instruction to your coding agent:

> You are helping me build a beginner-friendly calculator application using the MERN stack.
>
> ## Goal
>
> Build a simple calculator with:
>
> - Addition
> - Subtraction
> - Multiplication
> - Division
> - Exponentiation
> - Percentage
> - Multiple operations in one expression
> - Parentheses
> - Clear
> - Delete/backspace
> - Error handling
>
> Examples that should eventually work:
>
> ```text
> 5 + 3
> 10 - 4
> 6 * 7
> 20 / 5
> 2 ^ 3
> 20%
> 5 + 3 * 2
> (5 + 3) * 2
> ```
>
> ## Technology
>
> Use:
>
> - React
> - Node.js
> - Express.js
> - MongoDB
> - Mongoose
>
> Use Vite for the React frontend.
>
> ## Architecture
>
> Create a monorepo with:
>
> ```text
> client/
> server/
> ```
>
> Frontend responsibilities:
>
> - Calculator UI
> - User interaction
> - Expression display
> - Calling the backend API
> - Displaying results/errors
>
> Backend responsibilities:
>
> - REST API
> - Input validation
> - Expression parsing/evaluation
> - Error handling
> - Calculation history
>
> Use this backend flow:
>
> ```text
> Route
>   ↓
> Controller
>   ↓
> Service
>   ↓
> Expression Parser
>   ↓
> Result
> ```
>
> Do not put calculation logic directly inside Express routes.
>
> ## Important security requirement
>
> Do NOT use JavaScript `eval()`, `Function()`, or any mechanism that executes arbitrary user input as JavaScript.
>
> Build a small explicit expression parser that only supports the calculator syntax we define.
>
> ## Parser requirements
>
> Operator precedence should be:
>
> 1. Parentheses
> 2. Exponentiation
> 3. Multiplication and division
> 4. Addition and subtraction
>
> Support decimal numbers and negative numbers.
>
> For version 1, `%` means percentage conversion:
>
> ```text
> 20% = 0.2
> ```
>
> Handle division by zero and invalid expressions gracefully.
>
> ## API
>
> Create:
>
> ```text
> POST /api/calculator/calculate
> ```
>
> Request:
>
> ```json
> {
>   "expression": "5 + 3 * 2"
> }
> ```
>
> Response:
>
> ```json
> {
>   "expression": "5 + 3 * 2",
>   "result": 11
> }
> ```
>
> Invalid input should return an appropriate 4xx response with a simple JSON error:
>
> ```json
> {
>   "error": "Invalid expression"
> }
> ```
>
> Also create:
>
> ```text
> GET /api/calculator/history
> ```
>
> for calculation history.
>
> ## MongoDB
>
> Store successful calculations with:
>
> ```js
> {
>   expression: String,
>   result: Number,
>   createdAt: Date
> }
> ```
>
> MongoDB history can be implemented after the core calculator works.
>
> ## Frontend structure
>
> Prefer components such as:
>
> ```text
> Calculator
> Display
> Keypad
> Button
> History
> ```
>
> Keep React state simple and understandable.
>
> ## Development approach
>
> Work incrementally.
>
> First:
>
> 1. Inspect the repository.
> 2. Create the client and server structure.
> 3. Set up React/Vite.
> 4. Set up Express.
> 5. Add a backend health endpoint.
> 6. Make sure both applications can run locally.
>
> Do NOT implement the entire application in one huge change.
>
> After each meaningful milestone:
>
> - Explain what was changed.
> - Explain how to run it.
> - Identify files that were created/changed.
> - Mention any assumptions.
> - Run relevant tests or checks.
>
> Since I am a beginner, prioritize readable code and explain non-obvious parts.
>
> ## UI
>
> Create a clean, simple calculator interface that works well on desktop and mobile.
>
> Do not spend excessive time on visual design before the core functionality works.
>
> ## Testing
>
> Add tests for the expression parser and calculator service.
>
> At minimum test:
>
> ```text
> 5 + 3 = 8
> 10 - 4 = 6
> 6 * 7 = 42
> 20 / 5 = 4
> 2 ^ 3 = 8
> 20% = 0.2
> 5 + 3 * 2 = 11
> (5 + 3) * 2 = 16
> 10 / 0 = error
> invalid expressions = error
> ```
>
> Start with Milestone 1 only. Do not jump ahead until the basic project structure and local development setup are working.

---

# 17. Definition of Done for the First Milestone

The first milestone is complete when:

- `client` runs successfully
- `server` runs successfully
- React can load in the browser
- Express has a health endpoint
- Frontend can communicate with backend
- Environment examples exist
- `.gitignore` is configured
- README contains setup instructions
- No calculator evaluation logic uses `eval()`
- The project has a clean starting structure

Do not add authentication, user accounts, Redux, WebSockets, Docker, microservices, or other advanced infrastructure unless there is a specific requirement for them.
