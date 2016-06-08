## Digital Foster Services

**Table of Contents**

  * [Symsoft's Approach](#our-approach)  
  * [About the Team](#about-team)  
  * [Open Source Technologies](#open-source)  
  * [License](#license) 
  * [Project Setup](#setup) 

## Symsoft's Approach <a id="our-approach"></a>

SymSoft Solutions User Centered Agile Development approach delivers fast value while generating usable software since the first iteration rather than create independent software components that do not provide any real value to the end user. 

For the development of this prototype, we adhered to the [principles of the agile manifesto](http://www.agilemanifesto.org/principles.html) and used Scrum to help us to develop the prototype quickly while promoting transparency and adaptation.

![SymSoft Process](/docs/sprint_0/process/images/ourprocess.png)

[**Discovery Phase**] (/docs/discovery_phase/readme.md)

In this phase we reviewed the project requirements and learned about Foster Care to develop a prioritized features list (the initial Product Backlog).

During this phase we executed the following tasks:

1. Reviewed and understood the project requirements and context
2. Researched foster care websites, application forms, and local resources
3. Defined the team members 
4. Created  a high-level version of the initial product backlog

**Sprint 0**

We combined User Centered Design and Agile Development. By the end of this sprint, we generated interactive mockups with full functionality as described by the State requirements

During sprint 0 we executed the following tasks:

[*Human Centered Design:*](/docs/sprint_0/ux/readme.md)

1. Interviewed a foster parent to understand his challenges, and vision for improved digital foster care services
2. Created User Personas 
3. Designed high fidelity product wireframes and reviewed those with users
4. Gathered visual design, branding, and marketing guidelines

[*Agile Process:*](/docs/sprint_0/process/readme.md)

1. Refined Product Backlog with Acceptance Criteria
2. Agreed on Sprint and Release Level Definition of Done
3. Defined code standards and design guidelines for upcoming sprints
4. Set up Continuous Integration Server and Continuous deployment strategy 
5. Defined the [Application Architechture and Technology Stack](/docs/sprint_0/process/readme.md#arch-tech)
7. Setup Agile tracking tools [Jira](https://www.atlassian.com/software/jira/agile)	

**Sprint 1-N**

We developed the prototype through two week-long sprints and utilized Scrum as our agile development framework. 

During this phase we executed the following activities and tasks:

1. Sprint Planning
2. Sprint Backlog Refining
3. Daily Scrums
4. Sprint Reviews
5. Sprint Retrospectives
6. Test Driven Development for Automated testing
7. Code Review sessions
8. Pair programming and pair testing
9. Regression testing
10. Continuous Integration and Continuous deployment to [AWS Elastic Beanstalk] (https://aws.amazon.com/elasticbeanstalk/)
11. Continuous Monitoring with AWS Cloudwatch
12. Manual testing in multiple mobile devices
13. Cross-browser testing

## About the Team <a id="about-team"></a>

**Team Lead**

Savita Farooqui is the Product Manager for this project. 
Savita is has more than 15 years of experience in the IT field. During this time, she has been involved in a variety of projects from building technology tools and products, back office automation for businesses and governments and creating web portals for providing web-based information and service delivery. 

For the purpose of this project we assembled an agile team including the following vendor pool labor categories:

* Visual Designer
* Interaction Designer
* User Researcher
* Front-End Developer
* Back-End Web Developer
* Product Manager
* Agile Coach
* DevOps Engineer
* Technical Architect

For more details about the team composition please send us an email

## Open Source Technologies <a id="open-source"></a>

TODO

## License <a id="license"></a>

This project is licensed under the terms of the [MIT license] (CWS-Prototype/LICENSE). 
The photo from the home page is courtesy of [Jorge Barahona] (https://unsplash.com/@jorgebarahona), licensed under [Creative Commons Zero from Unsplash] (https://unsplash.com/license).

## Project Setup <a id="setup"></a>

TODO

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

TODO: Describe Config

Assuming all goes well we can now run the project with:
```
npm start
```
 The site should will now be running on `http://localhost:8000`
