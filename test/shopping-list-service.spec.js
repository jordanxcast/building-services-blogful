/* eslint-disable quotes */
/* eslint-disable semi */
const ShoppingListService = require('../src/shopping-list-service')
const pg = require('pg');
const PG_DECIMAL_OID = 1700; pg.types.setTypeParser(PG_DECIMAL_OID, parseFloat);
const knex = require('knex')


describe(`Shopping List Service Object`, () => {
  let db;
  let testItems = [
    {
      id: 1,
      name: 'bananas',
      price: 5.00,
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      checked: true,
      category: 'Breakfast'
    },
    {
      id: 2,
      name: 'tofu',
      price: 3.50,
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      checked: false,
      category: 'Main'
    },
    {
      id: 3,
      name: 'chocolates',
      price: 6.25,
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      checked: false,
      category: 'Snack'
    }
  ]

  before('set up db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
  })

  //before, after, afterEach hooks to maintain db for tests GO HERE
  before(() => db('shopping_list').truncate())
  afterEach(() => db('shopping_list').truncate())
  after(() => db.destroy())

  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db 
        .into('shopping_list')
        .insert(testItems)
    })
    it(`getAllItems() gets all items from shopping_list table`, () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql(testItems)
        })
    })
    it(`getItemById() resolves an item by id from shopping_list table`, () => {
      const secondTestItem = testItems[1]

      return ShoppingListService.getItemById(db, 2)
        .then(actual => {
          console.log('Actual:', actual);
          expect(actual).to.eql({
            id: 2,
            name: secondTestItem.name,
            price: secondTestItem.price,
            date_added: secondTestItem.date_added,
            checked: secondTestItem.checked,
            category: secondTestItem.category
          })
        })
    })
    it(`deleteItem() removes an item from the shopping_list table`, () => {
      const itemId = 2
      return ShoppingListService.deleteItem(db, itemId)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          const newItemsList = testItems.filter(item => item.id !== itemId)
          expect(allItems).to.eql(newItemsList)
        })
    })
    it(`updateItem() updates an item from the shopping_list table`, () => {
      const idOfItemUpdating = 2
      const newItemData = {
        name: 'updated name',
        price: 10,
        date_added: new Date(),
        category: 'Snack',
        checked: true,
      }
      return ShoppingListService.updateItem(db, idOfItemUpdating, newItemData)
        .then(() => ShoppingListService.getItemById(db, idOfItemUpdating))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemUpdating,
            ...newItemData,
          })
        })
    })
  })

  context(`Given shopping_list table has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })
    it(`insertItem() inserts an item in the shopping_list table`, () => {
      const testItem = { ...testItems[0] }
      delete testItem.id
      delete testItem.date_added

      return ShoppingListService
        .insertItem(db, testItem)
        .then(item => {
          expect(item).to.be.an('object')
          expect(item.name).to.eql(testItem.name)
          expect(item).to.have.property('id')
          expect(item).to.have.property('date_added')
        })
    })
    it(`errors on create when title not provided`, () => {
      const testItem = {
        name: testItems[0].name
      }
      return ShoppingListService
        .insertItem(db, testItem)
        .then(
          () => expect.fail(),
          (err) => {
            expect(err.message).to.include('not-null')
          }
        );
    })
  })
})