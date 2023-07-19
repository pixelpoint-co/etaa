
#!/bin/sh
# Deploy Script
# Quick deployment to ssh server

now="$(date +'%d/%m/%Y/%r')"
echo $now

# build
npm run build:staging

# set up new git remote, add, commit to today's datetime
cd build
git init .
git add --all
git commit -m "$now"
git remote add deploy root@test.creokorea.com:/data/project/erp.git

# push to post receive remote
git push deploy master --force

