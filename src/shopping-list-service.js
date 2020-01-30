const ShoppingListService = {
  getAllItems(knex){
    return knex.select('*').from('shopping_list');
    // return db('shopping_list').select('*');
  },
  insertItem(db, data){
    // insert new item into the shopping_list table
    return db('shopping_list')
      .insert(data)
      .returning('*')
      .then(rows => rows[0]);
  },
  getItemById(db, id){
    // gets specific item by id from shopping_list table
    return db.from('shopping_list').select('*').where('id', id).first();
  },
  updateItem(knex, id, newItemData){
    // updates existing item in the shopping_list table
    return knex('shopping_list')
      .where({ id })
      .update(newItemData);
  },
  deleteItem(knex, id){
    //deletes specific item in the shopping_list table
    return knex('shopping_list')
      .where({id})
      .delete();
  }
};

module.exports = ShoppingListService;