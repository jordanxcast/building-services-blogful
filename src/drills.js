require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

function searchItem(searchTerm) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .first()
    .then(res => {
      console.log(res);
      console.log('SEARCH TERM:', {searchTerm});
    });
}

//searchItem('kale');

function paginateShoppingItems(page) {
  const itemsPerPage = 6;
  const offset = itemsPerPage * (page -1);
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(itemsPerPage)
    .offset(offset)
    .then(res => {
      console.log(res);
      console.log('Page number:', {page});
    });
}

//paginateShoppingItems(2);

function itemsAddedDaysAgo(daysAgo){
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('date_added', '>', knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo))
    .then(res => {
      console.log(res);
      console.log('Days Ago:', {daysAgo});
    });
}

//itemsAddedDaysAgo(3);

function totalCostofCategories () {
  knexInstance
    .select('category')
    .from('shopping_list')
    .sum('price AS sum')
    .groupBy('category')
    .then(res => {
      console.log(res);
    });
}

totalCostofCategories();