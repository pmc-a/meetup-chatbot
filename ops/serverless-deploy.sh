# Check npm version
npm -v

# Echo AWS environment vars
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY

# Install serverless framework
npm install -g serverless

# Echo serverless framework version
serverless -v

# Attempt to deploy via serverless framework
serverless deploy -v
