# foodwatch

Foodwatch is an open web application that consumes data from the FDA Food Enforcements Report API (URL) and allows a visitor to select and display the reported event on a map.  The visitor is then able to highlight states to which that recalled food item was shipped.  The proof of concept below consumes the 10 most recent events.

Type | URL
---- | ---
Master Branch :rocket: | http://foodwatch.sjmatta.svc.tutum.io/
Release :sunny: | Coming soon!

[![Stories in Ready](https://badge.waffle.io/DistributedInformationTechnologies/foodwatch.png?label=ready&title=Ready)](https://waffle.io/DistributedInformationTechnologies/foodwatch)
[![Build Status](https://circleci.com/gh/DistributedInformationTechnologies/foodwatch/tree/master.png?style=shield)](https://circleci.com/gh/DistributedInformationTechnologies/foodwatch)
[![Code Climate](https://codeclimate.com/github/DistributedInformationTechnologies/foodwatch/badges/gpa.svg)](https://codeclimate.com/github/DistributedInformationTechnologies/foodwatch)

## Team
- Dev and Project Lead: sjmatta
- Leaflet Developer: treyyoder
- Meteor Developer: dan-nyanko
- Senior Software Consultant and Scrum Master: etrudeau

For additional details, please see the wiki.

## Development
1. [Install Meteor](https://www.meteor.com/install)
2. Clone this project
3. ```cd``` into the project directory
4. Run the project: ```meteor```
5. Go to http://localhost:3000/

## Continuous Integration

Automated continuous integration and deployment occurs in this order:

Github commit &#10140; CircleCI Build/Test &#10140; Docker Container &#10140; Docker Hub Repository &#10140; Webhook &#10140; Tutum Stack &#10140; DigitalOcean Docker Container

Deployment only occurs from the Master branch and is halted when the CircleCI Build/Test fails.


