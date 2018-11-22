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

ENV TOOLNAME="Amazon EC2 Instance Controller"
ENV INSTANCENAME="Amazon EC2 Instance"
ENV AWS_REGION="eu-central-1"
ENV AWS_INSTANCE_ID=""
ENV AWS_ACCESS_KEY_ID=""
ENV AWS_SECRET_ACCESS_KEY=""
ENV AWS_INSTANCETYPE_SMALL="t3.nano"
ENV AWS_INSTANCETYPE_LARGE="t3.2xlarge"

CMD [ "npm", "start" ]
