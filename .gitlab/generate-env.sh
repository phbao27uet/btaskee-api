#!/bin/bash

rm -rf .env
env | grep -E '^CI_REGISTRY_|^ZEN_|^DOCKER_IMAGE' >> .env