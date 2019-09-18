#!/usr/bin/env bash

srcroot=$PWD/src
for dir in tmp/out/typescript/*
do
  pushd "$dir"
  service=$(basename "$PWD")
  for version in v*
  do
    pushd "$version/$service"
    mkdir -p "$srcroot/services/$service/$version/models"
    cp "../openapi.yaml" "GeneratedApis.ts" "$srcroot/services/$service/$version"
    cp -- *.ts "$srcroot/services/$service/$version/models/"
    popd
  done
  popd
done
