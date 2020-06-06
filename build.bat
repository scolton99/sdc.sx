@echo off

echo Building main CSS...
call sass src\assets\scss\main.scss dist\assets\stylesheets\main.scss

echo Building main JS...
copy src\assets\js\script.js dist\assets\scripts\script.js

echo Building accessory HTML...
call haml src\picture.haml src\picture.html
call haml src\nav.haml src\nav.html

echo Building main HTML...
cd src
call haml index.haml ..\dist\index.html
call haml contact.haml ..\dist\contact.html
call haml bio.haml ..\dist\bio.html
cd projects
call haml index.haml ..\..\dist\projects\index.html
call haml tsc-server.haml ..\..\dist\projects\tsc-server.html