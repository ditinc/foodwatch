# foodwatch

[![Stories in Ready](https://badge.waffle.io/DistributedInformationTechnologies/foodwatch.png?label=ready&title=Ready)](https://waffle.io/DistributedInformationTechnologies/foodwatch)
[![Build Status](https://circleci.com/gh/DistributedInformationTechnologies/foodwatch/tree/master.png?style=shield)](https://circleci.com/gh/DistributedInformationTechnologies/foodwatch)
[![Code Climate](https://codeclimate.com/github/DistributedInformationTechnologies/foodwatch/badges/gpa.svg)](https://codeclimate.com/github/DistributedInformationTechnologies/foodwatch)

## Continuous Integration

Automated continuous integration and deployment occurs in this order:

Github commit &#10140; CircleCI Build/Test &#10140; Docker Container &#10140; Docker Hub Repository &#10140; Webhook &#10140; Tutum Stack &#10140; DigitalOcean Docker Container

Deployment only occurs from the Master branch and is halted when the CircleCI Build/Test fails.

Type | URL
---- | ---
Master Branch :rocket: | http://foodwatch.sjmatta.svc.tutum.io/
Release :sunny: | Coming soon!
