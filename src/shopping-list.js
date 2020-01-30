/* eslint-disable no-console */
require('dotenv').config();
const ShoppingListService = require('./shopping-list-service');

const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

ShoppingListService.getAllItems(knexInstance)
  .then(items => console.log(items))
  .then(() => 
    ShoppingListService.insertItem(knexInstance, {
      name: 'New Shopping Item',
      price: 1.00,
      category: 'Snack',
      checked: false,
      date_added: new Date()
    })
  )
  .then(newItem => {
    console.log(newItem);
    return ShoppingListService.updateItem(
      knexInstance,
      newItem.id,
      {name: 'Updated name'}
    ) .then(() => ShoppingListService.getItemById(knexInstance, newItem.id));
  })
  .then(item => {
    console.log(item);
    return ShoppingListService.deleteItem(knexInstance, item.id);
  });
