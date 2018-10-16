# Log current dir
pwd

# Check npm version
echo NPM Version:
npm -v

# Install serverless framework
npm install -g serverless

# Echo serverless framework version
echo Serverless Framework version:
serverless -v

# Move into root dir
cd meetup-chatbot-dev-app

# Log current dir
pwd

# Install dependencies
npm install

# Attempt to deploy via serverless framework
serverless deploy -v
