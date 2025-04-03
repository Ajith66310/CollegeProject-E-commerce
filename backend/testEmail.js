import sendInvoiceEmail from "./utils/emailService.js";

sendInvoiceEmail("ajith66310@gmail.com", "Ajith", {
  _id: "123456",
  items: [
    { name: "Product A", price: 50, quantity: 1 },
    { name: "Product B", price: 30, quantity: 2 },
  ],
  total: 110,
});
