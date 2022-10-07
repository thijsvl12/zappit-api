#!/bin/sh

npx prisma db push

node dist/main.js