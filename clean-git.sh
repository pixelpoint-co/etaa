git branch --merged | egrep -v "^\*|^\s*(master|main|staging|develop|rn/*)$" | xargs git branch -d
