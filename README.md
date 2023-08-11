# Financial Tracker API

## Overview

The Financial Tracker API is designed to help users track their financial transactions. With the capability to record, update, retrieve, and delete transactions, this API makes managing personal finance data simple and straightforward.

## Live URL

[Live API](https://shy-pear-dog-sock.cyclic.app/products)

[Live Website](https://shy-pear-dog-sock.cyclic.app)

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [Transactions](#transactions)
- [Authentication](#authentication)
- [Contribute](#contribute)
- [License](#license)

## Features:

1. Add new transactions with type, name, and amount.
2. Edit existing transactions.
3. Delete transactions.
4. Search transactions by name.
5. Filter transactions by type.
6. View aggregate data for total cash in, cash out, and balance.
7. Secure with basic authentication.

## Tech Stack:

- **Frontend**: Vanilla JS and Bootstrap 5.
- **Backend**: ExpressJS with in-memory data storage.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/m-istighfar/week-8-m-istighfar.git
```

2. Navigate to the project directory:

```bash
cd week-8-m-istighfar
```

3. Install the necessary dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm start
```

Your server should start on `http://localhost:3000/`. Open this URL in your browser to access the app

## API Endpoints

### Transactions

#### Get all transactions:

- **Endpoint**: `/products`
- **Method**: `GET`
- **Response**: A list of all transactions.

#### Get a specific transaction by ID:

- **Endpoint**: `/productss/:id`
- **Method**: `GET`
- **Parameters**: `id` - ID of the transaction.

#### Add a new transaction:

- **Endpoint**: `/products`
- **Method**: `POST`
- **Body**:
  - `type`: Either "Kas Masuk" or "Kas Keluar".
  - `name`: Name/description of the transaction.
  - `amount`: Amount of money for the transaction.

#### Update a transaction:

- **Endpoint**: `/products/:id`
- **Method**: `PUT`
- **Parameters**: `id` - ID of the transaction.

#### Partially update a transaction:

- **Endpoint**: `/products/:id`
- **Method**: `PATCH`
- **Parameters**: `id` - ID of the transaction.
- **Body** (example): You can include one or more of the following fields to update:
  - `type`: Either "Kas Masuk" or "Kas Keluar".
  - `name`: Name/description of the transaction.
  - `amount`: Amount of money for the transaction.
- **Description**: This endpoint allows you to update specific fields of a transaction without affecting other fields. If a field is omitted from the body, it will remain unchanged in the database.

#### Delete a transaction:

- **Endpoint**: `/products/:id`
- **Method**: `DELETE`
- **Parameters**: `id` - ID of the transaction.

#### Delete all transactions:

- **Endpoint**: `/products`
- **Method**: `DELETE`
- **Description**: This endpoint deletes all transactions from the database. Use with caution as this operation is irreversible.

To use each request command, please use JSON format. Example:

```bash
{
  "name": "x",
  "amount": "y",
  "type": "Kas Masuk" or "Kas Keluar"
}
```

## Authentication

To access the API, basic authentication is required:

- **Username**: `revou`
- **Password**: `tim6`

## Contribute

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

## License

This project is licensed under the MIT License.
