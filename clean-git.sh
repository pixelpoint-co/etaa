git branch --merged | egrep -v "^\*|(master|main|staging|develop|release|candidate)" | xargs git branch -d
