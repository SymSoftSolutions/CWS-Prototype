# Digital Foster Services

**Table of Contents**

  * [Application Access](#application-access)  
  * [An Agile Approach](#our-approach)  
  * [About the Team](#about-team)  
  * [Open Source Technologies](#open-source)  
  * [Application Setup](#setup)
  * [License](#license)

## Application Access <a id="application-access"></a>

We have made our functional prototype available through the following link:
 
[http://fostercare.symsoftsolutions.com/] (http://fostercare.symsoftsolutions.com/) 

Two accounts have been initially configured:

To login as a parent use:
 
__username:__ test@example.com
__password:__ 123
 
To login as a case worker use:
 
__username:__ case@example.com
__password:__ 123

## An Agile Approach <a id="our-approach"></a>

To quickly design and develop a working prototype from start to finish, we used a combination of user-centered design and agile development. We adhered to the [principles of the agile manifesto](http://www.agilemanifesto.org/principles.html) for an iterative process. We used [Scrum] (https://www.scrumalliance.org/why-scrum) as our framework for clear communication and workflow amongst the team.

![SymSoft Process](/docs/sprint_0/process/images/ourprocess.png)

[**Discovery Phase**] (/docs/discovery_phase/readme.md)

In this phase we [reviewed the project requirements and learned about Foster Care](CWS-Prototype/docs/discovery_phase/readme.md) in order to:

* Understand the project requirements
* Learn about Foster Care resources
* Define the team members
* Create an initital product backlog

**Sprint 0 - User Experience and Agile Development**

Next, we combined [user centered design and agile development] to generate interactive mockups with full functionality as described by the State requirements. During this sprint we executed the following tasks:

[*User-Centered Design:*](/docs/sprint_0/ux/readme.md)

1. Interviewed a foster parent 
2. Created User Personas 
3. Designed high fidelity product wireframes and reviewed those with users
4. Gathered design guidelines

[*Agile Process:*](/docs/sprint_0/process/readme.md)

1. Refined Product Backlog with Acceptance Criteria
2. Agreed on Sprint and Release Level Definition of Done
3. Defined code standards and design guidelines for upcoming sprints
4. Set up Continuous Integration Server and Continuous deployment strategy 
5. Defined the [Application Architechture and Technology Stack](/docs/sprint_0/process/readme.md#arch-tech)
7. Setup Agile tracking tools [Jira](https://www.atlassian.com/software/jira/agile)	

**Sprint 1-N**

TODO

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

For more details about the team composition please contact us

## Open Source Technologies <a id="open-source"></a>

[Open source tools, frameworks, and design resources] (docs/sprint_0/process/readme.md#arch-tech) guided our process from start to finish. The prototype was created using open source technologies including node.js, Postgres, HTML5 among others. While these technologies were chosen for this simple prototype, other technologies may be needed to handle complexities for future phases of this project. We have experience in PHP, Java, Ruby, Python and ASP .Net, with MySQL, SQL Server, Oracle, as well as NoSQL databases such as MongoDB.

## Application Setup <a id="setup"></a>

1.- First clone the repo and change your directory to the newly created project folder.

```
git clone https://github.com/SymSoftSolutions/CWS-Prototype.git
cd CWS-Prototype
```

2.- Next, assuming you have [node already](https://nodejs.org/en/download/current/) on your machine, install the dependencies with npm.
```
npm install
```
We are currently running node v6, so if you have a older node version installed on your machine, you might run into issues with some of our dependencies. If that happens to be the case, you can easily upgrade to node and re-run the npm install.

3.- We use PostgreSQL in our persistence layer, so you need to have postgres installed. You can download it [here](https://www.postgresql.org/download/).

Once you have PostgreSQL installed on your machine, we need a database created specifically for this project.

```
createdb cws
```

That creates the database `cws` using the default database server

You will more than likely need to modify the configuration of the project to match your postgres on your machine. To do this you can open up the simple config file in [config/index.js](/config/index.js) and modify the username, password, port, etc to match your postgres instance.
 
4.- Assuming all goes well we can now run the project with:
```
npm start
```
 The site should will now be running on `http://localhost:8000`

## License <a id="license"></a>

This project is licensed under the terms of the [MIT license] (CWS-Prototype/LICENSE). 
The photo from the home page is courtesy of [Jorge Barahona] (https://unsplash.com/@jorgebarahona), licensed under [Creative Commons Zero from Unsplash] (https://unsplash.com/license). [Google Material Icons] (https://design.google.com/icons/) licensed under the [Creative Commons license] (https://github.com/google/material-design-icons/blob/master/LICENSE). Profile photos provided by contributors of [UI Faces](http://uifaces.com), and profile names provided by contributors of [UI Names] (http://uinames.com).

## Thank You

Symsoft thanks the California Child Welfare System for the opportunity to create a prototype and participate in RFI #75001.
