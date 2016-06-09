**Sprint 0: Process**
============

**Table of Contents**

  * [Sprint Level Definition of Done](#sprint-done-definition)
  * [User Stories and Acceptance Criteria](#user-stories)
  * [Release Level Definition of Done](#done-definition)
  * [Continuous Integration & Deployment ](#ci_cd)
  * [Application Architecture and Technology Stack ](#arch-tech)
  

##Sprint Level Definition of Done <a id="sprint-done-definition"></a>

The sprint will be considered as done only when the following milestones and tasks are fully completed: 

1. All the committed items for the Sprint are completed
2. Unit tests were written and are passing
3. Code reviews and resulting corrections to meet code standards have been performed
4. All the code has been pushed to the master branch and it included relevant comments
5. The builds are generated without errors
6. Regression testing is completed
7. Application has been deployed to test environment 
8. Released version passed Product Manager Acceptance testing
9. Relevant documentation has been produced or updated

## User Stories and Acceptance Criteria <a id="user-stories"></a>

After the discovery phase was completed and during the Sprint 0 we created the first version of the refined product backlog. Here is an overview of the User Stories that were defined as part of the Product Backlog by the end of Sprint 0.  

1. **Information Website** – The creation of a website containing information about the Foster Care program. This website will be the starting point for the profile creation and the Foster Agencies location search
2. **Profile Creation** – Develop functionality for allowing users to establish a profile in the systems
3. **Look for nearby foster agencies** – Enable users to look for nearby agencies by specifying a valid zip code
4. **Profile Update** – Develop functionality for update user’s profile and accessing inbox
5. **Complementary profile fields** - Encourage users to capture additional profile information which is useful for caseworkers and foster agencies
6. **Parents Inbox** - Allow parents to have an inbox for viewing sent and received messages
7. **Parent Sends messages** - Enable Parents to send messages to the designated case workers
8. **Case Worker Inbox** - Enable Case workers to view sent and received messages from multiple foster parents
9. **Case worker sends messages** – enable case worker to send messages to the different foster parents they are working with
10. **Authentication** – Develop authentication mechanism for both application roles
11. **Notifications** -  Enable functionality for users to receive notifications when there are new messages in the Inbox

A PDF with the complete description of user stories and acceptance criteria can be downloaded from [this link](/docs/sprint_0/process/pdfs/initial-product-backlog.pdf).

## Release Level Definition of Done <a id="done-definition"></a>
1.	All the user stories and tasks committed for the release are completed
2.	All the code has been pushed to the master branch and it included relevant comments
3.	All unit tests are passing
4.	Regression testing has been successfully completed
5.	There are no software defects for the release
6.	Released version passed Product Manager Acceptance testing
7.	Application has been deployed to the production environment
8.	Relevant documentation has been produced or updated
9.	Application monitoring is up and running
10.	Application and Environment security has been tested and validated


## Continuous Integration & Deployment <a id="ci_cd"></a>

During sprint 0 we defined a continuous delivery strategy which enabled us to get visibility of the progress, get feedback early and deliver value fast. Continuous integration was configured in our integration environment using Jenkins CI. Builds were automatically triggered upon pushes to the prototype’s GitHub repository.

The following diagram illustrates our continuous delivery strategy:

![Continuous Delivery](/docs/sprint_0/process/images/ci-deployment.png)

Configuration management was handled via [configuration variables](https://devcenter.heroku.com/articles/config-vars) in the Heroku PaaS cloud environment. The prototype uses these configurations to provide the appropriate functionality.

## Application Architecture and Technology Stack <a id="arch-tech"></a> 

![Technology Stack](/docs/sprint_0/process/images/logocollage.png)

The software tools which we rely on are listed in the following sections. These tools were chosen because of their excellent performance characteristics, robust API's, healthy open source communities, histories within the private-sector, flexible deployment options, a wealth of documentation, and much more such criteria.

**Frameworks**

[Express] (http://expressjs.com/) provides our web application with a robust set of features and utility methods for creating web applications. Used internally at Netflix and commonly used as the E in the MEAN software stack, Express has an extensive history and is the de facto server framework for Node.js.

For templating we use [handlebarsjs] (http://handlebarsjs.com/) as it provides the right balance between its syntax, logic primitives, and ease of use. Handlebar's strength comes from how its limited looping and primitives force onto developers the best practice of minimizing logic in views when possible.

[Knex.js](http://knexjs.org/) is an SQL query builder for many SQL databases. It is designed to be flexible, and portable, and provides a full featured query and schema builder. Knex.js provides us the flexibility to iterate in an Agile Development model, while still providing clean and a maintainable API for long term maintenance.

**Data Persistence**

We utilize the enterprise class database, [PostgreSQL](https://www.postgresql.org/) for our data persistence needs. Being a battle tested object-relational database, Postgres provides the data integrity features required for any reliable system. With geospatial features and native JSON and binary JSON columns, Postgres has excellent support for marshalling user configuration and other objects between our applications components.

**Code Standards and Linting**

For code quality and linting we utilize basic tools such as [ESLint](http://eslint.org/), [JSDoc](http://usejsdoc.org/), and [sassDOC](http://sassdoc.com/) which we have embedded in our editors and project environments.  Our primary config for eslint is specified in our eslintrc file, and this file enforces basic conventions such as indent, comma, brace styles, etc. 

**Test Driven Development** 

Testing includes our unit tests and end to end user tests. Our limited timeframe for development narrows our testing scope to the core functionality of logging in, sending messages, profile updates, etc. For future tests we would implement more end-to-end tests using [Selenium](http://docs.seleniumhq.org/) server and [nightwatchjs](http://nightwatchjs.org/) 

An example console printout from our continous tests, this example focusing on user profile tests.

![Example Test](/docs/sprint_0/process/images/exampletest.png)
