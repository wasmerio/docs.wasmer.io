#!/bin/bash

pnpm run build
mv app public
wasmer publish
