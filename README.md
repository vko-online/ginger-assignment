# Ginger Payments Frontend Assignment

This assignment is to implement client-side API requests to the JSON-server (which contains payment data), create a client-side filter and render the
 content in the browser. You have the freedom to choose any additional framework/stylings and try to make it look decent. 
 
 ## Overview
 
 - Language: JavaScript, HTML, CSS
 - Estimated effort: 2-4 hours
 - Dependencies: [JSON-server](https://www.npmjs.com/package/json-server)

 ## Setup
 
 To install and start the JSON-server type the following command in your terminal:
 
 ```
 npm install && npm run start:api
 ``` 
 
 ## Tasks
 
 Implement the following tasks:
 
 ### Callback button
 
 When this button is clicked use a callback to get the 20 payments with the highest amount (notice that the amounts are in cents) and render
  the data in a table, where each payment is stored in a row. 
 
 ### Promise button
 
 When this button is clicked use a promise to do a GET request for the payments from the merchant "Ginger".
 
 ### Filter Payment-Method
 
 Create a client-side filter for the payment-method iDeal (method: "ideal") or if you feel ambitious
 (and have enough time left) create a dropdown with all the payment-methods ("creditcard", "bank-transfer", "ideal"). 
 
 ### Add Payments
 
 Create an input form which performs a POST request to the JSON-server

 ### Bonus: Add E2E test
 
 ## What to deliver 
 
 Provide a link to your Github/Bitbucket/Gitlab repository where we only need to:
  1. npm install 
  2. run the JSON-server 
  3. open the index.html file or run a static server to see your code working
