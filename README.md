# Secure the Future 

California's Foster Care System is designed to serve and protect those children who cannot safely remain in their homes. The counties placement agencies and licensed private Foster Family Agencies (FFAs) provide responsive and comprehensive placement services for children in need, including recruiting, certifying and training foster parents, and finding homes for children in need. 

SymSoft created this prototype online application to support the foster parents and secure the future for the foster children. The prototype enables foster parents to create and manage their profile online, search for nearby foster care facilities and exchange private messages with case workers.

SymSoft followed an [agile and user-centered approach](#our-approach) to create this prototype. We used [open source technologies] (#open-source) and deployed the solution on hosted [PaaS platform] (https://www.heroku.com/). 

**Table of Contents**

  * [Application Access](#application-access)  
  * [An Agile and User Centered Approach](#our-approach)  
  * [About the Team](#about-team)  
  * [Open Source Technologies](#open-source)  
  * [Application Setup](#setup)
  * [License](#license)

## Application Access <a id="application-access"></a>

Access the application at: [http://fostercare.symsoftsolutions.com/] (http://fostercare.symsoftsolutions.com/) 

[![Foster care prototype screenshots] (/docs/sprint1_n/photos/11_symsoft-solutions-chhs-rfi-75001_prototype-screenshots.jpg)] (http://fostercare.symsoftsolutions.com/) 

Two accounts have been initially configured:

To login as a parent use the following, or simply register with the system:
__Email:__ test@example.com
__Password:__ 123
 
To login as a case worker use:
 __Email:__ case@example.com
__Password:__ 123

## An Agile and User Centered Approach <a id="our-approach"></a>

To quickly design and develop a working prototype from start to finish, we used a combination of user-centered design and agile development. We adhered to the [principles of the agile manifesto](http://www.agilemanifesto.org/principles.html) for an iterative process. We used [Scrum] (https://www.scrumalliance.org/why-scrum) as our framework for clear communication and workflow amongst the team.

![SymSoft Process](/docs/sprint_0/process/images/ourprocess.png)

####Discovery Phase

[![Link to discovery phase details] (/docs/sprint1_n/photos/12_symsoft-solutions-chhs-rfi-75001_button-discovery-phase-v7.jpg)] (/docs/discovery_phase/readme.md)

In this phase we conducted following activities:

* [Independent research to learn about Foster Care](/docs/discovery_phase/readme.md)
* Understand the project requirements
* Create an initital product backlog
* Assemble the [team](#about-team)

###Sprint 0 - User Experience and Agile Development 

Next, we combined user centered design and agile development to generate interactive mockups with full functionality as described by the State requirements. During this sprint we executed the following tasks:

####User-Centered Design

[![Link to user-centered design details] (/docs/sprint1_n/photos/13_symsoft-solutions-chhs-rfi-75001_button-ux-v3.jpg)] (/docs/sprint_0/ux/readme.md)

1. Interviewed a foster parent 
2. Created User Personas 
3. Created low fidelity sketches to present and discuss ideas with a foster parent
4. Designed high fidelity product wireframes to demonstrate interactions and flow, and reviewed those with users
5. Created visual design for the application

####Agile Process

[![Link to agile process details] (/docs/sprint1_n/photos/14_symsoft-solutions-chhs-rfi-75001_button-agile-v3.jpg)] (/docs/sprint_0/process/readme.md)

1. Refined Product Backlog with Acceptance Criteria
2. Agreed on Sprint and Release Level Definition of Done
3. Defined code standards and design guidelines for upcoming sprints
4. Set up Continuous Integration Server and Continuous deployment strategy 
5. Defined the [Application Architechture and Technology Stack](/docs/sprint_0/process/readme.md#arch-tech)
7. Setup Agile tracking tools [Jira](https://www.atlassian.com/software/jira/agile)	

###Sprint 1-N

[![Link to prototype process details] (/docs/sprint1_n/photos/15_symsoft-solutions-chhs-rfi-75001_button-prototype-v3.jpg)] (/docs/sprint1_n/readme.md)

We developed the prototype functionality through two Sprints one-week long each. During each iteration, we followed the [U.S. Digital Services Playbook] (https://playbook.cio.gov) and by the end of each Sprint, we released an end to end solution which we made available for real users to test and provide feedback. Based on this feedback we implemented some of the improvements for upcoming iterations and documented some other that are out of the scope of this prototype but that were identified as functionality that provides value to users. 

## About the Team <a id="about-team"></a>

![Scrum Team](/docs/about_team/photos/project-team.jpg)

For this project, similar to our other projects, and inline with the requirements of the RFI, we assembled a multidiscplinary, cross-functional team, and identified Product Manager/ Team Lead for the project.

The team comprised on following vendor pool labor categories:

* User Researcher
* Visual Designer
* Interaction Designer
* Front-End Developer
* Back-End Web Developer
* Product Manager
* Agile Coach
* DevOps Engineer
* Technical Architect

Please contact us for more details about the team composition.

## Open Source Technologies <a id="open-source"></a>

[Open source tools, frameworks, and design resources] (docs/sprint_0/process/readme.md#arch-tech) guided our process from start to finish. The prototype was developed using the following open-source technologies (to name a few):

* node.js
* express
* PostgreSQL
* handlebars
* Knex.js
* jQuery
* Gulp
* Mocha
* HTML 5

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

This project is licensed under the terms of the [MIT license] (LICENSE). 
The photo from the home page is courtesy of [Jorge Barahona] (https://unsplash.com/@jorgebarahona), licensed under [Creative Commons Zero from Unsplash] (https://unsplash.com/license). [Google Material Icons] (https://design.google.com/icons/) licensed under the [Creative Commons license] (https://github.com/google/material-design-icons/blob/master/LICENSE). Profile photos provided by contributors of [UI Faces](http://uifaces.com), and profile names provided by contributors of [UI Names] (http://uinames.com).

## Thank You

SymSoft thanks the California Child Welfare System for the opportunity to create a prototype and participate in RFI #75001.
