#!/bin/bash

ruby <<-EORUBY
 
  	require 'json'
	require 'fileutils'

	json = File.read('config.template.json')
	config = JSON.parse(json)

	# update NID of the application
	if ENV['NID']
		config['appId'] = ENV['NID']
		puts "Application id is updated to " + ENV['NID']
	end

	# update authorization token
	if ENV['AUTHORIZATION']
		config['authorization'] = ENV['AUTHORIZATION']
		puts "Authorization token is updated."
	end

	# update build type to production
	if ENV['CONFIGURATION'] == 'prod'
		config['production'] = true
		puts "Changed configuration to production."
	end

	# update build type to release
	if ENV['BUILD_TYPE'] == 'Release'
		config['debug'] = false
		puts "Changed build type to release."
	end

	File.open('config.json', "w") do |f|
		f.write config.to_json
	end

	puts config.to_json
 
EORUBY

# install build script dependencies
cd build-script
yarn install
cd ..
