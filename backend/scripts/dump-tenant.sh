#!/bin/bash

kourou collection:export platform config --path ./tenant
kourou collection:export platform devices --path ./tenant
kourou collection:export platform frame-reference --path ./tenant
kourou collection:export platform templates --path ./tenant
kourou collection:export platform tenants --path ./tenant

kourou index:export tenant-hyvision-bytel --path ./tenant
