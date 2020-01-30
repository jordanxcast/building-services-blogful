require('dotenv').config();
const knex = require('knex');
const ArticlesService = require('./articles-service');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

//use all the Articles Service methods
ArticlesService.getAllArticles(knexInstance)
  .then(articles => console.log(articles))
  .then(() => 
    ArticlesService.insertArticle(knexInstance, {
      title: 'New Title',
      content: 'New Content',
      date_published: new Date(),
    })
  )
  .then(newArticle => {
    console.log(newArticle);
    return ArticlesService.updateArticle(
      knexInstance,
      newArticle.id,
      {title: 'Updated title'}
    ).then(() => ArticlesService.getById(knexInstance, newArticle.id));
  })
  .then(article => {
    console.log(article);
    return ArticlesService.deleteArticle(knexInstance, article.id);
  });

console.log(ArticlesService.getAllArticles());
