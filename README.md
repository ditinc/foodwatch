# Foodwatch

Foodwatch is an open web application that consumes data from the FDA Food Enforcements Report API (URL) and allows a visitor to select and display the reported event on a map.  The visitor is then able to highlight states to which that recalled food item was shipped.  The proof of concept below consumes the 10 most recent events.

Type | URL
---- | ---
Master Branch :rocket: | https://foodwatch.dtec.com/
Release :sunny: | Coming soon!

[![Stories in Ready](https://badge.waffle.io/DistributedInformationTechnologies/foodwatch.png?label=ready&title=Ready)](https://waffle.io/DistributedInformationTechnologies/foodwatch)
[![Build Status](https://circleci.com/gh/DistributedInformationTechnologies/foodwatch/tree/master.png?style=shield)](https://circleci.com/gh/DistributedInformationTechnologies/foodwatch)
[![Code Climate](https://codeclimate.com/github/DistributedInformationTechnologies/foodwatch/badges/gpa.svg)](https://codeclimate.com/github/DistributedInformationTechnologies/foodwatch)

## Team and Development Process
- DevOps and Project Lead: sjmatta
- Leaflet Developer: treyyoder
- Meteor Developer: dan-nyanko
- Senior Software Consultant and Scrum Master: etrudeau

Our development process requires selection of a project lead to run the project.  This individual is ultimately responsible for project success and product quality.  A senior software consultant assists by coaching the team during sprint planning, daily scrums, and independent reviews.  On most projects, DevOps would be a separate team member, but due to the small size of this project, the lead handled the DevOps setup and tweaks.  We conduct code review directly in GitHub through comments and issues.  Issues are automatically synced with Waffle.io Agile boards.

## Technology Stack
Foodwatch is built on Meteor.js/MongoDB using Leaflet and OpenStreetMaps as the mapping layer and map provider.  We leverage CircleCI for continuous integration.  The app is deployed in a Docker container hosted on DigitalOcean.  We leverage Tutum to manage the Docker container on DigitalOcean.

Most of the technologies in Foodwatch are free and open source.  However, several tools used in the development process are only free to use on open source projects.  These include Tutum, CircleCI, and NewRelic.  The software licensing is as follows:

- Meteor: MIT
- Jasmine: MIT
- Leaflet: BSD
- MongoDB: GNU AGPL v3.0
- OpenStreetMap: ODbL
- HAProxy: GPL v2.0
- Docker: Apache 2.0

Use of Foodwatch is limited by the licensing of its component parts.  The Foodwatch source code is licensed under GPL v3.0.

### Continuous Integration

Automated continuous integration and deployment is managed through CircleCI (https://circleci.com). On commit to the Master branch, the code is automatically deployed to Docker Hub.  Tutum (https://www.tutum.co/) describes the container configuration, layout, and relationships, and automatically downloads/starts the Docker containers on a node at DigitalOcean.

For additional details, please see the wiki.

### Configuration Management

Configuration for the app (Meteor in .meteor) and CircleCI (circle.yml) are managed through their respective config files in the repo. Confidential information (passwords, etc.) are stored as environmental variables in CircleCI and aren't available in GitHub.

### Continuous Monitoring

The release containers are monitored by New Relic. The Tutum stack consists of 1 HAProxy (http://www.haproxy.org/) container doing round robin load balancing to 2 Foodwatch containers. The Foodwatch containers share a MongoDB container. A New Relic container monitors all of the running containers.  This prevents downtime during automated redeploy.

### Unit Tests

Unit tests are written using Jasmine and run using the Velocity test runner for Meteor.  CircleCI runs the unit tests as part of the build/deploy process. See the Development section to run the unit tests.

### Development
1. [Install Meteor](https://www.meteor.com/install)
2. Clone this project
3. ```cd``` into the project directory
4. Optionally run unit tests: ```meteor --test```
5. Run the project: ```meteor```
6. Go to http://localhost:3000/

### Running
[![Deploy to Tutum](https://s.tutum.co/deploy-to-tutum.svg)](https://dashboard.tutum.co/stack/deploy/)

There are several ways to run the application. You can use the badge above to create the Tutum stack (some environmental variables required), follow the instructions in the Development section.

Or you can launch the Docker container.
 
1. Set the following environmental variables. (We plan to add additional configuration options in the future, including detecting the lack of these variables and adjusting.)
  * SSL_CERT: Base64-encoded DER private key and certificate, all on one line, with the text ```\n``` replacing line separators
  * NEW_RELIC_LICENSE_KEY: The API key provided by New Relic
2. Launch the required Mongo database: ```docker run -d --name mongo mongo```
3. Launch the Foodwatch container: ```docker run -d --name foodwatch --link mongo:mongo -e ROOT_URL=http://localhost -p 80:80 sjmatta/foodwatch```
4. Navigate to http://localhost/
