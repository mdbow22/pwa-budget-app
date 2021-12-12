# pwa-budget-app
A PWA that allows for tracking of transactions even offline

## Description

A small budget tracking app that allows for offline capabilities. When user is not online, transactions are saved using Dexie.js and IndexedDB. Once user goes back online, all transaction saved in the browser are pushed to the MongoDB database.

## Installation

After forking the repo and saving a local copy, in your terminal, run:

    npm install

You will also need to create a .env file with your MongoDB URI.

## Usage

This app can be used for tracking transactions (say while on vacation, or just day-to-day). Simply type in the name of the transaction and the amount. If it's adding money (income) click "Add Funds" or if subtracting money (expenses) click "Subtract Funds."

![screenshot of app with example transactions](/assets/screenshot.PNG)

The transaction history and chart will automatically update with the latest transaction.

If you go offline, the app will still track all your transactions within IndexedDB. When you go back online, the stored transactions will be sent to the server and MongoDB.

## Questions

For any questions, issues, or suggestions for improvement, please submit an issue in the repository on GitHub.

## Demo

A live demo of the app can be found at: https://frozen-shore-92878.herokuapp.com/
