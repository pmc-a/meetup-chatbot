# Log current dir
pwd

# Check npm version
echo NPM Version:
npm -v

# Echo AWS environment vars
echo AWS Access Key ID: $AWS_ACCESS_KEY_ID
echo AWS Secret Access Key: $AWS_SECRET_ACCESS_KEY

# Install serverless framework
npm install -g serverless

# Echo serverless framework version
serverless -v

# Move into root dir
cd meetup-chatbot-dev-app

# Log current dir
pwd

# Attempt to deploy via serverless framework
serverless deploy -v
