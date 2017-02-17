# xcode-add-missing-environments

A node script to add Staging and PreProd environments to iOS project configuration.

## How to use it

First convert your pbxproj to JSON format :

`$ plutil -convert json -o project.json -- YourProject.xcodeproj/project.pbxproj`

Next, add environments :

`$ xcode-add-missing-environments ./project.json > project.new.json`

Then, convert it to XML :
`$ plutil -convert xml1 -o project.final.xml -- project.new.json`

Finaly, replace the old xcodeproj :
`$ cp -Rf project.final.xml YourProject.xcodeproj/project.pbxproj`

## Note about using xml as pbxproj
Xcode support XML format as pbxproj configuration, the next time you will edit anything from xcode project settings, Xcode will automaticaly change the xml format into the standard format (without loosing anything).
