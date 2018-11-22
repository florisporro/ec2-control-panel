FROM node:alpine

# Change working directory
# Create app directory
WORKDIR ./app

# Copy package.json
COPY package*.json ./

# Install node modules, this way we don't end up rebuilding node_modules every time
RUN npm install

# Copy app directory
COPY . .

# Expose API port to the outside
EXPOSE 3000

ENV TOOLNAME="Amazon EC2 Instance Controller" \
    INSTANCENAME="Amazon EC2 Instance" \
    AWS_REGION="eu-central-1" \
    AWS_INSTANCE_ID="" \
    AWS_ACCESS_KEY_ID="" \
    AWS_SECRET_ACCESS_KEY="" \
    AWS_INSTANCETYPE_SMALL="t3.nano" \
    AWS_INSTANCETYPE_LARGE="t3.2xlarge"

CMD [ "npm", "start" ]
