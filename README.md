# foodwatch

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

Our development process requires selection of a project lead to run the project.  This individual is ultimately responsible for project success and product quality.  A senior software consultant assists by coaching the team during sprint planning, daily scrums, and independent reviews.  On most projects, DevOps would be a separate team member, but due to the small size of this project, the lead handled the DevOps setup.

## Technology Stack
Foodwatch is built on Meteor.js/MongoDB using Leaflet and OpenStreetView as the mapping layer and map provider.  We leverage CircleCI for continuous integration and Waffle.io for Agile boards.  The app is deployed in a Docker container hosted on DigitalOcean.  We leverage Tutum to manage the Docker container on DigitalOcean.

### Continuous Integration

Automated continuous integration and deployment is managed through CircleCI. On commit to the Master branch, the code is automatically deployed to Docker Hub and built by Tutum Stack on a host at DigitalOcean.

For additional details, please see the wiki.

### Configuration Management

Configuration for the app (Meteor) and CircleCI are managed through their respective config files in the repo. 

### Continuous Monitoring

The release container is monitored by New Relic.

### Unit Tests

Unit tests are written using Jasmine.  CircleCI runs the unit tests as part of the build/deploy process. See the Development section to run the unit tests.

### Development
1. [Install Meteor](https://www.meteor.com/install)
2. Clone this project
3. ```cd``` into the project directory
4. Optionally run unit tests: ```meteor --test```
5. Run the project: ```meteor```
6. Go to http://localhost:3000/

### Running
[![Deploy to Tutum](https://s.tutum.co/deploy-to-tutum.svg)](https://dashboard.tutum.co/stack/deploy/)

There are several ways to run the application. You can use the badge above to create the Tutum stack (some environmental variables required), follow the instructions in the Development section, or you can launch the Docker container:
1. Launch the required Mongo database: ```docker run -d --name mongo mongo```
2. Launch the foodwatch container: ```docker run -d --name foodwatch --link mongo:mongo -e ROOT_URL=http://localhost -p 80:80 sjmatta/foodwatch```
3. Navigate to http://localhost/
