# CWS-Prototype


## Development Processes
TODO

## Technology Stack
Listed below are the software tools which we rely on. Chosen for their high performance history when used by private-sector companies creating similar services, their flexibility in their deployment options, and their wealth of documentation and examples for enabling rapid development.

### Frameworks
[Express](http://expressjs.com/) provides our web application with a robust set of features and utility methods for creating web applications. Used internally at Netflix and commonly used as the _E_ in the [MEAN](https://en.wikipedia.org/wiki/MEAN_(software_bundle)) software stack, Express.js is the de facto server framework for node.js.

For templating we use [handlebarsjs]() as it provides the right balance between its syntax, logic primitives, and ease of it's use. Handlebars strength comes from how its limited looping and logic primitives force onto developers the best practice of minimizing complex logic in views whenever possible.

[Knex.js](knexjs.org) is a SQL query builder for many SQl databases. It is designed to be flexible, and portable, and provides a full featured query and schema builder. Knex.js provides us the flexibility to iterate in fast paced scrum model of development, all the while providing clean and maintainable api's for long term maintenance.

### Database
We utilize the enterprise class database, [PostgreSQL](https://www.postgresql.org,) for our data persistence needs. Being a battle tested object-relational database, Postgres provides the data integrity features required for any reliable system. With geospatial features and native json and binary json columns, postgres has excellent support for marshalling user configuration and other objects between our applications components.


## Hosting & Environment
TODO