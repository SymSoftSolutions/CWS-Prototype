# CWS-Prototype


## Setup
First clone the repo and change your directory to the newly created project folder.

```
git clone https://github.com/SymSoftSolutions/CWS-Prototype.git
cd CWS-Prototype
```

Next, assuming you have [node already](https://nodejs.org/en/download/current/) on your machine, install the dependencies with npm.
```
npm install
```

We use PostgreSQL in our persistence layer, so you need to have postgres installed. You can download it [here](https://www.postgresql.org/download/).

Once you have PostgreSQL installed on your machine, we need a database created specifically for this project.

```
createdb cws
```

That creates the database `cws` using the default database server

Assuming all goes well we can now run the project with:
```
npm start
```
 The site should will now be running on `http://localhost:8000`

## Development Processes
TODO

### Code Reviews
TODO
### Builds
TODO

### Testing
TODO

## Technology Stack
The software tools which we rely on are listed in the follow sections. These tools were chosen for their excellent performance characteristics, robust api's, healthy open source communities, histories within the private-sector, flexible deployment options, wealth of documentation, and many more such criteria.

### Frameworks
[Express](http://expressjs.com/) provides our web application with a robust set of features and utility methods for creating web applications. Used internally at Netflix and commonly used as the _E_ in the [MEAN](https://en.wikipedia.org/wiki/MEAN_(software_bundle)) software stack, Express has an extensive history and is the de facto server framework for node.js.

For templating we use [handlebarsjs]() as it provides the right balance between its syntax, logic primitives, and ease of use. Handlebar's strength comes from how its limited looping and primitives force onto developers the best practice of minimizing logic in views when possible.

[Knex.js](knexjs.org) is a SQL query builder for many SQl databases. It is designed to be flexible, and portable, and provides a full featured query and schema builder. Knex.js provides us the flexibility to iterate in a fast paced scrum model of development, while still providing clean and maintainable api's for long term maintenance.

### Databases
We utilize the enterprise class database, [PostgreSQL](https://www.postgresql.org,) for our data persistence needs. Being a battle tested object-relational database, Postgres provides the data integrity features required for any reliable system. With geospatial features and native json and binary json columns, postgres has excellent support for marshalling user configuration and other objects between our applications components.


## Hosting Environment
TODO
