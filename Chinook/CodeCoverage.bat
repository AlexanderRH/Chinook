@echo off
SET currentPath=%~dp0
SET testPath=%currentPath%Chinook.WebApi.Test
SET targetargs="test -f netcoreapp2.0 -c Release \"%testPath%\Chinook.WebApi.Test.csproj\""

opencover.console.exe -target:"dotnet.exe" -targetargs:%targetargs% -mergeoutput -hideskipped:File -output:coverage.xml -oldStyle -filter:"+[Chinook.*]* -[Chinook.WebApi.Test*]*" -searchdirs:"%testPath%\bin\Release\netcoreapp2.0" -register:user

reportgenerator.exe -reports:coverage.xml -targetdir:coverage -verbosity:Error